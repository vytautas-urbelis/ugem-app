from rest_framework import serializers

from business_rating.models import BusinessRating


class BusinessRatingSerializer(serializers.ModelSerializer):
    """ This serializer is used by these VIEWS:
    BusinessRatingView
    """

    class Meta:
        model = BusinessRating
        fields = [
            'id', 'date_created', 'customer_user_profile', 'business_user_profile', 'rating',
        ]
        read_only_fields = [
            'id', 'date_created', 'customer_user_profile', 'business_user_profile'
        ]
