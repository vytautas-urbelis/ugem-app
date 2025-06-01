import random

from django.core.mail import send_mail

from django.http import Http404
from rest_framework import status
from rest_framework.generics import CreateAPIView, UpdateAPIView, DestroyAPIView, RetrieveAPIView, ListCreateAPIView, \
    ListAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from business_user_profile.models import BusinessUserProfile, BusinessWallMessage, BusinessCategory
from business_user_profile.serializers import BusinessWallMessageSerializer, BusinessCategorySerializer
from customer_user_profile.models import CustomerUserProfile
from email_layouts.business_qr_email import business_email_layout
from email_layouts.business_verification_email import business_verification_link
from email_layouts.send_email import send_business_qr
from model_logs.models import LogsWallMessage

from project.permissions import IsSelf, IsMessageAuthor
from project.settings import MEDIA_HOST, FRONT_END_HOST, DEFAULT_FROM_EMAIL
from user.serializers import BusinessUserSerializer, UserRegistrationSerializer, BusinessUserUpdateDeleteSerializer, \
    BusinessByIdSerializer
from django.contrib.auth import get_user_model
from datetime import datetime

User = get_user_model()


def code_generator(length=15):
    numbers = '0123456789qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM'
    return ''.join(random.choice(numbers) for _ in range(length))


class GetBusinessUserById(ListAPIView):
    serializer_class = BusinessByIdSerializer
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        business_user = User.objects.get(id=kwargs['pk'])
        serializer = BusinessByIdSerializer(business_user, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)


class MeBusinessUser(RetrieveAPIView):
    """
    API view to retrieve the authenticated business user's details.
    """
    serializer_class = BusinessUserSerializer

    def get(self, request, *args, **kwargs):
        """
        Retrieves the authenticated user's details and returns them.
        Uses a GET method to conform with the typical RESTful approach for data retrieval.
        """
        # Directly use the authenticated user from the request without additional database query
        if not BusinessUserProfile.objects.filter(user=request.user).exists():
            return Response("User don't have Business profile.", status=status.HTTP_404_NOT_FOUND)
        serializer = BusinessUserSerializer(self.request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)


# Create your views here.
class CreateBusinessUser(CreateAPIView):
    """
    API view to handle creation of business user accounts.
    """
    serializer_class = UserRegistrationSerializer
    permission_classes = []  # letting all users access this endpoint

    def create(self, request, *args, **kwargs):
        """
        Overridden create method to add custom logic for user creation and sending an email with a registration code.
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)  # Validate serializer data and raise an exception on failure.

        email = serializer.validated_data.get('email')
        password = request.data.get('password')
        password_repeat = request.data.get('password_repeat')
        street_number = request.data.get('street_number')
        street = request.data.get('street')
        city = request.data.get('city')
        country = request.data.get('country')
        zip = request.data.get('postal_code')
        latitude = request.data.get('latitude')
        longitude = request.data.get('longitude')
        business_category = request.data.get('business_category')
        business_name = request.data.get('business_name')

        today = datetime.today()

        # Check if there were all the data provided:
        if not all([email, password, password_repeat, street_number, street, city, country, zip, latitude, longitude,
                    business_category, business_name]):
            return Response({'error': 'Please fill in all fields'}, status=status.HTTP_400_BAD_REQUEST)

        if password is None or password_repeat is None:
            return Response("No password provided", status=status.HTTP_400_BAD_REQUEST)

        # Check if the provided passwords match, if not, return an error
        if password != password_repeat:
            return Response('Password does not match', status=status.HTTP_400_BAD_REQUEST)

        if not email:
            return Response("No email provided", status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(email=email).exists():
            return Response('A business user with this email already exists.', status=status.HTTP_400_BAD_REQUEST)

        # Create the user with the validated email. Assuming `is_business` is a field on the User model.
        user = User.objects.create(email=email, username=email, is_business=True)
        user.set_password(password)

        category = BusinessCategory.objects.get(id=business_category)

        # Saving data to user profile
        user.business_user_profile.business_name = business_name
        user.business_user_profile.street_number = street_number
        user.business_user_profile.street = street
        user.business_user_profile.city = city
        user.business_user_profile.country = country
        user.business_user_profile.zip = zip
        user.business_user_profile.latitude = latitude
        user.business_user_profile.longitude = longitude
        user.business_user_profile.business_category = category
        user.business_user_profile.agreed_tos = True
        user.business_user_profile.agreed_tos_date = today
        user.business_user_profile.save()

        user.save()

        code = user.business_user_profile.code

        text_message = f"To verify your email, please click the following link: {FRONT_END_HOST}/verify-business-email/{code}"

        # Prepare and send the email.

        send_mail(
            'uGem email authentication',
            text_message,
            DEFAULT_FROM_EMAIL,
            [email],
            html_message=business_verification_link(FRONT_END_HOST, code),
            fail_silently=False,
        )

        return Response("Verification email was sent to your email address.", status=status.HTTP_200_OK)


class ResendVerificationLinkView(ListCreateAPIView):
    """
    API view to handle resending of verification link.
    """
    serializer_class = UserRegistrationSerializer

    def get(self, request, *args, **kwargs):
        # Check if the provided passwords match, if not, return an error

        # Create the user with the validated email. Assuming `is_business` is a field on the User model.
        user = request.user
        business_user_profile = user.business_user_profile
        if User.objects.filter(business_user_profile=business_user_profile).exists():
            if user.business_user_profile.is_verified:
                return Response("Email is already verified.", status=status.HTTP_400_BAD_REQUEST)
            email = user.email
            user.business_user_profile.code = code_generator()
            user.business_user_profile.save()
            code = user.business_user_profile.code
            # Create the plain text message
            text_message = f"To verify your email, please click the following link: {FRONT_END_HOST}/verify-business-email/{code}"

            # Prepare and send the email.
            send_mail(

                'uGem email authentication',
                text_message,
                DEFAULT_FROM_EMAIL,
                [email],
                html_message=business_verification_link(FRONT_END_HOST, code),
                fail_silently=False,
            )

            return Response("Verification email was sent to your email address.", status=status.HTTP_200_OK)
        return Response("Verification link was not sent.", status=status.HTTP_400_BAD_REQUEST)

        # Assuming `business_user_profile` is created via signals or overridden save method on the User model.
        # code = user.business_user_profile.code

        # send_mail(
        #     'Registration code:',
        #     f'generated code: {code}',
        #     'bee.smart.constructor@gmail.com',
        #     [email],
        #     fail_silently=False,
        # )
        # return Response("Code was generated and sent to your email", status=status.HTTP_200_OK)


class VeryfiBusinessUserView(UpdateAPIView):
    """
    API view to verify business users using a code and update their user profile.
    """
    serializer_class = BusinessUserSerializer
    permission_classes = []  # letting all users access this endpoint

    def patch(self, request, *args, **kwargs):
        code = request.data.get('code')
        if User.objects.filter(business_user_profile__code=code).exists():
            user = User.objects.get(business_user_profile__code=code)
            user.business_user_profile.is_verified = True
            user.business_user_profile.code = code_generator()
            user.business_user_profile.save()
            nickname = user.email.split('@')[0] + '@'
            customer_profile = CustomerUserProfile.objects.create(user=user, country=user.business_user_profile.country,
                                                                  city=user.business_user_profile.city,
                                                                  street=user.business_user_profile.street,
                                                                  street_number=user.business_user_profile.street_number,
                                                                  zip=user.business_user_profile.zip,
                                                                  nickname=nickname,
                                                                  is_verified=True)
            customer_profile.save()

            return Response('User email is verified.', status=status.HTTP_200_OK)
        return Response('Link is expired', status=status.HTTP_400_BAD_REQUEST)


class DeleteBusinessUser(DestroyAPIView):
    """
    API view to delete a BusinessUserProfile associated with the current authenticated user.
    """
    serializer_class = UserRegistrationSerializer
    permission_classes = [IsAuthenticated, IsSelf]

    # queryset = BusinessUserProfile

    def get_object(self):
        # This method ensures that you retrieve the user's profile correctly.
        try:
            return User.objects.get(id=self.request.user.id)
        except User.DoesNotExist:
            raise Http404


class UpdateBusinessUser(UpdateAPIView):
    """
    API view to update a BusinessUserProfile for the currently authenticated user.
    """
    serializer_class = BusinessUserUpdateDeleteSerializer
    permission_classes = [IsAuthenticated, IsSelf]
    queryset = BusinessUserProfile.objects.all()

    def get_object(self):
        """
        Retrieve the BusinessUserProfile associated with the current authenticated user.
        This override ensures that we directly fetch the user's profile, raising Http404 if not found.
        """
        try:
            return BusinessUserProfile.objects.get(user=self.request.user)
        except BusinessUserProfile.DoesNotExist:
            raise Http404

    def patch(self, request, *args, **kwargs):
        """
        Handle the PATCH request to partially update the user's profile.
        """
        profile = self.get_object()  # Retrieve the user profile.
        serializer = self.serializer_class(profile, data=request.data, partial=True)  # Allow partial updates

        if serializer.is_valid():
            serializer.save()  # This automatically updates the profile instance
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            # Return errors if validation fails.
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ListCreateBusinessWallMessageView(ListCreateAPIView):
    # queryset = BusinessWallMessage.objects.all()
    serializer_class = BusinessWallMessageSerializer

    def get_queryset(self):
        amount = self.request.query_params.get('amount', False)
        if amount:
            int_amount = int(amount)
            return BusinessWallMessage.objects.filter(
                business_user_profile=self.request.user.business_user_profile).order_by('-date_created')[:int_amount]
        else:
            return BusinessWallMessage.objects.filter(
                business_user_profile=self.request.user.business_user_profile).order_by('-date_created')

    # permission_classes = (IsAuthenticated, IsMessageAuthor)

    def perform_create(self, serializer):
        """
        Automatically assigns the logged-in user's customer profile to the new campaign.
        """
        business_user_profile = BusinessUserProfile.objects.get(user=self.request.user)
        serializer.save(business_user_profile=business_user_profile)
        LogsWallMessage.objects.create(action='create', business_user_profile=business_user_profile)


class DeleteBusinessWallMessageView(DestroyAPIView):
    queryset = BusinessWallMessage.objects.all()
    serializer_class = BusinessWallMessageSerializer
    permission_classes = (IsAuthenticated, IsMessageAuthor)

    def get_object(self):
        # This method ensures that you retrieve the user's profile correctly.
        try:
            return BusinessWallMessage.objects.get(
                id=self.kwargs['pk'])
        except User.DoesNotExist:
            raise Http404


class SendQrToEmail(CreateAPIView):

    def post(self, request, *args, **kwargs):
        """
        Overridden retrieve method to send an email with the QR code after successful retrieval
        and regeneration of the user's code.
        """
        user = request.user
        try:
            send_business_qr(
                subject="Your QR and card",
                body='',
                html_body=business_email_layout(user.business_user_profile.qr_code.url, MEDIA_HOST),
                recipient_list=[user.email],
                file_path=f'/media-files/{user.business_user_profile.qr_code}'
            )
            return Response({"message": 'Qr code sent successful'}, status=status.HTTP_200_OK)
        except Exception as e:
            print(e)  # Consider logging this instead of printing for production.
            return Response('Failed to send QR code. Please try again.', status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class BusinessCategoryListView(ListAPIView):
    serializer_class = BusinessCategorySerializer
    permission_classes = []
    queryset = BusinessCategory.objects.all()
