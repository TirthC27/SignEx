#!/usr/bin/env python3
"""
Simple FastAPI backend for SignEX Sign Language Detection
This is a basic test server to receive frames from the frontend.
"""

from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import io
import base64
from datetime import datetime
from PIL import Image
import uvicorn

app = FastAPI(title="SignEX Sign Language API", version="1.0.0")

# Enable CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Store frames for debugging (in production, you'd use a proper database)
frame_history = []

@app.get("/")
async def root():
    return {
        "message": "SignEX Sign Language Detection API",
        "status": "running",
        "endpoints": {
            "process_frame": "POST /process_frame",
            "health": "GET /health",
            "stats": "GET /stats"
        }
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "frames_processed": len(frame_history)
    }

@app.get("/stats")
async def get_stats():
    return {
        "total_frames": len(frame_history),
        "last_frame": frame_history[-1] if frame_history else None,
        "server_time": datetime.now().isoformat()
    }

@app.post("/process_frame")
async def process_frame(
    frame: UploadFile = File(...),
    timestamp: str = Form(...)
):
    try:
        # Read the uploaded frame
        frame_data = await frame.read()
        
        # Process the image
        image = Image.open(io.BytesIO(frame_data))
        width, height = image.size
        
        # Convert to base64 for display (optional)
        img_base64 = base64.b64encode(frame_data).decode('utf-8')
        
        # Store frame info for debugging
        frame_info = {
            "timestamp": timestamp,
            "received_at": datetime.now().isoformat(),
            "width": width,
            "height": height,
            "size_bytes": len(frame_data),
            "format": image.format,
            "frame_number": len(frame_history) + 1
        }
        
        frame_history.append(frame_info)
        
        # Keep only last 100 frames to prevent memory issues
        if len(frame_history) > 100:
            frame_history.pop(0)
        
        print(f"📸 Frame {frame_info['frame_number']}: {width}x{height} ({len(frame_data)} bytes)")
        
        # TODO: Add your sign language detection logic here
        # For now, just return frame information
        response = {
            "success": True,
            "frame_info": frame_info,
            "detected_signs": [],  # This is where detected signs would go
            "confidence": 0.0,     # Confidence score
            "processing_time_ms": 0,  # Processing time
            "message": "Frame received and processed successfully"
        }
        
        return JSONResponse(content=response)
        
    except Exception as e:
        print(f"❌ Error processing frame: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error processing frame: {str(e)}")

@app.get("/latest_frames/{count}")
async def get_latest_frames(count: int = 5):
    """Get the latest N frames for debugging"""
    if count > 50:
        count = 50  # Limit to prevent large responses
    
    return {
        "frames": frame_history[-count:],
        "total_available": len(frame_history)
    }

@app.delete("/clear_frames")
async def clear_frame_history():
    """Clear the frame history"""
    global frame_history
    frame_history.clear()
    return {"message": "Frame history cleared", "timestamp": datetime.now().isoformat()}

if __name__ == "__main__":
    print("🚀 Starting SignEX FastAPI Backend...")
    print("📡 Server will be available at:")
    print("   Local:    http://localhost:8000")
    print("   Network:  http://0.0.0.0:8000")
    print("📄 API Documentation: http://localhost:8000/docs")
    print("💡 Press Ctrl+C to stop the server")
    print("=" * 50)
    
    uvicorn.run(
        "fastapi-backend:app", 
        host="0.0.0.0", 
        port=8000, 
        reload=True,
        log_level="info"
    )
