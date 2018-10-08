import random
import string

from django.core.validators import MinValueValidator
from django.db import models
from django.utils import timezone
from enumfields import Enum, EnumIntegerField

from .partner_charity import PartnerCharity
from .referral_source import ReferralSource


class PaymentMethod(Enum):
    BANK = 1
    CHEQUE = 2
    CREDIT_CARD = 3
    PAYPAL = 4


class Pledge(models.Model):
    completed_time = models.DateTimeField()
    ip = models.GenericIPAddressField(null=True)
    reference = models.TextField(blank=True)
    name = models.CharField(max_length=100, blank=True, verbose_name='name')
    email = models.EmailField()
    subscribe = models.BooleanField(default=False, verbose_name='Send me news and updates')
    payment_method = EnumIntegerField(PaymentMethod)
    recurring = models.BooleanField()
    referral_source = models.ForeignKey(ReferralSource, blank=True, null=True, on_delete=models.PROTECT,
                                        verbose_name='How did you hear about us?')

    @property
    def amount(self):
        return self.components.aggregate(total=models.Sum('amount'))['total']

    @property
    def partner_charity_str(self):
        num_components = self.components.count()
        if num_components == 1:
            return self.components.get().partner_charity.name
        elif num_components > 1:
            partner_names = [component.partner_charity.name for component in self.components.all()]
            return '{} and {}'.format(', '.join(partner_names[:-1]), partner_names[-1])
        else:
            raise Exception('Pledge does not have any associated components')

    def generate_reference(self):
        if self.reference:  # for safety, don't overwrite
            return self.reference
        self.reference = ''.join(random.choice('ABCDEF' + string.digits) for _ in range(12))
        self.save()
        return self.reference

    def save(self, *args, **kwargs):
        if not self.completed_time:
            self.completed_time = timezone.now()
        super(Pledge, self).save(*args, **kwargs)

    def __str__(self):
        components = ', '.join([c.__unicode__() for c in self.components.all()])
        return "Pledge of {1} by {0.name}, " \
               "made on {2}. Reference {0.reference}".format(self, components, self.completed_time.date())


class PledgeComponent(models.Model):
    """Tracks the breakdown of a pledge between partner charities"""

    class Meta:
        unique_together = ('pledge', 'partner_charity')

    pledge = models.ForeignKey(Pledge, related_name='components', on_delete=models.CASCADE)
    partner_charity = models.ForeignKey(PartnerCharity, on_delete=models.PROTECT)
    amount = models.DecimalField(decimal_places=2, max_digits=12, validators=[MinValueValidator(0.01)])

    @property
    def proportion(self):
        return self.amount / self.pledge.amount

    def __str__(self):
        return "${0.amount} to {0.partner_charity}".format(self)
