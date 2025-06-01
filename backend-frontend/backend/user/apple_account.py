from rest_framework import status
from rest_framework.generics import CreateAPIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

from business_user_profile.models import BusinessUserProfile, BusinessCategory
from customer_user_profile.models import CustomerUserProfile
from user.serializers import UserRegistrationSerializer, BusinessUserSerializer, CustomerUserSerializer

from django.contrib.auth import get_user_model

from datetime import datetime

import jwt
import requests
from jwt.algorithms import RSAAlgorithm

User = get_user_model()


class AppleAuthSignUpView(CreateAPIView):
    """
    API view to handle Google OAuth registration and login. This view handles both business
    and customer user creation, along with email verification and token generation.
    """
    serializer_class = UserRegistrationSerializer
    permission_classes = []  # letting all users access this endpoint

    def verify_apple_identity_token(self, identity_token):
        # Fetch Apple's public keys
        response = requests.get("https://appleid.apple.com/auth/keys")
        apple_keys = response.json().get("keys", [])

        # Decode the token header
        unverified_header = jwt.get_unverified_header(identity_token)
        kid = unverified_header.get("kid")

        # Find the corresponding key
        apple_key = next((key for key in apple_keys if key["kid"] == kid), None)
        if not apple_key:
            raise ValueError("Invalid identity token: key not found")

        # Construct the public key
        public_key = RSAAlgorithm.from_jwk(apple_key)

        # Verify the token
        try:
            decoded_token = jwt.decode(
                identity_token,
                public_key,
                algorithms=["RS256"],
                audience="app.ugem",  # Replace with your app's bundle ID
                issuer="https://appleid.apple.com",
            )
            return decoded_token
        except jwt.ExpiredSignatureError:
            raise ValueError("Identity token has expired")
        except jwt.InvalidTokenError as e:
            raise ValueError(f"Invalid identity token: {e}")

    def create(self, request, *args, **kwargs):
        """
        Handles the creation or login of a user based on Google OAuth token and user data.
        """
        email = request.data.get('email', None)
        email = None if email == 'null' else email
        identity_token = request.data.get('identity_token', None)
        user_apple_id = request.data.get('user_apple_id', None)
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

        today = datetime.today()

        is_business = bool(request.data.get('is_business'))

        # Verify the Google ID token
        id_info = self.verify_apple_identity_token(identity_token)
        if not id_info:
            return Response({'error': 'Invalid ID token'}, status=status.HTTP_400_BAD_REQUEST)

        if email:
            user, created = User.objects.get_or_create(username=email, defaults={
                'email': email,
                'password': User.objects.make_random_password(),
                'is_business': is_business,
                'apple_id': user_apple_id,
            })
        else:
            user, created = User.objects.get_or_create(apple_id=user_apple_id, defaults={
                'password': User.objects.make_random_password(),
                'is_business': is_business,
                'apple_id': user_apple_id,
            })
        # Create or get user

        # if user with this email already existed:
        if not created and not user.is_business and is_business:
            user.apple_id = user_apple_id
            user.is_business = True
            user.save()

            business_user_profile = BusinessUserProfile.objects.create(user=user)
            category = BusinessCategory.objects.get(id=business_category)

            business_user_profile.business_name = business_name
            business_user_profile.street_number = street_number
            business_user_profile.street = street
            business_user_profile.city = city
            business_user_profile.country = country
            business_user_profile.zip = zip
            business_user_profile.latitude = latitude
            business_user_profile.longitude = longitude
            business_user_profile.business_category = category
            business_user_profile.is_verified = True
            user.business_user_profile.agreed_tos = True
            user.business_user_profile.agreed_tos_date = today
            business_user_profile.save()

            business = BusinessUserSerializer(user).data

            # Generate tokens
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)
            refresh_token = str(refresh)

            return Response({"business": business, "access": access_token, 'refresh': refresh_token},
                            status=status.HTTP_200_OK)

        elif not created and not is_business:
            user.apple_id = user_apple_id
            user.save()

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
            user.apple_id = user_apple_id
            user.save()
            # need to create customer profile
            customer_user_profile = CustomerUserProfile.objects.create(user=user)
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
            user.apple_id = user_apple_id
            user.save()

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


class AppleAuthSignInView(CreateAPIView):
    """
    API view to handle Google OAuth registration and login. This view handles both business
    and customer user creation, along with email verification and token generation.
    """
    serializer_class = UserRegistrationSerializer
    permission_classes = []  # letting all users access this endpoint

    def verify_apple_identity_token(self, identity_token):
        # Fetch Apple's public keys
        response = requests.get("https://appleid.apple.com/auth/keys")
        apple_keys = response.json().get("keys", [])

        # Decode the token header
        unverified_header = jwt.get_unverified_header(identity_token)
        kid = unverified_header.get("kid")

        # Find the corresponding key
        apple_key = next((key for key in apple_keys if key["kid"] == kid), None)
        if not apple_key:
            raise ValueError("Invalid identity token: key not found")

        # Construct the public key
        public_key = RSAAlgorithm.from_jwk(apple_key)

        # Verify the token
        try:
            decoded_token = jwt.decode(
                identity_token,
                public_key,
                algorithms=["RS256"],
                audience="app.ugem",  # Replace with your app's bundle ID
                issuer="https://appleid.apple.com",
            )
            return decoded_token
        except jwt.ExpiredSignatureError:
            raise ValueError("Identity token has expired")
        except jwt.InvalidTokenError as e:
            raise ValueError(f"Invalid identity token: {e}")

    def create(self, request, *args, **kwargs):
        """
        Handles the creation or login of a user based on Google OAuth token and user data.
        """
        email = request.data.get('email', None)
        identity_token = request.data.get('identity_token', None)
        user_apple_id = request.data.get('user_apple_id', None)

        is_business = bool(request.data.get('is_business'))

        # Verify the Apple ID token
        id_info = self.verify_apple_identity_token(identity_token)
        if not id_info:
            return Response({'error': 'Invalid ID token'}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.filter(apple_id=user_apple_id).first()

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
                                       apple_id=user_apple_id,
                                       )

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


class AppleAuthSignInClipView(CreateAPIView):
    """
    API view to handle Google OAuth registration and login. This view handles both business
    and customer user creation, along with email verification and token generation.
    """
    serializer_class = UserRegistrationSerializer
    permission_classes = []  # letting all users access this endpoint

    def verify_apple_identity_token(self, identity_token):
        # Fetch Apple's public keys
        response = requests.get("https://appleid.apple.com/auth/keys")
        apple_keys = response.json().get("keys", [])

        # Decode the token header
        unverified_header = jwt.get_unverified_header(identity_token)
        kid = unverified_header.get("kid")

        # Find the corresponding key
        apple_key = next((key for key in apple_keys if key["kid"] == kid), None)
        if not apple_key:
            raise ValueError("Invalid identity token: key not found")

        # Construct the public key
        public_key = RSAAlgorithm.from_jwk(apple_key)

        # Verify the token
        try:
            decoded_token = jwt.decode(
                identity_token,
                public_key,
                algorithms=["RS256"],
                audience="app.ugem.Clip-reward",  # Replace with your app's bundle ID
                issuer="https://appleid.apple.com",
            )
            return decoded_token
        except jwt.ExpiredSignatureError:
            raise ValueError("Identity token has expired")
        except jwt.InvalidTokenError as e:
            raise ValueError(f"Invalid identity token: {e}")

    def create(self, request, *args, **kwargs):
        """
        Handles the creation or login of a user based on Google OAuth token and user data.
        """
        email = request.data.get('email', None)
        identity_token = request.data.get('identity_token', None)
        user_apple_id = request.data.get('user_apple_id', None)

        # Verify the Apple ID token
        id_info = self.verify_apple_identity_token(identity_token)
        if not id_info:
            return Response({'error': 'Invalid ID token'}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.filter(apple_id=user_apple_id).first()

        if user:
            customer = CustomerUserSerializer(user).data
            user.customer_user_profile.is_verified = True
            user.customer_user_profile.save()
            # Generate tokens
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)
            refresh_token = str(refresh)
            return Response({"customer": customer, "access": access_token, 'refresh': refresh_token},
                            status=status.HTTP_200_OK)
        else:
            user = User.objects.create(username=email, email=email,
                                       password=User.objects.make_random_password(),
                                       apple_id=user_apple_id,
                                       )

            user.customer_user_profile.is_verified = True
            user.customer_user_profile.save()

            customer = CustomerUserSerializer(user).data

            # Generate tokens
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)
            refresh_token = str(refresh)
            return Response({"customer": customer, "access": access_token, 'refresh': refresh_token},
                            status=status.HTTP_200_OK)
