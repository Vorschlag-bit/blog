"use client";

import { useEffect, useState, useRef } from "react";

export default function PostRemoteControl() {
    // 목차 리스트 상태관리
    const [headings, setHeadings] = useState([])
    // 현재 보고 있는 헤딩 ID
    const [activeId, setActiveId] = useState("")
    // Observer를 저장할 ref (cleanup)
    const observerRef = useRef(null)

    // 1. 헤딩 태그 id 찾기 
    useEffect(() => {
        // 본문이 들어가있는 태그를 선택 (page.js의 prose 클래스 가진 div) (Tailwind Typography 클래스)
        const contentArea = document.querySelector(".prose")
        // console.log(`디버깅 용 콘솔, 찾은 영역: ${contentArea}`)

        if (!contentArea) return;

        // h1,h2,h3 태그 수집
        const elements = contentArea.querySelectorAll("h2, h3")
        
        // console.log(`찾은 요소들 개수: ${elements.length}`)
        // console.log(`찾은 요소: ${Array.from(elements)}`)

        const headingData = []

        elements.forEach((el, index) => {
            headingData.push({
                id: el.id,
                text: el.innerText,
                // "H2", "H3"
                level: el.tagName,
                element: el,
            })
        }
        )

        setHeadings(headingData)

        // 2. IntersectionObserver로 현재 위치 감지 로직 구현
        const handleObserver = (entries) => {
            entries.forEach((entry) => {
                // 헤딩이 화면의 특정 영역에 들어오면 activeId 변경
                if (entry.isIntersecting) {
                    setActiveId(entry.target.id)
                }
            })
        }

        // rootMargin: '-10% 0px -80% 0px'
        // -> 화면 상단 10 - 20 % 사이 좁은 구역을 지나갈 때만 감지
        observerRef.current = new IntersectionObserver(handleObserver, {
            rootMargin: "-10% 0px -80% 0px",
            threshold: 0,
        })

        headingData.forEach((heading) => {
            observerRef.current.observe(heading.element)
        })

        // CleanUp: 컴포넌트가 사라지면 감시 중단
        return () => {
            if (observerRef.current) observerRef.current.disconnect()
        }
    }, []);

    // 스크롤 기능들
    // 3. 맨 위로 가기 함수
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" })
    }

    // 4. 맨 아래로 가기 함수
    const scrollToBottom = () => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" })
    }

    // 5. 목차 클릭 시 이동 함수
    const handleLinkClick = (e, id) => {
        // 기본 앵커 동작 방지
        e.preventDefault()
        const element = document.getElementById(id)
        if (element) {
            // 헤더 높이만큼 빼고 스크롤시켜서 제목 안 가리게 하기
            const headerOffSet = 100
            const elementPosition = element.getBoundingClientRect().top
            const offsetPosition = elementPosition + window.pageYOffset - headerOffSet

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth",
            })

            // 클릭 시 강제로 active 상태 변경
            setActiveId(id)
        }
    }

    // 목차가 없다면 렌더링 x
    if (headings.length === 0) return null

    return (
        // 레이아웃: xl 화면(1280px) 이상에서만 보임
        // 메인 콘텐츠 옆에 붙이기 위해 left 계산식 사용
        <aside className="hidden xl:block fixed top-32 right-8 w-64 p-4 font-[Galmuri11] z-40">
            {/** 1. 목차 박스 (레트로 스타일) */}
            <div className="border-2 border-black dark:border-gray-500 bg-white dark:bg-gray-900 
            shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] mb-4 p-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
                <div className="flex items-center gap-2 mb-4 text-base font-bold border-b-2 border-dashed border-gray-300 pb-2">
                    <svg className="w-6 h-6" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"> <path d="M18 2H6v2h12v16h-2v-2h-2v-2h-4v2H8v2H6V2H4v20h4v-2h2v-2h4v2h2v2h4V2h-2z" fill="currentColor"/></svg>
                    목차
                </div>
                <ul className="space-y-2">
                    {headings.map((heading) => (
                        <li key={heading.id}
                            className={`transition-color ${heading.level === "H3" ? "ml-4 text-xs" : "text-sm"}`}
                        >
                            <a href={`#${heading.id}`}
                                onClick={(e) => handleLinkClick(e,heading.id)}
                                className={`flex items-center block truncate cursor-pointer hover:underline ${
                                    activeId === heading.id
                                    ? "text-blue-600 font-bold dark:text-blue-400"
                                    : "text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                                }`}
                            >
                                {activeId === heading.id && <span className="mr-1">
                                    <svg className="w-4 h-4" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"> <path d="M8 5v2h2V5H8zm4 4V7h-2v2h2zm2 2V9h-2v2h2zm0 2h2v-2h-2v2zm-2 2v-2h2v2h-2zm0 0h-2v2h2v-2zm-4 4v-2h2v2H8z" fill="currentColor"/> </svg>
                                    </span>}
                                {heading.text}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>

            {/** 2. 리모컨 버튼 (맨위/맨아래) */}
            <div className="flex justify-center gap-2">
                <button 
                    onClick={scrollToTop}
                    className="flex items-center bg-gray-100 dark:bg-gray-800 border-2 border-black dark:border-gray-500 p-2 hover:bg-gray-300 transition shadow-pixel active:transition-y-1 active:shadow-none"
                aria-label="맨 위로">
                    <svg className="w-5 h-5" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"> <path d="M4 6h16V4H4v2zm7 14h2v-8h2v2h2v-2h-2v-2h-2V8h-2v2H9v2H7v2h2v-2h2v8z" fill="currentColor"/> </svg>
                </button>
                <button 
                    onClick={scrollToBottom}
                    className="flex items-center bg-gray-100 dark:bg-gray-800 border-2 border-black dark:border-gray-500 p-2 hover:bg-gray-300 transition shadow-pixel active:transition-y-1 active:shadow-none"
                aria-label="맨 아래로">
                    <svg className="w-5 h-5" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"> <path d="M11 4h2v8h2v2h-2v2h-2v-2H9v-2h2V4zm-2 8H7v-2h2v2zm6 0v-2h2v2h-2zM4 18h16v2H4v-2z" fill="currentColor"/> </svg>
                </button>
            </div>
        </aside>
    )
}