**🥰 MR과 코드 리뷰의 목적을 염두해주세요.**

> ✅ 다른 사람의 코드를 보고 학습해요. </br>
> ✅ 버그 최소화 및 잠재적인 버그를 예방해요. </br>
> ✅ 리뷰의 prefix로 A, B, C를 붙여서 리뷰해요. </br>
> ✅ 리뷰어의 코드 리뷰 부담을 최소화 하기 위해 아래 양식을 준수하고 최대한 자세히 설명해주세요. </br>
> ✅ 리뷰어는 친절한 어조로 리뷰하며 더 나은 대안이 있다면 최대한 예시를 들어주세요. </br>
> ✅ 리뷰이는 본인 코드에 대한 "애정"을 버리고 열린 마음으로 리뷰를 읽어주세요. </br>
> ✅ 그 외 제안하고 싶은 코드리뷰 문화나 시스템이 있다면 제안해주세요. </br>

# 👀 해결하려는 문제가 무엇인가요?

# 💡 어떻게 해결했나요?

## Attachment

**이 라인부터는 여기서부터는 이해를 돕기 위한 예시입니다. MR시 이 라인의 메세지를 포함하여 아래 양식은 모두 지워주세요.**

# 👀 해결하려는 문제가 무엇인가요?

- TS2305: Module “react-router” has no exported member ‘useHistory’. 오류를 내면서 빌드가 깨집니다. 다른 모듈에 의해 react-router 버전이 5 → 6으로 올라간 게 문제입니다.

# 💡 어떻게 해결했나요?

- 사용하는 react-router의 버전을 package.json에 명시합니다.

## Attachment

- 이번 MR의 Front 동작을 이해를 돕는 GIF 파일 첨부!

- 리뷰어의 이해를 돕기 위한 모듈/클래스 설계에 대한 Diagram 포함!