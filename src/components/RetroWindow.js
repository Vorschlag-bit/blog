"use client";

export default function RetroWindow({ children, title = "Untitled", className ="" }) {
    return (
        // 1. 창틀 (검은 테두리 + 그림자)
        <div suppressHydrationWarning className={`border-2 border-black dark:border-gray-400 bg-white 
        dark:bg-gray-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.5)] ${className}`}>
            {/** 2. 타이틀 바 (파란색 or 회색 배경) */}
            <div suppressHydrationWarning className="border-b-2 border-black dark:border-gray-400 bg-blue-100 dark:bg-gray-800 p-2
            flex justify-between items-center select-none">
                {/** file/title */}
                <div className="font-[Galmuri11] font-bold text-sm truncate flex items-center gap-2">
                    <svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M13 17V3h-2v10H9v-2H7v2h2v2h2v2h2zm8 2v-4h-2v4H5v-4H3v6h18v-2zm-8-6v2h2v-2h2v-2h-2v2h-2z" fill="currentColor"/>
                    </svg>
                    <span className="ml-3">{title}</span>
                </div>

                {/** 윈도우 버튼 3개(장식용) */}
                <div className="flex gap-1">
                    {/** 최소화 */}
                    <div className="w-3 h-3 border border-black bg-white"></div>
                    {/** 최대화 */}
                    <div className="w-3 h-3 border border-black bg-gray-300"></div>
                    {/** 닫기 */}
                    <div className="w-3 h-3 border border-black bg-red-400"></div>
                </div>
            </div>

            {/** 3. 실제 콘텐츠 영역 */}
            <div className="p-6">
                {children}
            </div>
        </div>
    )
}