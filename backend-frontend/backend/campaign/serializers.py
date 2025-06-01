from datetime import date
from rest_framework import serializers

from business_user_profile.models import BusinessUserProfile
from campaign.models import Campaign, CollectorType
from collector_card.models import CollectorCard


# class CampaignSerializerForCustomer(serializers.ModelSerializer):
#     class Meta:
#         model = Campaign
#         fields = ['id', 'is_active', 'name', 'value_goal', 'stamp_design', 'description', 'additional_information',
#                   'date_created', 'beginning_date', 'ending_date', 'image', 'logo', 'collector_type']
#
#     def to_representation(self, instance):
#         representation = super().to_representation(instance)
#         # representation['business_user_profile'] = BusinessUserProfileSerializer(instance.business_user_profile,
#         #                                                                         many=False).data
#         representation['collector_type'] = CollectorTypeSerializer(instance.collector_type, many=False).data
#         return representation


class CampaignSerializer(serializers.ModelSerializer):
    """ This serializer is used by these VIEWS:
    ListCreateApiCampaignView
    ListOpenCampaignsForTeamsView
    ListOpenCampaignsView
    ListClosedCampaignsView
    """
    closed = serializers.SerializerMethodField()
    participants = serializers.SerializerMethodField()
    last_seven_days_participants = serializers.SerializerMethodField()
    one_week_ago_participants = serializers.SerializerMethodField()
    value = serializers.SerializerMethodField()
    last_seven_days_value = serializers.SerializerMethodField()
    one_week_ago_value = serializers.SerializerMethodField()
    vouchers_issued = serializers.SerializerMethodField()
    last_seven_days_vouchers_issued = serializers.SerializerMethodField()
    one_week_ago_vouchers_issued = serializers.SerializerMethodField()

    class Meta:
        model = Campaign
        fields = [
            'id', 'is_active', 'closed', 'name', 'value_goal', 'stamp_design', 'description',
            'additional_information', 'date_created', 'beginning_date', 'ending_date', 'image',
            'logo', 'qr_code', 'color', 'self_scann_amount', 'collector_type', 'business_user_profile', 'participants',
            'last_seven_days_participants',
            'one_week_ago_participants', 'value', 'last_seven_days_value', 'one_week_ago_value', 'vouchers_issued',
            'last_seven_days_vouchers_issued', 'one_week_ago_vouchers_issued'
        ]
        read_only_fields = [
            'id', 'closed', 'date_created', 'beginning_date', 'qr_code', 'participants', 'business_user_profile',
            'last_seven_days_participants', 'one_week_ago_participants', 'value', 'last_seven_days_value',
            'one_week_ago_value', 'vouchers_issued', 'last_seven_days_vouchers_issued', 'one_week_ago_vouchers_issued'
        ]

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['collector_type'] = CollectorTypeSerializer(
            instance.collector_type, context=self.context
        ).data
        representation['business_user_profile'] = BusinessUserProfileForCampaignSerializer(
            instance.business_user_profile, context=self.context
        ).data
        return representation

    def get_participants(self, obj):
        return getattr(obj, 'participants', 0)

    def get_last_seven_days_participants(self, obj):
        return getattr(obj, 'last_seven_days_participants', 0)

    def get_one_week_ago_participants(self, obj):
        return getattr(obj, 'one_week_ago_participants', 0)

    def get_value(self, obj):
        return getattr(obj, 'value', 0)

    def get_last_seven_days_value(self, obj):
        return getattr(obj, 'last_seven_days_value', 0)

    def get_one_week_ago_value(self, obj):
        return getattr(obj, 'one_week_ago_value', 0)

    def get_vouchers_issued(self, obj):
        return getattr(obj, 'vouchers_issued', 0)

    def get_last_seven_days_vouchers_issued(self, obj):
        return getattr(obj, 'last_seven_days_vouchers_issued', 0)

    def get_one_week_ago_vouchers_issued(self, obj):
        return getattr(obj, 'one_week_ago_vouchers_issued', 0)

    def get_closed(self, obj):
        if not obj.is_active:
            return True
        if obj.ending_date and obj.ending_date <= date.today():
            return True
        return False


class CollectorTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = CollectorType
        fields = '__all__'


class CampaignSerializerInBusinessProfile(serializers.ModelSerializer):
    """ This serializer is used by these VIEWS:
    ListSpecificBusinessOpenCampaignsView
    """
    closed = serializers.SerializerMethodField()
    collector = serializers.SerializerMethodField()

    class Meta:
        model = Campaign
        fields = [
            'id', 'is_active', 'closed', 'name', 'value_goal', 'stamp_design', 'description',
            'additional_information', 'date_created', 'beginning_date', 'ending_date', 'image',
            'logo', 'collector_type', 'business_user_profile', 'collector'
        ]
        read_only_fields = [
            'id', 'is_active', 'closed', 'name', 'value_goal', 'stamp_design', 'description',
            'additional_information', 'date_created', 'beginning_date', 'ending_date', 'image',
            'logo', 'collector_type', 'business_user_profile', 'collector'
        ]

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['business_user_profile'] = BusinessUserProfileForCampaignSerializer(
            instance.business_user_profile, context=self.context
        ).data
        return representation

    def get_closed(self, obj):
        if not obj.is_active:
            return True
        if obj.ending_date and obj.ending_date <= date.today():
            return True
        return False

    def get_collector(self, obj):
        user = self.context['request'].user
        return CollectorCardSerializerForBusinessProfile(
            CollectorCard.objects.filter(
                is_collected=False, campaign=obj,
                customer_user_profile=user.customer_user_profile).first()).data


class BusinessUserProfileForCampaignSerializer(serializers.ModelSerializer):
    class Meta:
        model = BusinessUserProfile
        fields = ['logo', 'business_name']


class CollectorCardSerializerForBusinessProfile(serializers.ModelSerializer):
    """
    This serializer is used by CampaignSerializerInBusinessProfile serializer:

    """

    class Meta:
        model = CollectorCard
        fields = ['id', 'is_collected', 'value_counted', 'value_goal', 'date_created']
        read_only_fields = ['id', 'is_collected', 'value_counted', 'value_goal', 'date_created']
