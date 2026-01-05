"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { FaMoon, FaSun } from "react-icons/fa"

export default function ThemeToggle() {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    // useEffect를 사용하는 이유: 서버와 클라이언트 HTML 불일치 방지
    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    return (
        <button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="p-1 md:p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        aria-label="Toggle Dark Mode"
        title="테마 전환"
        >
            {theme === "dark" ? <FaSun className="text-yellow-400" /> : <FaMoon className="text-gray-600" />}
        </button>
    )
}