# 모바일 게임 5종

인기 무료 모바일 게임을 조사해서 살짝 비틀거나 장르를 섞은 모바일 웹 게임 5개 모음. 전부 폰 세로 화면 기준이고, 설치 없이 브라우저에서 바로 플레이 가능.

플레이: https://kh32-7.github.io/mobile-game/

| 게임 | 장르 | 원작 조합 | 형식 | 브랜치 | 플레이 |
|---|---|---|---|---|---|
| 블록 조커 | 퍼즐 로그라이크 | Block Blast + Balatro | 2D Canvas | `game/block-joker` | [/block-joker/](https://kh32-7.github.io/mobile-game/block-joker/) |
| 보이드 모 | 액션 로그라이트 | Hole.io, All in Hole + Survivor.io | 3D three.js | `game/void-maw` | [/void-maw/](https://kh32-7.github.io/mobile-game/void-maw/) |
| 스웜 서퍼 | 엔드리스 러너 | Subway Surfers + Mob Control | 3D three.js | `game/swarm-surfers` | [/swarm-surfers/](https://kh32-7.github.io/mobile-game/swarm-surfers/) |
| 스시 루프 | 경영 타이쿤 | Pizza Ready + 컨베이어 벨트 퍼즐 | 3D three.js | `game/sushi-loop` | [/sushi-loop/](https://kh32-7.github.io/mobile-game/sushi-loop/) |
| 로그 퍼트 | 스포츠 아케이드 | 미니골프 + 새총 조준 + 로그라이크 | 2D Canvas | `game/rogue-putt` | [/rogue-putt/](https://kh32-7.github.io/mobile-game/rogue-putt/) |

## 시장 조사 요약 (2026년 9월 기준)

- 다운로드 상위: Free Fire Max, Block Blast, Roblox, Arrows - Puzzle Escape, Subway Surfers, Ludo King, Vita Mahjong, Pizza Ready 등. Subway Surfers와 Block Blast는 몇 년째 꾸준히 상위권 유지.
- 매출 성장 축은 하이브리드 캐주얼. 하이퍼캐주얼의 단순한 루프에 캐주얼급 진행 시스템(메타 업그레이드, 라이브옵스)을 얹은 구조가 IAP 매출 성장을 주도함.
- 퍼즐이 캐주얼 시장의 44% 이상. 컨베이어, 블록/정렬(Color Block Jam, Magic Sort), 나사 퍼즐, 구멍 삼키기(All in Hole)가 상위권.
- 인디/PC 쪽에서 모바일로 넘어온 로그라이크 빌드 구조(Balatro, Vampire Survivors 계열)가 짧은 세션 게임에 깊이를 더하는 방식으로 자주 차용됨.

조사 출처
- [2026's top 10 mobile game downloads (so far) - mobilegamer.biz](https://mobilegamer.biz/2026s-top-10-mobile-game-downloads-so-far-free-fire-max-block-blast-roblox-arrows-more/)
- [Casual Games Report H1 2026 - AppMagic](https://appmagic.rocks/research/casual-report-H12026/?hl=en)
- [Top Grossing Hybrid Casual Puzzles: Q1 2025 vs. Q1 2026 - Gamigion](https://www.gamigion.com/top-grossing-hybrid-casual-puzzles-q1-2025-vs-q1-2026/)
- [100 Most Downloaded Mobile Games of All Time - Udonis](https://www.blog.udonis.co/mobile-marketing/mobile-games/most-downloaded-mobile-games)

## 기획 방향

공통 원칙은 "검증된 하이퍼/하이브리드 캐주얼 루프 하나 + 다른 장르에서 가져온 깊이 레이어 하나". 루프는 3초 안에 이해되어야 하고, 깊이 레이어는 한 판을 다시 하게 만드는 이유가 되어야 함.

### 1. 블록 조커 (퍼즐 로그라이크, 2D)
- 코어: Block Blast의 8x8 보드에 조각 3개 배치, 가로/세로 줄 제거.
- 비튼 점: 점수를 Balatro식 칩 x 배수로 계산. 라운드마다 목표 점수와 트레이(핸드) 수 제한. 라운드 사이 상점에서 조커를 사서 점수 공식을 바꿈. 보석 칸(금, 루비, 유리, 강철)과 보스 저주.
- 한 판을 다시 하게 만드는 이유: 조커 조합으로 매 런이 다른 점수 공식이 됨.

### 2. 보이드 모 (액션 로그라이트, 3D)
- 코어: Hole.io처럼 구멍이 되어 작은 것부터 삼키며 커짐.
- 비튼 점: 적이 몰려오는 Survivor.io 서바이벌. 홀보다 큰 적은 피해를 주고, 작아진 적은 삼킴. 레벨업마다 스킬 3택1. 보스는 스킬로 깎아서 쪼그라뜨린 다음 삼켜야 끝남.
- 다시 하게 만드는 이유: 스킬 빌드 조합과 영구 업그레이드.

### 3. 스웜 서퍼 (엔드리스 러너, 3D)
- 코어: Subway Surfers의 3레인 스와이프 러너.
- 비튼 점: 혼자가 아니라 무리를 이끌고 달림. 숫자 게이트로 인원을 불리고, 레인보다 넓게 퍼진 무리가 장애물에 깎여 나감. 1000m마다 요새를 인원수로 부숨.
- 다시 하게 만드는 이유: 인원 관리라는 두 번째 목표, 코인 업그레이드, 미션.

### 4. 스시 루프 (경영 타이쿤, 3D)
- 코어: Pizza Ready식 아이들 아케이드. 조이스틱으로 걸어 다니며 재료를 등에 쌓아 나르고, 발판을 밟아 조리하고, 돈을 모아 해금 발판으로 식당을 키움.
- 비튼 점: 서빙이 컨베이어 벨트. 벨트 슬롯이 한정되어 있어서 손님 주문을 보고 올려야 하고, 안 팔린 접시는 말라서 치워야 함. 러시 타임, VIP 세트 주문, 콤보 팁.
- 다시 하게 만드는 이유: 식당 이전(4곳 이상), 오프라인 수익, 직원 고용, 코스튬과 레시피 도감.
- 참고: Pizza Ready는 2026년에도 하이퍼캐주얼 다운로드 1위([Business of Apps](https://www.businessofapps.com/data/most-popular-mobile-games/)).

### 5. 로그 퍼트 (스포츠 아케이드, 2D)
- 코어: 새총식 드래그 조준 미니골프.
- 비튼 점: 절차 생성 18홀, 타수 초과가 곧 체력 감소. 홀마다 유물 3택1로 공의 물리 규칙이 바뀜. 보스 홀과 데일리 코스.
- 다시 하게 만드는 이유: 유물 조합, 데일리 시드 기록 경쟁.

## 레포 구조

- `main`: 허브 페이지(`hub/`)와 이 기획 문서.
- `game/<이름>`: 게임별 소스 (Vite 프로젝트). 각 브랜치 README에 상세 설명.
- `gh-pages`: 배포 결과물. 워크플로가 자동으로 관리하므로 직접 수정하지 않음.

## 배포 방식

- `main` 푸시 시 허브를 `gh-pages` 루트에 배포.
- `game/<이름>` 푸시 시 `npm ci && npm run build` 후 `dist/`를 `gh-pages/<이름>/`에 배포.
- GitHub Pages 소스는 `gh-pages` 브랜치 루트(`Settings > Pages > Deploy from a branch`).
