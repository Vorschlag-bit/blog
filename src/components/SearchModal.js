"use client"
import { useState,useMemo,useRef,useEffect } from "react"
import Fuse from "fuse.js"
import Link from "next/link"

export default function SearchModal({ posts }) {
    const [query, setQuery] = useState('')
    const [isOpen,setIsOpen] = useState(false)
    const containerRef = useRef(null);
    
    const fuse = useMemo(() => {
        return new Fuse(posts, {
            keys: [
                { name: 'title', weight: 1 },       // 가중치 1
                { name: 'content', weight: 0.7 },   // 가중치 0.9
                { name: 'category', weight: 0.6 }
            ],
            includeScore: true, // 유사도 점수 포함
            threshold: 0.5,
            ignoreLocation: true,
            minMatchCharLength: 2,
        })
    }, [posts])

    // 검색어 결과에 따라 필터링
    const results = useMemo(() => {
        if (!query) return [];
        return fuse.search(query).map(result => result.item);
    }, [query, fuse])

    const handleOnChange = (e) => {
        setQuery(e.target.value);

        // 글자가 있으면 열고
        if (e.target.value.length > 0) setIsOpen(true)
        // 없으면 닫기
        else setIsOpen(false)
    }

    const handleOnFocus = () => {
        if (query.length > 0) setIsOpen(true)
    }

    // 외부 클릭 로직 추가
    useEffect(() => {
        function handleClickOutSide(event) {
            // ref 존재하고 클릭된 타겟이 ref에 포함되지 않으면 isOpen false로
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }

        // 마우스 누를 때 감지 시작
        document.addEventListener('mousedown',handleClickOutSide)

        // CleanUp
        return () => document.removeEventListener('mousedown', handleClickOutSide);
    },[])

    return (
        <div ref={containerRef} className="w-full max-w-md translate-x-20">
            <div className="relative flex items-center">
                <div className="absolute left-3">
                    <svg className="w-4" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"> <path d="M6 2h8v2H6V2zM4 6V4h2v2H4zm0 8H2V6h2v8zm2 2H4v-2h2v2zm8 0v2H6v-2h8zm2-2h-2v2h2v2h2v2h2v2h2v-2h-2v-2h-2v-2h-2v-2zm0-8h2v8h-2V6zm0 0V4h-2v2h2z" fill="currentColor"/> </svg>
                </div>
                <input
                    type="search"
                    placeholder="검색어를 입력하세요."
                    className="w-full border p-1 rounded-md border-gray-400 pl-8"
                    onChange={handleOnChange} // 핸들러 교체
                    onFocus={handleOnFocus}   // 포커스 핸들러 추가
                    value={query}
                    size={24}
                    maxLength={24}
                />
            </div>

            {/* 3. 조건부 렌더링: isOpen이 true이고 검색어가 있을 때만 보여줌 */}
            {isOpen && query.length > 0 && (
                <ul className="absolute top-full left-0 w-full bg-white pixel-shadow z-50 max-h-100 overflow-y-auto mt-1 border rounded-md">
                    {results.length === 0 ? (
                        <li className="text-gray-500 p-2 text-center text-sm dark:bg-gray-700 dark:text-white">
                            검색 결과가 없습니다.
                        </li>
                    ) : (
                        results.map((post) => (
                            <li key={post.id} className="border-b w-full last:border-0">
                                {/* onClick={() => setIsOpen(false)} 추가: 이동하면 닫히도록 */}
                                <Link 
                                    href={`/posts/${post.id}`} 
                                    className="block p-2 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <div className="font-bold text-lg dark:text-white truncate">{post.title}</div>
                                    <div className="text-sm text-gray-500 flex gap-2 mb-1">
                                        <span className="bg-blue-300 dark:bg-blue-300 text-blue-800 px-1 rounded text-xs flex items-center">{post.category}</span>
                                        <span>{post.date}</span>
                                    </div>
                                    <div className="text-sm text-gray-400 line-camp truncate">
                                        {post.description.slice(0, 50)}...
                                    </div>
                                </Link>
                            </li>
                        ))
                    )}
                </ul>
            )}
        </div>
    )
}