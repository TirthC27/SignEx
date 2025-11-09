"""
URL Configuration for Signex Django Backend
"""

from django.urls import path
from . import views

urlpatterns = [
    # Caption processing endpoint
    path('api/captions/', views.captions_api, name='captions_api'),
    
    # Audio transcription endpoint  
    path('api/transcribe/', views.audio_transcription_api, name='audio_transcription'),
    
    # Batch transcription endpoint
    path('api/transcribe/batch/', views.batch_transcription_api, name='batch_transcription'),
    
    # Supported languages endpoint
    path('api/languages/', views.supported_languages_api, name='supported_languages'),
    
    # Health check endpoint
    path('api/health/', views.health_check, name='health_check'),
    
    # Sign language video serving (you'd implement this based on your video storage)
    # path('api/sign-videos/<str:language>/<str:video_id>.mp4', views.serve_sign_video, name='serve_sign_video'),
]