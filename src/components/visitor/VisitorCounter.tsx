"use client"
import { useCounter } from "@/app/hooks/UseCounter"
import { useEffect } from "react"
import { incrementVisitor } from "@/app/action/visitor"

export default function VisitorCounter({ total,date }: { total:number, date: number }) {
    // 애니메이션 적용된 숫자 (duration: 1.2초 동안 촤라락)
    const animatedToday = useCounter(date, 1200)
    const animatedTotal = useCounter(total, 1200)

    // 영향 받는 거 없으니 빈 배열 의존성
    useEffect(() => {
        incrementVisitor()
    },[])

return (
        <aside className="retro-box p-4 w-[120%] relative -left-[4%] bg-white dark:bg-gray-800 border-2 border-black dark:border-gray-500 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.5)]">
            <div className="flex flex-col gap-4">
                {/* 헤더 */}
                <div className="flex justify-between items-end border-b-2 border-black/10 pb-1">
                    <div className="flex items-center gap-1">
                        <svg className="w-5" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"> <path d="M11 0H5v2H3v6h2v2h6V8H5V2h6V0zm0 2h2v6h-2V2zM0 14h2v4h12v2H0v-6zm2 0h12v-2H2v2zm14 0h-2v6h2v-6zM15 0h4v2h-4V0zm4 8h-4v2h4V8zm0-6h2v6h-2V2zm5 12h-2v4h-4v2h6v-6zm-6-2h4v2h-4v-2z" fill="currentColor"/> </svg>
                        <span className="font-bold text-xs tracking-widest">VISITORS</span>
                    </div>
                    <div className="flex gap-1 items-center">
                        <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
                        <span className="text-[10px] text-gray-500">LIVE</span>
                    </div>
                </div>

                {/* 컨텐츠 */}
                <div className="flex flex-col gap-3">
                    {/* Today */}
                    <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-gray-600">TODAY</span>
                        <NumberBoard number={animatedToday} length={8} />
                    </div>

                    {/* Total */}
                    <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-gray-600">TOTAL</span>
                        <NumberBoard number={animatedTotal} length={8} />
                    </div>
                </div>
            </div>
        </aside>
    )
}

// 공용 컴포넌트
function NumberBoard({ number, length }: { number: number, length: number }) {
    const strNum = number.toString().padStart(length, '0');
    const digits = strNum.split('');

    return (
        <div className="flex gap-[1px] bg-black border shadow-inner">
            {digits.map((digit, idx) => (
                <div 
                    key={idx}
                    // 사이즈 변경: w-6 h-8 -> w-4 h-6 / text-lg -> text-sm
                    className="w-4 h-6 flex items-center justify-center bg-[#f0f0f0] text-black dark:bg-[#2a2a2a] dark:text-white font-mono text-base font-bold relative overflow-hidden"
                >
                    <span className="relative z-10">{digit}</span>
                </div>
            ))}
        </div>
    )
}