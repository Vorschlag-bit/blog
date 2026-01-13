---
title: "이미지 로딩 최적화를 해보자 (LCP,FCP 점수 챙기기)"
date: "2026-01-13 21:59:45"
category: "개발"
description: "Lighthouse 대표 지표인 LCP와 FCP를 위한 이미지 렌더링 최적화를 해보자."
---

## 서론: 이거 짜증나네
내 블로그 글의 상세 정보를 Lighthouse를 통해서 성능 검사를 해보면 아래와 같은 <b>이미지 전송 개선</b> 권고가 나왔다.

<figure>
    <img src="/images/lcp_1.png" alt="이미지 파일이 표시된 크기에 비해 크기가 너무 크다는 내용" />
    <figcaption>사진의 기본 크기가 화면에 그려지는 것보다 너무 크단다.</figcaption>
</figure>

화면을 보여줄 때 이미지 렌더링 최적화는 정말 중요하다고 생각한다.

`fetchPriority` 같은 속성과 Next.js가 지원하는 `<Image>` 태그만 봐도 빠르게 가져오는 것도 중요하지만 언제 가져올 것이냐 같은 최적화 방식이 정말 다양하다는 걸 알 수 있다.

내 블로그는 마크다운 파일로 글을 작성하면, 빌드 시점에서 모든 글을 완성되는 <b>SSG(Static Site Generator)</b> 방식이다.

이때 마크다운은 여러 라이브러리를 거쳐서 <b>순수한 문자열</b>로 반환된다.

```typescript
// id(파일 이름)을 받아서 해당 글의 데이터를 가져오는 함수 (remark 비동기)
export async function getPostData(id: string): Promise<PostData | null> {
    try {
        const fullPath = path.join(postsDirectory, `${id}.md`)
        const fileContents = fs.readFileSync(fullPath, 'utf8')

        // 메타 데이터 파싱 (gray-matter)
        const matterResult = matter(fileContents)
        // 마크다운 본문을 HTML로 파싱 (remark)
        const processedContent = await remark()

        const htmlContent = processedContent.toString()

        // console.log(htmlContent)
        const metadata = matterResult.data as any

        const postData: PostData = {
            id,
            htmlContent,
            // ... 
        }

        // 데이터와 HTML 내용을 합쳐서 반환
        return postData
    } catch (error) {
        // ...
    }
}
```

위의 코드처럼 `htmlContent`라는 변수 속에 `tostring()`로 문자열로 보낸다. 그래서 `setDangerouslyInnerHTML` 속성을 통해 escape 문자가 아니라 태그 같은 문자도 그대로 사용하고 있다.

요지는 markdown으로 작성한 `<img>` 태그가 그래도 문자열로 반환되는 구조다 보니까
내가 markdown 파일에서 `<img>` 태그에 스타일 속성으로 높이와 폭을 일일히 지정하지 않는 한, 기본 크기로 된다는 것이다.

<figure>
    <img src="/images/img_tag_1.png" alt="개발자 도구로 확인해본 img 태그 모습" />
    <figcaption>크기 속성은 전혀 없는 걸 볼 수 있다.</figcaption>
</figure>

그렇다고 지금와서 100개 넘는 글의 `<img>` 태그들을 다 수정할 수는 없었다. 글 하나에 하나의 이미지만 있는 것도 당연히 아니니깐.

## <\Image> 태그를 쓰고 싶어요
내 블로그는 Next.js 기반 웹 페이지이다. Next.js에는 기본 `<img>` 태그 대신에
자체적으로 제공하는 `<Image>`라는 태그가 존재한다. 

`<Image>` 태그가 수행하는 기능은 아래와 같다.

1. <b>자동 리사이징</b>: 원본을 요청한 기기 화면 크기에 맞춰 같은 사진을 여러 장 생성해둠. (<code>srcset</code>)
2. <b>포맷 변경</b>: JPG/PNG를 더 가벼운 <b>Webp</b>나 <b>AVIF</b>로 변경해줌.
3. <b>Lazy Loading</b>: 스크롤이 이미지에 도달할 때 다운로드를 시작함.

위의 기능만 보아도 Next.js 프로젝트라면 반드시 써야 한다는 걸 알 수 있다.

현재 나는 이러한 기능을 못 쓰고 있으니 어떻게든 `<Image>` 태그를 적용할 방법을 찾아야 했었다.

## 결국 너비와 높이가 필요하다
빌드 시점에서 rehype으로 데이터를 가공할 때 `<img>` 태그만 찾아서 `<Image>` 태그로 바꾸는 함수를 구현해야 했으나, 그보다 먼저 해야할 것은 `<img>` 태그마다 별도의 너비와 높이 속성을 지정해줘야 했었다.

`<Image>` 태그는 너비와 높이 속성이 없으면 동작하지 않기 때문이다. 없다면 부모 태그의 속성에서 찾지만 그건 말도 안 되기 때문에 이미지별 고유 너비와 높이를 지정해줘야 했었다.

<figure>
    <img src="/images/img_tag_2.png" alt="개발자 도구로 확인해본 img 태그 모습" />
    <figcaption>크기 속성이 확실히 있는 걸 볼 수 있다.</figcaption>
</figure>