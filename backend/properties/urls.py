from django.urls import path
from . import views

urlpatterns = [
    path('properties/', views.list_properties, name='list-properties'),
    path('properties/available/', views.filter_properties, name='filter-properties'),
    path('properties/<int:pk>/', views.PropertyDetailView.as_view(), name='property-detail'),
    path('bookings/', views.BookingCreateView.as_view(), name='booking-create'),

    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),

    path('properties/create/', views.PropertyCreateView.as_view(), name='property-create'),
    path('properties/<int:pk>/update/', views.PropertyUpdateDeleteView.as_view(), name='property-update-delete'),
]
