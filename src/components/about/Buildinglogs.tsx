"use client"

import { useState } from "react"
import Link from "next/link"
import { PostData } from "@/types/post_type"

interface BuildingLogsProps {
    posts: PostData[]
}

export default function BuildingLogs({ posts }: BuildingLogsProps){
    const [isExpaned,setIsExpanded] = useState(false)

    // 펼쳐져 있으면 전체, 아니면 상위 5개
    const visiblePosts = isExpaned ? posts : posts.slice(0,5)

    return (
        <ul className="space-y-3">
            {visiblePosts.map((post) => (
                <li
                    key={post.id}
                    className="hover:bg-gray-800 p-1 -mx-1 rounded transition-colors group"
                >
                    <div className="flex gap-2 sm:flex-row sm:items-center">
                    <span className="text-gray-500 min-w-[100px]">{`[${post.date.split(' ')[0]}]`}</span>
                    <Link href={`/posts/${post.id}`} className="flex flex-col"
                          target="_blank" rel="noopener noreferrer"
                    >
                      <span className="text-yellow-400 font-bold group-hover:underline">{`${post.title}`}</span>
                    </Link>
                  </div>
                </li>
            ))}

            {/* 더보기 버튼(토글) */}
            {posts.length > 5 && (
                <li className="pt-2">
                    <button
                        onClick={() => setIsExpanded(!isExpaned)}
                        className="text-blue-400 hover:text-blue-300 font-bold text-sm flex items-center gap-2 hover:underline decoration-dashed underline-offset-4 cursor-pointer"
                    >
                        {isExpaned ? (
                            <>
                                <span>-- SYSTEM: COLLAPSE LOGS --</span>
                            </>
                        ) : (
                            <>
                                <span>{`>> LOAD MORE LOGS (${posts.length - 5} hidden)...`}</span>
                            </>
                        )}
                    </button>
                </li>
            )}
            <li className="mt-4 text-green-400 animate-pulse">{`> _`}</li>
        </ul>
    )
}