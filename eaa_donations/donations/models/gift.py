from django.db import models

from .pledge import Pledge


class Gift(models.Model):
    pledge = models.OneToOneField(Pledge, on_delete=models.CASCADE)
    recipient_name = models.CharField(max_length=100)
    recipient_email = models.EmailField()
    personal_message = models.TextField(blank=True, null=True)
    sent_at = models.DateTimeField(null=True, blank=True)
