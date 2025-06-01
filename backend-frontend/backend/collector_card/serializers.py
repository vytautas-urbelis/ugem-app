from datetime import date

from rest_framework import serializers

from business_user_profile.models import BusinessUserProfile
from campaign.models import Campaign
from collector_card.models import CollectorCard, LogsCollector


class CollectorCardSerializer(serializers.ModelSerializer):
    """
    This serializer is used by these VIEWS:
    BusinessAndSpecificUserUncollectedCollector
    CustomerUsersSpecificCampaignCollectors
    CollectorCardSerializer
    """

    is_active = serializers.SerializerMethodField()

    class Meta:
        model = CollectorCard
        fields = ['id', 'is_active', 'date_expired', 'is_collected', 'value_counted', 'value_goal', 'campaign',
                  'date_created', 'business_user_profile']
        read_only_fields = ['id', 'is_active', 'is_collected', 'value_counted', 'value_goal', 'campaign',
                            'date_created', 'business_user_profile']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['business_user_profile'] = BusinessUserProfileForCollectorCardSerializer(
            instance.business_user_profile, many=False).data
        representation['campaign'] = CampaignForCollectorCardSerializer(instance.campaign, many=False).data
        return representation

    def get_is_active(self, obj):
        today_date = date.today()

        def set_expired(coll):
            collector = CollectorCard.objects.get(id=coll.id)
            collector.date_expired = today_date
            coll.date_expired = today_date
            collector.save()

        if obj.date_expired:
            if obj.date_expired <= today_date:
                return False
        # Ensure that campaign is active
        if not obj.business_user_profile or not obj.campaign or not obj.campaign.is_active:
            set_expired(obj)
            return False
        if obj.campaign.ending_date:
            if obj.campaign.ending_date <= today_date:
                set_expired(obj)
                return False
        return True


class BusinessUserProfileForCollectorCardSerializer(serializers.ModelSerializer):
    user_id = serializers.SerializerMethodField()

    class Meta:
        model = BusinessUserProfile
        fields = ['user_id', 'business_name', 'logo']

    def get_user_id(self, obj):
        return obj.user.id


class CampaignForCollectorCardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Campaign
        fields = ['name', 'beginning_date', 'ending_date', 'stamp_design', 'color', 'collector_type', 'description',
                  'additional_information']


class LogsCollectorSerializer(serializers.ModelSerializer):
    class Meta:
        model = LogsCollector
        # fields = ['id', 'value_added', 'date_created', 'collector']
        fields = ['id', 'value_added', 'date_created']

    # def to_representation(self, instance):
    #     representation = super().to_representation(instance)
    #     representation['collector'] = CollectorCardSerializer(instance.collector, many=False).data
    #     return representation
