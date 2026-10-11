from rest_framework import serializers
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
from django.db import transaction


class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = "__all__"


class BedSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bed
        fields = "__all__"


class TenantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tenant
        fields = "__all__"


class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = "__all__"


class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = "__all__"


class ComplaintSerializer(serializers.ModelSerializer):
    class Meta:
        model = Complaint
        fields = "__all__"


# class CheckInOutSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = CheckInOut
#         fields = "__all__"


class PGSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = PGSettings
        fields = "__all__"





class CheckInOutSerializer(serializers.ModelSerializer):
    bed = serializers.PrimaryKeyRelatedField(
        queryset=Bed.objects.all(),
        write_only=True,
        required=True,
    )

    class Meta:
        model = CheckInOut
        fields = [
            "id",
            "tenant",
            "bed",
            "check_in_date",
            "expected_check_out",
            "actual_check_out",
            "security_deposit",
            "status",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]

    def create(self, validated_data):
        bed = validated_data.pop("bed")

        with transaction.atomic():
            # Lock the bed so simultaneous requests cannot allocate it twice.
            bed = Bed.objects.select_for_update().get(pk=bed.pk)

            tenant = Tenant.objects.select_for_update().get(
                pk=validated_data["tenant"].pk
            )

            if tenant.status != "Active":
                raise serializers.ValidationError({
                    "tenant": "Only active tenants can check in."
                })

            if bed.status != "Available":
                raise serializers.ValidationError({
                    "bed": "This bed is not available."
                })

            if tenant.bed_id is not None:
                raise serializers.ValidationError({
                    "tenant": "This tenant already has a bed assigned."
                })

            if CheckInOut.objects.filter(
                tenant=tenant,
                status="Checked In",
            ).exists():
                raise serializers.ValidationError({
                    "tenant": "This tenant already has an active stay."
                })

            if validated_data.get("status", "Checked In") != "Checked In":
                raise serializers.ValidationError({
                    "status": "A new stay must start as Checked In."
                })

            # Assign the bed and mark it occupied.
            tenant.bed = bed
            tenant.save(update_fields=["bed"])

            bed.status = "Occupied"
            bed.save(update_fields=["status"])

            validated_data["tenant"] = tenant
            return CheckInOut.objects.create(**validated_data)

    def update(self, instance, validated_data):
        with transaction.atomic():
            stay = CheckInOut.objects.select_for_update().get(
                pk=instance.pk
            )

            tenant = Tenant.objects.select_for_update().get(
                pk=stay.tenant_id
            )

            new_status = validated_data.get("status", stay.status)

            if stay.status == "Checked Out" and new_status != "Checked Out":
                raise serializers.ValidationError({
                    "status": "A completed stay cannot be reopened. Create a new stay instead."
                })

            # Perform checkout only once.
            if (
                stay.status == "Checked In"
                and new_status == "Checked Out"
            ):
                if not validated_data.get("actual_check_out"):
                    raise serializers.ValidationError({
                        "actual_check_out": "A checkout date is required."
                    })

                if tenant.bed_id:
                    bed = Bed.objects.select_for_update().get(
                        pk=tenant.bed_id
                    )
                    bed.status = "Available"
                    bed.save(update_fields=["status"])

                    tenant.bed = None
                    tenant.save(update_fields=["bed"])

            for field, value in validated_data.items():
                setattr(stay, field, value)

            stay.save()
            return stay
