from django.contrib.auth import authenticate
from django.db.models import Q

from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.views import APIView

from .models import Category, Property, Booking, UserProfile
from .serializers import (
    CategorySerializer,
    PropertySerializer,
    BookingSerializer,
    LoginSerializer,
    RegisterSerializer,
    CurrentUserSerializer,
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
        'email':    user.email,
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
        'email':    user.email,
    }, status=status.HTTP_201_CREATED)


@api_view(['GET', 'PATCH'])
@permission_classes([IsAuthenticated])
def current_user_view(request):
    user = request.user
    profile, _ = UserProfile.objects.get_or_create(user=user)

    if request.method == 'PATCH':
        serializer = CurrentUserSerializer(
            instance=user,
            data=request.data,
            partial=True,
            context={'request': request}
        )
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        user = serializer.save()
        profile = getattr(user, 'profile', None)

    return Response({
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'phone': getattr(profile, 'phone', '') or '',
        'city': getattr(profile, 'address', '') or '',
    })


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
            # Проверяем, что это владелец
            if property_item.owner != request.user:
                return Response(
                    {"error": "У вас нет прав на удаление этого объекта"},
                    status=status.HTTP_403_FORBIDDEN
                )
            # Soft delete — помечаем как удалённый вместо полного удаления
            property_item.is_deleted = True
            property_item.save()
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
    """GET /api/properties/  —  опубликованные объявления (для главной страницы)"""
    queryset = Property.objects.select_related('category', 'owner').filter(
        is_deleted=False, 
        is_published=True
    )

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


class UserPropertiesView(APIView):
    """GET /api/properties/my/ — посты текущего пользователя (включая удалённые)"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        properties = Property.objects.filter(
            owner=request.user
        ).select_related('category', 'owner').order_by('-id')
        serializer = PropertySerializer(properties, many=True)
        return Response(serializer.data)


class PropertyPublishView(APIView):
    """POST /api/properties/<id>/publish/ — опубликовать пост"""
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            property_item = Property.objects.get(pk=pk)
            if property_item.owner != request.user:
                return Response(
                    {"error": "У вас нет прав на публикацию этого объекта"},
                    status=status.HTTP_403_FORBIDDEN
                )
            property_item.is_published = True
            property_item.save()
            serializer = PropertySerializer(property_item)
            return Response(serializer.data)
        except Property.DoesNotExist:
            return Response({"error": "Объект не найден"}, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, pk):
        """DELETE /api/properties/<id>/publish/ — отменить публикацию"""
        try:
            property_item = Property.objects.get(pk=pk)
            if property_item.owner != request.user:
                return Response(
                    {"error": "У вас нет прав на изменение этого объекта"},
                    status=status.HTTP_403_FORBIDDEN
                )
            property_item.is_published = False
            property_item.save()
            return Response({"message": "Публикация отменена"})
        except Property.DoesNotExist:
            return Response({"error": "Объект не найден"}, status=status.HTTP_404_NOT_FOUND)


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
    

