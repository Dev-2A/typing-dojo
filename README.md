# ⌨️ Typing Dojo

개발자를 위한 코드 타이핑 수련장.  
실제 코드 스니펫(Python, JavaScript, Java, TypeScript 등)으로 타이핑을 연습하고,  
WPM/정확도를 실시간 측정하며, 자주 틀리는 키를 키보드 히트맵으로 분석합니다.

> 일반 타이핑 연습기와 달리 괄호, 세미콜론, 인덴트, 특수문자 등  
> **코드 특유의 타이핑 패턴**에 특화된 도구입니다.

## 🔗 배포

**[https://Dev-2A.github.io/typing-dojo/](https://Dev-2A.github.io/typing-dojo/)**

## ✨ 주요 기능

### 연습 모드

- 8개 언어(Python · JS · TS · Java · Go · Rust · SQL · CSS), 난이도별 26개 코드 스니펫
- Monaco Editor 기반 원본 코드 뷰어 (VS Code 스타일 구문 강조)
- 타이핑 시 정타(초록)/오타(빨강) 실시간 diff 시각화
- WPM · 정확도 · 경과 시간 · 진행률 실시간 대시보드
- WPM 추이 SVG 라인 차트 (1초 간격 샘플링)
- Tab → 스페이스 2칸, Enter → 줄바꿈 자동 변환

### 결과 리포트

- S/A/B/C/D/F 등급 판정 + 점수 (난이도 배율 반영)
- Net WPM · CPM · 정타/오타 비율 바
- 퍼포먼스 분석 코멘트 (속도 · 정확도 · 특수문자 오타 피드백)
- 키보드 히트맵 + 코드 특수문자 오타 분포

### 매일 도전

- 날짜 시드 기반 일일 3라운드 (초급 · 중급 · 고급)
- 라운드별 등급/점수 표시, 연속 도전 일수(streak)
- 오늘의 총점 집계

### 통계 & 성장 그래프

- 전체 요약 (총 연습 횟수, 평균/최고 WPM, 평균 정확도, 연습 시간 등)
- 주간 WPM 추세 (상승/하락/유지)
- 일별 성장 추이 차트 (WPM + 정확도, 최근 30일)
- 언어별 통계 (평균 WPM · 정확도 · 최고 WPM · 연습 횟수)
- 최근 기록 테이블

### 키보드 히트맵

- US QWERTY 레이아웃 기반 열 분포 시각화
- 오타 강도별 색상 (노랑 → 주황 → 빨강)
- Shift 문자 포함 분석
- 코드 특수문자 그룹별 오타 횟수 (중괄호, 소괄호, 세미콜론 등)

## 🛠️ 기술 스택

| 분류 | 기술 |
| --- | --- |
| Framework | React 19 + Vite |
| Styling | Tailwind CSS v4 |
| Code Editor | Monaco Editor (@monaco-editor/react) |
| State | React Hooks (useState, useMemo, useCallback, useRef) |
| Storage | localStorage (타이핑 히스토리, 매일 도전 기록) |
| Chart | Custom SVG (WPM 추이, 성장 그래프) |
| Deploy | GitHub Pages (gh-pages) |

## 📁 프로젝트 구조

```text
src/
├── components/
│   ├── common/        # Toast
│   ├── layout/        # Header, Footer
│   ├── stats/         # LiveStats, WpmChart, KeyboardHeatmap,
│   │                  # ResultReport, GrowthChart, LanguageBreakdown,
│   │                  # HistoryTable, OverallSummary
│   └── typing/        # CodeViewer, TypingInput, SnippetSelector,
│                      # LanguageCard, DiffOverlay, DifficultyBadge,
│                      # ErrorSummary
├── data/
│   └── snippets.js    # 코드 스니펫 데이터 (8개 언어, 26개)
├── hooks/
│   ├── useTimer.js    # setInterval 기반 타이머
│   ├── useTyping.js   # 타이핑 엔진 코어
│   └── useWpmSampler.js # WPM 1초 간격 샘플러
├── pages/
│   ├── PracticePage.jsx
│   ├── DailyPage.jsx
│   └── StatsPage.jsx
├── utils/
│   ├── typing.js      # WPM/정확도 계산, 문자 비교, diff
│   ├── storage.js     # localStorage CRUD, 일별/언어별 통계
│   ├── keyboard.js    # 키보드 레이아웃, 히트맵 데이터
│   ├── difficulty.js  # 난이도 배율, 점수/등급 판정
│   └── daily.js       # 매일 도전 시드 생성, streak
├── App.jsx
├── main.jsx
└── index.css
```

## 🚀 로컬 실행

```bash
git clone https://github.com/Dev-2A/typing-dojo.git
cd typing-dojo
npm install
npm run dev
```

## 📄 라이선스

MIT License

## 🧑‍💻 만든 사람

**[Dev-2A](https://github.com/Dev-2A)**  
콜라와 💙로 만들었습니다.
