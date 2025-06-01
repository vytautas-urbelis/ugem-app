import random

import jwt
from django.contrib.auth import get_user_model
from django.core.mail import send_mail

from django.http import Http404
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.exceptions import NotFound
from rest_framework.generics import CreateAPIView, UpdateAPIView, RetrieveAPIView, DestroyAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from apple_cards.pass_update import update_customer_card, update_voucher_card, \
    update_collector_card_stamps, update_collector_card_points
from business_user_profile.models import BusinessUserProfile, BusinessWallMessage, BusinessCategory
from business_user_profile.serializers import BusinessWallMessageForBusinessProfileSerializer
from collector_card.models import CollectorCard
# from email_layouts.get_card_email import get_card_layout
# from email_layouts.qr_email import email_layout

from customer_user_profile.models import CustomerUserProfile
from email_layouts.customer_verification_email import customer_verification_link
# from email_layouts.send_email import send_email_with_attachment
from model_logs.models import LogsWallMessage, LogsFollowBusiness, LogsSubscribeBusiness
from project.permissions import IsSelf
from project.settings import FRONT_END_HOST, DEFAULT_FROM_EMAIL
# from apple_cards.customer_card import create_customer_card
from user.serializers import UserRegistrationSerializer, CustomerUserSerializer, CustomerUserUpdateDeleteSerializer, \
    BusinessByIdSerializer
# from utils.nickname_generator.nickname import generate_unique_nickname
from voucher_card.models import VoucherCard
from datetime import datetime

User = get_user_model()


def code_generator(length=15):
    numbers = '0123456789qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM'
    return ''.join(random.choice(numbers) for _ in range(length))


class MeCustomerUser(RetrieveAPIView):
    """
    API view to retrieve the authenticated end user's details.
    """
    serializer_class = CustomerUserSerializer

    def get(self, request, *args, **kwargs):
        """
        Retrieves the authenticated user's details and returns them.
        Uses a GET method to conform with the typical RESTful approach for data retrieval.
        """
        # Directly use the authenticated user from the request without additional database query
        serializer = CustomerUserSerializer(self.request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)


class CustomerUserByEmailIsVerified(CreateAPIView):
    """
    API view to retrieve the authenticated end user's details.
    """
    serializer_class = CustomerUserSerializer
    permission_classes = []

    def post(self, request, *args, **kwargs):
        """
        Retrieves the authenticated user's details and returns them.
        Uses a GET method to conform with the typical RESTful approach for data retrieval.
        """
        email = request.data['email']
        user = User.objects.get(email=email)
        # Directly use the authenticated user from the request without additional database query
        serializer = CustomerUserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)


class GetCustomerUserById(RetrieveAPIView):
    serializer_class = CustomerUserSerializer

    def get(self, request, *args, **kwargs):
        customer = User.objects.get(id=kwargs['pk'])
        return Response(CustomerUserSerializer(customer).data, status=status.HTTP_200_OK)


class CreateCustomerUser(CreateAPIView):
    """
    API view to handle end-user registration. This view creates a new user or updates
    existing user's codes and sends a verification link via email.
    """
    serializer_class = UserRegistrationSerializer
    permission_classes = []  # letting all users access this endpoint

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)  # Validates incoming data and raises an exception on failure.
        referred_by = request.query_params.get('referred_by', '')
        email = serializer.validated_data.get('email')
        password = serializer.validated_data.get('password')
        today = datetime.today()
        if not email:
            return Response("No email provided", status=status.HTTP_400_BAD_REQUEST)

        # Ensure the user profile is created, and generate new codes if the user was already in the system.
        user = User.objects.filter(email=email).first()
        if user:
            return Response("User with this email already exists.", status=status.HTTP_400_BAD_REQUEST)
        else:
            user = User.objects.create(email=email, username=email)
            user.set_password(password)
            user.customer_user_profile.agreed_tos = True
            user.customer_user_profile.agreed_tos_date = today
            user.save()
            code = user.customer_user_profile.code
            text_message = f"To verify your email, please click the following link: {FRONT_END_HOST}/verify-email/{code}"

            # Prepare and send the email.

            send_mail(
                'uGem email verification.',
                text_message,
                DEFAULT_FROM_EMAIL,
                [email],
                html_message=customer_verification_link(FRONT_END_HOST, code),
                fail_silently=False,
            )

            if referred_by != '':
                user_profile = user.customer_user_profile
                try:
                    decoded = jwt.decode(referred_by, options={"verify_signature": False})

                    if decoded.get('customer_id'):
                        customer_user_profile = CustomerUserProfile.objects.get(user_id=decoded.get('customer_id'))
                        secret_key = customer_user_profile.secret_key
                        jwt.decode(referred_by, secret_key, algorithms="HS256")
                        user_profile.referred_by = customer_user_profile
                        user_profile.save()

                    elif decoded.get('business_id'):
                        business_user_profile = BusinessUserProfile.objects.get(user__id=decoded.get('business_id'))
                        email = business_user_profile.user.email
                        jwt.decode(referred_by, email, algorithms="HS256")
                        user_profile.referred_by_business = business_user_profile
                        user_profile.save()

                except Exception:
                    pass
        data = CustomerUserSerializer(user).data
        return Response(data, status=status.HTTP_200_OK)


# class CreateGetClipUser(CreateAPIView):
#     """
#     API view to handle clip user creation or return
#     """
#     serializer_class = UserRegistrationSerializer
#     permission_classes = []  # letting all users access this endpoint
#
#     def create(self, request, *args, **kwargs):
#
#         device_id = request.data.get('device_id', None)
#         if not device_id:
#             return Response("No device id provided", status=status.HTTP_400_BAD_REQUEST)
#
#         # Ensure the user profile is created, and generate new codes if the user was already in the system.
#         user = User.objects.filter(customer_user_profile__device_id=device_id).first()
#         if user:
#             data = CustomerUserSerializer(user).data
#             return Response(data, status=status.HTTP_200_OK)
#         else:
#             random_email = generate_unique_nickname(CustomerUserProfile)
#             user = User.objects.create(email=random_email, username=random_email)
#             user.customer_user_profile.device_id = device_id
#             user.customer_user_profile.save()
#             user.save()
#
#             data = CustomerUserSerializer(user).data
#             return Response(data, status=status.HTTP_201_CREATED)


class SendVerificationEmail(CreateAPIView):
    permission_classes = []

    def post(self, request, *args, **kwargs):
        user = request.user
        email = user.email
        if user.customer_user_profile.is_verified:
            return Response("Email already verified", status=status.HTTP_400_BAD_REQUEST)
        code = user.customer_user_profile.code
        text_message = f"To verify your email, please click the following link: {FRONT_END_HOST}/verify-email/{code}"
        # Prepare and send the email.

        send_mail(
            'uGem email verification.',
            text_message,
            DEFAULT_FROM_EMAIL,
            [email],
            html_message=customer_verification_link(FRONT_END_HOST, code),
            fail_silently=False,
        )

        return Response("Verification email was sent to your email address.", status=status.HTTP_200_OK)


class VerifyCustomerUserAndCreateCard(CreateAPIView):
    """
    API view to generate a new QR code for an end user and send it via email.
    """
    serializer_class = UserRegistrationSerializer
    permission_classes = []  # letting all users access this endpoint

    def post(self, request, *args, **kwargs):
        """
        Overridden retrieve method to send an email with the QR code after successful retrieval
        and regeneration of the user's code.
        """
        try:
            code = self.request.data['code']
            customer_user_profile = CustomerUserProfile.objects.get(code=code)
            customer_user_profile.code = code_generator()  # Update the code on access
            customer_user_profile.is_verified = True
            customer_user_profile.save(update_fields=['code', 'is_verified'])
            return Response('Account successfully verified.', status=status.HTTP_200_OK)
        except CustomerUserProfile.DoesNotExist:
            # Handle case where profile does not exist to send a specific error response.
            raise NotFound('Profile with the given code does not exist.')


class DeleteCustomerUser(DestroyAPIView):
    """
    API view to delete a BusinessUserProfile associated with the current authenticated user.
    """
    serializer_class = UserRegistrationSerializer
    permission_classes = [IsAuthenticated, IsSelf]
    queryset = CustomerUserProfile

    def get_object(self):
        # This method ensures that you retrieve the user's profile correctly.
        try:
            return User.objects.get(id=self.request.user.id)
        except User.DoesNotExist:
            raise Http404


class UpdateCustomerUser(UpdateAPIView):
    """
    API view to update a EndUserProfile for the currently authenticated user.
    """
    serializer_class = CustomerUserUpdateDeleteSerializer
    permission_classes = [IsAuthenticated, IsSelf]
    queryset = CustomerUserProfile.objects.all()

    def get_object(self):
        """
        Retrieve the CustomerUserProfile associated with the current authenticated user.
        This override ensures that we directly fetch the user's profile, raising Http404 if not found.
        """
        try:
            return CustomerUserProfile.objects.get(user=self.request.user)
        except CustomerUserProfile.DoesNotExist:
            raise Http404

    def patch(self, request, *args, **kwargs):
        """
        Handle the PATCH request to partially update the user's profile.
        """
        customer_user_profile = self.get_object()  # Retrieve the user profile.
        serializer = self.serializer_class(customer_user_profile, data=request.data,
                                           partial=True)  # Allow partial updates

        if serializer.is_valid():
            serializer.save()  # This automatically updates the profile instance
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            # Return errors if validation fails.
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CreateBusinessUserProfile(CreateAPIView):
    """
    API view to handle creation of business user profile.
    """
    serializer_class = UserRegistrationSerializer

    def post(self, request, *args, **kwargs):
        """
        Overridden create method to add custom logic for user creation and sending an email with a registration code.
        """
        if BusinessUserProfile.objects.filter(user=request.user).exists():
            return Response('Business profile already exists.', status=status.HTTP_400_BAD_REQUEST)
        user = request.user
        street_number = request.data.get('street_number')
        street = request.data.get('street')
        city = request.data.get('city')
        country = request.data.get('country')
        zip = request.data.get('postal_code')
        latitude = request.data.get('latitude')
        longitude = request.data.get('longitude')
        business_category = request.data.get('business_category')
        business_name = request.data.get('business_name')

        category = BusinessCategory.objects.get(id=business_category)

        today = datetime.today()

        # Check if there were all the data provided:
        if not all([street_number, street, city, country, zip, latitude, longitude,
                    business_category, business_name]):
            return Response({'error': 'Please fill in all fields'}, status=status.HTTP_400_BAD_REQUEST)

        # Create business user profile.
        business_user_profile = BusinessUserProfile.objects.create(user=user, is_verified=True,
                                                                   business_name=business_name,
                                                                   street_number=street_number, street=street,
                                                                   city=city, country=country, zip=zip,
                                                                   latitude=latitude, longitude=longitude,
                                                                   business_category=category,
                                                                   agreed_tos=True,
                                                                   agreed_tos_date=today
                                                                   )

        business_user_profile.save()
        user.is_business = True
        user.save()

        return Response("Business profile created", status=status.HTTP_200_OK)


class CreateCustomerUserCard(CreateAPIView):
    """
    API view to generate a new QR code for an end user and send it via email.
    """
    serializer_class = UserRegistrationSerializer

    # Add credentials true to axios call

    def get_object(self):
        """
        Retrieve and return the EndUserProfile based on the provided 'code' in the URL.
        Overriding this method to include specific error handling and logic for code regeneration.
        """
        try:
            user = self.request.user
            customer_user_profile = CustomerUserProfile.objects.get(user=user)
            return customer_user_profile
        except CustomerUserProfile.DoesNotExist:
            # Handle case where profile does not exist to send a specific error response.
            raise NotFound('Profile does not exist.')

    def post(self, request, *args, **kwargs):
        """
        Overridden retrieve method to send an email with the QR code after successful retrieval
        and regeneration of the user's code.
        """
        customer_user_profile = self.get_object()  # Get the object using the overridden get_object method.
        try:
            response = update_customer_card(customer_user_profile)

            return response
        except Exception as e:
            print(e)  # Consider logging this instead of printing for production.
            return Response('Failed to send Apple card', status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class CreateCustomerUserVoucherCard(CreateAPIView):
    """
    API view to generate a new QR code for an end user and send it via email.
    """
    serializer_class = UserRegistrationSerializer

    # Add credentials true to axios call

    def get_object(self):
        """
        Retrieve and return the EndUserProfile based on the provided 'code' in the URL.
        Overriding this method to include specific error handling and logic for code regeneration.
        """
        try:
            user = self.request.user
            voucher_id = self.request.data.get("voucher_id")
            customer_user_profile = CustomerUserProfile.objects.get(user=user)
            voucher = VoucherCard.objects.get(id=voucher_id, customer_user_profile=customer_user_profile)
            return voucher
        except CustomerUserProfile.DoesNotExist:
            # Handle case where profile does not exist to send a specific error response.
            raise NotFound('Profile does not exist.')

    def post(self, request, *args, **kwargs):
        """
        Overridden retrieve method to send an email with the QR code after successful retrieval
        and regeneration of the user's code.
        """
        voucher_card = self.get_object()  # Get the object using the overridden get_object method.
        customer_user_profile = CustomerUserProfile.objects.get(user=self.request.user)

        try:
            response = update_voucher_card(voucher_card, customer_user_profile)

            return response
        except Exception as e:
            print(e)  # Consider logging this instead of printing for production.
            return Response('Failed to send Voucher card', status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class CreateCustomerUserCollectorCard(CreateAPIView):
    """
    API view to generate a new QR code for an end user and send it via email.
    """
    serializer_class = UserRegistrationSerializer

    # Add credentials true to axios call

    def get_object(self):
        """
        Retrieve and return the EndUserProfile based on the provided 'code' in the URL.
        Overriding this method to include specific error handling and logic for code regeneration.
        """
        try:
            user = self.request.user
            collector_id = self.request.data.get("collector_id")
            customer_user_profile = CustomerUserProfile.objects.get(user=user)
            collector = CollectorCard.objects.get(id=collector_id, customer_user_profile=customer_user_profile)
            return collector
        except CustomerUserProfile.DoesNotExist:
            # Handle case where profile does not exist to send a specific error response.
            raise NotFound('Profile does not exist.')

    def post(self, request, *args, **kwargs):
        """
        Overridden retrieve method to send an email with the QR code after successful retrieval
        and regeneration of the user's code.
        """
        collector_card = self.get_object()  # Get the object using the overridden get_object method.

        try:
            if collector_card.campaign.collector_type.id == 1:
                response = update_collector_card_stamps(collector_card)
            elif collector_card.campaign.collector_type.id == 2:
                response = update_collector_card_points(collector_card, 'Points')
            elif collector_card.campaign.collector_type.id == 3:
                response = update_collector_card_points(collector_card, 'CHF')

            return response
        except Exception as e:
            print(e)  # Consider logging this instead of printing for production.
            return Response('Failed to send Apple card', status=status.HTTP_500_INTERNAL_SERVER_ERROR)


"""This need to be review"""


class FallowBusinessOnScan(CreateAPIView):
    permission_classes = []

    def post(self, request, *args, **kwargs):
        business_qr = self.request.data.get("business_qr")
        email = self.request.data.get("email")
        customer_user_profile = CustomerUserProfile.objects.get(user__email=email)
        try:
            decoded = jwt.decode(business_qr, options={"verify_signature": False})

            decoded.get('business_id')
            business_user_profile = BusinessUserProfile.objects.get(user__id=decoded.get('business_id'))
            email = business_user_profile.user.email
            jwt.decode(business_qr, email, algorithms="HS256")
            if customer_user_profile.followed_businesses.filter(user__id=business_user_profile.user.id).exists():
                return Response({'message': 'Already following.', "business": business_user_profile.user.id},
                                status=status.HTTP_200_OK)
            customer_user_profile.followed_businesses.add(business_user_profile)
            LogsFollowBusiness.objects.create(business_user_profile=business_user_profile,
                                              customer_user_profile=customer_user_profile, action='follow')
            if not customer_user_profile.subscribed_businesses.filter(user__id=business_user_profile.user.id).exists():
                customer_user_profile.subscribed_businesses.add(business_user_profile)
                LogsSubscribeBusiness.objects.create(business_user_profile=business_user_profile,
                                                     customer_user_profile=customer_user_profile, action='subscribe')
            customer_user_profile.save()
            return Response({'message': 'Success.', "business": business_user_profile.user.id},
                            status=status.HTTP_200_OK)

        except Exception:
            return Response('Sorry, but we can not recognise this QR code.', status=status.HTTP_400_BAD_REQUEST)


class GetBusinessOnScan(CreateAPIView):

    def post(self, request, *args, **kwargs):
        business_qr = self.request.data.get("business_qr")
        try:
            decoded = jwt.decode(business_qr, options={"verify_signature": False})
            decoded.get('business_id')
            business_user = User.objects.get(id=decoded.get('business_id'))
            email = business_user.email
            jwt.decode(business_qr, email, algorithms="HS256")
            return Response({"business_id": business_user.id},
                            status=status.HTTP_200_OK)
        except Exception:
            return Response('Sorry, but we can not recognise this QR code.', status=status.HTTP_400_BAD_REQUEST)


class ToggleFallowBusiness(CreateAPIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        user = request.user
        business_id = self.request.data.get("business_id")
        customer_user_profile = get_object_or_404(CustomerUserProfile, user=user)
        business_user_profile = get_object_or_404(BusinessUserProfile, user__id=business_id)
        business_user = User.objects.get(id=business_id)

        if customer_user_profile.followed_businesses.filter(user__id=business_user_profile.user.id).exists():
            customer_user_profile.followed_businesses.remove(business_user_profile)
            customer_user_profile.save()
            LogsFollowBusiness.objects.create(business_user_profile=business_user_profile,
                                              customer_user_profile=customer_user_profile, action='unfollow')
            """Comment"""
            serializer = BusinessByIdSerializer(business_user, context={'request': request})
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            customer_user_profile.followed_businesses.add(business_user_profile)
            customer_user_profile.save()
            LogsFollowBusiness.objects.create(business_user_profile=business_user_profile,
                                              customer_user_profile=customer_user_profile, action='follow')
            serializer = BusinessByIdSerializer(business_user, context={'request': request})
            return Response(serializer.data, status=status.HTTP_200_OK)


class ToggleSubscribeBusiness(CreateAPIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        user = request.user
        business_id = self.request.data.get("business_id")
        customer_user_profile = get_object_or_404(CustomerUserProfile, user=user)
        business_user_profile = get_object_or_404(BusinessUserProfile, user__id=business_id)
        business_user = User.objects.get(id=business_id)

        if customer_user_profile.subscribed_businesses.filter(user__id=business_user_profile.user.id).exists():
            customer_user_profile.subscribed_businesses.remove(business_user_profile)
            customer_user_profile.save()
            serializer = BusinessByIdSerializer(business_user, context={'request': request})
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            customer_user_profile.subscribed_businesses.add(business_user_profile)
            customer_user_profile.save()
            serializer = BusinessByIdSerializer(business_user, context={'request': request})
            return Response(serializer.data, status=status.HTTP_200_OK)


class ToggleLikeWallMessage(CreateAPIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        user = request.user
        message_id = self.request.data.get("message_id")
        customer_user_profile = get_object_or_404(CustomerUserProfile, user=user)
        wall_message = get_object_or_404(BusinessWallMessage, id=message_id)

        if customer_user_profile.liked_messages.filter(id=wall_message.id).exists():
            customer_user_profile.liked_messages.remove(wall_message)
            customer_user_profile.save()
            LogsWallMessage.objects.create(action='unlike', customer_user_profile=customer_user_profile,
                                           wall_message=wall_message,
                                           business_user_profile=wall_message.business_user_profile)
            serializer = BusinessWallMessageForBusinessProfileSerializer(wall_message, context={'request': request})
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            customer_user_profile.liked_messages.add(wall_message)
            customer_user_profile.save()
            LogsWallMessage.objects.create(action='like', customer_user_profile=customer_user_profile,
                                           wall_message=wall_message,
                                           business_user_profile=wall_message.business_user_profile)
            serializer = BusinessWallMessageForBusinessProfileSerializer(wall_message, context={'request': request})
            return Response(serializer.data, status=status.HTTP_200_OK)
