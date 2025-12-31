"use client"
import { useState,useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link";

// 사용자가 입력한 api
export default function PostRank() {
    const params = useParams();
    const currentId = params.id || '/';
    
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
            // console.log(`fetched data: `, data);
            
            setTop5Rank(data)
        } catch (err) {
            console.error(`인기글 DB를 조회하지 못 했습니다.`);
            setErrMsg('인기글 DB 조회 실패')
        } finally {
            setIsLoading(false)
        }
    }


    useEffect(() => {
        fetchRank(currentId)
    },[currentId])

    return (
        //  최상위 div
        <div className="relative top-8 w-60 flex flex-col items-start gap-3">
            {/* header */}
            <p className="flex items-center w-59 border-b-[2px] border-gray-400 border-dashed p-1 whitespace-wrap font-bold pb-3 gap-2">
                <svg className="w-6 dark:text-white" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"> <path d="M5 3H3v18h18V3H5zm14 2v14H5V5h14zM9 11H7v6h2v-6zm2-4h2v10h-2V7zm6 6h-2v4h2v-4z" fill="currentColor"/> </svg>
                <span className="dark:text-gray-200">인기 글</span>
            </p>
            {isLoading ? (
                // 로딩 중 화면
                <div className="w-full font-bold text-lg text-center mt-[3rem] animate-pulse">Loading...</div>
            ) : (
                // 로딩 완료 화면
                // List Container 
                <div className="w-full">
                    {top5Rank.length > 0 ? (
                    // top5 있을 때
                    <ul className="flex flex-col gap-1">
                        {top5Rank.map((post) => (
                            <li key={post.id}
                                className="group p-2 border border-gray-500 hover:border-indigo-700 w-full transition-colors"
                            >
                                <Link href={`/posts/${post.id}`} className="">
                                    <p className="font-bold text-black truncate group-hover-glitch dark:text-gray-300 mb-1">{post.title}</p>
                                    <p className="text-gray-400 text-xs">{post.date}</p>
                                </Link>
                            </li>
                        ))}
                    </ul>
                ) : (
                    // top5 없을 때
                    <div className="flex items-center absolute text-sm text-red-400 dark:text-red-200 top-[5em] left-[2em] border border-red-500 p-2 gap-2">
                        <svg className="w-5" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"> <path d="M3 3h16v2H5v14h14v2H3V3zm18 0h-2v18h2V3zM11 15h2v2h-2v-2zm2-8h-2v6h2V7z" fill="currentColor"/> </svg>
                        <span>{errMsg}</span>
                    </div>
                )}
            </div>
            )}
        </div>
    )
}