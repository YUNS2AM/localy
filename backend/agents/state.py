"""State definition for Travel Agent LangGraph system"""

from typing import TypedDict, Annotated, Optional, List
from operator import add


class TravelAgentState(TypedDict):
    """
    여행 에이전트 시스템의 전체 상태
    """
    # 입력
    user_input: str
    user_intent: str  # "restaurant", "itinerary", "chat"
    
    # 대화 컨텍스트
    conversation_history: Annotated[List[dict], add]
    
    # 에이전트 결과
    restaurant_results: Optional[List[dict]]
    itinerary_results: Optional[dict]
    chat_response: Optional[str]
    
    # 출력
    final_response: str
