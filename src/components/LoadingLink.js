"use client"
import { useRouter } from "next/navigation"
import { useLoading } from "@/context/LoadingContext"

export default function LoadingLink({ href, children, className, ...props }) {
    const { setIsLoading } = useLoading()
    const router = useRouter()

    const handleClick = (e) => {
        // 1. Next.js의 빠른 이동 막기
        e.preventDefault()

        // console.log("✅ 클릭됨! 로딩 시작")

        // 2. 로딩 상태 키기
        setIsLoading(true)

        // 3. 아주 잠깐 뒤에 페이지 강제 이동
        // React가 로딩 화면을 그릴 시간 벌기(0.5초)
        setTimeout(() => {
            router.push(href)
        },500)
    }

    return (
    <a
        href={href}
        onClick={handleClick}
        className={`${className} cursor-pointer`}
        {...props}
    >
        {children}
    </a>
    )
}