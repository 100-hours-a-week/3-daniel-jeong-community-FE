/**
 * 떠오르는 말풍선 애니메이션
 */

// 기본 말풍선 텍스트
const BUBBLE_TEXTS = [
    '#아무말대잔치', '#해외여행', '#맛집후기', '#함께해요', '#영화추천',
    '#심심해', '#바다여행', '#같이해요', '#책추천', '#나가서놀고싶다',
    '#우리들의공간', '#등산', '#음악추천', '#그냥말해봐', '#캠핑',
    '#질문있어요', '#게임추천', '#소소한일상', '#피크닉', '#대잔치',
    '#일상톡톡', '#드라마추천', '#정보공유', '#자전거', '#모르겠어',
    '#웹툰추천', '#같이이야기해요', '#여행후기', '#점심뭐먹지', '#만화추천',
    '#애니메이션', '#함께나눠요', '#오늘뭐하지', '#공연후기', '#전시회후기',
    '#카페추천', '#오늘도야근', '#디저트추천', '#옷브랜드추천', '#오운완',
    '#운동후기', '#요리후기', '#취미공유', '#다이어트', '#저메추',
    '#공유해요', '#소통해요', '#댓글달기', '#오늘의이야기', '#자유게시판',
    '#심심풀이', '#시간때우기', '#아무노래나일단틀어', '#아무말', '#대화해요'
];

class BubbleAnimation {
    constructor(container = 'body') {
        this.container = typeof container === 'string' 
            ? document.querySelector(container) 
            : container;
        
        this.isRunning = false;
        this.usedTexts = new Set(); // 사용된 텍스트 저장
        this.usedPositions = new Set(); // 사용된 위치 저장
        this.animationFrameId = null;
        this.init();
    }
    
    init() {
        this.createBubblesContainer();
        this.startContinuousAnimation();
    }
    
    createBubblesContainer() {
        // 기존 컨테이너가 있으면 제거
        const existingContainer = this.container.querySelector('.bubbles-container');
        if (existingContainer) {
            existingContainer.remove();
        }
        
        // 새 컨테이너 생성
        this.bubblesContainer = document.createElement('div');
        this.bubblesContainer.className = 'bubbles-container';
        this.container.appendChild(this.bubblesContainer);
    }
    
    startContinuousAnimation() {
        if (this.isRunning) return;
        this.isRunning = true;
        
        let lastTime = 0;
        let nextInterval = 1500 + Math.random() * 2500;
        
        const animate = (currentTime) => {
            if (this.isRunning) {
                if (currentTime - lastTime >= nextInterval) {
                    // 말풍선 생성
                    this.createBubble();
                    lastTime = currentTime;
                    nextInterval = 1500 + Math.random() * 2500; // 다음 간격 랜덤 설정
                }
                this.animationFrameId = requestAnimationFrame(animate);
            }
        };
        
        this.animationFrameId = requestAnimationFrame(animate);
    }
    
    createBubble() {
        // 왼쪽 말풍선 생성
        this.createSingleBubble('left');
        // 오른쪽 말풍선 생성
        this.createSingleBubble('right');
    }
    
    createSingleBubble(side = null) {
        const bubble = document.createElement('div');
        bubble.className = 'bubble';
        
        // 중복되지 않는 텍스트 선택
        let randomText;
        let textAttempts = 0;
        const maxTextAttempts = 20;
        
        do {
            randomText = BUBBLE_TEXTS[Math.floor(Math.random() * BUBBLE_TEXTS.length)];
            textAttempts++;
        } while (this.usedTexts.has(randomText) && textAttempts < maxTextAttempts);
        
        this.usedTexts.add(randomText);
        bubble.textContent = randomText;
        
        // 랜덤 위치 설정
        let randomPosition;
        let positionAttempts = 0;
        const maxPositionAttempts = 20;
        
        // 위치 범위 정의
        const leftRange = { min: 5, max: 30 };
        const rightRange = { min: 65, max: 90 };
        
        do {
            // 지정된 쪽 또는 랜덤 선택
            if (side === 'left') {
                randomPosition = Math.random() * (leftRange.max - leftRange.min) + leftRange.min;
            } else if (side === 'right') {
                randomPosition = Math.random() * (rightRange.max - rightRange.min) + rightRange.min;
            } else {
                const isLeft = Math.random() < 0.5;
                const range = isLeft ? leftRange : rightRange;
                randomPosition = Math.random() * (range.max - range.min) + range.min;
            }
            positionAttempts++;
        } while (Array.from(this.usedPositions).some(pos => Math.abs(pos - randomPosition) < 15) && positionAttempts < maxPositionAttempts);
        
        this.usedPositions.add(randomPosition);
        bubble.style.left = `${randomPosition}%`;
        
        // 초기 위치 설정
        bubble.style.bottom = '-100px';
        bubble.style.opacity = '0';
        
        // 애니메이션 설정
        const duration = 22;
        
        bubble.style.animation = `bubbleFloat ${duration}s linear forwards`;
        
        this.bubblesContainer.appendChild(bubble);
        
        // 메모리 누수 방지를 위한 timeout ID 저장
        const timeoutId = setTimeout(() => {
            if (bubble.parentNode) {
                bubble.remove();
                this.usedTexts.delete(randomText);
                this.usedPositions.delete(randomPosition);
            }
        }, duration * 1000);
        
        bubble.timeoutId = timeoutId;
    }
    
    stopAnimation() {
        this.isRunning = false;
        
        // requestAnimationFrame 정리
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
        
        // 모든 timeout 정리
        const bubbles = this.bubblesContainer.querySelectorAll('.bubble');
        bubbles.forEach(bubble => {
            if (bubble.timeoutId) {
                clearTimeout(bubble.timeoutId);
            }
        });
        
        // 기존 말풍선 제거
        this.bubblesContainer.innerHTML = '';
        
        // Set 초기화
        this.usedTexts.clear();
        this.usedPositions.clear();
    }
    
    destroy() {
        this.stopAnimation();
        if (this.bubblesContainer) {
            this.bubblesContainer.remove();
        }
    }
}

// 전역으로 사용할 수 있도록 export
window.BubbleAnimation = BubbleAnimation;

// 기본 인스턴스 생성 함수
window.createBubbleAnimation = (container = 'body') => {
    return new BubbleAnimation(container);
};