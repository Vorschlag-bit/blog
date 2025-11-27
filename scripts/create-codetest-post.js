const { randomInt } = require('crypto')
const fs = require('fs')
const path = require('path')

const date = new Date().toISOString().slice(0,19).replace('T'," ")

const title = process.argv[2] || `new-post-${randomInt}`

const slug = title.toLowerCase().replace(/\s+/g, '_')
const fileName = `${slug}.md`

const content = `---
title: "백준 ${title}번 (python)"
date: "${date}"
category: "코테"
description: "python으로 풀어보는 ${title}"
---

## 코딩 테스트 풀이

!["문제사진"](/images/.png)
glink

백준 ${title} 문제 풀이에 대한 해설.

`

const filePath = path.join(process.cwd(), 'posts', fileName)

if (fs.existsSync(filePath)) {
    console.error('❌ 이미 같은 이름의 파일이 존재합니다!')
    process.exit(1)
}

fs.writeFileSync(filePath, content)
console.log(`✅ 성공! posts/${fileName} 파일이 생성되었습니다.`);