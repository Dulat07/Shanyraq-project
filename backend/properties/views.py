from django.contrib.auth import authenticate
from django.db.models import Q

from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.views import APIView

from .models import Category, Property, Booking
from .serializers import (
    CategorySerializer,
    PropertySerializer,
    BookingSerializer,
    LoginSerializer,
    RegisterSerializer,
)


# ═══════════════════════════════════════════════════════════════════════════
#  AUTH
# ═══════════════════════════════════════════════════════════════════════════

@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    """POST /api/login/  →  { token, user_id, username }"""
    serializer = LoginSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    user = authenticate(
        username=serializer.validated_data['username'],
        password=serializer.validated_data['password'],
    )
    if user is None:
        return Response(
            {'error': 'Invalid credentials.'},
            status=status.HTTP_400_BAD_REQUEST,
        )

    token, _ = Token.objects.get_or_create(user=user)
    return Response({
        'token':    token.key,
        'user_id':  user.id,
        'username': user.username,
    })


@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    """
    POST /api/register/
    Body: { username, password, email? }
    Returns: { token, user_id, username }
    После регистрации сразу выдаём токен — фронт не должен делать второй запрос.
    """
    serializer = RegisterSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    user  = serializer.save()
    token = Token.objects.create(user=user)

    return Response({
        'token':    token.key,
        'user_id':  user.id,
        'username': user.username,
    }, status=status.HTTP_201_CREATED)


@api_view(['POST'])
def logout_view(request):
    """POST /api/logout/  (requires Token auth)"""
    if request.user.is_authenticated:
        request.user.auth_token.delete()
        return Response({'message': 'Logged out successfully.'})
    return Response({'error': 'Not authenticated.'}, status=status.HTTP_401_UNAUTHORIZED)


class PropertyDeleteView(APIView):
    permission_classes = [IsAuthenticated] # Удалять может только авторизованный

    def delete(self, request, pk):
        try:
            property_item = Property.objects.get(pk=pk)
            # Можно добавить проверку: если property_item.owner != request.user: return 403
            property_item.delete()
            return Response({"message": "Объект успешно удален"}, status=status.HTTP_204_NO_CONTENT)
        except Property.DoesNotExist:
            return Response({"error": "Объект не найден"}, status=status.HTTP_404_NOT_FOUND)


# ═══════════════════════════════════════════════════════════════════════════
#  CATEGORIES  (FBV)
# ═══════════════════════════════════════════════════════════════════════════

@api_view(['GET'])
@permission_classes([AllowAny])
def list_categories(request):
    categories = Category.objects.all()
    serializer = CategorySerializer(categories, many=True)
    return Response(serializer.data)


@api_view(['POST'])
def create_category(request):
    serializer = CategorySerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ═══════════════════════════════════════════════════════════════════════════
#  PROPERTIES
# ═══════════════════════════════════════════════════════════════════════════

@api_view(['GET'])
@permission_classes([AllowAny])
def list_properties(request):
    queryset = Property.objects.select_related('category', 'owner').all()

    search = request.GET.get('search')
    if search:
        queryset = queryset.filter(
            Q(title__icontains=search) | Q(location__icontains=search)
        )

    category_id = request.GET.get('category_id')
    if category_id:
        queryset = queryset.filter(category_id=category_id)

    serializer = PropertySerializer(queryset, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([AllowAny])
def filter_properties(request):
    properties = Property.available_objects.select_related('category', 'owner').all()
    serializer = PropertySerializer(properties, many=True)
    return Response(serializer.data)


class PropertyDetailView(generics.RetrieveAPIView):
    queryset           = Property.objects.select_related('category', 'owner').all()
    serializer_class   = PropertySerializer
    permission_classes = [AllowAny]


class PropertyCreateView(generics.CreateAPIView):
    queryset           = Property.objects.all()
    serializer_class   = PropertySerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class PropertyUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    queryset           = Property.objects.all()
    serializer_class   = PropertySerializer
    permission_classes = [IsAuthenticated]


# ═══════════════════════════════════════════════════════════════════════════
#  BOOKINGS
# ═══════════════════════════════════════════════════════════════════════════

class BookingCreateView(generics.CreateAPIView):
    queryset           = Booking.objects.all()
    serializer_class   = BookingSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class BookingListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        bookings   = Booking.objects.filter(user=request.user).select_related('property')
        serializer = BookingSerializer(bookings, many=True)
        return Response(serializer.data)