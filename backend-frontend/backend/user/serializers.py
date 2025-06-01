# from datetime import timedelta
# from django.utils import timezone
from django.contrib.auth import get_user_model
from django.db.models import Avg
# from django.db.models import Q
from rest_framework import serializers

from business_rating.models import BusinessRating
# from algos.business_rating_algo import calculate_business_rating
from business_user_profile.models import BusinessUserProfile
from business_user_profile.serializers import BusinessUserProfileSerializerById
from customer_user_profile.models import CustomerUserProfile
from customer_user_profile.serializers import CustomerUserProfileSerializer
from voucher_card.models import VoucherCard

User = get_user_model()


class BusinessUserSerializer(serializers.ModelSerializer):
    """ This serializer is used by these VIEWS:
    TokenUserObtainView
    """

    class Meta:
        model = User
        fields = ['id', 'is_business', 'email', 'date_joined', 'business_user_profile']
        read_only_fields = ['id', 'is_business', 'email', 'date_joined', 'business_user_profile']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['business_user_profile'] = BusinessUserProfileForAuthSerializer(instance.business_user_profile,
                                                                                       many=False).data
        return representation


class BusinessUserProfileForAuthSerializer(serializers.ModelSerializer):
    followers_number = serializers.SerializerMethodField()
    hearts_number = serializers.SerializerMethodField()
    issued_vouchers = serializers.SerializerMethodField()
    user_id = serializers.SerializerMethodField()

    # user_rating = serializers.SerializerMethodField()

    class Meta:
        model = BusinessUserProfile
        # Add campaigns to fields after created
        fields = ['user_id', 'business_name', 'about', 'country', 'city', 'street', 'street_number', 'zip',
                  'latitude', 'longitude', 'website', 'logo', 'shop_image', 'qr_code',
                  'is_verified', 'agreed_tos', 'agreed_tos_date', 'issued_vouchers', 'hearts_number',
                  'followers_number', 'subscription', 'is_vip']

    # def get_user_rating(self, obj):
    #     # Calculate the date 100 days ago from today
    #     date_threshold = timezone.now() - timedelta(days=100)
    #
    #     engaged_followers = CustomerUserProfile.objects.filter(
    #         Q(vouchercard__campaign__business_user_profile=obj, vouchercard__date_created__gte=date_threshold) |
    #         Q(logs_wall_message__business_user_profile=obj, liked_messages__like_logs__timestamp__gte=date_threshold,
    #           logs_wall_message__action='like') |
    #         Q(logs_collector_card__collector_card__campaign__business_user_profile=obj,
    #           logs_collector_card__timestamp__gte=date_threshold)
    #     ).distinct().count()
    #
    #     # Query to get how many users liked wall messages
    #     total_likes = CustomerUserProfile.objects.filter(liked_messages__business_user_profile=obj).count()
    #
    #     # Query how many followers business has
    #     followers = obj.followers.filter().count()
    #
    #     # Query how many vouchers were issued
    #     vouchers_issued = VoucherCard.objects.filter(campaign__business_user_profile=obj).count()
    #
    #     # Query how many vouchers were used
    #     vouchers_used = VoucherCard.objects.filter(Q(campaign__business_user_profile=obj) & Q(is_used=True)).count()
    #
    #     # Query how many unique users used this vouchers
    #     unique_voucher_users = CustomerUserProfile.objects.filter(
    #         vouchercard__campaign__business_user_profile=obj).distinct().count()
    #
    #     # return print(engaged_followers, followers, vouchers_issued, vouchers_used, unique_voucher_users, total_likes)
    #
    #     return calculate_business_rating(
    #         followers,
    #         engaged_followers,
    #         total_likes,
    #         vouchers_issued,
    #         vouchers_used,
    #         unique_voucher_users)

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


# class UserSerializerRequestRequester(serializers.ModelSerializer):
#     class Meta:
#         model = User
#         fields = ['id', 'email', 'date_joined', 'business_user_profile']
#         read_only_fields = ['id', 'email', 'date_joined', 'business_user_profile']
#
#     def to_representation(self, instance):
#         representation = super().to_representation(instance)
#         representation['business_user_profile'] = BusinessUserProfileForRequestsSerializerById(
#             instance.business_user_profile, many=False).data
#         return representation


# class UserSerializerRequestReceiver(serializers.ModelSerializer):
#     class Meta:
#         model = User
#         fields = ['id', 'email', 'date_joined', 'customer_user_profile']
#         read_only_fields = ['id', 'email', 'date_joined', 'customer_user_profile']
#
#     def to_representation(self, instance):
#         representation = super().to_representation(instance)
#         representation['customer_user_profile'] = CustomerUserProfileForRequestsSerializer(
#             instance.customer_user_profile, many=False).data
#         return representation


class UserRegistrationSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)


class BusinessByIdSerializer(serializers.ModelSerializer):
    following = serializers.SerializerMethodField()
    subscribing = serializers.SerializerMethodField()
    rating = serializers.SerializerMethodField()
    my_rating = serializers.SerializerMethodField()
    number_of_ratings = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'email', 'date_joined', 'following', 'subscribing', 'my_rating', 'rating',
                  'number_of_ratings', 'business_user_profile']
        read_only_fields = ['id', 'email', 'date_joined', 'following', 'subscribing', 'my_rating', 'rating',
                            'number_of_ratings' 'business_user_profile']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['business_user_profile'] = BusinessUserProfileSerializerById(instance.business_user_profile,
                                                                                    context=self.context,
                                                                                    many=False).data
        return representation

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


class BusinessUserUpdateDeleteSerializer(serializers.ModelSerializer):
    class Meta:
        model = BusinessUserProfile
        fields = '__all__'


class CustomerUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'is_business', 'email', 'date_joined', 'customer_user_profile']
        read_only_fields = ['email', 'is_business', 'customer_user_profile']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['customer_user_profile'] = CustomerUserProfileSerializer(instance.customer_user_profile,
                                                                                many=False).data
        return representation


class CustomerUserIsVerifiedSerializer(serializers.ModelSerializer):
    is_verified = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'is_verified']

    def get_is_verified(self, obj):
        if obj.customer_user_profile.is_verified:
            return True
        return False


class CustomerUserUpdateDeleteSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomerUserProfile
        fields = '__all__'
