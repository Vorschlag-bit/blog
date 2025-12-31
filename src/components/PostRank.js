"use client"
import { useState,useEffect } from "react"
import { useParams } from "next/navigation"

// 사용자가 입력한 api
export default function PostRank() {
    const params = useParams();
    const currentId = params.id;
    console.log(`currentId: `, currentId);
    
    // 상태 훅들
    const [isLoading, setIsLoading] = useState(false)
    const [errMsg, setErrMsg] = useState('')
    // 랭킹을 저장할 상태는 state일까 ref일까? => state가 맞는 거 같음
    // 조회는 어차피 cache로 
    const [top5Rank, setTop5Rank] = useState([])

    const fetchRank = async (id) => {
        setIsLoading(true)
        setErrMsg('')
        try {
            const res = await fetch(`/api/post_rank`, 
                { method: 'POST', 
                    // body는 반드시 문자열
                    body: JSON.stringify({ id: id }),
                    headers: { 'Content-Type': 'application/json' }
                })
            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw Error(errData.error)
            }
            const data = await res.json()
            console.log(`fetched data: `, data);
            
            setTop5Rank(data)
        } catch (err) {
            console.error(`인기글 DB를 조회하지 못 했습니다.`);
            setErrMsg('인기글 DB 조회 실패')
        } finally {
            setIsLoading(false)
        }
    }


    useEffect(() => {
        // main 페이지는 id 없으므로 return
        if (!currentId) return
        fetchRank(currentId)
    },[currentId])

    return (
        //  최상위 div
        <div className="relative flex">
            {/* header */}
            <p className="border-b border-dashed p-1">인기 글</p>
            <div className="gap-1 flex">
                {top5Rank.length > 0 ? (
                // top5 있을 때
                <ul>
                    {top5Rank.map((post) => (
                        <li key={post.id}
                            className="p-3"
                        >
                            <p className="font-bold text-black">{post.title}</p>
                            <p className="text-gray-300">{post.date}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                // top5 없을 때
                <div className="absolute left-2em top-2em p-2">{errMsg}</div>
            )}
            </div>
        </div>
    )
}