from django.contrib.auth import get_user_model
from django.db.models import Avg
from rest_framework import serializers
from datetime import date

from business_rating.models import BusinessRating
from business_user_profile.models import BusinessUserProfile, BusinessWallMessage
from campaign.models import Campaign
from customer_user_profile.models import CustomerUserProfile
from promotion.models import Promotion
from voucher_card.models import VoucherCard

User = get_user_model()


class FeedItemSerializer(serializers.Serializer):
    item_type = serializers.CharField()
    distance = serializers.FloatField()
    data = serializers.SerializerMethodField()

    def get_data(self, obj):
        if obj.item_type == 'message':
            return BusinessWallMessageSerializer(obj, context=self.context).data
        elif obj.item_type == 'campaign':
            return BusinessCampaignSerializer(obj, context=self.context).data
        elif obj.item_type == 'promotion':
            return BusinessPromotionSerializer(obj, context=self.context).data
        else:
            return None


class BusinessWallMessageSerializer(serializers.ModelSerializer):
    liked = serializers.SerializerMethodField()

    class Meta:
        model = BusinessWallMessage
        fields = ['id', 'message', 'business_user_profile', 'date_created', 'likes_number', 'liked']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['business_user_profile'] = BusinessUserProfileForFeedSerializer(instance.business_user_profile,
                                                                                       context=self.context,
                                                                                       many=False).data
        return representation

    def get_liked(self, obj):
        request = self.context.get('request')
        user = request.user
        customer = CustomerUserProfile.objects.get(user=user)
        if customer.liked_messages.filter(id=obj.id).exists():
            return True
        return False


class BusinessCampaignSerializer(serializers.ModelSerializer):
    closed = serializers.SerializerMethodField()

    class Meta:
        model = Campaign
        fields = ['id', 'is_active', 'closed', 'name', 'value_goal', 'stamp_design', 'description',
                  'additional_information', 'date_created', 'beginning_date', 'ending_date', 'image',
                  'logo', 'collector_type', 'business_user_profile', ]

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['business_user_profile'] = BusinessUserProfileForFeedSerializer(instance.business_user_profile,
                                                                                       context=self.context,
                                                                                       many=False).data
        return representation

    def get_closed(self, obj):
        if not obj.is_active:
            return True
        if obj.ending_date and obj.ending_date <= date.today():
            return True
        return False


class BusinessPromotionSerializer(serializers.ModelSerializer):
    have_this_voucher = serializers.SerializerMethodField()

    class Meta:
        model = Promotion
        fields = ['id', 'name', 'is_active', 'have_this_voucher', 'description', 'additional_information', 'image',
                  'date_created', 'date_ends', 'business_user_profile']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['business_user_profile'] = BusinessUserProfileForFeedSerializer(instance.business_user_profile,
                                                                                       context=self.context,
                                                                                       many=False).data
        return representation

    def get_have_this_voucher(self, obj):
        user = self.context['request'].user
        if VoucherCard.objects.filter(customer_user_profile=user.customer_user_profile, promotion=obj).exists():
            return True
        else:
            return False


class BusinessUserProfileForFeedSerializer(serializers.ModelSerializer):
    class Meta:
        model = BusinessUserProfile
        # Add campaigns to fields after created
        fields = ['business_name', 'followers', 'about', 'country', 'city', 'street', 'street_number', 'zip',
                  'latitude', 'longitude', 'website', 'logo', 'shop_image', 'qr_code', 'business_category', 'user']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['user'] = FollowedBusinessesFeedSerializer(instance.user,
                                                                  context=self.context,
                                                                  many=False).data
        return representation


class FollowedBusinessesFeedSerializer(serializers.ModelSerializer):
    following = serializers.SerializerMethodField()
    subscribing = serializers.SerializerMethodField()
    rating = serializers.SerializerMethodField()
    my_rating = serializers.SerializerMethodField()
    number_of_ratings = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'email', 'date_joined', 'following', 'subscribing', 'my_rating', 'rating', 'number_of_ratings']
        read_only_fields = ['id', 'email', 'date_joined', 'following', 'subscribing', 'my_rating', 'rating',
                            'number_of_ratings']

    def get_following(self, obj):
        request = self.context.get('request')
        user = request.user
        customer = CustomerUserProfile.objects.get(user=user)
        if customer.followed_businesses.filter(user__id=obj.id).exists():
            return True
        return False

    def get_subscribing(self, obj):
        request = self.context.get('request')
        user = request.user
        customer = CustomerUserProfile.objects.get(user=user)
        if customer.subscribed_businesses.filter(user__id=obj.id).exists():
            return True
        return False

    def get_rating(self, obj):
        average_rating = BusinessRating.objects.filter(business_user_profile=obj.business_user_profile).aggregate(
            average_rating=Avg('rating'))['average_rating']
        if average_rating is not None:
            return average_rating
        else:
            return 0

    def get_number_of_ratings(self, obj):
        number_of_ratings = BusinessRating.objects.filter(business_user_profile=obj.business_user_profile).count()
        return number_of_ratings

    def get_my_rating(self, obj):
        request = self.context.get('request')
        user = request.user
        customer_user_profile = CustomerUserProfile.objects.get(user=user)
        my_rating = BusinessRating.objects.filter(business_user_profile=obj.business_user_profile,
                                                  customer_user_profile=customer_user_profile).first()
        if my_rating:
            return my_rating.rating
        else:
            return 0


class BusinessUserProfileForSearchSerializer(serializers.Serializer):
    distance = serializers.FloatField()
    data = serializers.SerializerMethodField()

    def get_data(self, obj):
        return BusinessUserProfileForFeedSerializer(obj, context=self.context).data
