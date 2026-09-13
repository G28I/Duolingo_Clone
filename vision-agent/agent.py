import os
from dotenv import load_dotenv
from vision_agents.core import Agent, User, Runner, AgentLauncher
from vision_agents.core.instructions import Instructions
import vision_agents.plugins.getstream as getstream
import vision_agents.plugins.openai as openai

load_dotenv()

DEFAULT_TEACHER_INSTRUCTIONS = (
    "You are a warm, human, energetic, and encouraging AI language teacher. "
    "You speak mostly English while teaching target languages through short, natural, human conversations. "
    "Use contractions like I'm, let's, you'll, and that's, along with gentle praise like 'Great job!' or 'Awesome!'. "
    "Introduce target-language words slowly with clear English translations. "
    "Listen carefully to the student's response, adapt your feedback, and ask them to repeat or try again. "
    "STRICT RULE: Stay strictly within the currently selected lesson's goal, vocabulary, and phrases. Do not teach unrelated topics or switch to other languages. "
    "STRICT RULE: Keep every spoken response to strictly 1 or 2 short conversational sentences."
)


async def create_agent(**kwargs) -> Agent:
    """Create and configure the AI Language Teacher agent using Groq or OpenAI."""
    load_dotenv()
    groq_key = os.getenv("GROQ_API_KEY")
    openai_key = os.getenv("OPENAI_API_KEY")

    # Use Groq AI if GROQ_API_KEY is present or if key starts with gsk_
    if groq_key or (openai_key and openai_key.startswith("gsk_")):
        api_key = groq_key or openai_key
        print("[AI Teacher Agent] Initializing Groq AI LLM (model: llama-3.3-70b-versatile)...")
        llm = openai.LLM(
            model="llama-3.3-70b-versatile",
            api_key=api_key,
            base_url="https://api.groq.com/openai/v1",
        )
        tts = openai.TTS(api_key=api_key)
        return Agent(
            edge=getstream.Edge(),
            agent_user=User(id="ai-teacher", name="AI Language Teacher"),
            instructions=DEFAULT_TEACHER_INSTRUCTIONS,
            llm=llm,
            tts=tts,
        )
    else:
        print("[AI Teacher Agent] Initializing OpenAI Realtime LLM...")
        llm = openai.Realtime(
            model="gpt-4o-realtime-preview",
            voice="marin",
            api_key=openai_key or "",
            send_video=False,
        )
        return Agent(
            edge=getstream.Edge(),
            agent_user=User(id="ai-teacher", name="AI Language Teacher"),
            instructions=DEFAULT_TEACHER_INSTRUCTIONS,
            llm=llm,
        )


async def join_call(agent: Agent, call_type: str, call_id: str):
    """Handle joining a call with the agent, consuming Stream custom call data, and running until finish."""
    try:
        getstream_edge = agent.edge
        call_res = await getstream_edge.client.video.get_call(
            type=call_type, id=call_id
        )
        call_obj = getattr(call_res, "call", None)
        custom_data = getattr(call_obj, "custom", {}) if call_obj else {}
        if not custom_data and hasattr(call_res, "custom"):
            custom_data = getattr(call_res, "custom", {})

        lesson_title = custom_data.get("lessonTitle", "Language Lesson")
        target_lang = custom_data.get("targetLanguage", "French")
        user_name = custom_data.get("userName", "Learner")
        goals = custom_data.get("goals", [])
        vocabulary = custom_data.get("vocabulary", [])
        phrases = custom_data.get("phrases", [])
        ai_prompt = custom_data.get("aiTeacherPrompt", "")

        vocab_str = ", ".join(vocabulary) if isinstance(vocabulary, list) else str(vocabulary)
        phrases_str = "; ".join(phrases) if isinstance(phrases, list) else str(phrases)
        goals_str = ", ".join(goals) if isinstance(goals, list) else str(goals)

        instructions_text = (
            f"You're a warm, energetic language teacher guiding {user_name} through the lesson '{lesson_title}' in {target_lang}.\n"
            f"Lesson Goals: {goals_str}\n"
            f"Target Vocabulary to practice: {vocab_str}\n"
            f"Key Phrases to practice: {phrases_str}\n"
            f"Teacher Persona & Guidelines: {ai_prompt}\n\n"
            "TEACHING RULES:\n"
            f"1. Stay strictly focused on this lesson's target language ({target_lang}) and its specific vocabulary/phrases. Do not teach unrelated topics or switch to other languages.\n"
            "2. Speak mostly in warm, natural English, using contractions (I'm, let's, that's) and friendly, gentle encouragement (Awesome!, Great try!).\n"
            f"3. Introduce {target_lang} words slowly with immediate English translations.\n"
            "4. Listen to the student's response, adapt your feedback accordingly, and ask them to repeat or try again.\n"
            "5. CRITICAL: Keep every spoken response strictly to 1 or 2 short conversational sentences."
        )

        agent.instructions = Instructions(instructions_text)
        print(f"[AI Teacher Agent] Loaded custom lesson context for {user_name} ({target_lang}): {lesson_title}")
    except Exception as err:
        print(f"[AI Teacher Agent Warning] Could not fetch call custom metadata: {err}")

    call = await agent.create_call(call_type, call_id)
    async with agent.join(call):
        await agent.finish()


if __name__ == "__main__":
    runner = Runner(AgentLauncher(create_agent=create_agent, join_call=join_call))
    runner.cli()
