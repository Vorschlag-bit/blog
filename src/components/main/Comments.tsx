"use client"

import { useEffect, useRef } from "react"
import { useTheme } from "next-themes"

export default function Comments() {
    const ref = useRef<HTMLElement>(null)
    const { theme } = useTheme() // 다크모드 감지

    // 테마가 바뀌면 Giscus 테마도 함께 바뀌는 로직
    useEffect(() => {
        const giscusTheme = theme === "dark" ? "dark" : "light"

        const script = document.createElement("script")
        script.src = "https://giscus.app/client.js"
        script.setAttribute("data-repo", "Vorschlag-bit/blog")
        script.setAttribute("data-repo-id", "R_kgDOQaC9lg")
        script.setAttribute("data-category", "Q&A")
        script.setAttribute("data-category-id", "DIC_kwDOQaC9ls4CyCpI")
        script.setAttribute("data-mapping","pathname")
        script.setAttribute("data-strict", "0")
        script.setAttribute("data-reactions-enabled", "1")
        script.setAttribute("data-emit-metadata", "0")
        script.setAttribute("data-input-position", "bottom")
        script.setAttribute("data-theme", giscusTheme)
        script.setAttribute("data-lang", "ko")
        script.crossOrigin = "anonymous"
        script.async = true

        // 기존 스크립트가 있을 경우 지우고 다시 실행 (중복 방지)
        if (ref.current) {
            ref.current.innerHTML = ""
            ref.current.appendChild(script)
        }
    }, [theme])

    return <section ref={ref} className="w-full mt-10 pt-10 border-t" />
}