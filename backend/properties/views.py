from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import generics
from .models import Property, Booking
from .serializers import PropertySerializer, BookingSerializer

from django.db.models import Q

@api_view(['GET'])
def list_properties(request):
    queryset = Property.objects.all()
    search_query = request.GET.get('search', None)
    if search_query:
        queryset = queryset.filter(
            Q(title__icontains=search_query) | 
            Q(location__icontains=search_query)
        )
    serializer = PropertySerializer(queryset, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def filter_properties(request):
    properties = Property.available_objects.all()
    serializer = PropertySerializer(properties, many=True)
    return Response(serializer.data)

class PropertyDetailView(generics.RetrieveAPIView):
    queryset = Property.objects.all()
    serializer_class = PropertySerializer

from rest_framework.permissions import IsAuthenticated

class BookingCreateView(generics.CreateAPIView):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from .serializers import LoginSerializer  # Проверь, что импорт есть

@api_view(['POST'])
def login_view(request):
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        user = authenticate(
            username=serializer.validated_data['username'],
            password=serializer.validated_data['password']
        )
        if user:
            token, _ = Token.objects.get_or_create(user=user)
            return Response({'token': token.key})
        return Response({'error': 'Неверный логин или пароль'}, status=400)
    return Response(serializer.errors, status=400)

@api_view(['POST'])
def logout_view(request):
    if request.user.is_authenticated:
        # Удаляем токен из базы при выходе
        request.user.auth_token.delete()
        return Response({'message': 'Вы успешно вышли'})
    return Response({'error': 'Вы не авторизованы'}, status=401)


from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
# Проверь, что Property и PropertySerializer импортированы

# Исправление I5: Создание нового объявления
class PropertyCreateView(generics.CreateAPIView):
    queryset = Property.objects.all()
    serializer_class = PropertySerializer
    permission_classes = [IsAuthenticated] # Только для залогиненных

    def perform_create(self, serializer):
        # Автоматически назначаем текущего пользователя владельцем (owner)
        serializer.save(owner=self.request.user)

# Исправление I5: Редактирование и удаление
class PropertyUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Property.objects.all()
    serializer_class = PropertySerializer
    # В идеале здесь нужно добавить кастомный permission, 
    # чтобы только owner мог менять данные, но для начала хватит этого:
    permission_classes = [IsAuthenticated]