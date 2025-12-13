"use client"
import { useEffect,useState } from "react"
import { useLoading } from "@/context/LoadingContext";

export default function GlobalLoader() {
    const { isLoading } = useLoading()
    // 1. 저절로 증가하는 숫자 만들기
    const [count, setCount] = useState(0)

    // 2. useEffect 안에서 setInterval 사용하기
    // useEffect는 오직 타이머를 키고, 끄는 일만 수행(자동으로 0부터 100까지 증가)
    useEffect(() => {
        if (!isLoading) {
            // 로딩 꺼지면 숫자 초기화
            setCount(0)
            return;
        }

        // setInterval 동안 숫자 증가
        const timerId = setInterval(() => {
            // State 업데이트
            // setCount((prev) => prev + 1)로 해야지 누적됌
            setCount((prev) => {
                if (prev >= 100) return 100;
                return prev +  Math.floor(Math.random() * 10) + 1;
            })
        }, 30) // 0.1초마다 실행
        // setInterval 반납
        return () => clearInterval(timerId)
    }, [isLoading]);

    // 로딩 중이 아니면 화면이 아무것도 안 그리기
    if (!isLoading) return null;

    // pixel 스타일 CSS
    const pixelBorderStyle = "shadow-[4px_0_0_0_black,-4px_0_0_0_black,0_-4px_0_0_black,0_4px_0_0_black] dark:shadow-[4px_0_0_0_white,-4px_0_0_0_white,0_-4px_0_0_white,0_4px_0_0_white]"

    // CSS 적용
    return (
        // 외각선 박스
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white/200 dark:bg-gray-900/200 backdrop-blur-sm">
            <div className={`flex gap-1 p-2 mb-6 mx-2 bg-transparent ${pixelBorderStyle}`}>
                {Array(10).fill(0).map((_, index) => {
                    // 현재 인덱스가 count(%)를 10으로 나눈 몫보다 작다면 채움
                    const isFilled = index < Math.floor(count / 10)
                    let barColor = "bg-green-400"
                    if (count <= 33) {
                        barColor = "bg-red-500"
                    } else if (count <= 66) {
                        barColor = "bg-yellow-400"
                    }

                    return (
                        <div 
                            key={index}
                            className={`w-4 h-10 transition-all duration-100
                            ${isFilled 
                                ? `${barColor} shadow-[inset_2px_2px_0px_0px_rgba(255,255,255,0.4)]`
                                : "bg-transparent opacity-30"}`} />
                    )
                })}
            </div>

            {/** loading 텍스트 */}
            <div className="flex flex-col items-center gap-2 text-black dark:text-white">
                <div className="relative text-2xl font-bold font-[Galmuri11 Bold] tracking-widest">
                    NOW LOADING
                    <span className="absolute left-full w-8 text-left">
                        ...
                    </span>
                </div>
                <div className="text-sm font-[Galmuri11]">
                    {Math.floor(count)}% COMPLETE
                </div>
            </div>
        </div>
    )
}