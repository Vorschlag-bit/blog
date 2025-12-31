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
    

    const fetchRank = async (path) => {
        setIsLoading(true)
        setErrMsg('')
        try {
            const res = await fetch(`/post_rank/${path}`, { method: 'POST', })
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
        <div className=""></div>
    )
}