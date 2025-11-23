---
title: "커스텀 404-page 만들기"
date: "2025-11-23 13:41:20"
category: "개발"
description: "나만의 404 페이지를 만들어보자"
---

## 404페이지 만들어보기
404페이지는 사용자가 요청한 endPoint가 유효하지 않을 경우 return 되는 페이지이다.\
이전 프로젝트에서도 언젠가 만들어봐야지하고 생각만 하고 있다가 항상 만들지 못 했었는데 \
개인 블로그에선 Next.js의 도움을 받아 쉽고 빠르게 구현할 수 있어서 해보기로 결심했다.

Next.js는 `/src/app` 디렉토리에 `not-found.js`라는 파일을 만들기만 하면 알아서 404page로 등록해준다.\
따라서 내가 만들 건 그냥 한 페이지 html 디자인 정도가 전부였다.

```javascript
/** /src/app/not-found.js */
import Link from "next/link";

export default function Notfound() {
    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-10 font-[Galmuri11]">
            <h1 className="text-9xl text-blue-600 mb-4">404</h1>
            <h2 className="text-2xl mb-8">FILE_NOT_FOUND_EXCEPTION</h2>
            <p className="mb-8 text-gray-500">
                찾으시려는 페이지가 삭제되었거나 주소가 유효하지 않습니다.<br/>
                시스템 관리자에게 문의하세요.
            </p>
            <Link href="/" className="bg-blue-600 text-white px-6 py-3 shadow-pixel cursor-pointer hover:bg-blue-800">
                시스템 초기화(홈으로)
            </Link>
        </div>
    );
}
```

### 결과
!["404_page"](/images/404_page.png)
쉽고 편하게 404 완성!\
의도치 않지만 아직 완성하지 않은 페이지인 `About`을 통해서 404를 쉽게 테스트할 수 있었다.

오늘도 404 페이지를 구상하면서 HTML 지식들을 쌓을 수 있었다. 여전히 css가 정말 어렵지만 해보다보면\
거시적인? css 레이아웃을 보는 눈을 가질 수 있을 거라고 생각한다.

다음 개발은 **사이드 항목**을 만들거나 **커스텀 로딩창**을 만들고 싶다.\
사이드 항목은 너무 광범위한 주제기 때문에 아마도 꾸준히 개발되는 기능으로 되지 않을까?