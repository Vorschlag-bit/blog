"use client"

import { useState,useEffect,useRef } from "react"

export default function VisitorCounter() {
    const [isLoading,setIsLoading] = useState('true')
    // 당일과 전체 모두 객체로 받기 위해 null
    const [visitors,setVisitors] = useState(null)
    // api 실패 시, errMsg
    const [errMsg, setErrMsg] = useState("")

    // 개발 모드(Strict Mode)에서 중복 방지용 Ref
    const hasFetched = useRef(false)

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
            fetchVisitors()
            hasFetched.current = true;
        }
    },[])

    return (
        <div className="retro-box p-8 w-30 h-29 mt-12 bg-black text-green-500 font-mono border-2 border-gray-600">
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
                            <div className="font'bold text-sm tracking-widest">VISITORS</div>
                            {/* 당일 방문자 */}
                            <div className="flex flex-col items-center">
                                <span className="text-gray-400 mb-1">TODAY</span>
                                <span className="text-lg font-bold">
                                    {visitors.date?.toString().padStart(6,'0')}
                                </span>
                            </div>
                            {/* 전체 방문자 */}
                            <div className="flex flex-col items-center">
                                <span className="text-gray-400 mb-1">TOTAL</span>
                                <span className="text-lg font-bold text-red-500">
                                    {visitors.total?.toString().padStart(6,'0')}
                                </span>
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