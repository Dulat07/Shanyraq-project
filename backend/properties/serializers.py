from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Category, Property, Booking


# ─── Serializers (from serializers.Serializer) ───────────────────────────────

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    password = serializers.CharField(write_only=True)


class RegisterSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    password = serializers.CharField(write_only=True)
    email    = serializers.EmailField(required=False)

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Username is already taken.")
        return value

    def create(self, validated_data):
        return User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password'],
            email=validated_data.get('email', '')
        )


# ─── ModelSerializers ────────────────────────────────────────────────────────

class CategorySerializer(serializers.ModelSerializer):
    """Сериализует Category: id + name."""

    class Meta:
        model  = Category
        fields = ['id', 'name']


class PropertySerializer(serializers.ModelSerializer):
    """
    Сериализует Property.
    • category — вложенный объект {id, name} в ответе (read).
    • category_id — принимается при записи (write).
    • owner_username — удобное поле для фронта.
    """
    category       = CategorySerializer(read_only=True)
    category_id    = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        source='category',
        write_only=True,
        required=False,
        allow_null=True
    )
    owner_username = serializers.CharField(source='owner.username', read_only=True)

    class Meta:
        model  = Property
        fields = [
            'id', 'title', 'description', 'price',
            'rooms', 'location', 'is_available', 'image_url',
            'category', 'category_id',
            'owner', 'owner_username', 'agent',
        ]
        read_only_fields = ['owner']


class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model            = Booking
        fields           = '__all__'
        read_only_fields = ['user', 'created_at']