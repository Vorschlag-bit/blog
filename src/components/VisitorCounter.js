"use client"
import { useCounter } from "@/app/hooks/UseCounter"
import { useState,useEffect,useRef } from "react"

export default function VisitorCounter() {
    const [isLoading,setIsLoading] = useState('true')
    // 당일과 전체 모두 객체로 받기 위해 null
    const [visitors,setVisitors] = useState({ date: 0, total: 0 })
    // api 실패 시, errMsg
    const [errMsg, setErrMsg] = useState("")

    // 개발 모드(Strict Mode)에서 중복 방지용 Ref
    const hasFetched = useRef(false)

    // 애니메이션 적용된 숫자 (duration: 2초 동안 촤라락)
    const animatedToday = useCounter(visitors.date, 2000);
    const animatedTotal = useCounter(visitors.total, 2000)

    const fetchVisitors = async () => {
        setIsLoading(true)
        setErrMsg("")
        try {
            const res = await fetch('/api/visit', {
                method: 'POST',
            })
            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw Error("DB 조회 실패!" || errData.error)
            }

            const data = await res.json()
            console.log("데이터 파싱 결과: ", data);
            
            setVisitors(data)

        } catch (err) {
            console.error(err);
            setErrMsg("방문자 정보를 조회하지 못 했습니다.")
        } finally {
            setIsLoading(false);
        }
    };

    // 영향 받는 거 없으니 빈 배열 의존성
    useEffect(() => {
        // 중복 호출 방지
        if (!hasFetched.current) {
            // fetchVisitors()

            // 임시 데이터로 테스트
            setTimeout(() => {
                setVisitors({ date: 123, total: 15420 });
                setIsLoading(false);
            }, 500);
            hasFetched.current = true;
        }
    },[])

    return (
        <div className="retro-box p-6 w-full mt-12 bg-white dark:bg-gray-800 border-2 border-black
            dark:border-gray-500 shadow-pixel flex-col gap-6 items-center
        ">
            <div>
                {isLoading ? (
                    // 조회 중일 경우
                    <div className="animate-pulse">Loading...</div>
                ) : (
                    // 조회 끝
                    visitors ? (
                        // 데이터 가져온 경우
                        <div className="flex flex-col items-center">
                            {/* header */}
                            <div className="font-bold text-lg tracking-widest border-dashed">VISITORS</div>
                            {/* 당일 방문자 */}
                            <div className="flex flex-col items-center">
                                <span className="text-gray-400 mb-1">TODAY</span>
                                <NumberBoard number={animatedToday} length={6} color="bg-green-100 text-green-700 border-green-600" />
                            </div>
                            {/* 전체 방문자 */}
                            <div className="flex flex-col items-center">
                                <span className="text-gray-400 mb-1">TOTAL</span>
                                <NumberBoard number={animatedTotal} length={6} color="bg-blue-100 text-blue-700 border-blue-600" />
                            </div>
                        </div>
                    ) : (
                        // 데이터 못 가져온 경우
                        <div className="text-red-600 text-lg text-center">
                            {errMsg || "방문자 정보 조회 실패"}
                        </div>
                    )
                )}
            </div>
        </div>
    )
}

// 날짜 숫자 공용 컴포넌트
function NumberBoard({ number, length, color }) {
    // 숫자 문자열로 바꾸고 0채우기
    const strNum = number.toString().padStart(length,'0');
    // 문자열을 배열로 변환
    const digits = strNum.split('')

    return (
        <div className="flex justify-between gap-1 sm:gap-2">
            {digits.map((digit, idx) => (
                <div 
                key={idx}
                className={`
                    flex-1 aspect-[3/4] flex items-center justify-center
                    text-xl sm:text-2xl font-bold font-mono rounded-lg border-2
                    shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)]
                    transition-all duration-300
                    ${color}
                `}>
                    {digit}
                </div>
            ))}
        </div>
    )
}