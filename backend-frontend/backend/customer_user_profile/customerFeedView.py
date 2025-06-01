from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.generics import ListAPIView
from rest_framework.response import Response

from datetime import date

from customer_user_profile.customerFeedSerializer import FollowedBusinessesFeedSerializer, FeedItemSerializer, \
    BusinessUserProfileForSearchSerializer, BusinessUserProfileForFeedSerializer
from business_user_profile.models import BusinessWallMessage, BusinessUserProfile
from campaign.models import Campaign
from promotion.models import Promotion

from itertools import chain
from django.db.models import CharField, F, Value, FloatField, ExpressionWrapper, Q
from rest_framework.permissions import IsAuthenticated

from django.db.models.functions import ASin, Cos, Radians, Sin, Sqrt, Power

User = get_user_model()


class GetFollowedBusinessesForFeedView(ListAPIView):
    serializer_class = FollowedBusinessesFeedSerializer
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        customer = request.user.customer_user_profile
        followed_user_ids = customer.followed_businesses.values_list('user_id', flat=True)
        search = self.request.query_params.get('search', False)
        latitude = self.request.query_params.get('latitude', 0)
        longitude = self.request.query_params.get('longitude', 0)

        # Earth's radius in kilometers
        EARTH_RADIUS = 6371.0

        # Convert coordinates to radians
        lat1 = Radians(F('business_user_profile__latitude'))
        lat2 = Radians(Value(float(latitude)))
        lon1 = Radians(F('business_user_profile__longitude'))
        lon2 = Radians(Value(float(longitude)))

        # Differences
        delta_lat = lat2 - lat1
        delta_lon = lon2 - lon1

        # Haversine formula components
        sin_delta_lat_div2 = Sin(delta_lat / 2)
        sin_delta_lon_div2 = Sin(delta_lon / 2)

        a = (
                Power(sin_delta_lat_div2, 2) +
                Cos(lat1) * Cos(lat2) * Power(sin_delta_lon_div2, 2)
        )

        c = 2 * ASin(Sqrt(a))

        # Distance expression
        distance_expression = ExpressionWrapper(
            EARTH_RADIUS * c,
            output_field=FloatField()
        )

        if search:
            # Validate coordinates
            if not latitude or not longitude:
                return Response({'error': 'Latitude and longitude are required.'}, status=status.HTTP_400_BAD_REQUEST)

            # (Optional) Set maximum distance
            # max_distance = 20  # in kilometers

            # Annotate and order messages
            messages = BusinessWallMessage.objects.filter(
                (Q(message__icontains=search) | Q(business_user_profile__business_name__icontains=search)) &
                (Q(business_user_profile__subscription=True) | Q(business_user_profile__is_vip=True))
            ).annotate(
                item_type=Value('message', output_field=CharField()),
                distance=distance_expression
            )
            # .filter(distance__lte=max_distance)  # Uncomment if filtering by distance
            messages = messages.order_by('distance')

            # Annotate and order campaigns
            campaigns = Campaign.objects.filter(
                ((Q(name__icontains=search) | Q(business_user_profile__business_name__icontains=search)) &
                 (Q(business_user_profile__subscription=True) | Q(business_user_profile__is_vip=True))),
                ending_date__gt=date.today(),
                is_active=True
            ).annotate(
                item_type=Value('campaign', output_field=CharField()),
                distance=distance_expression
            )
            # .filter(distance__lte=max_distance)  # Uncomment if filtering by distance
            campaigns = campaigns.order_by('distance')

            # Annotate and order promotions
            promotions = Promotion.objects.filter(
                ((Q(name__icontains=search) | Q(business_user_profile__business_name__icontains=search)) &
                 (Q(business_user_profile__subscription=True) | Q(business_user_profile__is_vip=True))),
                date_ends__gt=date.today(),
                is_active=True
            ).annotate(
                item_type=Value('promotion', output_field=CharField()),
                distance=distance_expression
            )
            # .filter(distance__lte=max_distance)  # Uncomment if filtering by distance
            promotions = promotions.order_by('distance')

            # Combine and sort the items
            combined = sorted(
                chain(messages, campaigns, promotions),
                key=lambda instance: instance.distance,
                reverse=False  # Closest items first
            )

            serializer = FeedItemSerializer(combined, many=True, context={'request': request})
            return Response(serializer.data, status=status.HTTP_200_OK)

        messages = BusinessWallMessage.objects.filter(
            (Q(business_user_profile__subscription=True) |
             Q(business_user_profile__is_vip=True)),
            business_user_profile__user_id__in=followed_user_ids
        ).annotate(
            item_type=Value('message', output_field=CharField()),
            distance=distance_expression
        )
        campaigns = Campaign.objects.filter(
            (Q(business_user_profile__subscription=True) |
             Q(business_user_profile__is_vip=True)),
            business_user_profile__user_id__in=followed_user_ids,
            ending_date__gt=date.today(),
            is_active=True
        ).annotate(
            item_type=Value('campaign', output_field=CharField()),
            distance=distance_expression
        )
        promotions = Promotion.objects.filter(
            (Q(business_user_profile__subscription=True) |
             Q(business_user_profile__is_vip=True)),
            business_user_profile__user_id__in=followed_user_ids,
            date_ends__gt=date.today(),
            is_active=True
        ).annotate(
            item_type=Value('promotion', output_field=CharField()),
            distance=distance_expression
        )

        # Combine and sort the items
        combined = sorted(
            chain(messages, campaigns, promotions),
            key=lambda instance: instance.date_created,
            reverse=True
        )

        serializer = FeedItemSerializer(combined, many=True, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)


class SearchBusinessView(ListAPIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        search = self.request.query_params.get('search', '')
        latitude = self.request.query_params.get('latitude', 0)
        longitude = self.request.query_params.get('longitude', 0)

        # Earth's radius in kilometers
        EARTH_RADIUS = 6371.0

        # Convert coordinates to radians
        lat1 = Radians(F('latitude'))
        lat2 = Radians(Value(float(latitude)))
        lon1 = Radians(F('longitude'))
        lon2 = Radians(Value(float(longitude)))

        # Differences
        delta_lat = lat2 - lat1
        delta_lon = lon2 - lon1

        # Haversine formula components
        sin_delta_lat_div2 = Sin(delta_lat / 2)
        sin_delta_lon_div2 = Sin(delta_lon / 2)

        a = (
                Power(sin_delta_lat_div2, 2) +
                Cos(lat1) * Cos(lat2) * Power(sin_delta_lon_div2, 2)
        )

        c = 2 * ASin(Sqrt(a))

        # Distance expression
        distance_expression = ExpressionWrapper(
            EARTH_RADIUS * c,
            output_field=FloatField()
        )

        if search:
            # Validate coordinates
            if not latitude or not longitude:
                return Response({'error': 'Latitude and longitude are required.'}, status=status.HTTP_400_BAD_REQUEST)

            businesses = BusinessUserProfile.objects.filter(
                (Q(business_name__icontains=search) |
                 Q(about__icontains=search)) &
                (Q(subscription=True) | Q(is_vip=True))
            ).annotate(
                distance=distance_expression
            )
            # .filter(distance__lte=max_distance)  # Uncomment if filtering by distance
            businesses = businesses.order_by('distance')

            serializer = BusinessUserProfileForSearchSerializer(businesses, many=True, context={'request': request})
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response([], status=status.HTTP_200_OK)


class GetBusinessesForMaps(ListAPIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        latitude = self.request.query_params.get('latitude', 0)
        longitude = self.request.query_params.get('longitude', 0)
        lat_radius = 1
        lng_radius = 1

        businesses = BusinessUserProfile.objects.filter(
            Q(latitude__range=(float(latitude) - lat_radius, float(latitude) + lat_radius)) &
            Q(longitude__range=(float(longitude) - lng_radius, float(longitude) + lng_radius)) &
            (Q(subscription=True) | Q(is_vip=True))
        )

        serializer = BusinessUserProfileForFeedSerializer(businesses, many=True, context={'request': request})

        return Response(serializer.data, status=status.HTTP_200_OK)
