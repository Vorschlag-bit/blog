"use client"

import { createContext, useContext, useState,useEffect, Dispatch, SetStateAction } from "react"
import { usePathname, useSearchParams } from "next/navigation"

interface LoadingContextType {
    isLoading: boolean;
    setIsLoading: Dispatch<SetStateAction<boolean>>
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined)

interface LoadingProviderProps {
    children: React.ReactNode;
}

export function LoadingProvider({ children }: LoadingProviderProps) {
    const [isLoading, setIsLoading] = useState(false)
    const pathName = usePathname()
    const searchParams = useSearchParams()

    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false)
        }, 0);
    }, [pathName, searchParams])

    return (
        <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
            {children}
        </LoadingContext.Provider>
    )
}

export function useLoading() {
    const context = useContext(LoadingContext)

    if (!context) {
        throw Error('useLoading must be used within a Loading Provider')
    }

    return context
}