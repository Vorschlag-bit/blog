import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

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
        }
    })

    // 3. 날짜순으로 정렬해서 return (최신글)
    return allPostsData.sort((a,b) => {
        if (a.date < b.date) return 1
        else return -1
    })
}