"use client";
import { useEffect, useState, useRef } from "react";
import ScrollProgress from "./ScrollProgress";
import { setTimeout } from "timers";

type HeadingTag = "H2" | "H3" | "H4" | "H5"

interface HeaderInfo {
    id: string;
    text: string;
    level: HeadingTag;
    element: Element;
}

const indentStyles: Record<HeadingTag, string> = {
    H2: "text-sm font-bold",
    H3: "ml-4 text-xs font-medium",
    H4: "ml-8 text-[11px] text-gray-500",
    H5: "ml-12 text-[9px] text-gray-400"
}

export default function PostRemoteControl() {
    // 목차 리스트 상태관리
    const [headings, setHeadings] = useState<HeaderInfo[]>([])
    // 현재 보고 있는 헤딩 ID
    const [activeId, setActiveId] = useState("")
    // Observer를 저장할 ref (cleanup)
    const observerRef = useRef<IntersectionObserver | null>(null)
    // isClosed 추가 (버튼으로 닫기)
    const [isClosed, setIsClosed] = useState(false)

    const handleOnClick = () => setIsClosed((prev) => !prev)

    // 1. 헤딩 태그 id 찾기 
    useEffect(() => {
        // 본문이 들어가있는 태그를 선택 (page.js의 prose 클래스 가진 div) (Tailwind Typography 클래스)
        const contentArea = document.querySelector(".prose")
        // console.log(`디버깅 용 콘솔, 찾은 영역: ${contentArea}`)

        if (!contentArea) return;

        // h1,h2,h3 태그 수집
        const elements = contentArea.querySelectorAll<HTMLElement>("h2, h3, h4, h5")
        
        // console.log(`찾은 요소들 개수: ${elements.length}`)
        // console.log(`찾은 요소: ${Array.from(elements)}`)

        const headingData: HeaderInfo[] = []

        elements.forEach((el,_) => {
            const tagName = el.tagName as HeadingTag
            if (indentStyles[tagName]) {
                    headingData.push({
                    id: el.id,
                    text: el.innerText,
                    // "H2", "H3"
                    level: tagName,
                    element: el,
                })
            }
        }
        )

        // setTimeOut으로 감싸서 비동기 처리
        setTimeout(() => {
            setHeadings(headingData)
        },0)

        // 2. IntersectionObserver로 현재 위치 감지 로직 구현
        const handleObserver = (entries: IntersectionObserverEntry[]) => {
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
            observerRef.current?.observe(heading.element)
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
        // footer 위치로 이동
        const footer = document.querySelector('footer');

        if (footer) {
            footer.scrollIntoView({ behavior: "smooth", block: "end" });
        } else {
            window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" })
        }
    }

    // 5. 목차 클릭 시 이동 함수
    const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
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

    // const ToggleButton = () => (
    // <button 
    //     onClick={handleOnClick}
    //     // 열린 상태(닫힌 버튼) : 닫힌 상태(열림 버튼)
    //     className={!isClosed ? "border border-red-500 dark:border-red-400 hover:opacity-70 transition-opacity" : "border-0 hover:opacity transition-opacity"}
    //     aria-label={!isClosed ? "목차 닫기" : "목차 열기"}
    // > 
    //     {!isClosed ? (
    //         // 열린 상태
    //         <svg className="w-6 text-red-400 dark:text-red-300" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"> <path d="M5 5h2v2H5V5zm4 4H7V7h2v2zm2 2H9V9h2v2zm2 0h-2v2H9v2H7v2H5v2h2v-2h2v-2h2v-2h2v2h2v2h2v2h2v-2h-2v-2h-2v-2h-2v-2zm2-2v2h-2V9h2zm2-2v2h-2V7h2zm0 0V5h2v2h-2z" fill="currentColor"/> </svg>
    //     ): (
    //         // 닫힌 상태
    //         <svg className="w-6 border text-green-400 dark:text-green-300" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"> <path d="M5 3h6v2H5v14h14v-6h2v8H3V3h2zm8 0h8v8h-2V7h-2V5h-4V3zm0 8h-2v2H9v2h2v-2h2v-2zm4-4h-2v2h-2v2h2V9h2V7z" fill="currentColor"/> </svg>
    //     )}
    // </button>
    // )

    return (
        // 레이아웃: xl 화면(1024px) 이상에서만 보임
        // 메인 콘텐츠 옆에 붙이기 위해 left 계산식 사용
        <aside className="hidden xl:block absolute top-160 left-full ml-3 h-full z-40">
            <div className="sticky top-10 w-60">
                {/** 1. 목차 박스 (레트로 스타일) */}
                {!isClosed ? (
                    <>
                        <div className="border-2 dark:border-gray-500 bg-white dark:bg-gray-900
                        shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.5)] mb-4 p-3 max-h-[70vh] overflow-y-auto">
                            <div className="flex items-center justify-between mb-4 border-b-2 border-dashed border-gray-300 pb-3"
                                title="목차"
                            >
                                <div className="flex items-center font-bold gap-1">
                                    <svg className="w-6" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"> <path d="M8 2h12v20H4V2h4zm4 8h-2v2H8V4H6v16h12V4h-4v8h-2v-2z" fill="currentColor"/> </svg>
                                    <span>목차</span>
                                </div>
                                <button onClick={handleOnClick} className="border border-red-500 dark:border-red-400 cursor-pointer hover:bg-red-400" title="목차 닫기">
                                    <svg className="w-5 text-red-500 dark:text-red-400 hover:text-white" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"> <path d="M5 5h2v2H5V5zm4 4H7V7h2v2zm2 2H9V9h2v2zm2 0h-2v2H9v2H7v2H5v2h2v-2h2v-2h2v-2h2v2h2v2h2v2h2v-2h-2v-2h-2v-2h-2v-2zm2-2v2h-2V9h2zm2-2v2h-2V7h2zm0 0V5h2v2h-2z" fill="currentColor"/> </svg>
                                </button>
                            </div>
                            {/* 닫히지 않은 경우 (기본) */}
                            <div>
                                <ul className="space-y-2">
                                    {headings.map((heading) => (
                                        <li key={heading.id}
                                            className={`transition-color ${indentStyles[heading.level]}`}
                                        >
                                            <a href={`#${heading.id}`}
                                                onClick={(e) => handleLinkClick(e,heading.id)}
                                                className={`flex items-center block truncate cursor-pointer hover:underline ${
                                                    activeId === heading.id
                                                    ? "text-blue-600 font-bold dark:text-blue-400"
                                                    : "text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                                                }`}
                                                title={`${heading.text}`}
                                            >
                                                {activeId === heading.id && <span className="mr-1">
                                                    <svg className="w-4 h-4" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"> <path d="M8 5v2h2V5H8zm4 4V7h-2v2h2zm2 2V9h-2v2h2zm0 2h2v-2h-2v2zm-2 2v-2h2v2h-2zm0 0h-2v2h2v-2zm-4 4v-2h2v2H8z" fill="currentColor"/> </svg>
                                                    </span>}
                                                {heading.text}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                                <ScrollProgress />
                            </div>
                        </div>
                        {/** 2. 리모컨 버튼 (맨위/맨아래) */}
                        <div className="flex justify-center gap-3">
                            <button
                                onClick={scrollToTop}
                                className="flex items-center border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-500 p-2 hover:bg-gray-200 dark:hover:bg-gray-500 transition shadow-pixel cursor-pointer" title="맨 위로"
                            aria-label="맨 위로">
                                <svg className="w-5 h-5" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"> <path d="M4 6h16V4H4v2zm7 14h2v-8h2v2h2v-2h-2v-2h-2V8h-2v2H9v2H7v2h2v-2h2v8z" fill="currentColor"/> </svg>
                            </button>
                            <button
                                onClick={scrollToBottom}
                                className="flex items-center border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-500 p-2 hover:bg-gray-200 dark:hover:bg-gray-500 transition shadow-pixel cursor-pointer" title="맨 아래로"
                            aria-label="맨 아래로">
                                <svg className="w-5 h-5" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"> <path d="M11 4h2v8h2v2h-2v2h-2v-2H9v-2h2V4zm-2 8H7v-2h2v2zm6 0v-2h2v2h-2zM4 18h16v2H4v-2z" fill="currentColor"/> </svg>
                            </button>
                        </div>
                    </>
                ) : (
                    <div 
                    className="border-2 dark:border-gray-500 bg-white dark:bg-gray-900
                        shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.5)] mb-4 p-3 max-h-[70vh] overflow-y-auto"
                    >
                        <div className="flex items-center justify-between"
                            title="목차">
                            <div className="flex items-center font-bold gap-1">
                                <svg className="w-6" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"> <path d="M8 2h12v20H4V2h4zm4 8h-2v2H8V4H6v16h12V4h-4v8h-2v-2z" fill="currentColor"/> </svg>
                                <span>목차</span>
                            </div>
                            <button onClick={handleOnClick} className="border border-green-500 dark:border-green-400 cursor-pointer hover:bg-green-400" aria-label="목차 열기 버튼" title="목차 열기">
                                <svg className="w-5 text-green-500 hover:text-white dark:text-green-400" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"> <path d="M11 4h2v7h7v2h-7v7h-2v-7H4v-2h7V4z" fill="currentColor"/> </svg>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </aside>
    )
}