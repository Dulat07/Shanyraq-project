from django.urls import path
from . import views

urlpatterns = [
    path('properties/', views.list_properties, name='list-properties'),
    path('properties/available/', views.filter_properties, name='filter-properties'),
    path('properties/<int:pk>/', views.PropertyDetailView.as_view(), name='property-detail'),
    path('bookings/', views.BookingCreateView.as_view(), name='booking-create'),
]
