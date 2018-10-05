from django.db import models


class PartnerCharity(models.Model):
    slug_id = models.CharField(max_length=30, unique=True)
    name = models.TextField(unique=True, verbose_name='Name (human readable)')
    email = models.EmailField(help_text='Used to cc the charity on receipts')
    xero_account_name = models.TextField(help_text='Exact text of incoming donation account in xero')
    active = models.BooleanField(default=True)
    thumbnail = models.FileField(blank=True, null=True)
    order = models.IntegerField(null=True, blank=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = 'Partner charities'
