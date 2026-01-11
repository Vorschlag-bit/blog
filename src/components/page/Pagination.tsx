import Link from "next/link";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    basePath: string | "/"
}

// 카테고리 화면에도 Paging을 하기 위해 basePath(기본값: 홈) 파라미터 추가
export default function Pagination({ currentPage, totalPages, basePath }: PaginationProps) {
    const PAGE_COUNT = 5
    // curPage = 배열 인덱스 + 1
    // 현재 페이지 기준 시작 페이지 계산, 3 -> (0 * 5) + 1
    const startPage = Math.floor((currentPage - 1) / PAGE_COUNT) * PAGE_COUNT + 1
    // 현재 페이지 기준 마지막 페이지 계산
    const endPage = Math.min(startPage + PAGE_COUNT - 1, totalPages)
    // 페이지 번호 배열 만들기
    const pages = Array.from({ length: endPage - startPage + 1 }, (_,i) => startPage + i)
    // prev 눌렀을 때 페이지 수
    const prevPage = Math.max(1, currentPage - PAGE_COUNT)
    // next 눌렀을 때 페이지 수
    const nextPage = Math.min(totalPages, currentPage + PAGE_COUNT)
    return (
        <div className="flex justify-center items-center gap-3 lg:mt-7 mt-3">
            {/** 이전 버튼 */}
            {currentPage > 1 ? (
                <Link
                    // basePath 뒤에 queryString 덧붙이기
                    href={`${basePath}?page=${prevPage}`}
                    className="px-2 lg:px-3 py-1 text-xs whitespace-nowrap lg:text-base border-2 border-black dark:border-gray-500 hover:bg-gray-200 dark:hover:bg-gray-800"
                >
                    &lt; PREV
                </Link>
            ) : (
                <span className="px-2 lg:px-3 py-1 text-xs whitespace-nowrap lg:text-base border-2 border-gray-300 text-gray-300 cursor-not-allowed">
                    &lt; PREV
                </span>
            )}
            {/** 페이지 번호들*/}
            <div className="flex gap-1">
                {pages.map((p) => (
                    <Link
                        key={p}
                        href={`${basePath}?page=${p}`}
                        className={`px-2 lg:px-3 py-1 border-2 text-xs lg:text
                            ${p == currentPage 
                                ? 'bg-blue-600 text-white border-blue-600 dark:bg-blue-800'
                                : 'border-black dark:border-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                    >
                        {p}
                    </Link>
                ))}
            </div>
            {/** 이후 버튼 */}
            {currentPage < totalPages ? (
                <Link
                    href={`${basePath}?page=${nextPage}`}
                    className="px-2 lg:px-3 py-1 text-xs whitespace-nowrap lg:text-base border-2 border-black dark:border-gray-500 hover:bg-gray-200 dark:hover:bg-gray-800"
                >
                    NEXT &gt;
                </Link>
            ) : (
                <span className="px-2 lg:px-3 py-1 text-xs whitespace-nowrap lg:text-base border-2 border-gray-300 text-gray-300 cursor-not-allowed">
                    NEXT &gt;
                </span>
            )}
        </div>
    )
}