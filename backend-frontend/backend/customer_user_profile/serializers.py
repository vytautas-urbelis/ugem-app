from rest_framework import serializers

from business_user_profile.serializers import BusinessUserProfileSerializer
from customer_card.serializers import CustomerCardSerializer
from customer_user_profile.models import CustomerUserProfile


class CustomerUserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomerUserProfile
        # Add campaigns to fields after created
        fields = ['secret_key', 'first_name', 'last_name', 'nickname', 'country', 'city', 'street', 'street_number',
                  'zip', 'avatar', 'is_verified', 'agreed_tos', 'agreed_tos_date', 'customer_card',
                  'followed_businesses']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['customer_card'] = CustomerCardSerializer(instance.customer_card, many=False).data
        representation['followed_businesses'] = BusinessUserProfileSerializer(instance.followed_businesses,
                                                                              many=True).data
        return representation

# class CustomerUserProfileOutSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = CustomerUserProfile
#         # Add campaigns to fields after created
#         fields = ['user', 'first_name', 'last_name', 'nickname', 'city', 'street', 'zip', 'avatar']
