from django.db import models

from .donation import Donation


class StripeTransaction(models.Model):
    donation = models.OneToOneField(Donation)


class PaypalTransaction(models.Model):
    donation = models.OneToOneField(Donation)


class BankTransaction(models.Model):
    donation = models.OneToOneField(Donation)
