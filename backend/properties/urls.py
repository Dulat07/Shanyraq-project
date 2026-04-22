from django.urls import path
from . import views

urlpatterns = [
    # ── Auth ──────────────────────────────────────────────────────────────
    path('login/',    views.login_view,    name='login'),
    path('me/',       views.current_user_view, name='current-user'),
    path('register/', views.register_view, name='register'),   # НОВЫЙ
    path('logout/',   views.logout_view,   name='logout'),
    path('properties/<int:pk>/', views.PropertyDeleteView.as_view()),

    # ── Categories ────────────────────────────────────────────────────────
    path('categories/',        views.list_categories, name='category-list'),
    path('categories/create/', views.create_category, name='category-create'),

    # ── Properties ────────────────────────────────────────────────────────
    path('properties/',                   views.list_properties,                    name='property-list'),
    path('properties/available/',         views.filter_properties,                  name='property-available'),
    path('properties/my/',                views.UserPropertiesView.as_view(),       name='property-my'),
    path('properties/create/',            views.PropertyCreateView.as_view(),       name='property-create'),
    path('properties/<int:pk>/',          views.PropertyDetailView.as_view(),       name='property-detail'),
    path('properties/<int:pk>/publish/',  views.PropertyPublishView.as_view(),      name='property-publish'),
    path('properties/<int:pk>/update/',   views.PropertyUpdateDeleteView.as_view(), name='property-update'),

    # ── Products alias ────────────────────────────────────────────────────
    path('products/',          views.list_properties,              name='product-list'),
    path('products/<int:pk>/', views.PropertyDetailView.as_view(), name='product-detail'),

    # ── Bookings ──────────────────────────────────────────────────────────
    path('bookings/',    views.BookingCreateView.as_view(), name='booking-create'),
    path('bookings/my/', views.BookingListView.as_view(),   name='booking-my'),
]
