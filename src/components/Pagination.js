import Link from "next/link";

export default function Pagination({ currentPage, totalPages }) {
    // 페이지 번호 배열 만들기
    const pages = Array.from({ length: totalPages }, (_, i) => i+1);

    return (
        <div>
            {/** 이전 버튼 */}
            {currentPage > 1 ? (
                <Link
                    href={`/?page=${currentPage - 1}`}
                    className="px-3 py-1 border-2 border-black"
                >
                    &lt; PREV
                </Link>
            ) : (
                <span className="px-3 py-1 border-2 border-gray-300">
                    &lt; PREV
                </span>
            )}
            {/** 페이지 번호들*/}
            <div>
                {pages.map((p) => (
                    <Link
                        key={p}
                        href={`/?page=${p}`}
                        className={`px-3 py-1 border-2
                            ${p == currentPage ? 'bg-blue-600 text-white' : 'border-black'}`}
                    >
                        {p}
                    </Link>
                ))}
            </div>
            {/** 이후 버튼 */}
            {currentPage < totalPages ? (
                <Link
                    href={`/?page=${currentPage + 1}`}
                    className="px-3 py-1 border-2 border-black"
                >
                    NEXT &gt;
                </Link>
            ) : (
                <span className="px-3 py-1 border-2 border-gray-300">
                    NEXT &gt;
                </span>
            )}
        </div>
    )
}