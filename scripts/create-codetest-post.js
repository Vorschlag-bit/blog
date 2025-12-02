const { randomInt } = require('crypto')
const fs = require('fs')
const path = require('path')

const date = new Date().toISOString().slice(0,19).replace('T'," ")

const title = process.argv[2] || `new-post-${randomInt}`

const slug = title.toLowerCase().replace(/\s+/g, '_')
const fileName = `${slug}.md`

const pNum = slug.split("_")[1]

const content = `---
title: "백준 ${pNum}번 (python)"
date: "${date}"
category: "코테"
description: "python으로 풀어보는 백준 ${pNum}"
---

## 코딩 테스트 풀이

!["문제사진"](/images/${pNum}.png)
<a href="https://www.acmicpc.net/problem/${pNum}" style="color: #2f9e44; text-decoration: none;">
  문제링크
</a>

백준 ${pNum}번 문제 풀이에 대한 해설.

`

const filePath = path.join(process.cwd(), 'posts', fileName)

if (fs.existsSync(filePath)) {
    console.error('❌ 이미 같은 이름의 파일이 존재합니다!')
    process.exit(1)
}

fs.writeFileSync(filePath, content)
console.log(`✅ 성공! posts/${fileName} 파일이 생성되었습니다.`);