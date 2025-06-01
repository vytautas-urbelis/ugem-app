from django.db.models import Q
from rest_framework import serializers

from django.utils import timezone
from datetime import timedelta

from algos.business_rating_algo import calculate_business_rating
from business_user_profile.models import BusinessUserProfile, BusinessWallMessage, BusinessCategory
from campaign.models import Campaign
from customer_user_profile.models import CustomerUserProfile
from promotion.models import Promotion
from voucher_card.models import VoucherCard


class CampaignForBusinessProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Campaign
        fields = '__all__'


class BusinessWallMessageForBusinessProfileSerializer(serializers.ModelSerializer):
    liked = serializers.SerializerMethodField()

    class Meta:
        model = BusinessWallMessage
        fields = ['id', 'date_created', 'message', 'liked', 'likes_number']

    def get_liked(self, obj):
        request = self.context.get('request')
        user = request.user
        customer = CustomerUserProfile.objects.get(user=user)
        if customer.liked_messages.filter(id=obj.id).exists():
            return True
        return False


class PromotionForBusinessProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Promotion
        fields = '__all__'


class BusinessCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = BusinessCategory
        fields = ['id', 'name']


class BusinessUserProfileSerializerById(serializers.ModelSerializer):
    followers_number = serializers.SerializerMethodField()
    hearts_number = serializers.SerializerMethodField()
    issued_vouchers = serializers.SerializerMethodField()

    class Meta:
        model = BusinessUserProfile
        # Add campaigns to fields after created
        fields = ['business_name', 'followers_number', 'issued_vouchers', 'hearts_number', 'followers', 'about',
                  'country', 'city', 'street', 'street_number', 'zip', 'latitude', 'longitude', 'website', 'logo',
                  'shop_image', 'qr_code', 'business_category', 'business_wall', 'subscription', 'is_vip']

    def to_representation(self, instance):
        representation = super().to_representation(instance)

        # Sort the business_wall messages by date_created in descending order
        sorted_wall_messages = instance.business_wall.order_by('-date_created')

        representation['business_category'] = BusinessCategorySerializer(instance.business_category, many=False).data
        representation['business_wall'] = BusinessWallMessageForBusinessProfileSerializer(sorted_wall_messages,
                                                                                          context=self.context,
                                                                                          many=True).data
        return representation

    def get_followers_number(self, obj):
        return obj.followers.filter().count()

    def get_hearts_number(self, obj):
        messages = obj.business_wall.filter()
        count = 0
        for message in messages:
            count += message.likes.count()
        return count

    def get_issued_vouchers(self, obj):
        return VoucherCard.objects.filter(campaign__business_user_profile=obj).count()

    # def get_open_campaigns(self, obj):
    #     campaigns = obj.campaigns.filter(is_active=True)
    #     return CampaignForBusinessProfileSerializer(campaigns, many=True).data
    #
    # def get_open_promotions(self, obj):
    #     promotions = obj.promotions.filter(is_active=True)
    #     return PromotionForBusinessProfileSerializer(promotions, many=True).data


class BusinessUserProfileSerializer(serializers.ModelSerializer):
    followers_number = serializers.SerializerMethodField()
    hearts_number = serializers.SerializerMethodField()
    issued_vouchers = serializers.SerializerMethodField()
    user_id = serializers.SerializerMethodField()

    # user_rating = serializers.SerializerMethodField()

    class Meta:
        model = BusinessUserProfile
        # Add campaigns to fields after created
        fields = ['user_id', 'business_name', 'followers', 'about', 'country', 'city', 'street', 'street_number', 'zip',
                  'latitude', 'longitude', 'website', 'logo', 'shop_image', 'qr_code', 'business_category',
                  'is_verified', 'agreed_tos', 'agreed_tos_date', 'issued_vouchers', 'hearts_number',
                  'followers_number', 'subscription', 'is_vip']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['business_category'] = BusinessCategorySerializer(instance.business_category, many=False).data

        return representation

    def get_user_rating(self, obj):
        # Calculate the date 100 days ago from today
        date_threshold = timezone.now() - timedelta(days=100)

        engaged_followers = CustomerUserProfile.objects.filter(
            Q(vouchercard__campaign__business_user_profile=obj, vouchercard__date_created__gte=date_threshold) |
            Q(logs_wall_message__business_user_profile=obj, liked_messages__like_logs__timestamp__gte=date_threshold,
              logs_wall_message__action='like') |
            Q(logs_collector_card__collector_card__campaign__business_user_profile=obj,
              logs_collector_card__timestamp__gte=date_threshold)
        ).distinct().count()

        # Query to get how many users liked wall messages
        total_likes = CustomerUserProfile.objects.filter(liked_messages__business_user_profile=obj).count()

        # Query how many followers business has
        followers = obj.followers.filter().count()

        # Query how many vouchers were issued
        vouchers_issued = VoucherCard.objects.filter(campaign__business_user_profile=obj).count()

        # Query how many vouchers were used
        vouchers_used = VoucherCard.objects.filter(Q(campaign__business_user_profile=obj) & Q(is_used=True)).count()

        # Query how many unique users used this vouchers
        unique_voucher_users = CustomerUserProfile.objects.filter(
            vouchercard__campaign__business_user_profile=obj).distinct().count()

        # return print(engaged_followers, followers, vouchers_issued, vouchers_used, unique_voucher_users, total_likes)

        return calculate_business_rating(
            followers,
            engaged_followers,
            total_likes,
            vouchers_issued,
            vouchers_used,
            unique_voucher_users)

    def get_followers_number(self, obj):
        return obj.followers.filter().count()
        # followers = obj.followers_number
        # return

    def get_hearts_number(self, obj):
        messages = obj.business_wall.filter()
        count = 0
        for message in messages:
            count += message.likes.count()
        return count

    def get_issued_vouchers(self, obj):
        return VoucherCard.objects.filter(campaign__business_user_profile=obj).count()

    def get_user_id(self, obj):
        return obj.user.id


class BusinessWallMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = BusinessWallMessage
        # Add campaigns to fields after created
        fields = ['id', 'message', 'date_created', 'business_user_profile', 'likes_number']
        read_only_fields = ['date_created', 'business_user_profile', 'likes_number']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['business_user_profile'] = BusinessUserProfileSerializer(instance.business_user_profile,
                                                                                many=False).data
        return representation
