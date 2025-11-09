# Signex Translator Chrome Extension

A Chrome extension that captures live captions from Google Meet and translates them to sign language using a Django backend.

## Features

- 🎥 **Google Meet Integration**: Automatically detects and captures live captions
- 🤖 **Real-time Translation**: Sends captions to your Django backend for NLP processing
- 🎨 **Floating Sign Panel**: Shows sign language videos in a moveable overlay
- ⚙️ **Easy Configuration**: Simple popup interface for settings
- 🔒 **Privacy-First**: Only captures visible captions, no audio/video recording

## Installation

### For Development/Testing

1. **Download the extension files** to a folder on your computer
2. **Open Chrome** and go to `chrome://extensions/`
3. **Enable "Developer mode"** (toggle in top-right corner)
4. **Click "Load unpacked"** and select the extension folder
5. The extension will appear in your Chrome toolbar

### File Structure
```
signex-extension/
├── manifest.json       # Extension configuration
├── content.js          # Google Meet caption capture
├── background.js       # Extension lifecycle management  
├── popup.html          # Settings interface
├── popup.js            # UI functionality
├── popup.css           # Styling
└── images/             # Extension icons
    ├── icon16.png
    ├── icon32.png
    ├── icon48.png
    └── icon128.png
```

## How to Use

### Step 1: Configure Backend
1. Click the Signex extension icon in Chrome toolbar
2. Enter your Django backend URL (e.g., `https://your-domain.com`)
3. Click "Save Settings"

### Step 2: Use with Google Meet
1. Join a Google Meet
2. **Enable live captions** in Google Meet:
   - Click the 3-dots menu → "Turn on captions"
   - Or use keyboard shortcut `Ctrl+Shift+C` (Windows/Linux) or `Cmd+Shift+C` (Mac)
3. The extension will automatically detect captions and send them to your backend
4. Sign language translations will appear in the floating panel

### Step 3: Control the Extension
- **Toggle Extension**: Use the switch in the popup to enable/disable translation
- **Toggle Sign Panel**: Show/hide the floating sign language video panel
- **Auto-show Panel**: Automatically display the panel when joining Google Meet

## Django Backend Requirements

Your Django backend should have an endpoint that accepts caption data:

### API Endpoint
```python
# views.py
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import json

@csrf_exempt
def captions_api(request):
    if request.method == "POST":
        data = json.loads(request.body)
        caption_text = data.get("caption", "")
        timestamp = data.get("timestamp")
        
        # Process caption with your NLP + sign language pipeline
        sign_video_url = process_caption_to_sign_language(caption_text)
        
        return JsonResponse({
            "status": "ok",
            "signVideoUrl": sign_video_url  # Optional: URL to sign language video
        })

# urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('api/captions/', views.captions_api, name='captions_api'),
    # ... other URLs
]
```

### CORS Configuration
Make sure your Django backend allows requests from `chrome-extension://`:

```python
# settings.py
CORS_ALLOWED_ORIGINS = [
    "https://meet.google.com",
]

CORS_ALLOW_CREDENTIALS = True

# For development, you might need:
CORS_ALLOW_ALL_ORIGINS = True  # Only for development!
```

## Privacy & Permissions

### What the extension accesses:
- ✅ Google Meet captions (text only, already visible to user)
- ✅ Extension storage (for settings)
- ✅ Active tab (to detect Google Meet)

### What it does NOT access:
- ❌ Audio/video streams
- ❌ Private conversations without captions
- ❌ Other websites or personal data

## Troubleshooting

### Extension not working?
1. Make sure you're on `meet.google.com`
2. Enable live captions in Google Meet
3. Check that the extension is enabled (toggle in popup)
4. Verify backend URL is correct

### No sign language videos showing?
1. Check Django backend is running and accessible
2. Verify CORS settings allow the extension
3. Check browser console for error messages (`F12` → Console tab)

### Caption detection issues?
Google Meet may update their HTML structure. If captions aren't detected:
1. Right-click on a caption → "Inspect"
2. Find the HTML selector for caption text
3. Update `CAPTION_SELECTORS` array in `content.js`

## Development

### Testing locally:
```bash
# Check extension is loaded
chrome://extensions/

# View extension logs
Right-click extension → "Inspect popup"
F12 → Console (on Google Meet page)
```

### Updating the extension:
1. Make changes to files
2. Go to `chrome://extensions/`
3. Click refresh icon on the Signex extension
4. Test changes

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly with Google Meet
5. Submit a pull request

## License

MIT License - feel free to use and modify as needed.

## Support

For issues or questions:
- Check the troubleshooting section above
- Review browser console logs
- Ensure your Django backend is configured correctly