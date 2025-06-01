# from django.shortcuts import render
import asyncio
import random

import jwt
from django.db.models import Q
from jwt import InvalidTokenError, DecodeError
from rest_framework import status
from rest_framework.generics import CreateAPIView, ListAPIView, get_object_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from apple_cards.pass_update import send_push_token
from base.sender import voucher_created
from collector_card.models import CollectorCard
from customer_user_profile.models import CustomerUserProfile
from model_logs.models import LogsVoucherCard
from pass_update_register.models import AppleDevice, ApplePass
from promotion.models import Promotion
from promotion.serializers import PromotionsSerializerInBusinessProfile
from teams_request.models import TeamsRequest
from voucher_card.models import VoucherCard, VoucherType
from voucher_card.serializers import VoucherSerializer

from datetime import timedelta
from django.utils import timezone


def code_generator(length=15):
    numbers = '0123456789qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM'
    return ''.join(random.choice(numbers) for _ in range(length))


# Create your views here.

class UseVoucherView(CreateAPIView):
    # serializer_class = UseVoucherSerializer
    queryset = VoucherCard.objects.all()
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        voucher_token = request.data.get('voucher_token')

        # Check if requester is from business team
        business_owner_id = request.data.get('business_owner_id', None)

        # Decode the voucher token without verifying the signature to extract user_id and voucher_id
        try:
            decoded = jwt.decode(voucher_token, options={"verify_signature": False})
            user_id = decoded.get('user_id')
            voucher_id = decoded.get('voucher_id')
        except jwt.DecodeError:
            return Response({'message': 'Invalid voucher token.'}, status=status.HTTP_400_BAD_REQUEST)

        # Retrieve the customer user profile based on the user_id from the token
        try:
            customer_user_profile = CustomerUserProfile.objects.get(user_id=user_id)
        except CustomerUserProfile.DoesNotExist:
            return Response({'message': 'The Qr Code is broken.'}, status=status.HTTP_400_BAD_REQUEST)

        # Verify the token using the user's secret key
        secret_key = customer_user_profile.secret_key
        try:
            jwt.decode(voucher_token, secret_key, algorithms="HS256")
        except jwt.InvalidSignatureError:
            return Response({'message': 'Invalid voucher token signature.'}, status=status.HTTP_400_BAD_REQUEST)

        # Verify if the voucher exists
        try:
            voucher = VoucherCard.objects.get(id=voucher_id)
        except VoucherCard.DoesNotExist:
            return Response({'message': "This voucher doesn't exist."}, status=status.HTTP_404_NOT_FOUND)

        # Check if the voucher belongs to the current user's business profile. Or the voucher scanning Team member
        if not self.is_user_owner(request.user, voucher) and not self.is_user_in_team(request.user, voucher,
                                                                                      business_owner_id):
            return Response({'message': "You don't have permission to use this voucher."},
                            status=status.HTTP_401_UNAUTHORIZED)

        # If requester is business owner it checks if user requests data from he's personal profile
        if self.is_user_owner(request.user, voucher) and business_owner_id:
            return Response({'message': "You don't have permission to use this voucher."},
                            status=status.HTTP_401_UNAUTHORIZED)

        # Check if the voucher has already been used
        if voucher.is_used:
            return Response({'message': 'This voucher has already been used.'}, status=status.HTTP_400_BAD_REQUEST)

        # Mark the voucher as used and save the changes
        voucher.is_used = True
        voucher.save()

        # Save voucher usage logs
        LogsVoucherCard.objects.create(
            action='used',
            customer_user_profile=customer_user_profile,
            voucher_card=voucher,
            campaign_name=voucher.campaign.name if voucher.campaign else None,
            promotion_name=voucher.promotion.name if voucher.promotion else None,
            business_name=voucher.business_user_profile.business_name
        )

        # Check if the voucher is part of a collector card and mark it as used
        collector_card = CollectorCard.objects.filter(voucher_cards=voucher).first()
        if collector_card:
            collector_card.is_used = True
            collector_card.save()

            # Update the Apple Pass if linked to the collector card
            if AppleDevice.objects.filter(apple_pass__serial_number=collector_card.serial_nr).exists():
                apple_pass = ApplePass.objects.get(serial_number=collector_card.serial_nr)
                apple_pass.last_updated = code_generator()
                apple_pass.save()
                apple_device = AppleDevice.objects.get(apple_pass=apple_pass)
                asyncio.run(send_push_token(apple_device.push_token, apple_pass.pass_type_id))

        return Response({'message': "You've just used your voucher."}, status=status.HTTP_200_OK)

    def is_user_owner(self, user, voucher):
        return user.business_user_profile == voucher.business_user_profile

    def is_user_in_team(self, user, voucher, business_owner_id):
        # Checks if user is requesting from business team profile which is same as voucher business
        # and user is in a team
        return voucher.business_user_profile.user.id == business_owner_id and TeamsRequest.objects.filter(
            receiver=user,
            requester=voucher.business_user_profile.user,
            status='accepted').exists()


# Comments:
# 1. Decoded the voucher token without signature verification first to extract user_id and voucher_id.
# 2. Added error handling for token decoding to manage invalid tokens early.
# 3. Separated the retrieval of customer user profile and voucher validation to simplify the logic flow.
# 4. Verified the token signature using the user's secret key after extracting data, adding an extra layer of security.
# 5. Refactored repetitive `VoucherCard` queries by storing the result in a variable to avoid multiple database hits.
# class UseVoucherView(CreateAPIView):
#     serializer_class = UseVoucherSerializer
#     queryset = VoucherCard.objects.all()
#     permission_classes = [IsAuthenticated]
#
#     def post(self, request, *args, **kwargs):
#         voucher_token = request.data['voucher_token']
#         try:
#             decoded = jwt.decode(voucher_token, options={"verify_signature": False})
#             user_id = decoded['user_id']
#             customer_user_profile = CustomerUserProfile.objects.get(user_id=user_id)
#             secret_key = customer_user_profile.secret_key
#             jwt.decode(voucher_token, secret_key, algorithms="HS256")
#
#         except CustomerUserProfile.DoesNotExist:
#             return Response({'message': 'The Qr Code Is Broken'}, status=status.HTTP_400_BAD_REQUEST)
#
#         decoded = jwt.decode(voucher_token, options={"verify_signature": False})
#         voucher_id = decoded['voucher_id']
#
#         if VoucherCard.objects.filter(id=voucher_id).exists():
#             if self.request.user.business_user_profile != VoucherCard.objects.get(
#                     id=voucher_id).business_user_profile:
#                 return Response({'message': "You don't have permission to use this voucher."},
#                                 status=status.HTTP_401_UNAUTHORIZED)
#             voucher = VoucherCard.objects.get(id=voucher_id)
#             if voucher.is_used:
#                 return Response({'message': 'This voucher has already been used.'}, status=status.HTTP_400_BAD_REQUEST)
#
#             voucher.is_used = True
#             voucher.save()
#
#             # Saving voucher logs
#             LogsVoucherCard.objects.create(action='used', customer_user_profile=customer_user_profile,
#                                            voucher_card=voucher, campaign_name=voucher.campaign_name,
#                                            business_name=voucher.business_name)
#
#             if CollectorCard.objects.filter(voucher_cards=voucher).exists():
#                 collector_card = CollectorCard.objects.get(voucher_cards=voucher)
#                 collector_card.is_used = True
#                 collector_card.save()
#
#                 if AppleDevice.objects.filter(apple_pass__serial_number=collector_card.serial_nr).exists():
#                     apple_pass = ApplePass.objects.get(serial_number=collector_card.serial_nr)
#                     apple_pass.last_updated = code_generator()
#                     apple_pass.save()
#                     apple_device = AppleDevice.objects.get(apple_pass=apple_pass)
#                     # push notification
#                     asyncio.run(send_push_token(apple_device.push_token, apple_pass.pass_type_id))
#
#             return Response({'message': "You've just used your voucher."}, status=status.HTTP_200_OK)
#         return Response({'message': "This voucher doesn't exist."}, status=status.HTTP_404_NOT_FOUND)


class GetVoucherView(ListAPIView):
    serializer_class = VoucherSerializer
    queryset = VoucherCard.objects.all()
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        voucher_token = request.data['voucher_token']

        user = request.user

        business_owner_id = request.data.get('business_owner_id', None)
        try:
            decoded = jwt.decode(voucher_token, options={"verify_signature": False})
            user_id = decoded['user_id']
            customer_user_profile = CustomerUserProfile.objects.get(user_id=user_id)
            secret_key = customer_user_profile.secret_key
            jwt.decode(voucher_token, secret_key, algorithms="HS256")

        except CustomerUserProfile.DoesNotExist:
            return Response({'message': 'The Qr Code Is Broken'}, status=status.HTTP_400_BAD_REQUEST)

        except (InvalidTokenError, DecodeError):
            return Response({'message': 'The Qr Code Is Broken'}, status=status.HTTP_400_BAD_REQUEST)

        decoded = jwt.decode(voucher_token, options={"verify_signature": False})
        voucher_id = decoded['voucher_id']

        if VoucherCard.objects.filter(id=voucher_id).exists():
            voucher = VoucherCard.objects.get(id=voucher_id)
            if not self.is_user_owner(user, voucher) and not self.is_user_in_team(user, voucher, business_owner_id):
                return Response({'message': "You don't have permission to use this voucher."},
                                status=status.HTTP_401_UNAUTHORIZED)

            # If requester is business owner it checks if user requests data from he's personal profile
            if self.is_user_owner(request.user, voucher) and business_owner_id:
                return Response({'message': "You don't have permission to use this voucher."},
                                status=status.HTTP_401_UNAUTHORIZED)

            voucher = VoucherCard.objects.get(id=voucher_id)

            if voucher.is_used:
                return Response({'message': 'This voucher has already been used.'}, status=status.HTTP_400_BAD_REQUEST)

            data = VoucherSerializer(voucher).data

            return Response(data, status=status.HTTP_200_OK)
        return Response({'message': "This voucher doesn't exist."}, status=status.HTTP_404_NOT_FOUND)

    def is_user_owner(self, user, voucher):
        return user.business_user_profile == voucher.business_user_profile

    def is_user_in_team(self, user, voucher, business_owner_id):
        return voucher.business_user_profile.user.id == business_owner_id and TeamsRequest.objects.filter(
            receiver=user,
            requester=voucher.business_user_profile.user,
            status='accepted').exists()


# class CreateCampaignVoucherView(CreateAPIView):
#     serializer_class = UseVoucherSerializer
#     queryset = VoucherCard.objects.all()
#     permission_classes = [IsAuthenticated]
#
#     def post(self, request, *args, **kwargs):
#         secret_key = request.data['secret_key']
#         campaign_id = request.data['campaign_id']
#         campaign = get_object_or_404(Campaign, id=campaign_id)
#         customer_user_profile = get_object_or_404(CustomerUserProfile, secret_key=secret_key)
#         voucher_type = VoucherType.objects.get(id=2)
#
#         if campaign.business_user_profile == self.request.user.business_user_profile or TeamsRequest.objects.filter(
#                 requester=campaign.business_user_profile.user, receiver=self.request.user, status='accepted').exists():
#             VoucherCard.objects.create(customer_user_profile=customer_user_profile, campaign=campaign,
#                                        logo=campaign.logo, business_name=campaign.business_user_profile.business_name,
#                                        campaign_name=campaign.name, expiration_date=campaign.ending_date,
#                                        business_user_profile=campaign.business_user_profile, voucher_type=voucher_type)
#             return Response({'message': 'Voucher has been created'}, status=status.HTTP_200_OK)
#         else:
#             return Response({'message': 'You are not allowed to create this voucher'},
#                             status=status.HTTP_401_UNAUTHORIZED)


class CreatePromotionVoucherView(CreateAPIView):
    # serializer_class = UseVoucherSerializer
    queryset = VoucherCard.objects.all()
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        user = self.request.user
        promotion_id = request.data['promotion_id']
        promotion = get_object_or_404(Promotion, id=promotion_id)
        if VoucherCard.objects.filter(customer_user_profile=user.customer_user_profile, promotion=promotion).exists():
            return Response('Already participated in this promotion', status=status.HTTP_400_BAD_REQUEST)
        if promotion.vouchers_issued >= promotion.vouchers_amount:
            return Response('No vouchers left.', status=status.HTTP_400_BAD_REQUEST)
        customer_user_profile = user.customer_user_profile
        voucher_type = VoucherType.objects.get(id=3)
        voucher = VoucherCard.objects.create(customer_user_profile=customer_user_profile,
                                             promotion=promotion,
                                             expiration_date=promotion.date_ends,
                                             date_expired=promotion.date_ends,
                                             business_user_profile=promotion.business_user_profile,
                                             business_id=promotion.business_user_profile.user.id,
                                             voucher_type=voucher_type)
        promotion.vouchers_issued = promotion.vouchers_issued + 1
        if promotion.vouchers_issued >= promotion.vouchers_amount:
            promotion.is_active = False
        promotion.save()
        voucher = VoucherSerializer(voucher)
        promotion = PromotionsSerializerInBusinessProfile(promotion, context={'request': request})
        voucher_created(customer_user_profile.secret_key, voucher.data)
        return Response({'voucher': voucher.data, 'promotion': promotion.data}, status=status.HTTP_200_OK)


class IsVoucherUsed(ListAPIView):
    # serializer_class = VoucherSerializer
    queryset = VoucherCard.objects.all()
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        voucher_id = kwargs['voucher_id']
        voucher = get_object_or_404(VoucherCard, id=voucher_id)
        if voucher.is_used:
            return Response({'is_used': 'true'}, status=status.HTTP_200_OK)
        if not voucher.is_used:
            return Response({'is_used': 'false'}, status=status.HTTP_200_OK)
        else:
            return Response({'message': 'We can not find the Voucher.'}, status=status.HTTP_404_NOT_FOUND)


class CustomerUsersActiveVouchers(ListAPIView):
    # queryset = VoucherCard.objects.all()
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = self.request.user
        customer_user_profile = CustomerUserProfile.objects.get(user=user)
        search = request.query_params.get('search', False)
        now = timezone.now()
        three_days_ago = now - timedelta(hours=72)
        if search:
            vouchers = VoucherCard.objects.filter(
                Q(customer_user_profile=customer_user_profile) &
                Q(is_used=False) & Q(date_expired__gte=three_days_ago) &
                (Q(campaign__name__icontains=search) | Q(
                    business_user_profile__business_name__icontains=search))).order_by('-date_created')
        else:
            vouchers = (VoucherCard.objects.filter(Q(customer_user_profile=customer_user_profile) &
                                                   Q(is_used=False) & Q(date_expired__gte=three_days_ago)).order_by(
                '-date_created'))

        serializer = VoucherSerializer(vouchers, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class CustomerUsersUsedVouchers(ListAPIView):
    # serializer_class = UseVoucherSerializer
    queryset = VoucherCard.objects.all()
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = self.request.user
        customer_user_profile = CustomerUserProfile.objects.get(user=user)
        vouchers = VoucherCard.objects.filter(customer_user_profile=customer_user_profile, is_used=True)
        serializer = VoucherSerializer(vouchers, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
