interface RetroWindowProps {
    children: React.ReactNode;
    title: string | "Untitled";
    className: string | ""
}

export default function RetroWindow({ children, title, className }: RetroWindowProps) {
    return (
        // 1. 창틀 (검은 테두리 + 그림자)
        <div className={`border-2 border-black dark:border-gray-400 bg-white 
        dark:bg-gray-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.5)] ${className}`}>
            {/** 2. 타이틀 바 (파란색 or 회색 배경) */}
            <div suppressHydrationWarning className="border-b-2 border-black dark:border-gray-400 bg-blue-100 dark:bg-gray-800 p-2
            flex justify-between items-center select-none">
                {/** file/title */}
                <div className="text-xs font-bold truncate flex items-center gap-1 text-black dark:text-white lg:text-sm">
                <svg className="w-2 h-2 lg: w-5 h-5" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M3 22h18V8h-2V6h-2v2h-2V6h2V4h-2V2H3v20zm2-2V4h8v6h6v10H5z" fill="currentColor"/>
                </svg>
                    <span className="ml-1 truncate">{title}</span>
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
            <div className="p-2 lg:p-6">
                {children}
            </div>
        </div>
    )
}