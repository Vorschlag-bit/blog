"use client"
import { useState,useEffect } from "react"

// 사용자가 입력한 api
export default function PostRank({ props }) {
    const [isLoading, setIsLoading] = useState(false)
    const [errMsg, setErrMsg] = useState('')
    // 랭킹을 저장할 상태는 state일까 ref일까? => state가 맞는 거 같음
    // 조회는 어차피 cache로 
    const [top5Rank, setTop5Rank] = useState()
    const path = props.path
    

    const fetchRank = async (path,postInfo) => {
        setIsLoading(true)
        setErrMsg('')
        try {
            const res = await fetch(`/post_rank/${path}`, 
                { method: 'POST', 
                    body: {
                        id: postInfo.id,
                        title: postInfo.title,
                        date: postInfo.date
                    }
                })
            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw Error(errData.error)
            }

            const data = await res.json()
            setTop5Rank(data)
        } catch (err) {
            console.error(`인기글 DB를 조회하지 못 했습니다.`);
            setErrMsg('인기글 DB 조회 실패')
        } finally {
            setIsLoading(false)
        }
    }


    useEffect(() => {
        if (!isLoading) return
        fetchRank(path)
    },[path])

    return (
        //  최상위 div
        <div className="relative flex items-center">
            {/* header */}
            <p className="border-b border-dashed p-1">인기 글</p>
            <div className="gap-1">
                {top5Rank ? (
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