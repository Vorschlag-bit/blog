import { getAllCategories } from "@/lib/posts";
import Link from "next/link";

export default function CategoryList({type = "vertical"}) {
    const sortedCategories = getAllCategories()

    // pc 이상의 화면에서 보여줄 배치 (세로)

    // 모바일 이상의 화면에서 보여줄 배치

    return (
        <>
            {type !== "vertical" ? (
                // 태블릿 이하의 화면
                <div className="lg:hidden w-full pt-2 pb-2 md:p-4 overflow-hidden">
                    <ul className="flex items-center whitespace-nowrap gap-3 overflow-x-auto">
                        {sortedCategories.map(({category, count}) => (
                            <li key={category} className="shrink-0 border border-gray-600">
                                <Link
                                    href={category === "All" ? "/" : `/categories/${category}`}
                                    className="hover-glitch block transition-color px-2 py-1 dark:bg-gray-800"
                                >
                                    <span className="text-xs flex items-center gap-1">
                                        {category}
                                        <span className="text-xs text-gray-500">{`(${count})`}</span>
                                    </span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                // pc 이상의 화면
                // 위치: 화면 중앙 기준 왼쪽 + 약간 아래(mt-14)
                <div className="w-full mr-4 font-[Galmuri11]">
                    {/* 1. 가장 바깥 박스 (그림자 효과) */}
                    <div className="border-2 border-black dark:border-gray-500 bg-white dark:bg-gray-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.5)]">
                
                        {/* 2. 타이틀 바 */}
                        <div className="bg-blue-600 text-white p-1.5 border-b-2 border-black dark:border-gray-500 flex justify-between items-center select-none">
                            <span className="font-bold text-xs pl-1">CATEGORY.EXE</span>
                            <div className="flex gap-1">
                                <div className="w-3 h-3 bg-white border border-black cursor-pointer hover:bg-gray-200"></div>
                                <div className="w-3 h-3 bg-gray-300 border border-black cursor-pointer hover:bg-gray-400"></div>
                            </div>
                        </div>
                        {/* 3. 컨텐츠 영역 (흰색 부분) */}
                        <div className="p-4">
                            {/* 카테고리 제목 (아이콘 포함) */}
                            <div className="flex items-center gap-2 mb-3 pb-2 border-b-2 border-dashed border-gray-300">
                                <svg className="w-6 h-6" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                    <path d="M12 2H2v10h2v2h2v2h2v2h2v2h2v2h2v-2h2v-2h2v-2h2v-2h2v-2h-2v-2h-2V8h-2V6h-2V4h-2V2zm0 2v2h2v2h2v2h2v2h2v2h-2v2h-2v2h-2v2h-2v-2h-2v-2H8v-2H6v-2H4V4h8zM6 6h2v2H6V6z" fill="currentColor"/>
                                </svg>
                                <h3 className="font-bold text-lg">Directory</h3>
                            </div>
                            {/* 리스트 목록 */}
                            <ul className="space-y-1">
                                {sortedCategories.map(({category, count}) => (
                                    <li key={category}>
                                        <Link
                                            href={category === "All" ? "/" : `/categories/${category}`}
                                            // hover-glitch 클래스 적용
                                            className="hover-glitch block p-1.5 hover:bg-blue-50 dark:hover:bg-gray-800 hover:text-blue-600 transition-colors rounded group"
                                        >
                                            {/* 마우스 올리면 화살표 나오게 (group-hover) */}
                                            <span className="font-medium text-sm flex items-center">
                                                {category != "All" && (
                                                    <svg className="w-6 h-6" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"> <path d="M6 16h10v2h2v-2h2v-2h-2v-2h-2v2H6V4H4v12h2zm10-4v-2h-2v2h2zm0 6v2h-2v-2h2z" fill="currentColor"/> </svg>
                                                )}
                                                {category}
                                                <span className="text-xs text-gray-400 ml-1">{`(${count})`}</span>
                                            </span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}