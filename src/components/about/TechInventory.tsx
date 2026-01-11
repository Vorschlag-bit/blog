"use client"

import { useState,useRef,useEffect } from "react"
import Image from "next/image"
import { Techitem } from "@/types/tech_type"

interface TechInventoryProps {
    techStack: Techitem[];
    categories: string[];
}

export default function TechInventory({ techStack,categories }: TechInventoryProps) {
    const [activeCategory, setActiveCategory] = useState("ALL");
    // Ref - HTMLDivElement
    const filterRef = useRef<HTMLDivElement>(null)

    // 외부 클릭 로직 추가
    useEffect(() => {
        function handleClickOutSide(event: MouseEvent) {
            // ref존재하고, 클릭된 target이 ref에 포함 안 되면 isClicked false로
            if (filterRef.current && !filterRef.current.contains(event.target as Node)) setActiveCategory("ALL")
        }

        document.addEventListener('mousedown', handleClickOutSide)

        return () => document.removeEventListener('mousedown', handleClickOutSide)
    },[])


    return (
        <div className="flex flex-col gap-4">
            {/* 상단 필터들 */}
            <div ref={filterRef} className="flex flex-wrap gap-2">
                {categories.map((category) => (
                    <button
                        key={category}
                        onClick={() => setActiveCategory(category)}
                        className={`px-3 py-1 text-sm font-bold border-2 border transition-all cursor-pointer
                            ${activeCategory === category ? "bg-gray-600 text-white" : "bg-white text-black hover:bg-gray-200"}
                            `}
                    >
                        {category}
                    </button>
                ))}
            </div>
            {/* 기술 스택 리스트 (Flex Wrap 레이아웃) */}
            <div className="flex flex-wrap gap-3">
                {techStack.map((tech) => {
                    const isActive = activeCategory === "ALL" || tech.tags.includes(activeCategory)

                    return (
                        <div 
                            key={tech.name}
                            className={`flex items-center gap-2 border px-3 py-2 bg-white dark:bg-gray-700 transition-all duration-500 ease-in-out
                                ${isActive ? "opacity-100 blur-0 scale-100 grayscale-0" : "opacity-30 blur-[2px] scale-95 grayscale"}
                                `}
                        >
                            {/* 아이콘 */}
                            <div className="relative w-7 h-7">
                                <Image 
                                    fill
                                    src={tech.icon}
                                    alt={`${tech.name} icon`}
                                    priority={true}
                                    fetchPriority="high"
                                    className="object-contain"
                                    sizes="30px"
                                />
                            </div>
                            {/* 기술 이름 */}
                            <span className="font-bold text-sm">{tech.name}</span>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}