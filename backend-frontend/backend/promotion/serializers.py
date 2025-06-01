from rest_framework import serializers

from business_user_profile.models import BusinessUserProfile
from promotion.models import Promotion
from voucher_card.models import VoucherCard


class PromotionSerializer(serializers.ModelSerializer):
    vouchers_used = serializers.SerializerMethodField()

    class Meta:
        model = Promotion
        fields = ['id', 'name', 'is_active', 'description', 'additional_information', 'image', 'vouchers_amount',
                  'vouchers_issued', 'vouchers_used', 'date_created', 'date_ends', 'business_user_profile']
        read_only_fields = ['id', 'date_created', 'business_user_profile']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['business_user_profile'] = BusinessUserProfileForPromotionsSerializer(
            instance.business_user_profile,
            many=False).data
        return representation

    #
    def get_vouchers_used(self, obj):
        return VoucherCard.objects.filter(promotion=obj, is_used=True).distinct().count()
        # return obj.collectors.end_user_profile.count()


class PromotionsSerializerInBusinessProfile(serializers.ModelSerializer):
    """
    This serializer is used by
    ListSpecificBusinessOpenPromotionsView
    """
    have_this_voucher = serializers.SerializerMethodField()

    class Meta:
        model = Promotion
        fields = ['id', 'name', 'is_active', 'have_this_voucher', 'description', 'additional_information', 'image', 'vouchers_amount',
                  'vouchers_issued', 'date_created', 'date_ends', 'business_user_profile']
        read_only_fields = ['id', 'name', 'is_active', 'have_this_voucher', 'description', 'additional_information', 'image',
                            'vouchers_amount', 'vouchers_issued', 'date_created', 'date_ends', 'business_user_profile']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['business_user_profile'] = BusinessUserProfileForPromotionsSerializer(
            instance.business_user_profile,
            many=False).data
        return representation

    def get_have_this_voucher(self, obj):
        user = self.context['request'].user
        if VoucherCard.objects.filter(customer_user_profile=user.customer_user_profile, promotion=obj).exists():
            return True
        else:
            return False


class BusinessUserProfileForPromotionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = BusinessUserProfile
        fields = ['logo', 'business_name']
