from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('scenario/1/', views.knee_knockdown, name='knee_knockdown'),
    path('scenario/2/', views.fever_frenzy, name='fever_frenzy'),
    path('scenario/3/', views.burn_emergency, name='burn_emergency'),

    # 🩹 Drag-and-Drop Knee Knockdown Mini-Game
    path('knee-game/', views.knee_drag_game, name='knee_drag_game'),
]
