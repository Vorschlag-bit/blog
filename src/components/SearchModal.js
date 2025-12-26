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
                { name: 'content', weight: 0.3 },   // 가중치 0.3
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
            <input 
                type="search"
                placeholder=" 검색어를 입력하세요."
                className="w-full border p-1 rounded-md" // 스타일 약간 수정
                onChange={handleOnChange} // 핸들러 교체
                onFocus={handleOnFocus}   // 포커스 핸들러 추가
                value={query}
                size={24}
                maxLength={24}
            />

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
                                        <span className="bg-gray-200 px-1 rounded text-xs flex items-center">{post.category}</span>
                                        <span>{post.date}</span>
                                    </div>
                                    <div className="text-sm text-gray-400 line-camp truncate">
                                        {post.content.slice(0, 50)}...
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