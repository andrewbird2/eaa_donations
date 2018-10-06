from django import forms
from enumfields.fields import EnumChoiceField

from .models import Pledge, ReferralSource, PartnerCharity, PledgeComponent, PaymentMethod, StripeTransaction, \
    Donation


class PaymentMethodField(EnumChoiceField):
    def clean(self, value):
        mapping_dict = {
            'bank-transfer': PaymentMethod.BANK,
            'credit-card': PaymentMethod.CREDIT_CARD,
            'paypal': PaymentMethod.PAYPAL,
        }
        return mapping_dict[value]


class PledgeForm(forms.ModelForm):
    class Meta:
        model = Pledge
        fields = ['name', 'email', 'how_did_you_hear_about_us_db', 'subscribe_to_updates',
                  'payment_method', 'recurring', 'recurring_frequency', 'is_gift', 'gift_recipient_name',
                  'gift_recipient_email', 'gift_personal_message']

    how_did_you_hear_about_us_db = forms.ModelChoiceField(queryset=ReferralSource.objects.all(),
                                                          to_field_name='slug_id', required=False)
    payment_method = PaymentMethodField()
    recurring_frequency = RecurringFrequencyField()

    def __init__(self, *args, **kwargs):
        super(PledgeForm, self).__init__(*args, **kwargs)
        self.referral_sources = ReferralSource.objects.filter(enabled=True).order_by('order')


class PledgeComponentForm(forms.ModelForm):
    class Meta:
        model = PledgeComponent
        fields = ('pledge', 'partner_charity', 'amount')

    partner_charity = forms.ModelChoiceField(queryset=PartnerCharity.objects.all(),
                                             to_field_name='slug_id')
    pledge = forms.ModelChoiceField(queryset=Pledge.objects.all(), required=False)


PledgeComponentFormSet = forms.modelformset_factory(PledgeComponent, form=PledgeComponentForm,
                                                    fields=('pledge', 'partner_charity', 'amount'))


class DonationForm(forms.ModelForm):
    class Meta:
        model = StripeTransaction
        fields = '__all__'

    date = forms.DateTimeField(required=False)

class StripeTransactionForm(forms.ModelForm):
    class Meta:
        model = StripeTransaction
        fields = '__all__'

    date = forms.DateTimeField(required=False)


class PledgeFormOld(forms.ModelForm):
    class Meta:
        model = Pledge
        fields = ['first_name', 'email', 'how_did_you_hear_about_us_db', 'subscribe_to_updates',
                  'payment_method', 'recurring']

    class Media:
        # Don't use Media as it's compatible with ManifestStaticFilesStorage on Django 1.8
        # https://code.djangoproject.com/ticket/21221
        pass

    # These values control the donation amount buttons shown
    donation_amounts_raw = (25, 50, 100, 250)
    donation_amounts = [('$' + str(x), x) for x in donation_amounts_raw]

    # The template will display labels for these fields
    hide_labels = ['subscribe_to_updates', ]

    def __init__(self, *args, **kwargs):
        super(PledgeFormOld, self).__init__(*args, **kwargs)
        self.referral_sources = ReferralSource.objects.filter(enabled=True).order_by('order')
