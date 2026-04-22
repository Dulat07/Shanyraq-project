from django.db import models
from django.contrib.auth.models import User


# ─── Custom Manager ──────────────────────────────────────────────────────────

class AvailablePropertyManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(is_available=True, is_deleted=False, is_published=True)


class UserPropertiesManager(models.Manager):
    """Показывает все посты пользователя, включая удалённые"""
    def get_queryset(self):
        return super().get_queryset().filter(is_deleted=False)


# ─── Category ────────────────────────────────────────────────────────────────

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)

    class Meta:
        verbose_name_plural = "categories"

    def __str__(self):
        return self.name


# ─── UserProfile ─────────────────────────────────────────────────────────────

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    phone = models.CharField(max_length=20, blank=True)
    address = models.TextField(blank=True)

    def __str__(self):
        return self.user.username


# ─── Property (Product) ──────────────────────────────────────────────────────

class Property(models.Model):
    title       = models.CharField(max_length=255)
    description = models.TextField()
    price       = models.DecimalField(max_digits=10, decimal_places=2)
    rooms       = models.IntegerField(default=1)
    location    = models.CharField(max_length=255)
    is_available = models.BooleanField(default=True)
    is_deleted  = models.BooleanField(default=False)  # Soft delete flag
    is_published = models.BooleanField(default=False)  # Published on main page
    image_url   = models.URLField(max_length=500, blank=True, null=True)

    # ForeignKey to Category (replaces the old CharField)
    category = models.ForeignKey(
        Category,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='properties'
    )

    owner = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='owned_properties'
    )
    agent = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='managed_properties'
    )

    objects          = models.Manager()
    available_objects = AvailablePropertyManager()
    user_properties = UserPropertiesManager()

    class Meta:
        verbose_name_plural = "properties"

    def __str__(self):
        return self.title


# ─── Booking ─────────────────────────────────────────────────────────────────

class Booking(models.Model):
    user       = models.ForeignKey(User,     on_delete=models.CASCADE, related_name='bookings')
    property   = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='bookings')
    start_date = models.DateField()
    end_date   = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} — {self.property.title}"


# ─── Review ──────────────────────────────────────────────────────────────────

class Review(models.Model):
    user       = models.ForeignKey(User,     on_delete=models.CASCADE, related_name='reviews')
    property   = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='reviews')
    rating     = models.IntegerField(default=5)
    comment    = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Review by {self.user.username} for {self.property.title}"