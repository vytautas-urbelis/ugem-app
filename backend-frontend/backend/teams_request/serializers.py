from rest_framework import serializers

from business_user_profile.models import BusinessUserProfile
from customer_user_profile.models import CustomerUserProfile
from teams_request.models import TeamsRequest

from django.contrib.auth import get_user_model

User = get_user_model()


class TeamsRequestSerializer(serializers.ModelSerializer):
    """ This serializer is used by these VIEWS:
    TeamsRequestView
    TeamsRequestUpdateView
    MyTeams
    """

    class Meta:
        model = TeamsRequest
        fields = ['id', 'status', 'created_at', 'updated_at', 'requester', 'receiver', 'deleted']
        read_only_fields = ['id', 'status', 'created_at', 'updated_at', 'requester', 'receiver', 'deleted']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['requester'] = UserSerializerRequestRequester(instance.requester,
                                                                     many=False).data
        representation['receiver'] = UserSerializerRequestReceiver(instance.receiver, many=False).data
        representation['deleted'] = UserSerializerRequestReceiver(instance.deleted, many=False).data
        return representation


class UserSerializerRequestRequester(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'date_joined', 'business_user_profile']
        read_only_fields = ['id', 'email', 'date_joined', 'business_user_profile']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['business_user_profile'] = BusinessUserProfileForRequestsSerializerById(
            instance.business_user_profile, many=False).data
        return representation


class BusinessUserProfileForRequestsSerializerById(serializers.ModelSerializer):
    class Meta:
        model = BusinessUserProfile
        # Add campaigns to fields after created
        fields = ['business_name', 'logo', ]


class UserSerializerRequestReceiver(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'date_joined', 'customer_user_profile']
        read_only_fields = ['id', 'email', 'date_joined', 'customer_user_profile']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['customer_user_profile'] = CustomerUserProfileForRequestsSerializer(
            instance.customer_user_profile, many=False).data
        return representation


class CustomerUserProfileForRequestsSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomerUserProfile
        # Add campaigns to fields after created
        fields = ['nickname', 'avatar']
