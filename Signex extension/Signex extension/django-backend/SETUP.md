# Signex Django Backend Setup Guide

## Quick Start

### 1. Install Dependencies
```bash
cd django-backend
pip install -r requirements.txt
```

### 2. Django Project Setup
Create a new Django project:
```bash
django-admin startproject signex_project .
cd signex_project
python manage.py startapp signex_backend
```

### 3. Configure Settings
Add to your Django `settings.py`:

```python
# Add to INSTALLED_APPS
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'corsheaders',
    'signex_backend',  # Your app
]

# Add CORS middleware
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    # ... other middleware
]

# CORS settings for Chrome extension
CORS_ALLOWED_ORIGINS = [
    "https://meet.google.com",
]

CORS_ALLOWED_ORIGIN_REGEXES = [
    r"^chrome-extension://.*$",
]

CORS_ALLOW_CREDENTIALS = True
```

### 4. Add URLs
In your main `urls.py`:
```python
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('signex_backend.urls')),
]
```

### 5. Copy Backend Files
Copy these files to your `signex_backend` app:
- `views.py` (provided)
- `urls.py` (provided)

### 6. Run Migrations
```bash
python manage.py migrate
```

### 7. Create Superuser (Optional)
```bash
python manage.py createsuperuser
```

### 8. Start Development Server
```bash
python manage.py runserver 0.0.0.0:8000
```

Your backend will be available at: `http://localhost:8000`

## API Endpoints

### 1. Caption Processing
```
POST /api/captions/
Content-Type: application/json

{
    "caption": "Hello world",
    "timestamp": 1635123456789,
    "source": "google-meet",
    "language": "en"
}
```

### 2. Audio Transcription
```
POST /api/transcribe/
Content-Type: multipart/form-data

audio: [audio file]
language: "en" (or "auto" for auto-detection)
timestamp: "1635123456789"
```

### 3. Supported Languages
```
GET /api/languages/

Response:
{
    "status": "success",
    "languages": {
        "en": "English",
        "es": "Spanish",
        ...
    }
}
```

### 4. Health Check
```
GET /api/health/

Response:
{
    "status": "healthy",
    "groq_connected": true,
    "supported_languages": 18
}
```

## Environment Variables

Create a `.env` file:
```bash
# Django
DEBUG=True
SECRET_KEY=your-secret-key-here

# Groq API
GROQ_API_KEY=your_groq_api_key_here

# Database (for production)
DATABASE_URL=postgres://user:pass@localhost:5432/signex_db
```

## Production Deployment

### 1. Environment Setup
```bash
# Install production dependencies
pip install gunicorn whitenoise psycopg2-binary

# Set environment variables
export DEBUG=False
export ALLOWED_HOSTS=your-domain.com
```

### 2. Static Files
```bash
python manage.py collectstatic --noinput
```

### 3. Database Migration
```bash
python manage.py migrate
```

### 4. Run with Gunicorn
```bash
gunicorn signex_project.wsgi:application --bind 0.0.0.0:8000
```

## Testing the API

### Test Caption Processing
```bash
curl -X POST http://localhost:8000/api/captions/ \
  -H "Content-Type: application/json" \
  -d '{"caption": "Hello world", "language": "en"}'
```

### Test Audio Transcription
```bash
# Record a short audio file first
curl -X POST http://localhost:8000/api/transcribe/ \
  -F "audio=@test.m4a" \
  -F "language=en"
```

### Test Health Check
```bash
curl http://localhost:8000/api/health/
```

## Chrome Extension Setup

1. Update the extension's backend URL to your Django server
2. Load the extension in Chrome (`chrome://extensions/`)
3. Join a Google Meet with captions enabled
4. Watch the backend logs for incoming requests

## Troubleshooting

### CORS Issues
- Make sure CORS settings include your extension origin
- Check browser console for CORS errors
- Verify `CORS_ALLOW_CREDENTIALS = True`

### Audio Upload Issues
- Check file size limits in Django settings
- Verify audio format is supported (webm, m4a, wav)
- Look at server logs for detailed error messages

### Groq API Issues
- Verify API key is correct
- Check Groq API quotas and limits
- Review audio file format and size requirements

### Sign Language Processing
The current implementation includes placeholder sign language processing. To fully implement:

1. **Integrate your NLP pipeline** in `process_text_to_sign_language()`
2. **Add sign language video storage** and retrieval
3. **Implement video generation** or mapping to existing sign videos
4. **Add caching** for frequently requested translations

## Development Tips

- Use Django's `runserver` for development
- Check `signex.log` for detailed logging
- Monitor Groq API usage in their dashboard
- Test with various audio qualities and languages
- Use Chrome DevTools to debug extension communication