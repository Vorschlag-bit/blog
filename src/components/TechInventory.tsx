"use client"

import { useState } from "react"
import Image from "next/image"

const TECH_STACK = [
    { name: "Javascript", icon: "/icons/js.svg", tags: ["Language", "Frontend"] },
    { name: "Typescript", icon: "/icons/typescript.svg", tags: ["Language", "Frontend"] },
    { name: "Java", icon: "/icons/java.svg", tags: ["Language", "Backend"] },
    { name: "Kotlin", icon: "/icons/kotlin.svg", tags: ["Language", "Backend"] },
    { name: "Python", icon: "/icons/kotlin.svg", tags: ["Language"] },
    { name: "React", icon: "/icons/react.svg", tags: ["Framework", "Froentend"] },
    { name: "Next.js", icon: "/icons/nextjs2.svg", tags: ["Framework", "Froentend"] },
    { name: "TailwindCSS", icon: "/icons/tailwindcss.svg", tags: ["Framework", "Froentend"] },
    { name: "Spring", icon: "/icons/spring.svg", tags: ["Framework", "Backend"] },
    { name: "Redis", icon: "/icons/redis.svg", tags: ["Database"] },
    { name: "MariaDB", icon: "/icons/mariadb.svg", tags: ["Database"] },
    { name: "Postgresql", icon: "/icons/postgresql.svg", tags: ["Database"] },
    { name: "Git", icon: "/icons/git.svg", tags: ["Tools & Deployment"] },
    { name: "Github", icon: "/icons/github.svg", tags: ["Tools & Deployment"] },
    { name: "GithubActions", icon: "/icons/github.svg", tags: ["Tools & Deployment"] },
    { name: "VercelDeployment", icon: "/icons/vercel.svg", tags: ["Tools & Deployment"] },
]

const CATEGORIES = ["ALL", "Frontend", "Backend", "Database", "Tools & Deployment"]

export default function TechInventory() {
    const [activeCategory, setActiveCategory] = useState("ALL");

    return (
        <div className="flex flex-col gap-4">
            {/* 상단 필터들 */}
            <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((category) => (
                    <button
                        key={category}
                        onClick={() => setActiveCategory(category)}
                        className={`px-3 py-1 text-sm font-bold border-2 border transiton-all
                            ${activeCategory === category ? "bg-gray-600 text-white" : "bg-white text-black hover:bg-gray-200"}
                            `}
                    >
                        {category}
                    </button>
                ))}
            </div>
            {/* 기술 스택 리스트 (Flex Wrap 레이아웃) */}
            <div className="flex flex-wrap gap-3">
                {TECH_STACK.map((tech) => {
                    const isActive = activeCategory === "ALL" || tech.tags.includes(activeCategory)

                    return (
                        <div 
                            key={tech.name}
                            className={`flex items-center gap-2 border px-3 py-2 bg-white transiton-all duration-500 ease-in-out
                                ${isActive ? "opactity-100 blur-0 scale-100 grayscale-0" : "opactity-30 blur-[2px] scale-95 grayscale"}
                                `}
                        >
                            {/* 아이콘 */}
                            <div className="relative w-7 h-7">
                                <Image 
                                    fill
                                    src={tech.icon}
                                    alt={`${tech.name} icon`}
                                    className="object-contain"
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