from rest_framework import status
from rest_framework.generics import ListCreateAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from business_rating.models import BusinessRating
from business_rating.serializers import BusinessRatingSerializer
from business_user_profile.models import BusinessUserProfile


class BusinessRatingView(ListCreateAPIView):
    """
    API view to create business rating.
    """
    # serializer_class = BusinessRatingSerializer
    # queryset = BusinessRating.objects.all()
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        business_id = request.data['business_id']
        rating = request.data['rating']
        customer_user_profile = self.request.user.customer_user_profile
        business_user_profile = BusinessUserProfile.objects.get(user=business_id)

        business_rating = BusinessRating.objects.filter(customer_user_profile=customer_user_profile,
                                                        business_user_profile=business_user_profile).first()

        if business_rating:
            business_rating.rating = rating
            business_rating.save()

            serializer = BusinessRatingSerializer(business_rating).data
            return Response(serializer, status=status.HTTP_200_OK)
        else:
            business_rating = BusinessRating.objects.create(customer_user_profile=customer_user_profile,
                                                            business_user_profile=business_user_profile,
                                                            rating=rating)
            serializer = BusinessRatingSerializer(business_rating).data
            return Response(serializer, status=status.HTTP_200_OK)
