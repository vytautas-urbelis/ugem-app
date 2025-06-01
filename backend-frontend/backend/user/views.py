import random

from django.contrib.auth import get_user_model
from django.db.models import Q
# from django.db.models import Count

from rest_framework import status
from rest_framework.generics import CreateAPIView, ListAPIView

from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView

from business_user_profile.models import BusinessUserProfile
from business_user_profile.serializers import BusinessUserProfileSerializer
from customer_user_profile.models import CustomerUserProfile
from customer_user_profile.serializers import CustomerUserProfileSerializer
from email_layouts.send_email import send_password_recovery_link
from email_layouts.user_password_recover import user_password_recover
from project.settings import MEDIA_HOST
# from teams_request.models import TeamsRequest
# from teams_request.serializers import TeamsRequestSerializer
from user.serializers import BusinessUserSerializer, CustomerUserSerializer
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken

User = get_user_model()


def code_generator(length=15):
    numbers = '0123456789qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM'
    return ''.join(random.choice(numbers) for _ in range(length))


class TokenUserObtainView(TokenObtainPairView):
    """
    post:
    Create a new session for a user. Sends back tokens and user.
    """

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        try:
            serializer.is_valid(raise_exception=True)
        except TokenError as e:
            raise InvalidToken(e.args[0])

        user = User.objects.get(email=request.data['email'])
        req = request
        if not request.data.get('account', False):
            return Response({'message': 'No active account found with the given credentials'},
                            status=status.HTTP_401_UNAUTHORIZED)

        if request.data['account'] == 'business':
            if not BusinessUserProfile.objects.filter(user=user).exists():
                return Response({'message': 'No active account found with the given credentials'},
                                status=status.HTTP_401_UNAUTHORIZED)
            try:
                business_serializer = BusinessUserSerializer(instance=user, context={'request': req})
                res = {
                    'business': business_serializer.data,
                    **serializer.validated_data
                }
                return Response(res, status=status.HTTP_200_OK)
            except (TokenError, InvalidToken,):
                return Response({'message': 'No active account found with the given credentials'},
                                status=status.HTTP_401_UNAUTHORIZED)

        elif request.data['account'] == 'customer':
            if not CustomerUserProfile.objects.filter(user=user).exists():
                return Response({'message': 'No active account found with the given credentials'},
                                status=status.HTTP_401_UNAUTHORIZED)
            try:
                customer_user_serializer = CustomerUserSerializer(instance=user, context={'request': req})
                res = {
                    'customer': customer_user_serializer.data,
                    **serializer.validated_data
                }
                return Response(res, status=status.HTTP_200_OK)
            except (TokenError, InvalidToken):
                return Response({'message': 'No active account found with the given credentials'},
                                status=status.HTTP_401_UNAUTHORIZED)

        else:
            return Response({'message': 'No active account found with the given credentials'},
                            status=status.HTTP_401_UNAUTHORIZED)


class AskToRecoverPasswordView(CreateAPIView):
    permission_classes = []

    def post(self, request, *args, **kwargs):
        email = request.data.get('email', None)

        "Checking if user with email exists"
        if User.objects.filter(email=email).exists():
            user = User.objects.get(email=email)
            user.pass_recovery_code = code_generator()
            user.password_recovery_in_progress = True
            user.save()
            try:
                send_password_recovery_link(
                    subject="Password Create/Recovery link",
                    body='',
                    html_body=user_password_recover(MEDIA_HOST, user.password_recovery_code),
                    recipient_list=[user.email]
                )
                return Response({"message": 'Password recovery link sent successfully.'}, status=status.HTTP_200_OK)
            except Exception as e:
                print(e)  # Consider logging this instead of printing for production.
                return Response('Failed to send password recovery link. Please try again.',
                                status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            return Response('No active account found with the given email.',
                            status=status.HTTP_400_BAD_REQUEST)


class RecoverPasswordView(CreateAPIView):
    queryset = User.objects.all()
    permission_classes = []

    def post(self, request, *args, **kwargs):
        password = request.data.get('password', None)
        password2 = request.data.get('password2', None)

        "Checking if passwords match"
        if password != password2:
            return Response({'message': 'Passwords do not match'}, status=status.HTTP_400_BAD_REQUEST)

        if not password or not password2:
            return Response({'message': 'Passwords need to be provided.'}, status=status.HTTP_400_BAD_REQUEST)
        recovery_code = request.data.get('recoveryCode', None)

        "Checking if user with recovery code exists"
        if User.objects.filter(password_recovery_code=recovery_code).exists():
            user = User.objects.get(password_recovery_code=recovery_code)

            "Checking if user with recovery code is marked as in progress"
            if user.password_recovery_in_progress:
                "If user exists and is marked as in progress, reset password and password recovery code"
                user.password_recovery_code = code_generator()
                user.set_password(password)
                user.save()
                return Response({'message': 'Password has been reset.'}, status=status.HTTP_200_OK)
        else:
            return Response({'message': 'Link is expired'}, status=status.HTTP_401_UNAUTHORIZED, )


class GetMyProfilesView(ListAPIView):
    def get(self, request, *args, **kwargs):
        user = self.request.user
        # Getting profiles
        business = BusinessUserProfile.objects.filter(user=user)
        business_user_profile = BusinessUserProfileSerializer(business, many=True).data
        customer = CustomerUserProfile.objects.filter(user=user)
        customer_user_profile = CustomerUserProfileSerializer(customer, many=True).data
        teams = BusinessUserProfile.objects.filter((Q(is_vip=True) | Q(subscription=True)),
                                                   user__sent_requests__receiver=user,
                                                   user__sent_requests__status='accepted')
        teams_user_profile = BusinessUserProfileSerializer(teams, many=True).data

        return Response({'business_user_profile': business_user_profile, 'customer_user_profile': customer_user_profile,
                         'teams_user_profile': teams_user_profile}, status=status.HTTP_200_OK)
