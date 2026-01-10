"use client"

import dynamic from "next/dynamic"

// ssr: false 옵션을 줄 경우, 서버에서 랜더링하지 않고, 클라이언트에서만 함
const ThemeToggle = dynamic(() => import('@/components/ThemeToggle'), {
     ssr: false,
    // 로딩 중 UI
    loading: () => <div className="p-1 md:p-4 border" />
})

export default function ThemeContainer() {
    return <ThemeToggle/>
}