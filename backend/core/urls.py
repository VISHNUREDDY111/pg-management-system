from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import dashboard_summary

from .views import (
    RoomViewSet,
    BedViewSet,
    TenantViewSet,
    BookingViewSet,
    PaymentViewSet,
    ComplaintViewSet,
    CheckInOutViewSet,
    PGSettingsViewSet,
)


router = DefaultRouter()

router.register("rooms", RoomViewSet)
router.register("beds", BedViewSet)
router.register("tenants", TenantViewSet)
router.register("bookings", BookingViewSet)
router.register("payments", PaymentViewSet)
router.register("complaints", ComplaintViewSet)
router.register("check-in-out", CheckInOutViewSet)
router.register("settings", PGSettingsViewSet)


urlpatterns = [
    path("", include(router.urls)),
    path("dashboard/summary/", dashboard_summary, name="dashboard-summary"),
]

path("api/", include("core.urls")),