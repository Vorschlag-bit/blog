"use client"

import { useState,useEffect } from "react"

export default function VisitorCounter() {
    const [isLoading,setIsLoading] = useState('true')
    // 당일과 전체 모두 객체로 받기 위해 null
    const [visitors,setVisitors] = useState(null)
    // api 실패 시, errMsg
    const [errMsg, setErrMsg] = useState("")
    // 흐름
    // 해당 UI가 있을 경우 자동으로 호출을 해야 함
    // isLoading이 false면 return

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
            
            setVisitors({
                ...data
            })

        } catch (err) {
            console.error(err);
            setErrMsg("방문자 정보를 조회하지 못 했습니다.")
        } finally {
            setIsLoading(false);
        }
    };

    // 영향 받는 거 없으니 빈 배열 의존성
    useEffect(() => {
        fetchVisitors()
    },[])

    return (
        <div>
            <div>
                {isLoading ? (
                    // 조회 중일 경우
                    <div>Searching...</div>
                ) : (
                    // 조회 끝
                    visitors ? (
                        // 데이터 가져온 경우
                        <div>
                            {/* header */}
                            <div className="font'bold text-sm tracking-widest">VISITORS</div>
                            {/* 당일 방문자 */}
                            <div className="">
                                {visitors.date}
                            </div>
                            {/* 전체 방문자 */}
                            <div className="">
                                {visitors.total}
                            </div>
                        </div>
                    ) : (
                        // 데이터 못 가져온 경우
                        <div>
                            {errMsg || "방문자 정보 조회 실패"}
                        </div>
                    )
                )}
            </div>
        </div>
    )
}