"use client"
import { useState,useMemo } from "react"
import Fuse from "fuse.js"
import Link from "next/link"

export default function SearchModal({ posts }) {
    const [query, setQuery] = useState('')

    // useMemo?
    const fuse = useMemo(() => {
        return new Fuse(posts, {
            keys: [
                { name: 'title', weight: 1 },       // 가중치 1
                { name: 'content', weight: 0.5 },   // 가중치 0.5
                { name: 'category', weight: 0.5 }
            ],
            includeScore: true, // 유사도 점수 포함
            threshold: 0.4
        })
    }, [posts])

    // 검색어 결과에 따라 필터링
    const results = useMemo(() => {
        if (!query) return [];
        return fuse.search(query).map(result => result.item);
    }, [query, fuse])

    return (
        <div className="">
            <input 
            type="search"
            placeholder="검색어를 입력하세요."
            className=""
            value={query}
            size={24}
            maxLength={24}
            />

            <ul className="max-h-60 mt-4 overflow-y-auto">
                {results?.length === 0 && query !== '' ? (
                    <li className="text-gray-500">검색결과가 없습니다.</li>
                ) : (
                    results.map((post) => (
                        <li key={post.id} className="border-b last:border-0">
                            <Link href={`/posts/${post.id}`} className="block p-2 hover:bg-gray-100">
                                <div className="font-bold text-lg">{post.title}</div>
                                <div className="text-sm text-gray-500">
                                    <span className="bg-gray-200 px-1 rounded">{post.category}</span>
                                    {post.date}
                                </div>
                            </Link>
                            <p className="text-sm text-gray-400 truncate">{post.content.slice(0,50)}...</p>
                        </li>
                    ))
                )}
            </ul>
        </div>
    )
}