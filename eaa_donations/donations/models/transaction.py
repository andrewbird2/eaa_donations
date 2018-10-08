from django.db import models

from .donation import Donation


class StripeTransaction(models.Model):
    donation = models.OneToOneField(Donation, on_delete=models.CASCADE)


class PaypalTransaction(models.Model):
    donation = models.OneToOneField(Donation, on_delete=models.CASCADE)


class BankTransaction(models.Model):
    donation = models.OneToOneField(Donation, on_delete=models.CASCADE)
