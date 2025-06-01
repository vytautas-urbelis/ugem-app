from rest_framework import status
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView, ListAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from promotion.models import Promotion
from promotion.serializers import PromotionSerializer, PromotionsSerializerInBusinessProfile
from business_user_profile.models import BusinessUserProfile
from project.permissions import IsOfferOwner

from django.db.models import Q

from datetime import date


class ListCreatePromotionView(ListCreateAPIView):
    """
    API view to list and create Offer for a business user.
    """
    serializer_class = PromotionSerializer
    permission_classes = [IsAuthenticated]  # Ensures that only authenticated users can access this view

    def get_queryset(self):
        """
        Return Offer specifically for the logged-in user's business.
        """
        # Efficient retrieval of the customer's profile with a one-time database query
        business_user_profile = BusinessUserProfile.objects.get(user=self.request.user)
        return Promotion.objects.filter(business_user_profile=business_user_profile).order_by('-date_created')

    def perform_create(self, serializer):
        """
        Automatically assigns the logged-in user's business to the new Offer.
        """
        business_user_profile = BusinessUserProfile.objects.get(user=self.request.user)
        serializer.save(business_user_profile=business_user_profile)


class ListOpenPromotionsView(ListAPIView):
    """
    API view to list and create promotions for a customer user profile.
    """
    serializer_class = PromotionSerializer
    permission_classes = [IsAuthenticated]  # Ensures that only authenticated users can access this view

    def get_queryset(self):
        """
        Return promotions specifically for the logged-in user's customer profile.
        """
        # Efficient retrieval of the customer's profile with a one-time database query
        business_user_profile = BusinessUserProfile.objects.get(user=self.request.user)
        today = date.today()
        return Promotion.objects.filter(Q(business_user_profile=business_user_profile) &
                                        Q(date_ends__gt=today) & Q(is_active=True) |
                                        Q(business_user_profile=business_user_profile) &
                                        Q(date_ends__isnull=True) & Q(is_active=True)).order_by('-date_created')


class ListSpecificBusinessOpenPromotionsView(ListAPIView):
    """
    API view to list specific business open promotions for customer user when he is in business profile on app
    """
    permission_classes = [IsAuthenticated]  # Ensures that only authenticated users can access this view

    def get_queryset(self):
        """
        Return promotions specifically business user based on id
        """
        business_id = self.kwargs['pk']
        business_user_profile = BusinessUserProfile.objects.get(user_id=business_id)
        # Efficient retrieval of the customer's profile with a one-time database query
        today = date.today()
        return Promotion.objects.filter(Q(business_user_profile=business_user_profile) &
                                        Q(date_ends__gt=today) & Q(is_active=True) |
                                        Q(business_user_profile=business_user_profile) &
                                        Q(date_ends__isnull=True) & Q(is_active=True)).order_by('-date_created')

    def get(self, request, *args, **kwargs):
        serializer = PromotionsSerializerInBusinessProfile(self.get_queryset(), many=True, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)


class ListClosedPromotionsView(ListAPIView):
    """
    API view to list and create promotions for a customer user profile.
    """
    serializer_class = PromotionSerializer
    permission_classes = [IsAuthenticated]  # Ensures that only authenticated users can access this view

    def get_queryset(self):
        """
        Return promotions specifically for the logged-in user's customer profile.
        """
        # Efficient retrieval of the customer's profile with a one-time database query
        business_user_profile = BusinessUserProfile.objects.get(user=self.request.user)
        today = date.today()
        return Promotion.objects.filter(Q(business_user_profile=business_user_profile) &
                                        Q(date_ends__lte=today) |
                                        Q(business_user_profile=business_user_profile) &
                                        Q(is_active=False)).order_by('-date_created')


class ReadUpdateDeletePromotionView(RetrieveUpdateDestroyAPIView):
    """
    API view to read, update, and delete a single Offer, ensuring that the user is authenticated and is the owner of the Offer.
    """
    queryset = Promotion.objects.all()
    serializer_class = PromotionSerializer
    permission_classes = [IsAuthenticated, IsOfferOwner]
