import os
import json
import traceback
from groq import AsyncGroq, Groq
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

# 1. Configuration
STABLE_MODEL = "llama-3.3-70b-versatile"
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

PERSONAS = {
    "developer": (
        "You are an Elite Developer Advocate and Technical Writer. You understand the profound needs of software engineers. "
        "When generating documentation, follow these principles: "
        "- Detail is preferred over brevity ('Too long is better than too short'). "
        "- Structure must be logical and exhaustive. "
        "- For READMEs, prioritize: Name, Description, Badges, Visuals, Installation, Usage, Support, Roadmap, Contributing, Authors, License, and Project Status. "
        "- Use technical, precise language."
    ),
    "learner": (
        "You are a Senior Code Mentor specializing in deep technical discovery. "
        "Your goal is to help students 'feel' and understand how code works at a fundamental level. "
        "When generating explanations, focus on: "
        "- Breaking down complex logic line-by-line. "
        "- Explaining the 'Why' behind architectural choices. "
        "- Providing conceptual analogies to make abstract code tangible."
    )
}

TEMPLATES = {
    "chat_guidance": "Provide nuanced conceptual advice and strategic guidance. Leverage first-principles reasoning.",
    "code_documentation": "Provide hyper-structured, technically exhaustive mappings of code architecture and logic flows.",
    "document_generation": "Engineer high-fidelity, professional-grade documentation with structural precision.",
    "code_generation": "Design production-ready, scalable, and optimized software components with architectural commentary.",
    "website_generation": "Architect premium UI/UX components focusing on modern aesthetics and clean patterns.",
    "rewrite_improve": "Perform high-stakes editorial refinement, optimizing for linguistic executive impact."
}

ROUTER_PROMPT = """You are the Advanced Semantic Orchestrator for a high-intelligence AI ecosystem. 
Analyze the user's input with deep-level reasoning to determine the optimal response mode.

Respond ONLY with a valid JSON object: 
{ 
  "mode": "...", 
  "detected_language": "...", 
  "is_technical": boolean, 
  "intent_confidence": float,
  "reasoning_path": "short description of why this mode was chosen"
}

MODES & ARCHETYPES:
- chat_guidance: Nuanced conceptual advice, conversational tutoring, or strategic guidance.
- code_documentation: Technical synthesis and architectural mapping of existing code.
- document_generation: Engineering high-fidelity professional, academic, or strategic documents.
- code_generation: Designing production-grade, optimized, and scalable software components.
- website_generation: Architecting premium, high-fidelity UI/UX components with modern aesthetics.
- rewrite_improve: High-stakes editorial refinement, linguistic optimization, and structural refactoring.

CRITICAL: If the input is gibberish or random keystrokes (e.g. "asdfasdf", "hjkl"), set mode to 'gibberish'."""

def get_groq_client(is_async=True):
    if not GROQ_API_KEY:
        return None
    try:
        if is_async:
            return AsyncGroq(api_key=GROQ_API_KEY)
        return Groq(api_key=GROQ_API_KEY)
    except:
        return None

async def detect_intent(prompt: str) -> dict:
    """Internal LLM call to categorize the user's request."""
    client = get_groq_client(is_async=False) # Use sync client for intent detection for simplicity in some contexts, or just use async if preferred
    if not client:
        return {"mode": "chat_guidance"}

    try:
        completion = client.chat.completions.create(
            model=STABLE_MODEL,
            messages=[
                {"role": "system", "content": ROUTER_PROMPT},
                {"role": "user", "content": f"ANALYZE: {prompt}"},
            ],
            temperature=0,
            response_format={"type": "json_object"}
        )
        return json.loads(completion.choices[0].message.content)
    except Exception as e:
        print(f"Error in detect_intent: {str(e)}")
        return {"mode": "chat_guidance"}

async def generate_assistant_streaming(message: str, user_context: str = "general", doc_type: str = "auto"):
    """Real-time streaming using Groq."""
    intent_data = await detect_intent(message)
    mode = intent_data.get("mode", "chat_guidance")
    
    if mode == "gibberish":
        yield "I could not understand that. What would you like me to do?"
        return

    persona_base = PERSONAS.get(user_context, PERSONAS["developer"])
    expert_persona = TEMPLATES.get(mode, TEMPLATES["chat_guidance"])
    
    system_message = f"""You are AGED (AI Document Architect & Assistant).
Persona: {user_context.upper()} ({persona_base})
Operational Mode: {expert_persona}
Document Type Target: {doc_type}

OPERATIONAL PROTOCOL:
1. Maintain high-fidelity output. Do not truncate technical components.
2. If the user asks for a document, provide a professional structure.
3. If it's a chat, be helpful and intelligent.
4. AT THE VERY END, provide exactly three actionable next steps under the heading '**Next Steps:**'."""

    client = get_groq_client(is_async=True)
    if not client:
        yield "Error: AI Core Offline (API Key Missing)"
        return

    try:
        completion = await client.chat.completions.create(
            model=STABLE_MODEL,
            messages=[
                {"role": "system", "content": system_message},
                {"role": "user", "content": message},
            ],
            temperature=0.7,
            max_tokens=8192,
            stream=True
        )
        async for chunk in completion:
            content = chunk.choices[0].delta.content or ""
            if content:
                yield content
    except Exception as e:
        yield f"AI Error: {str(e)}"
