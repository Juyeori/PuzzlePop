# 🗓️ ~1월 15일 (월)

* 주말
    - 백엔드 팀 회의를 통해 기본 테이블 속성 정의, ERD 초안 제작
        - ERD v1.0
            <img src="./img/240113_img1.png" />
        
    - 요구사항 명세서 v1.0 완성
        - [240114 요구사항 명세서 v1.0 링크](https://docs.google.com/spreadsheets/d/1C7pJNXHdLoR1nTblNIq3rpCiKxgurcrFm9QsJ3zkVV0/edit#gid=1624068894)

* 오전 회의
    - 백엔드 팀 주말 ERD 작성 중 생긴 논의점 제기 및 해소
    - 서비스 기획 상세 사항 구체화

* 오후 
    - 컨설턴트님 미팅 진행
        - 각종 문서, ERD의 수정 및 구체화 필요성 파악
        
    - 'PuzzlePop' ERD 수정
        - 테이블별 속성 재정의 및 ERD 관계 재정립
        - 16일(화)까지 작업하여 완성 예정
        - ERD v1.2
            <img src="./img/240115_img1.png" />



# 🗓️ 1월 16일 (화)

* ERD 마무리
    - DB 기존 설계에 대한 정규화 및 테이블 관계 재정립
    - DB 설계 최종 검토 후 ERD v1.3 완성
    - ERD v1.3
        <img src="./img/240116_img1.png" />

* API 명세서 작성 (17일 완성 예정)

* 금주 작업 내용에 대한 Jira 이슈 등록

* 커밋, 브랜치, 지라 관리 컨벤션 논의 및 결정



# 🗓️ 1월 17일 (수)

* API 명세서 v1.0 완성
    - [240117 API 명세서 v1.0 링크](https://docs.google.com/spreadsheets/d/1C7pJNXHdLoR1nTblNIq3rpCiKxgurcrFm9QsJ3zkVV0/edit#gid=1624068894)

* Jira 1주차 스프린트에 대한 이슈 등록 마무리

* 로컬 PC 개발 환경 설정

* 전체 코드 리뷰 규칙, 백엔드 코딩 컨벤션 논의 및 결정



# 🗓️ 1월 18일 (목)

* API 명세서 수정 및 추가 상세화

* 컨설턴트님 미팅 진행
    - API 명세서, ERD 피드백

* ERD 설계 추가 고려점 논의 및 수정
    - 테이블명 및 필드명 확정하여 ERD 반영
    - OAuth 로그인 인증 토큰의 저장 방식 논의
    - ERD v1.4
        <img src="./img/240118_img1.png" />

* 로컬 PC MySQL 환경 설정

* 퍼즐 이미지 관련 CRUD 기능 개발 중



# 🗓️ 1월 19일 (금)

* ERD 관련 추가 논의 및 수정
    - '이미지', '상점아이템' 테이블명, 필드별 속성 재정의하여 수정
    - '인게임 아이템', '상점 아이템' 하나의 아이템으로 통일할 것인지 추가 논의 필요

* JPA, lombok 사용법 학습 및 적용

* API 명세서 기반 기본 CRUD 기능 구현
    - image 관련 CRUD 완성
    - 주말까지 상점 아이템, 전적, 랭킹 관련 기본 기능 구현 예정


# 🗓️ 1월 22일 (월)

* Jira 2주차 스프린트 이슈 정의 및 등록

* ERD 관련 추가 논의 및 수정
    - '아이템' 테이블 하나로 통합
    - '유저' 테이블 - '인증' 테이블 하나로 통합

* 컨설턴트님 미팅 진행
    - 전체 일정 계획 수립의 필요성

* EC2 초기 설정 / Docker, Jenkins 설치 및 환경 설정
    - [Jenkins 링크](http://i10a304.p.ssafy.io:8080/)
