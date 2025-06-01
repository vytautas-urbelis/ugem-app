from datetime import date

from rest_framework import serializers

from business_user_profile.models import BusinessUserProfile
from campaign.models import Campaign
from promotion.models import Promotion
from voucher_card.models import VoucherCard


class VoucherSerializer(serializers.ModelSerializer):
    """ This serializer is used by these VIEWS:
    GetVoucherView,
    CustomerUsersActiveVouchers,
    CustomerUsersUsedVouchers
    """
    is_active = serializers.SerializerMethodField()

    class Meta:
        model = VoucherCard
        fields = ['id', 'is_active', 'date_expired', 'voucher_type', 'is_used', 'date_created', 'date_used',
                  'business_id', 'expiration_date', 'qr_code', 'promotion', 'campaign', 'business_user_profile']

        read_only_fields = ['id', 'is_active', 'date_expired', 'voucher_type', 'is_used', 'date_created', 'date_used',
                            'business_id', 'expiration_date', 'qr_code', 'date_created', 'promotion', 'campaign',
                            'business_user_profile']

    def get_is_active(self, obj):
        today_date = date.today()

        def set_expired(vouch):
            voucher = VoucherCard.objects.get(id=vouch.id)
            voucher.date_expired = today_date
            vouch.date_expired = today_date
            voucher.save()

        if obj.date_expired:
            if obj.date_expired <= today_date:
                return False
        # Ensure that campaign is active
        if not obj.business_user_profile:
            set_expired(obj)
            return False
        if not obj.campaign and not obj.promotion:
            set_expired(obj)
            return False
        if obj.campaign:
            if obj.campaign.ending_date:
                if obj.campaign.ending_date <= today_date:
                    set_expired(obj)
                    return False
            if not obj.campaign.is_active:
                set_expired(obj)
                return False
        if obj.promotion:
            if obj.promotion.date_ends:
                if obj.promotion.date_ends <= today_date:
                    set_expired(obj)
                    return False
            # if not obj.promotion.is_active:
            #     set_expired(obj)
            #     return False
        return True

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['business_user_profile'] = BusinessUserProfileForVoucherSerializer(
            instance.business_user_profile, many=False).data
        representation['promotion'] = PromotionForVoucherSerializer(
            instance.promotion, many=False).data
        representation['campaign'] = CampaignForVoucherSerializer(
            instance.campaign, many=False).data
        return representation


class BusinessUserProfileForVoucherSerializer(serializers.ModelSerializer):
    class Meta:
        model = BusinessUserProfile
        fields = ['logo', 'business_name', ]


class PromotionForVoucherSerializer(serializers.ModelSerializer):
    class Meta:
        model = Promotion
        fields = ['name', 'description', 'additional_information', 'image']


class CampaignForVoucherSerializer(serializers.ModelSerializer):
    class Meta:
        model = Campaign
        fields = ['name', 'description', 'additional_information', 'image']
