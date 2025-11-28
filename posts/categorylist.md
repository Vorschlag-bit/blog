---
title: "카테고리 리스트 만들기"
date: "2025-11-28 10:57:38"
category: "개발"
description: "왼쪽 사이드에 둘 카테고리 리스트를 구현해보자"
---

## 카테고리 리스트를 만들어보자

블로그의 메인 페이지는 대강 구조가 갖추어졌으니 메인 페이지만 덩그러니 있는 페이지를 좀 더 풍성하게 만들고,  
사용자로 하여금 쉽게 내 블로그 글 카테고리들을 모아서 볼 수 있게끔 **카테고리 리스트**를 만들기로 결심했다.  
일반적인 서버 컴포넌트이기도 하고 어려운 기능도 아니라서 가벼운 마음으로 설계 및 구현한 과정에 대해서 다뤄본다.

### 설계 및 구현
나는 **markdown**으로 작성된 블로그글을 `remark`, `rehype` 등 다양한 패키지들을 통해 HTML로 가공한 후 보여준다. 

이 함수를 위해서 모든 블로그글을 가져오는 함수인 `getSortedPostsData`가 존재하는데 함수명대로 모든 블로그글을 
가져와서 작성 날짜 내림차순으로 제공하는 함수이다.  

이 함수를 그대로 활용하고 `map` 함수를 통해서 **category** 필드만 
빼내서 사용하고 중복을 방지하기 위해 **list -> set -> list**으로 return하면 될 거 같다고 생각했다.  

물론 return 전에 카테고리들을 영어 > 한글 우선순위로 정렬된 상태로 제공하고 싶어서 오름차순 정렬을 적용했고, 직접 구현하는 것도
좋지만 다중 언어(먼 이야기지만)를 고려해서 javascript가 지원하는 `localeCompare`를 사용해서 정렬했다.

#### 초기 getAllCategories 함수 코드
```javascript
// 왼쪽 사이드 바 카테고리 리스트를 만들기 위한 카테고리 추출 함수
export function getAllCategories() {
    const allPosts = getSortedPostsData()
    const allCategories = allPosts.map(({ category }) => category)
    const setCategory = new Set(allCategories)

    // set을 다시 array return, [...Set]은 set의 요소를 펼쳐서 다시 배열로 만드는 문법
    return [...setCategory].sort((a,b) => a.localeCompare(b))
}
```

이후에는 `CategoryList.js` 컴포넌트를 만들고, `getAllCategories`로 받은 리스트를  
`<ul>`, `<li>` 태그를 활용해 차례대로 뿌려줬다.  
물론 카테고리를 클릭하면 기존에 만들어둔 카테고리 모음집 화면으로 이동하도록 `map` 함수 내부에
`<Link>` 태그를 적용해서 하이퍼 링크를 달아주었다.

#### CategoryList 컴포넌트 코드
```javascript
import { getAllCategories } from "@/lib/posts";
import Link from "next/link";

export default function CategoryList() {
    const sortedCategories = getAllCategories()
    return (
        <aside> {/** 가장 바깥의 테두리 박스 */}
            <div className="">
                <h3 className="">
                    카테고리 목록
                </h3>
                <ul>
                    {sortedCategories.map((category) => (
                        <li key={category}>
                            <Link href={`/categories/${category}`}>
                                {category}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </aside>
    )
}
```

#### 임시 결과 화면
!["아주_cute"](/images/temp_sidebar.png)
아주 큐트하다.  
이렇게 만들고 나니 다른 블로그들은 태그나 카테고리 리스트들을 보여줄 때 옆에  
해당 태그(카테고리)의 개수도 함께 보여준다는 걸 알게 되었다. 따라서 `getAllCategories` 로직을 좀 바꾸기로 했다.  
먼저 `dict`을 사용해서 key = category, value = 개수로 등록을 하고 `Object.entries()`를 통해서 순회하여 튜플로 저장하고 정렬을 따로 반영한 후 리스트에 담을 때 전체 개수를 0번 인덱스에 담고 1부터 {카테고리, 개수} 객체를 순회하면 될 거 같았다.  

#### 수정된 getAllCategories 함수 코드
```javascript
export function getAllCategories() {
    const allPosts = getSortedPostsData()
    
    // 1. 개수 세기 (reduce 함수 활용)
    const countMap = allPosts.reduce((acc, post) => {
        // category 없으면 '기타'로
        const category = post.category || "기타"

        // dict에 키가 있으면 누적, 없으면 1로 초기화
        acc[category] = (acc[category] || 0) + 1
        return acc
    }, {})

    // 2. 딕셔너리를 배열로 반환하고 정렬하기(Object.entries)
    // Object.entries는 [['개발',2],['일상',1]] 형태
    const sortedCategories = Object.entries(countMap)
        .map(([category, count]) => ({ category, count })) // 객체로 변환
        .sort((a,b) => a.category.localeCompare(b.category)) // 오름차순 정렬
    
    // 3. '전체(All)` 카테고리 맨 앞에 붙이기
    const totalCnt = allPosts.length
    const allCategory = { category: 'All', count: totalCnt }

    // 스프레드 연산자로 합쳐서 리턴
    return [allCategory, ...sortedCategories]
}
```

#### 수정된 CategoryList
```javascript
export default function CategoryList() {
    const sortedCategories = getAllCategories()
    return (
        <aside> {/** 가장 바깥의 테두리 박스 */}
            <div className="">
                <h3 className="">
                    카테고리 목록
                </h3>
                <ul>
                    {sortedCategories.map(({category, count}) => (
                        <li key={category}>
                            <Link 
                                // All이면 main으로 아니면 카테고리 분류 페이지로
                                href={category === "All" ? "/" : `/categories/${category}`}
                            >
                                <span>{category}</span>
                                <span>{`(${count})`}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </aside>
    )
}
```

수정 후
!["after_changed_logics"](/images/list_temp2.png)