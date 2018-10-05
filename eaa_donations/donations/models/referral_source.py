from django.db import models


class ReferralSource(models.Model):
    slug_id = models.CharField(max_length=30, unique=True)
    label = models.CharField(max_length=256, help_text="Instead of editing this text, you probably want to "
                                                       "disable this ReferralSource and create a new one. If you edit "
                                                       "this, you'll also update the referral sources for donations "
                                                       "already made.",
                             unique=True)
    enabled = models.BooleanField(default=True)
    order = models.BigIntegerField(blank=True, null=True,
                                   help_text='Enter an integer. Reasons will be ordered from smallest to largest.')

    def __str__(self):
        return '{}{}'.format('(DISABLED) ' if not self.enabled else '', self.label)
