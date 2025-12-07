"use client"

import { createContext, useContext, useState, useEffect } from "react"
// import { usePathname, useSearchParams } from "next/navigation"

const LoadingContext = createContext()

export function LoadingProvider({ children }) {
    const [isLoading, setIsLoading] = useState(false)
    // const pathName = usePathname()
    // const searchParams = useSearchParams()

    // 더이상 path 변경으로 로딩을 감지하지 않음, 대신 상세 페이지의 모든 img 태그 다운로드를 체크하도록 수정
    // useEffect(() => {
    //     setIsLoading(false)
    // }, [pathName, searchParams])

    return (
        <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
            {children}
        </LoadingContext.Provider>
    )
}

export function useLoading() {
    return useContext(LoadingContext)
}