from django import forms
from enumfields.fields import EnumChoiceField

from .models import Pledge, ReferralSource, PartnerCharity, PledgeComponent, PaymentMethod, StripeTransaction, \
    Gift


class PaymentMethodField(EnumChoiceField):
    def clean(self, value):
        mapping_dict = {
            'bank-transfer': PaymentMethod.BANK,
            'credit-card': PaymentMethod.CREDIT_CARD,
            'paypal': PaymentMethod.PAYPAL,
        }
        return mapping_dict[value]


class GiftForm(forms.ModelForm):
    class Meta:
        model = Gift
        fields = ['pledge', 'recipient_name', 'recipient_email', 'personal_message']

    pledge = forms.ModelChoiceField(queryset=Pledge.objects.all(), required=False)


class PledgeForm(forms.ModelForm):
    class Meta:
        model = Pledge
        fields = ['name', 'email', 'referral_source', 'subscribe', 'payment_method', 'recurring']

    referral_source = forms.ModelChoiceField(queryset=ReferralSource.objects.all(),
                                             to_field_name='slug_id', required=False)
    payment_method = PaymentMethodField()

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
