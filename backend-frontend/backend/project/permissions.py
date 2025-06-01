from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_staff
        )


class IsReadOnly(BasePermission):
    def has_permission(self, request, view):
        return bool(request.method in SAFE_METHODS)


class IsCampaignOwner(BasePermission):
    def has_object_permission(self, request, view, obj):
        business_user_profile = request.user.business_user_profile
        return business_user_profile == obj.business_user_profile


class IsOfferOwner(BasePermission):
    def has_object_permission(self, request, view, obj):
        business_user_profile = request.user.business_user_profile
        return business_user_profile == obj.business_user_profile


class IsMessageAuthor(BasePermission):
    def has_object_permission(self, request, view, obj):
        business_user_profile = request.user.business_user_profile
        return business_user_profile == obj.business_user_profile


class IsBusinessOwner(BasePermission):
    def has_object_permission(self, request, view, obj):
        business_user_profile = request.user.business_user_profile
        return business_user_profile == obj.campaign.business_user_profile


class IsSelf(BasePermission):
    def has_object_permission(self, request, view, obj):
        user = request.user
        return user == obj


class IsRevCat(BasePermission):
    def has_permission(self, request, view):
        print(request.user.email == 'recat@hook.com')
        return bool(request.user.email == 'recat@hook.com')
