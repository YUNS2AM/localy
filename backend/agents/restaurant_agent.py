"""Restaurant Finder Agent - GPT-4 기반 맛집 추천"""

from langchain_openai import ChatOpenAI
from .state import TravelAgentState


# GPT-4 모델
llm = ChatOpenAI(model="gpt-4o-mini", temperature=0.7)


# 간단한 맛집 데이터 (데모용)
RESTAURANT_DB = {
    "부산": [
        {"name": "해운대 밀면", "type": "밀면", "rating": 4.5},
        {"name": "광안리 회센터", "type": "회", "rating": 4.7},
        {"name": "서면 돼지국밥", "type": "국밥", "rating": 4.6}
    ],
    "서울": [
        {"name": "명동 칼국수", "type": "칼국수", "rating": 4.4},
        {"name": "강남 삼겹살", "type": "고기", "rating": 4.8},
        {"name": "홍대 초밥", "type": "일식", "rating": 4.6}
    ],
    "제주": [
        {"name": "제주 흑돼지", "type": "고기", "rating": 4.9},
        {"name": "성산 해물탕", "type": "해산물", "rating": 4.7},
        {"name": "서귀포 횟집", "type": "회", "rating": 4.8}
    ]
}


def find_restaurants(location: str) -> list:
    """위치 기반 맛집 검색"""
    for city in RESTAURANT_DB.keys():
        if city in location:
            return RESTAURANT_DB[city]
    return RESTAURANT_DB["서울"]  # 기본값


def restaurant_agent_node(state: TravelAgentState) -> TravelAgentState:
    """
    GPT-4 기반 맛집 추천 에이전트
    """
    user_input = state["user_input"]
    
    print(f"[Restaurant Agent - GPT-4] 맛집 검색 중...")
    
    # 1. 위치 추출
    location = ""
    for city in ["부산", "서울", "제주"]:
        if city in user_input:
            location = city
            break
    if not location:
        location = "서울"
    
    # 2. 맛집 검색
    restaurants = find_restaurants(location)
    
    # 3. GPT-4로 추천 생성 (객관적 정보)
    restaurant_list = "\n".join([
        f"- {r['name']} ({r['type']}, 평점 {r['rating']})"
        for r in restaurants
    ])
    
    prompt = f"""{location}의 맛집을 추천해주세요.

맛집 목록:
{restaurant_list}

사용자 요청: {user_input}

**객관적이고 전문적으로** 3-4문장으로 추천해주세요. 캐릭터 연기 없이 정보만 제공하세요."""
    
    try:
        response = llm.invoke(prompt)
        recommendation = response.content
    except Exception as e:
        print(f"GPT-4 추천 생성 실패: {e}")
        recommendation = f"{location} 맛집 추천:\n\n" + restaurant_list
    
    print(f"[Restaurant Agent] 추천 완료")
    
    return {
        "restaurant_results": restaurants,
        "final_response": recommendation
    }
