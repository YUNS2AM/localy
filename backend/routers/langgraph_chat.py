from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional

from agents.graph import travel_agent_graph
from agents.state import TravelAgentState

router = APIRouter(
    prefix="/api/langgraph",
    tags=["langgraph"],
    responses={404: {"description": "Not found"}},
)


class ChatRequest(BaseModel):
    message: str
    conversation_history: Optional[List[dict]] = []


class ChatResponse(BaseModel):
    response: str
    intent: str
    agent_results: Optional[dict] = None


@router.post("/chat", response_model=ChatResponse)
async def langgraph_chat(request: ChatRequest):
    """
    LangGraph 멀티에이전트 챗봇 엔드포인트
    """
    try:
        # 초기 상태 설정
        initial_state: TravelAgentState = {
            "user_input": request.message,
            "user_intent": "",
            "conversation_history": request.conversation_history,
            "restaurant_results": None,
            "itinerary_results": None,
            "chat_response": None,
            "final_response": ""
        }
        
        print(f"\n=== LangGraph 실행 ===")
        print(f"입력: {request.message}")
        
        # LangGraph 실행
        result = travel_agent_graph.invoke(initial_state)
        
        print(f"의도: {result['user_intent']}")
        print(f"응답: {result['final_response'][:50]}...")
        
        # 결과 구성
        agent_results = {}
        if result.get("restaurant_results"):
            agent_results["restaurants"] = result["restaurant_results"]
        if result.get("itinerary_results"):
            agent_results["itinerary"] = result["itinerary_results"]
        if result.get("chat_response"):
            agent_results["chat"] = result["chat_response"]
        
        return ChatResponse(
            response=result["final_response"],
            intent=result["user_intent"],
            agent_results=agent_results if agent_results else None
        )
        
    except Exception as e:
        print(f"LangGraph 에러: {e}")
        import traceback
        traceback.print_exc()
        
        raise HTTPException(
            status_code=500,
            detail=f"LangGraph 실행 실패: {str(e)}"
        )


@router.get("/health")
async def langgraph_health():
    """
    LangGraph 시스템 헬스 체크
    """
    return {
        "status": "ok",
        "system": "langgraph_multi_agent",
        "agents": ["orchestrator", "restaurant", "itinerary", "chat"]
    }
