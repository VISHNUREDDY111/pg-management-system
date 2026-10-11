from django.db import models


class Room(models.Model):
    FLOOR_CHOICES = [
        ("Ground Floor", "Ground Floor"),
        ("1st Floor", "1st Floor"),
        ("2nd Floor", "2nd Floor"),
        ("3rd Floor", "3rd Floor"),
    ]

    SHARING_CHOICES = [
        (1, "1 Sharing"),
        (2, "2 Sharing"),
        (3, "3 Sharing"),
        (4, "4 Sharing"),
    ]

    STATUS_CHOICES = [
        ("Available", "Available"),
        ("Occupied", "Occupied"),
        ("Maintenance", "Maintenance"),
    ]

    room_number = models.CharField(max_length=20, unique=True)
    floor = models.CharField(max_length=50, choices=FLOOR_CHOICES)
    sharing = models.PositiveIntegerField(choices=SHARING_CHOICES)
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="Available"
    )

    def __str__(self):
        return f"Room {self.room_number}"


class Bed(models.Model):
    STATUS_CHOICES = [
        ("Available", "Available"),
        ("Occupied", "Occupied"),
        ("Maintenance", "Maintenance"),
    ]

    room = models.ForeignKey(
        Room,
        on_delete=models.CASCADE,
        related_name="beds"
    )
    bed_number = models.CharField(max_length=20)
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="Available"
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["room", "bed_number"],
                name="unique_bed_per_room"
            )
        ]

    def __str__(self):
        return f"{self.room.room_number} - Bed {self.bed_number}"


class Tenant(models.Model):
    PAYMENT_STATUS_CHOICES = [
        ("Paid", "Paid"),
        ("Pending", "Pending"),
        ("Overdue", "Overdue"),
    ]

    STATUS_CHOICES = [
        ("Active", "Active"),
        ("Inactive", "Inactive"),
    ]

    name = models.CharField(max_length=100)
    phone = models.CharField(max_length=15)
    email = models.EmailField(blank=True, null=True)

    bed = models.ForeignKey(
        Bed,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="tenants"
    )

    sharing = models.PositiveIntegerField()
    rent = models.DecimalField(max_digits=10, decimal_places=2)
    joining_date = models.DateField()

    payment_status = models.CharField(
        max_length=20,
        choices=PAYMENT_STATUS_CHOICES,
        default="Pending"
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="Active"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Booking(models.Model):
    BOOKING_TYPE_CHOICES = [
        ("Monthly", "Monthly"),
        ("Daily", "Daily"),
    ]

    PAYMENT_STATUS_CHOICES = [
        ("Paid", "Paid"),
        ("Pending", "Pending"),
        ("Refunded", "Refunded"),
    ]

    STATUS_CHOICES = [
        ("Pending", "Pending"),
        ("Approved", "Approved"),
        ("Cancelled", "Cancelled"),
    ]

    booking_id = models.CharField(max_length=30, unique=True)

    tenant_name = models.CharField(max_length=100)
    phone = models.CharField(max_length=15)

    bed = models.ForeignKey(
        Bed,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="bookings"
    )

    sharing = models.PositiveIntegerField()

    booking_type = models.CharField(
        max_length=20,
        choices=BOOKING_TYPE_CHOICES
    )

    amount = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    payment_status = models.CharField(
        max_length=20,
        choices=PAYMENT_STATUS_CHOICES,
        default="Pending"
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="Pending"
    )

    booking_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.booking_id


class Payment(models.Model):
    PAYMENT_METHOD_CHOICES = [
        ("UPI", "UPI"),
        ("Cash", "Cash"),
        ("Bank Transfer", "Bank Transfer"),
        ("Card", "Card"),
    ]

    STATUS_CHOICES = [
        ("Paid", "Paid"),
        ("Pending", "Pending"),
        ("Overdue", "Overdue"),
        ("Refunded", "Refunded"),
    ]

    payment_id = models.CharField(max_length=30, unique=True)

    tenant = models.ForeignKey(
        Tenant,
        on_delete=models.CASCADE,
        related_name="payments"
    )

    amount = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    due_date = models.DateField()
    paid_date = models.DateField(blank=True, null=True)

    payment_method = models.CharField(
        max_length=30,
        choices=PAYMENT_METHOD_CHOICES,
        blank=True,
        null=True
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="Pending"
    )

    month = models.CharField(max_length=20)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.payment_id


class Complaint(models.Model):
    CATEGORY_CHOICES = [
        ("Maintenance", "Maintenance"),
        ("Food", "Food"),
        ("Cleaning", "Cleaning"),
        ("Electricity", "Electricity"),
        ("Water", "Water"),
        ("Internet", "Internet"),
        ("Other", "Other"),
    ]

    PRIORITY_CHOICES = [
        ("High", "High"),
        ("Medium", "Medium"),
        ("Low", "Low"),
    ]

    STATUS_CHOICES = [
        ("Open", "Open"),
        ("In Progress", "In Progress"),
        ("Resolved", "Resolved"),
    ]

    complaint_id = models.CharField(max_length=30, unique=True)

    tenant = models.ForeignKey(
        Tenant,
        on_delete=models.CASCADE,
        related_name="complaints"
    )

    category = models.CharField(
        max_length=30,
        choices=CATEGORY_CHOICES
    )

    title = models.CharField(max_length=200)
    description = models.TextField()

    priority = models.CharField(
        max_length=20,
        choices=PRIORITY_CHOICES,
        default="Medium"
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="Open"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.complaint_id


class CheckInOut(models.Model):
    STATUS_CHOICES = [
        ("Checked In", "Checked In"),
        ("Checked Out", "Checked Out"),
    ]

    tenant = models.ForeignKey(
        Tenant,
        on_delete=models.CASCADE,
        related_name="checkin_records"
    )

    check_in_date = models.DateField()
    expected_check_out = models.DateField()

    actual_check_out = models.DateField(
        blank=True,
        null=True
    )

    security_deposit = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="Checked In"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.tenant.name} - {self.status}"


class PGSettings(models.Model):
    pg_name = models.CharField(
        max_length=200,
        default="SLR Bliss PG for Gents"
    )

    owner_name = models.CharField(max_length=100)

    phone = models.CharField(max_length=15)
    alternate_phone = models.CharField(
        max_length=15,
        blank=True
    )

    email = models.EmailField(
        blank=True
    )

    address = models.TextField()

    check_in_time = models.TimeField()
    check_out_time = models.TimeField()

    security_deposit = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0
    )

    monthly_1_share = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=14000
    )

    monthly_2_share = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=8000
    )

    monthly_3_share = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=6000
    )

    monthly_4_share = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=5500
    )

    daily_1_share = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=800
    )

    daily_2_share = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=500
    )

    daily_3_share = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=400
    )

    daily_4_share = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=350
    )

    whatsapp_notifications = models.BooleanField(default=True)
    payment_reminders = models.BooleanField(default=True)
    complaint_notifications = models.BooleanField(default=True)

    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.pg_name