// scrips/create-post.js
const { randomInt } = require('crypto')
const fs = require('fs')
const path = require('path')

// 1. 오늘 날짜 구하기 (YYYY-mm-dd)
const date = new Date().toISOString().slice(0,19).replace('T'," ")
// console.log(date)

// 2. 실행할 때 입력한 제목 가져오기 (없으면 'new-post')
const title = process.argv[2] || `new-post${randomInt}`

// 3. 파일 이름 만들기 (띄어쓰기는 하이픈으로 변경)
const slug = title.toLowerCase().replace(/\s+/g, '-')
const fileName = `${slug}.md`

// 4. 파일 내용 템플릿
const content = `---
title: "${title}"
date: "${date}"
description: ""
---

## 여기에 내용을 입력하세요
`

// 5. posts 폴더에 파일 생성
const filePath = path.join(process.cwd(), 'posts', fileName)

if (fs.existsSync(filePath)) {
    console.error('❌ 이미 같은 이름의 파일이 존재합니다!')
    process.exit(1)
}

fs.writeFileSync(filePath, content)
console.log(`✅ 성공! posts/${fileName} 파일이 생성되었습니다.`);