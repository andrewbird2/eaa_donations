from rest_framework import routers, serializers, viewsets

from .models import PartnerCharity, ReferralSource

router = routers.DefaultRouter()


class PartnerCharitySerializer(serializers.ModelSerializer):
    id = serializers.CharField(source='slug_id')
    value = serializers.CharField(source='name')

    class Meta:
        model = PartnerCharity
        fields = ('id', 'value')


class PartnerCharityViewSet(viewsets.ModelViewSet):
    queryset = PartnerCharity.objects.filter(active=True).order_by('order')
    serializer_class = PartnerCharitySerializer


router.register('partner_charities', PartnerCharityViewSet)


class ReferralSourceSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source='slug_id')
    value = serializers.CharField(source='label')

    class Meta:
        model = ReferralSource
        fields = ('id', 'value')


class ReferralSourceViewSet(viewsets.ModelViewSet):
    queryset = ReferralSource.objects.filter(enabled=True).order_by('order')
    serializer_class = ReferralSourceSerializer


router.register('referral_sources', ReferralSourceViewSet)
