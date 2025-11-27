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
    .use(rehypeExternalLinks, {
        target: '_blank',
        rel: ['noopener', 'noreferrer'],
    })
    .use(rehypeSlug) // HTML 변환 시 id 추가
    .use(rehypeKatex)
    .use(rehypeRaw)
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