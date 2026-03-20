from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import traceback

from ai_service import generate_assistant_streaming

app = FastAPI(title="AGED AI CORE")

class ChatRequest(BaseModel):
    message: str
    user_context: str = "general"
    preferences: dict = {}

@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal Server Error",
            "message": str(exc),
            "traceback": traceback.format_exc() if not isinstance(exc, HTTPException) else None
        }
    )

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/chat-stream")
@app.post("/chat-stream")
async def chat_stream_endpoint(payload: ChatRequest):
    message = (payload.message or "").strip()
    if not message:
        raise HTTPException(status_code=400, detail="Message empty.")

    async def event_stream():
        async for chunk in generate_assistant_streaming(
            message=message,
            user_context=payload.user_context,
            doc_type=payload.preferences.get("doc_type", "auto")
        ):
            yield chunk

    return StreamingResponse(event_stream(), media_type="text/event-stream")

@app.get("/api/health")
@app.get("/health")
def health_check():
    return {"status": "healthy", "engine": "aged-ai-v5"}

@app.get("/")
def root():
    return {"message": "AGED AI Core is ONLINE"}
