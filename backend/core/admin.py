from django.contrib import admin
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


@admin.register(Room)
class RoomAdmin(admin.ModelAdmin):
    list_display = (
        "room_number",
        "floor",
        "sharing",
        "status",
    )
    list_filter = (
        "floor",
        "sharing",
        "status",
    )
    search_fields = ("room_number",)


@admin.register(Bed)
class BedAdmin(admin.ModelAdmin):
    list_display = (
        "bed_number",
        "room",
        "status",
    )
    list_filter = ("status",)
    search_fields = (
        "bed_number",
        "room__room_number",
    )


@admin.register(Tenant)
class TenantAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "phone",
        "bed",
        "sharing",
        "rent",
        "payment_status",
        "status",
    )
    list_filter = (
        "payment_status",
        "status",
        "sharing",
    )
    search_fields = (
        "name",
        "phone",
        "email",
    )


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = (
        "booking_id",
        "tenant_name",
        "phone",
        "bed",
        "booking_type",
        "amount",
        "payment_status",
        "status",
        "booking_date",
    )
    list_filter = (
        "booking_type",
        "payment_status",
        "status",
    )
    search_fields = (
        "booking_id",
        "tenant_name",
        "phone",
    )


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = (
        "payment_id",
        "tenant",
        "amount",
        "due_date",
        "paid_date",
        "payment_method",
        "status",
        "month",
    )
    list_filter = (
        "payment_method",
        "status",
        "month",
    )
    search_fields = (
        "payment_id",
        "tenant__name",
    )


@admin.register(Complaint)
class ComplaintAdmin(admin.ModelAdmin):
    list_display = (
        "complaint_id",
        "tenant",
        "category",
        "title",
        "priority",
        "status",
        "created_at",
    )
    list_filter = (
        "category",
        "priority",
        "status",
    )
    search_fields = (
        "complaint_id",
        "tenant__name",
        "title",
    )


@admin.register(CheckInOut)
class CheckInOutAdmin(admin.ModelAdmin):
    list_display = (
        "tenant",
        "check_in_date",
        "expected_check_out",
        "actual_check_out",
        "security_deposit",
        "status",
    )
    list_filter = ("status",)
    search_fields = ("tenant__name",)


@admin.register(PGSettings)
class PGSettingsAdmin(admin.ModelAdmin):
    list_display = (
        "pg_name",
        "owner_name",
        "phone",
        "updated_at",
    )