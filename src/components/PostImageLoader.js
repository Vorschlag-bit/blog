"use client"
import { useRef, useState, useEffect } from "react"
import { useLoading } from "@/context/LoadingContext"

export default function PostImageLoader({ children }) {
    const { setIsLoading } = useLoading()
    const contentRef = useRef(null)
    const [isReady, setIsReady] = useState(false)

    useEffect(() => {
        if (!contentRef.current) return 

        // 1. 분문 안의 <img> 찾기
        const images = contentRef.current.querySelectorAll('img')

        // 이미지가 하나도 없다면 바로 return
        if (images.length === 0) {
            setIsLoading(false)
            setIsReady(true)
            return
        }

        let loaderCount = 0
        const total = images.length

        // 2. 이미지 로드 완료 체크
        const checkAllLoaded = () => {
            loaderCount++
            if (loaderCount >= total) {
                // 모든 이미지 업로드 완료
                setIsLoading(false)
                setIsReady(true)
            }
        }

        // 3. 각 이미지에 리스너 부착
        images.forEach((img) => {
            // 이미 캐시된 거면 pass
            if (img.complete) {
                checkAllLoaded()
            } else {
                // error, load 모두 등록
                img.addEventListener('load', checkAllLoaded)
                img.addEventListener('error', checkAllLoaded)
            }
        });

        // 4. 일정 시간 초과 시, 화면 강제로 나오도록 하기
        const timeOutId = setTimeout(() => {
            setIsLoading(false)
            setIsReady(true)
        }, 3000) // 3초

        return () => clearTimeout(timeOutId)
    }, [setIsLoading])

    return (
        // isReady가 false면 opacity = 0, 아니면 100
        <div ref={contentRef} className={`transition-opacity duration-500 ${isReady ? 'opacity-100' : 'opacity-0'}`}>
            {children}
        </div>
    )
}