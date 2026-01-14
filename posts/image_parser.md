---
title: "이미지 로딩 최적화를 해보자 (LCP, FCP)"
date: "2026-01-13 21:59:45"
category: "개발"
description: "Lighthouse의 대표 지표인 LCP와 FCP 개선을 위해 Next.js의 Image 컴포넌트를 적용하고, 마크다운 파이프라인을 최적화해보자."
---

## 서론: 이거 짜증나네

요즘 Lighthouse로 성능 검사를 자주 돌린다. 그런데 블로그 상세 조회에선 항상 빨간색 경고등과 함께 <b>이미지 전송 개선 권고</b>가 맨날 보인다..

<figure>
    <img src="/images/lcp_1.png" alt="Lighthouse 이미지 전송 개선 권고 화면" />
    <figcaption>사진의 원본 크기가 화면에 그려지는 크기보다 너무 크다시단다.</figcaption>
</figure>

웹 성능 최적화에서 이미지는 분명 중요하다. 단순히 "빨리 가져오는 것"을 넘어, "적절한 크기로", "필요한 순간에" 가져오는 전략이 필수적이다. React의 `fetchPriority` 같은 속성이나 Next.js가 기본으로 제공하는 `<Image>` 태그만 봐도 이 최적화 기술들이 얼마나 고도화되어 있는지 알 수 있다.

하지만 내 블로그는 <b>SSG(Static Site Generator)</b> 방식이다. 마크다운 파일이 여러 라이브러리를 거쳐 <b>순수한 HTML 문자열로 변환</b>되어 뿌려지는 구조다.

```typescript
// id(파일 이름)을 받아서 해당 글의 데이터를 가져오는 함수 (remark 비동기)
export async function getPostData(id: string): Promise<PostData | null> {
    try {
        // ... 파일 읽기 ...
        
        // 마크다운 본문을 HTML로 파싱 (remark)
        const processedContent = await remark()
            // ... 플러그인들 ...
            .process(matterResult.content);

        const htmlContent = processedContent.toString(); // 여기서 순수 문자열이 됨!

        return {
            id,
            htmlContent, // 문자열 덩어리를 리턴
            // ...
        };
    } catch (error) {
        // ...
    }
}
```

이렇게 문자열로 변환된 `htmlContent`를 `dangerouslySetInnerHTML`을 통해 화면에 그리고 있었다. 

문제는 마크다운 파서가 `<img>` 태그를 만들 때, 내가 일일이 `width`와 `height`를 적어주지 않는 이상 <b>크기 정보가 없는 깡통 태그</b>가 생성된다는 점이다.

<figure>
    <img src="/images/img_tag_1.png" alt="개발자 도구로 확인해본 img 태그 모습" />
    <figcaption>width, height 속성이 전혀 없는 순정 img 태그의 모습.</figcaption>
</figure>

그렇다고 지금 와서 100개가 넘는 글들을 전부 열어서 이미지마다 크기를 적어줄 수는 없었다. <b>자동화가 필요했다</b>.

## Next.js의 <Image\> 태그를 쓰고 싶어요

내 블로그는 Next.js 기반이다. Next.js는 일반 `<img>` 태그 대신 사용할 수 있는 강력한 `<Image>` 컴포넌트를 제공한다. 이걸 쓰면 얻을 수 있는 이득은 명확하다.

| 기능 | 설명 | 기대 효과 |
| :--- | :--- | :--- |
| **자동 리사이징** | 요청한 기기의 화면 크기에 맞춰 적절한 크기의 이미지를 생성 (`srcset`) | 모바일에서 4K 원본을 받는 데이터 낭비 방지 |
| **최신 포맷 변환** | JPG/PNG를 더 가벼운 **WebP**나 **AVIF**로 자동 변환 | 이미지 용량 대폭 감소 (LCP 개선) |
| **Lazy Loading** | 뷰포트에 들어올 때까지 이미지 로딩을 지연 | 초기 로딩 속도 향상 및 대역폭 절약 |
| **CLS 방지** | 이미지 로딩 전 영역을 미리 확보 (`width`/`height` 필수) | 레이아웃이 덜컥거리는 현상 방지 |

성능 점수를 깎아먹는 주범인 LCP(Largest Contentful Paint)와 CLS(Cumulative Layout Shift)를 잡으려면 `<Image>` 태그 도입은 필수였다.

## 1단계: 빌드 타임에 너비와 높이 주입하기

`<Image>` 태그를 사용하려면 **반드시 `width`와 `height` 속성이 필요하다.** (비율을 계산해서 공간을 확보해야 하니까)

따라서 마크다운을 HTML로 변환하는 빌드 시점(Build Time)에, 로컬 이미지 파일을 직접 열어서 크기를 잰 다음 `<img>` 태그에 속성으로 박아넣는 작업이 선행되어야 했다.

이를 위해 `image-size` 패키지와 `unist-util-visit`을 사용해서 커스텀 플러그인을 만들었다.

*   `image-size`: 이미지 파일의 버퍼를 읽어 크기(`width`, `height`)를 계산.
*   `visit()`: HTML 트리(AST)를 순회하며 `<img>` 태그만 골라냄.

```typescript
// rehype 플러그인: img 태그에 크기 속성 강제 주입
function rehypeImage() {
    return (tree: any) => {
        visit(tree, 'element', (node: any) => {
            // img 태그이면서 로컬 이미지인 경우만 처리
            if (node.tagName === 'img' && node.properties && typeof node.properties.src === 'string') {
                const src = node.properties.src;
                if (src.startsWith('https')) return; // 외부 이미지는 패스
                
                // 실제 파일 시스템 경로 계산
                const imgPath = path.join(process.cwd(), 'public', src);

                try {
                    // 이미지 파일을 읽어서 크기 계산
                    const buffer = fs.readFileSync(imgPath);
                    const dim = sizeOf(buffer); // image-size 라이브러리

                    // width, height 속성 주입
                    if (dim.height && dim.width) {
                        node.properties.height = dim.height;
                        node.properties.width = dim.width;
                    }
                } catch (err) {
                    console.error('이미지 처리 실패:', src);
                }
            }
        })
    }
}
```

이 함수를 `rehypeRaw` 플러그인 뒤에 배치했다. 이제 마크다운 파이프라인을 통과한 HTML 문자열 속 `<img>` 태그들은 자신의 크기 정보를 가지게 되었다.

<figure>
    <img src="/images/img_tag_2.png" alt="속성이 주입된 img 태그" />
    <figcaption>이제 width와 height 속성이 확실하게 들어가 있다.</figcaption>
</figure>

## 2단계: <img\>를 <Image\>로

이제 재료는 준비됐다. 남은 건 HTML 문자열을 화면에 뿌릴 때, `<img>` 태그를 낚아채서 Next.js의 `<Image>` 컴포넌트로 바꿔치기하는 것이다.

기존의 `dangerouslySetInnerHTML` 방식은 문자열을 통째로 렌더링하기 때문에 태그별 조작이 불가능했다. 그래서 **`html-react-parser`** 라이브러리를 도입했다. 이 라이브러리는 HTML 문자열을 React Node로 변환해 주는데, 이 과정에서 특정 태그를 다른 컴포넌트로 교체(`replace`)할 수 있는 강력한 기능을 제공한다.

```tsx
// components/PostContent.tsx (Server Component)
import parse, { Element } from "html-react-parser";
import Image from "next/image";

export default function PostContent({ htmlContent }: { htmlContent: string }) {
    // 문자열 -> React Node 변환
    const content = parse(htmlContent, {
        replace: (domNode) => {
            // img 태그 발견 시 교체 로직 실행
            if (domNode instanceof Element && domNode.tagName === 'img') {
                const { src, alt, width, height } = domNode.attribs;

                // 로컬 이미지이고 크기 정보가 있다면 <Image>로 변환
                if (src.startsWith('/') && width && height) {
                    return (
                        <span className="relative w-full flex justify-center my-8">
                            <Image 
                                src={src}
                                alt={alt || 'image'}
                                width={parseInt(width, 10)}
                                height={parseInt(height, 10)}
                                className="retro-img h-auto" // Tailwind 커스텀 클래스
                                sizes="(max-width: 768px) 100vw, 700px"
                                priority={false} 
                            />
                        </span>
                    );
                }
            }
        }
    });

    return <div className="markdown-body">{content}</div>;
}
```

이 컴포넌트는 클라이언트 번들 사이즈를 줄이기 위해 <b>서버 컴포넌트(RSC)</b>로 구현했다. 브라우저는 파싱 로직이나 라이브러리 코드 없이, 변환이 완료된 깔끔한 HTML만 받게 된다.

### 적용된 주요 최적화 옵션

이번 리팩토링에서 `<Image>` 태그에 적용한 주요 속성들은 다음과 같다.

| 속성 | 값 (Example) | 역할 및 최적화 포인트 |
| :--- | :--- | :--- |
| **sizes** | `(max-width: 768px) 100vw, 700px` | **가장 중요한 옵션.** 브라우저에게 "모바일이면 화면 꽉 차게, PC면 700px로 보여줄 거야"라고 미리 알려줌. 브라우저는 이에 맞춰 **가장 적절한 용량의 이미지**를 골라서 다운로드함. |
| **priority** | `true` / `false` | LCP 요소(보통 첫 번째 이미지)에는 `true`를 줘서 우선순위를 높이고, 나머지는 `false`로 Lazy Loading을 적용함. |
| **quality** | `75` (기본값) | 이미지 품질을 조절하여 용량을 줄임. (필요시 조정 가능) |
| **placeholder**| `blur` | 이미지가 로드되기 전 흐릿한 미리보기를 보여줘 사용자 경험(UX) 개선. |

## 마무리

이렇게 해서 <b>마크다운 파싱 → 이미지 크기 계산 → HTML 변환 → React 컴포넌트 교체</b>로 이어지는 이미지 최적화 파이프라인을 완성했다.

<figure>
    <img src="/images/img_tag_3.png" alt="수정 후 lighthouse 점수" />
    <figcaption>lcp 점수는 아직도 좀 낮지만, fcp 점수가 대폭 상승했다.</figcaption>
</figure>

LCP 점수가 좀 아쉽지만 결론적으로 Lighthouse 점수 개선은 물론, 사용자가 블로그에 들어왔을 때 이미지가 덜컥거리지 않고 부드럽게 뜨는 쾌적한 경험을 제공할 수 있게 되었다. 100개의 글을 일일이 수정하지 않고 기술적으로 해결해서 더욱 뿌듯하다.