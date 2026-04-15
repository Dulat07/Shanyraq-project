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
