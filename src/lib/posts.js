import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import exp from 'constants';

// 수학 공식 이쁘게 표현하기 위한 라이브러리 import
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

// code 하이라이트를 위해 새로운 라이브러리 import
import remarkRehype from 'remark-rehype';
import rehypeHighlight from 'rehype-highlight';
import rehypeStringify from 'rehype-stringify';

import rehypeRaw from 'rehype-raw';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import rehypeExternalLinks from 'rehype-external-links';
import { start } from 'repl';
import { log } from 'console';

// posts 폴더의 위치를 알아내는 코드
// process.cwd()는 현재 프로젝트의 루트 경로 의미
const postsDirectory = path.join(process.cwd(), 'posts')

export function getSortedPostsData() {
    // 1. posts 폴더에 있는 파일 이름들을 가져옴 (['first-post.md, ...])
    const fileNames = fs.readdirSync(postsDirectory)
    // 2. 파일들을 하나씩 가공(map)
    const allPostsData = fileNames.map((fileName) => {
        // '.md' 확장자 제거 후 id로 사용 (ex: 'first-post')
        const id = fileName.replace(/\.md$/, '')
        // 파일 전체 경로 만들기
        const fullPath = path.join(postsDirectory, fileName)
        // 파일 내용 읽기
        const fileContent = fs.readFileSync(fullPath, 'utf8')
        // gray-matter 사용해서 메타데이터(title, date...) 파싱
        const matterResult = matter(fileContent)

        // id와 metadata 합쳐서 반환
        return {
            id,
            ...matterResult.data,
            category: matterResult.data.category || "기타", // 카테고리가 없으면 '기타'
        }
    })

    // 3. 날짜순으로 정렬해서 return (최신글)
    return allPostsData.sort((a,b) => {
        if (a.date < b.date) return 1
        else return -1
    })
}

// id(파일 이름)을 받아서 해당 글의 데이터를 가져오는 함수 (remark 비동기)
export async function getPostData(id) {
    const fullPath = path.join(postsDirectory, `${id}.md`)
    const fileContents = fs.readFileSync(fullPath, 'utf8')

    // 메타 데이터 파싱 (gray-matter)
    const matterResult = matter(fileContents)
    // 마크다운 본문을 HTML로 파싱 (remark)
    const processedContent = await remark()
    .use(remarkMath)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true }) // md -> HTML로 변경
    .use(rehypeRaw)
    .use(rehypeExternalLinks, {
        target: '_blank',
        rel: ['noopener', 'noreferrer'],
    })
    .use(rehypeSlug) // HTML 변환 시 id 추가
    .use(rehypeKatex)
    .use(rehypeHighlight) // 코드 하이라이팅 적용
    .use(rehypeStringify) // HTML 문자열로 변경
    .process(matterResult.content)

    const htmlContent = processedContent.toString()

    // console.log(htmlContent)

    // 데이터와 HTML 내용을 합쳐서 반환
    return {
        id,
        htmlContent,
        ...matterResult.data,
    }
}

export function getPostsByCategory(category) {
    const allPosts = getSortedPostsData()
    // filter 함수로 조건에 맞는 것만 남기기
    return allPosts.filter((post) => post.category === category)
}

// 왼쪽 사이드 바 카테고리 리스트를 만들기 위한 카테고리 추출 함수
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

// 모두 보기 화면에서 사용할 페이징 로직
export function getPaginatedPosts(page = 1, limit = 10) {    
    // 1. 모든 글 가져오기 (기존 함수 활용)
    const allPosts = getSortedPostsData()
    
    // 2. 모든 글 개수
    const totalCount = allPosts.length

    // 3. Paging 계산 로직 (10개씩 보여주되, 41개면 5페이지이므로 올림처리)
    const totalPages = Math.ceil(totalCount / limit)

    // 4. 현재 페이지가 범위를 벗어나지 않도록 보정
    const currentPage = Math.max(1,Math.min(page,totalPages))

    // 5. 배열 자르기
    const startIdx = (currentPage - 1) * limit
    const endIdx = startIdx + limit
    

    // slice를 통해서 원본 배열의 범위만큼 복사해서 가져오기
    const paginatedPosts = allPosts.slice(startIdx, endIdx)
    

    // 6. Java Page 객체처럼 return
    return {
        posts: paginatedPosts,                  // 현재 페이지 글 목록(content)
        currentPage,                            // 현재 페이지 번호
        totalPages,                             // 전체 페이지 수
        totalCount,                             // 전체 글 수
        hasNext: currentPage < totalPages,      // 다음 페이지 존재 여부
        hasPrev: currentPage > 1,               // 이전 페이지 존재 여부
    }
}

// 카테고리 분류 화면에서 사용할 페이징 로직
export function getPaginatedCategories(page = 1, limit = 10, category ="기타") {
    // 1. queryParams로 받은 category로 해당 카테고리 글만 추출
    const allCategoriesPosts = getPostsByCategory(category);

    // 2. 해당 카테고리 글 총 개수
    const totalCount = allCategoriesPosts.length;

    // 3. 전체 페이지 수
    const totalPages = Math.ceil(totalCount / limit);

    // 4. 현재 페이지
    const curPage = Math.max(1,Math.min(totalPages,page));

    // 5. 페이지 인덱스 계산
    const startIdx = (curPage - 1) * limit;
    const endIdx = startIdx + limit;

    // 6. 슬라이싱된 배열
    const paginatedCategories = allCategoriesPosts.slice(startIdx,endIdx);

    return {
        posts: paginatedCategories,
        curPage,
        totalPages,
        totalCount,
        hasNext: curPage < totalPages,
        hasPrev: curPage > 1,
    }
}

// 상세 조회에서 사용할 이전/이후 포스팅 nav 로직
export async function getPreNextPost(currentId) {
    const allPosts = getSortedPostsData()

    // 현재 글 idx 찾기
    const idx = allPosts.findIndex((post) => post.id === currentId)

    // 예외처리
    if (idx === -1) return { prev: null, next: null }

    // idx - 1 == 더 최신 글 -> Next
    // idx + 1 == 더 이전 글 -> Prev
    const next = idx - 1 >= 0 ? allPosts[idx - 1] : null;
    const prev = idx + 1 < allPosts.length ? allPosts[idx + 1] : null;

    return {
        prev: prev,     // 이전 글
        next: next,     // 이후 글
    }
}