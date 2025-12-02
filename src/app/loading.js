"use client"
import { useEffect,useState } from "react"

export default function Loading() {
    // 1. 저절로 증가하는 숫자 만들기
    const [count, setCount] = useState(0)

    // 2. useEffect 안에서 setInterval 사용하기
    // useEffect는 오직 타이머를 키고, 끄는 일만 수행(자동으로 0부터 100까지 증가)
    useEffect(() => {
        // setInterval 동안 숫자 증가
        const timerId = setInterval(() => {
            // State 업데이트
            // setCount((prev) => prev + 1)로 해야지 누적됌
            setCount((prev) => {
                if (prev >= 100) return 100;
                return prev +  Math.floor(Math.random() * 10) + 1;
            })
        },100) // 0.1초마다 실행
        // setInterval 반납
        return () => clearInterval(timerId)
    }, []);

    // CSS 적용
    return (
        // 외각선 박스
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white dark:bg-gray-900">
            <div className="flex gap-1 p-2 border-4 border-black dark:border-white mb-4">
                {Array(10).fill(0).map((_, index) => {
                    // 현재 인덱스가 count(%)를 10으로 나눈 몫보다 작다면 채움
                    const isFilled = index < Math.floor(count / 10)

                    return (
                        <div 
                            key={index}
                            className={`w-4 h-10 transition-colors duration-200 ${isFilled ? "bg-black dark:bg-white" : "bg-transparent"}`} />
                    )
                })}
            </div>

            {/** loading 텍스트 */}
            <div className="ml-4 font-bold font-[Galmuri11]">
                Loading... {Math.floor(count)} %
            </div>
        </div>
    )
}