from django.db import models

from .pledge import Pledge, PledgeComponent


class Donation(models.Model):
    datetime = models.DateTimeField()
    reference = models.TextField(blank=True)
    pledge = models.ForeignKey(Pledge, blank=True, null=True, on_delete=models.PROTECT)

    @property
    def amount(self):
        return self.components.aggregate(total=models.Sum('amount'))['total']

    @property
    def fees(self):
        return self.components.aggregate(total=models.Sum('fees'))['total']

    @property
    def component_summary_str(self):
        return ', '.join('%s ($%s)' % (component.pledge_component.partner_charity.name,
                                       '{0:.2f}'.format(component.amount)
                                       ) for component in self.components.all())


class DonationComponent(models.Model):
    """Tracks the breakdown of a donation between partner charities"""
    pledge_component = models.ForeignKey(PledgeComponent, on_delete=models.CASCADE)
    donation = models.ForeignKey(Donation, related_name='components', on_delete=models.CASCADE)
    amount = models.FloatField()
    fees = models.FloatField()

