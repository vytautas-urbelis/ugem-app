from rest_framework import status
from rest_framework.generics import CreateAPIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

from business_user_profile.models import BusinessUserProfile, BusinessCategory
from customer_user_profile.models import CustomerUserProfile
from project.settings import GOOGLE_OAUTH_CLIENT_ID
from user.serializers import UserRegistrationSerializer, BusinessUserSerializer, CustomerUserSerializer
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
# from django.conf import settings
from tempfile import NamedTemporaryFile

from django.contrib.auth import get_user_model
from django.core.files import File
from urllib.request import urlopen

from datetime import datetime

User = get_user_model()


class GoogleAuthSignUpView(CreateAPIView):
    """
    API view to handle Google OAuth registration and login. This view handles both business
    and customer user creation, along with email verification and token generation.
    """
    serializer_class = UserRegistrationSerializer
    permission_classes = []  # letting all users access this endpoint

    def download_photo(self, photo):
        if not photo:
            return None
        # Create a temporary file
        img_temp = NamedTemporaryFile(delete=True)

        # Download image and write it to the temporary file
        img_temp.write(urlopen(photo).read())

        # Ensure everything is written to disk
        img_temp.flush()

        # Move the pointer back to the start of the file
        img_temp.seek(0)

        # Wrap the temporary file in a Django File object
        return File(img_temp, name='downloaded_image.jpg')

    def verify_google_id_token(self, id_token_str):
        """
        Verifies the provided Google ID token using the Google OAuth client.
        """
        try:
            # Specify the CLIENT_ID of the app that accesses the backend:
            CLIENT_ID = GOOGLE_OAUTH_CLIENT_ID

            id_info = id_token.verify_oauth2_token(
                id_token_str,
                google_requests.Request(),
                CLIENT_ID
            )
            return id_info

        except ValueError as e:
            # Print or log the exact error message
            print(f"ValueError occurred: {e}")
            return None

    def create(self, request, *args, **kwargs):
        """
        Handles the creation or login of a user based on Google OAuth token and user data.
        """
        email = request.data.get('email', None)
        id_token = request.data.get('idToken', None)
        # family_name = request.data.get('familyName', '')
        # given_name = request.data.get('givenName', '')

        street_number = request.data.get('street_number', None)
        street = request.data.get('street', None)
        city = request.data.get('city', None)
        country = request.data.get('country', None)
        zip = request.data.get('postal_code', None)
        latitude = request.data.get('latitude', None)
        longitude = request.data.get('longitude', None)
        business_category = request.data.get('business_category', None)
        business_name = request.data.get('business_name', None)

        # Download the user's profile photo if provided
        photo = request.data.get('photo', None)

        today = datetime.today()

        # downloaded_photo = None
        # if photo:
        #     # Create a temporary file
        #     img_temp = NamedTemporaryFile(delete=True)
        #
        #     # Download image and write it to the temporary file
        #     img_temp.write(urlopen(photo).read())
        #
        #     # Ensure everything is written to disk
        #     img_temp.flush()
        #
        #     # Move the pointer back to the start of the file
        #     img_temp.seek(0)
        #
        #     # Wrap the temporary file in a Django File object
        #     downloaded_photo = File(img_temp, name='downloaded_image.jpg')

        is_business = bool(request.data.get('is_business'))

        # Verify the Google ID token
        id_info = self.verify_google_id_token(id_token)
        if not id_info:
            return Response({'error': 'Invalid ID token'}, status=status.HTTP_400_BAD_REQUEST)

        # Create or get user
        user, created = User.objects.get_or_create(username=email, defaults={
            # 'first_name': given_name,
            # 'last_name': family_name,
            'email': email,
            'password': User.objects.make_random_password(),
            'is_business': is_business,
        })

        # if user with this email already existed:
        if not created and not user.is_business and is_business:
            business_user_profile = BusinessUserProfile.objects.create(user=user)
            category = BusinessCategory.objects.get(id=business_category)

            downloaded_photo = self.download_photo(photo)

            business_user_profile.business_name = business_name
            business_user_profile.street_number = street_number
            business_user_profile.street = street
            business_user_profile.city = city
            business_user_profile.country = country
            business_user_profile.zip = zip
            business_user_profile.latitude = latitude
            business_user_profile.longitude = longitude
            business_user_profile.business_category = category
            business_user_profile.logo = downloaded_photo
            business_user_profile.is_verified = True
            user.business_user_profile.agreed_tos = True
            user.business_user_profile.agreed_tos_date = today
            business_user_profile.save()

            user.is_business = True
            user.save()

            business = BusinessUserSerializer(user).data

            # Generate tokens
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)
            refresh_token = str(refresh)

            return Response({"business": business, "access": access_token, 'refresh': refresh_token},
                            status=status.HTTP_200_OK)

        elif not created and not is_business:
            user.customer_user_profile.is_verified = True
            user.customer_user_profile.save()

            customer = CustomerUserSerializer(user).data

            # Generate tokens
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)
            refresh_token = str(refresh)

            return Response({"customer": customer, "access": access_token, 'refresh': refresh_token},
                            status=status.HTTP_200_OK)

        elif not created and user.is_business and is_business:
            return Response({'error': "Account with this email already exists."},
                            status=status.HTTP_400_BAD_REQUEST)

        # if created user is business type:
        if created and is_business:
            downloaded_photo = self.download_photo(photo)
            # need to create customer profile
            customer_user_profile = CustomerUserProfile.objects.create(user=user)
            customer_user_profile.avatar = downloaded_photo
            customer_user_profile.is_verified = True
            customer_user_profile.save()

            category = BusinessCategory.objects.get(id=business_category)

            user.business_user_profile.business_name = business_name
            user.business_user_profile.street_number = street_number
            user.business_user_profile.street = street
            user.business_user_profile.city = city
            user.business_user_profile.country = country
            user.business_user_profile.zip = zip
            user.business_user_profile.latitude = latitude
            user.business_user_profile.longitude = longitude
            user.business_user_profile.business_category = category
            user.business_user_profile.logo = downloaded_photo
            user.business_user_profile.is_verified = True
            user.business_user_profile.agreed_tos = True
            user.business_user_profile.agreed_tos_date = today
            user.business_user_profile.save()

            business = BusinessUserSerializer(user).data

            # Generate tokens
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)
            refresh_token = str(refresh)

            return Response({"business": business, "access": access_token, 'refresh': refresh_token},
                            status=status.HTTP_200_OK)

        # if created user is customer type:
        if created and not is_business:
            downloaded_photo = self.download_photo(photo)

            user.customer_user_profile.avatar = downloaded_photo
            user.customer_user_profile.is_verified = True
            user.customer_user_profile.agreed_tos = True
            user.customer_user_profile.agreed_tos_date = today
            user.customer_user_profile.save()

            customer = CustomerUserSerializer(user).data

            # Generate tokens
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)
            refresh_token = str(refresh)

            return Response({"customer": customer, "access": access_token, 'refresh': refresh_token},
                            status=status.HTTP_200_OK)


class GoogleAuthSignInView(CreateAPIView):
    """
    API view to handle Google OAuth registration and login. This view handles both business
    and customer user creation, along with email verification and token generation.
    """
    serializer_class = UserRegistrationSerializer
    permission_classes = []  # letting all users access this endpoint

    def download_photo(self, photo):
        if not photo:
            return None
        # Create a temporary file
        img_temp = NamedTemporaryFile(delete=True)

        # Download image and write it to the temporary file
        img_temp.write(urlopen(photo).read())

        # Ensure everything is written to disk
        img_temp.flush()

        # Move the pointer back to the start of the file
        img_temp.seek(0)

        # Wrap the temporary file in a Django File object
        return File(img_temp, name='downloaded_image.jpg')

    def verify_google_id_token(self, id_token_str):
        """
        Verifies the provided Google ID token using the Google OAuth client.
        """
        try:
            # Specify the CLIENT_ID of the app that accesses the backend:
            CLIENT_ID = GOOGLE_OAUTH_CLIENT_ID

            id_info = id_token.verify_oauth2_token(
                id_token_str,
                google_requests.Request(),
                CLIENT_ID
            )
            return id_info

        except ValueError as e:
            # Print or log the exact error message
            print(f"ValueError occurred: {e}")
            return None

    def create(self, request, *args, **kwargs):
        """
        Handles the creation or login of a user based on Google OAuth token and user data.
        """
        email = request.data.get('email', None)
        id_token = request.data.get('idToken', None)

        is_business = bool(request.data.get('is_business'))

        photo = request.data.get('photo', None)

        # Verify the Google ID token
        id_info = self.verify_google_id_token(id_token)
        if not id_info:
            return Response({'error': 'Invalid ID token'}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.filter(email=email).first()

        if user:
            if user.is_business and is_business:
                # In the case when business user already exists and user attempts to create business user again
                # we only verify this user email.
                business = BusinessUserSerializer(user).data

                user.business_user_profile.is_verified = True
                user.business_user_profile.save()

                # Generate tokens
                refresh = RefreshToken.for_user(user)
                access_token = str(refresh.access_token)
                refresh_token = str(refresh)

                return Response({"business": business, "access": access_token, 'refresh': refresh_token},
                                status=status.HTTP_200_OK)
            # In the case when customer user already exists and user attempts to create business user
            # we create business user profile and verify user email
            elif is_business and not user.is_business:
                return Response({'error': "You need first to create business account"},
                                status=status.HTTP_400_BAD_REQUEST)

            elif not is_business:
                customer = CustomerUserSerializer(user).data
                user.customer_user_profile.is_verified = True
                user.customer_user_profile.save()

                # Generate tokens
                refresh = RefreshToken.for_user(user)
                access_token = str(refresh.access_token)
                refresh_token = str(refresh)

                return Response({"customer": customer, "access": access_token, 'refresh': refresh_token},
                                status=status.HTTP_200_OK)
        elif not user and not is_business:
            user = User.objects.create(username=email, email=email,
                                       password=User.objects.make_random_password(),
                                       is_business=is_business,
                                       )

            downloaded_photo = self.download_photo(photo)
            user.customer_user_profile.avatar = downloaded_photo
            user.customer_user_profile.is_verified = True
            user.customer_user_profile.save()

            customer = CustomerUserSerializer(user).data

            # Generate tokens
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)
            refresh_token = str(refresh)
            return Response({"customer": customer, "access": access_token, 'refresh': refresh_token},
                            status=status.HTTP_200_OK)

        elif not user and is_business:
            return Response({'error': "You need first to create business account"}, status=status.HTTP_400_BAD_REQUEST)
