"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { usePathname, useSearchParams } from "next/navigation"

const LoadingContext = createContext()

export function LoadingProvider({ children }) {
    const [isLoading, setIsLoading] = useState(false)
    const pathName = usePathname()
    const searchParams = useSearchParams()

    // 페이지 경로가 바뀌면(이동 완료 시) 로딩 끄기
    useEffect(() => {
        setIsLoading(false)
    }, [pathName, searchParams])

    return (
        <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
            {children}
        </LoadingContext.Provider>
    )
}

export function useLoading() {
    return useContext(LoadingContext)
}