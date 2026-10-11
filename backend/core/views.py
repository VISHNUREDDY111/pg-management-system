from rest_framework import viewsets
from django.db.models import Sum
from django.http import JsonResponse



from .models import (
    Room,
    Bed,
    Tenant,
    Booking,
    Payment,
    Complaint,
    CheckInOut,
    PGSettings,
)

from .serializers import (
    RoomSerializer,
    BedSerializer,
    TenantSerializer,
    BookingSerializer,
    PaymentSerializer,
    ComplaintSerializer,
    CheckInOutSerializer,
    PGSettingsSerializer,
)


class RoomViewSet(viewsets.ModelViewSet):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer


class BedViewSet(viewsets.ModelViewSet):
    queryset = Bed.objects.all()
    serializer_class = BedSerializer


class TenantViewSet(viewsets.ModelViewSet):
    queryset = Tenant.objects.all()
    serializer_class = TenantSerializer


class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer


class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer


class ComplaintViewSet(viewsets.ModelViewSet):
    queryset = Complaint.objects.all()
    serializer_class = ComplaintSerializer


# class CheckInOutViewSet(viewsets.ModelViewSet):
#     queryset = CheckInOut.objects.all()
#     serializer_class = CheckInOutSerializer

class CheckInOutViewSet(viewsets.ModelViewSet):
    queryset = CheckInOut.objects.select_related("tenant").all()
    serializer_class = CheckInOutSerializer

class PGSettingsViewSet(viewsets.ModelViewSet):
    queryset = PGSettings.objects.all()
    serializer_class = PGSettingsSerializer



def dashboard_summary(request):
    rooms = Room.objects.all()
    tenants = Tenant.objects.all()
    bookings = Booking.objects.all()
    payments = Payment.objects.all()
    complaints = Complaint.objects.all()

    return JsonResponse({
        "total_rooms": rooms.count(),
        "occupied_rooms": rooms.filter(status="Occupied").count(),
        "available_rooms": rooms.filter(status="Available").count(),

        "total_tenants": tenants.count(),
        "active_tenants": tenants.filter(status="Active").count(),

        "total_bookings": bookings.count(),
        "pending_bookings": bookings.filter(status="Pending").count(),

        "payments_collected": (
            payments.filter(status="Paid")
            .aggregate(total=Sum("amount"))["total"] or 0
        ),
        "payments_pending": (
            payments.filter(status="Pending")
            .aggregate(total=Sum("amount"))["total"] or 0
        ),

        "open_complaints": complaints.filter(
            status="Open"
        ).count(),
    })
