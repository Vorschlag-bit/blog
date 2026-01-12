import Link from "next/link"

const pixelShadow = "shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"

export default function ExComponent() {
    return (
        <section className="flex flex-col gap-6">
            {/* [1] 핵심 경험 1: 날씨 API */}
            <div className={`w-full border-2 border-black dark:border-gray-500 bg-white dark:bg-gray-800 p-5 ${pixelShadow}`}>
                <div className="flex items-center gap-3 mb-3 border-2 border-dashed border-gray-300 p-1 pl-2">
                    <svg className="w-7 h-7 text-blue-600" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"> <path d="M16 4h-6v2H8v2H4v2H2v2H0v6h2v2h20v-2h2v-6h-2v-2h-2V8h-2V6h-2V4zm2 8h4v6H2v-6h2v-2h4v2h2v-2H8V8h2V6h6v2h2v4zm0 0v2h-2v-2h2z" fill="currentColor"/> </svg>
                    <h3 className="text-base md:text-xl font-bold">Function: Weather Widget Optimization</h3>
                </div>
                <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 space-y-3 mt-1">
                    {/* 설명 */}
                    <div className="">
                    <div className="w-[7rem] flex items-center gap-2 bg-red-100 text-red-600 px-1 py-0.5 text-sm md:text-base font-bold">
                        <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"> <path d="M3 3h16v2H5v14h14v2H3V3zm18 0h-2v18h2V3zM11 15h2v2h-2v-2zm2-8h-2v6h2V7z" fill="currentColor"/> </svg>
                        <span className="">Problem</span>
                    </div>
                    <p className="text-sm md:text-base mt-2 text-gray dark:text-gray-300">잦은 API 호출로 인한 서버 부하 및 초기 로딩 시 CLS(Layout Shift) 발생</p>
                    </div>
                    {/* solution */}
                    <div className="">
                    <div className="w-[7rem] flex items-center gap-2 bg-yellow-100 text-yellow-600 px-1 py-0.5 text-sm md:text-base font-bold">
                        <svg className="w-5 h-5 md:w-6 md:h-6" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"> <path d="M8 2h8v2H8V2ZM6 6V4h2v2H6Zm0 6H4V6h2v6Zm2 2H6v-2h2v2Zm8 0v4H8v-4h2v2h4v-2h2Zm2-2v2h-2v-2h2Zm0-6h2v6h-2V6Zm0 0V4h-2v2h2Zm-2 14H8v2h8v-2Z" /> </svg>
                        <span className="">Solution</span>
                    </div>
                    <ul className="text-sm md:text-base mt-2 list-disc list-inside text-gray-600 dark:text-gray-300">
                        <li>
                        <span>
                            <b>Server Component Wrapper:</b> 초기 렌더링은 서버에서 처리하여 로딩 없는 즉각적 화면 제공 (SSR)
                            <Link className="inline-flex items-center align-middle ml-1 mb-1" href={'/posts/weather_refactor'} target="_blank" rel="noopener noreferrer">
                            <svg className="w-5 text-blue-600" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"> <path d="M21 11V3h-8v2h4v2h-2v2h-2v2h-2v2H9v2h2v-2h2v-2h2V9h2V7h2v4h2zM11 5H3v16h16v-8h-2v6H5V7h6V5z" fill="currentColor"/> </svg>
                            </Link>
                        </span>
                        </li>
                        <li>
                        <span>
                            <b>Server Actions & Caching:</b> 좌표 소수점 반올림(3자리)을 통해 캐시 적중률(Hit Rate)을 높여 API 호출 최소화
                            <Link className="inline-flex items-center align-middle ml-1 mb-1" href={'/posts/weather#위치-데이터-캐싱'} target="_blank" rel="noopener noreferrer">
                            <svg className="w-5 text-blue-600" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"> <path d="M21 11V3h-8v2h4v2h-2v2h-2v2h-2v2H9v2h2v-2h2v-2h2V9h2V7h2v4h2zM11 5H3v16h16v-8h-2v6H5V7h6V5z" fill="currentColor"/> </svg>
                            </Link>
                        </span>
                        </li>
                    </ul>
                    </div>
                    {/* result */}
                    <div className="">
                    <div className="w-[7rem] flex items-center gap-2 bg-green-100 text-green-600 px-1 py-0.5 text-sm md:text-base font-bold">
                        <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"> <path d="M6 16h10v2h2v-2h2v-2h-2v-2h-2v2H6V4H4v12h2zm10-4v-2h-2v2h2zm0 6v2h-2v-2h2z" fill="currentColor"/> </svg>
                        <span className="">Result</span>
                    </div>
                    <p className="text-base md:text-lg mt-2 font-bold text-gray-700 dark:text-white">API 호출 70% 감소, LCP 0.2s 단축 달성</p>
                    </div>
                </div>        
                </div>
            </div>
    
                
            {/* [2] 핵심 경험 2: RSC 리팩토링 */}
            <div className={`col-span-1 border-2 border-black dark:border-gray-500 bg-white dark:bg-gray-800 p-5 ${pixelShadow} flex flex-col`}>
                <div className="flex items-center gap-3 mb-4 border-2 border-dashed border-gray-300 dark:border-gray-600 p-1 pl-2">
                    <svg className="w-7 h-7 text-purple-600" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"> <path d="M3 3h18v18H3V3zm16 16V5H5v14h14zM7 7h10v2H7V7zm0 4h10v2H7v-2zm0 4h7v2H7v-2z" fill="currentColor"/> </svg>
                    <h3 className="text-base md:text-xl font-bold">Function: RSC Refactoring</h3>
                </div>
                
                <div className="flex-1 space-y-3 mt-1">
                    {/* Problem */}
                    <div>
                        <div className="w-[7rem] flex items-center gap-2 bg-red-100 text-red-600 px-1 py-0.5 text-sm md:text-base font-bold">
                            <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"> <path d="M3 3h16v2H5v14h14v2H3V3zm18 0h-2v18h2V3zM11 15h2v2h-2v-2zm2-8h-2v6h2V7z" fill="currentColor"/> </svg>
                            <span className="">Problem</span>
                        </div>
                        <p className="text-sm md:text-base mt-2 text-gray dark:text-gray-300">단순 조회용 UI(인기글)의 CSR 처리로 인한 초기 로딩 지연 및 불필요한 JS 번들 전송</p>
                    </div>
                    {/* Solution */}
                    <div>
                        <div className="w-[7rem] flex items-center gap-2 bg-yellow-100 text-yellow-600 px-1 py-0.5 text-sm md:text-base font-bold">
                            <svg className="w-5 h-5 md:w-6 md:h-6" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"> <path d="M8 2h8v2H8V2ZM6 6V4h2v2H6Zm0 6H4V6h2v6Zm2 2H6v-2h2v2Zm8 0v4H8v-4h2v2h4v-2h2Zm2-2v2h-2v-2h2Zm0-6h2v6h-2V6Zm0 0V4h-2v2h2Zm-2 14H8v2h8v-2Z" /> </svg>
                            <span className="">Solution</span>
                        </div>
                        <ul className="text-sm md:text-base mt-2 list-disc list-inside text-gray-600 dark:text-gray-300">
                            <li>
                                <span>
                                <b>RSC 전환:</b> 데이터 가공 로직 서버 이관
                                <Link className="inline-flex items-center align-middle ml-1 mb-1" href={'/posts/rank_refactor#1-쓰기write---ssg-환경에서의-딜레마와-해결'} target="_blank" rel="noopener noreferrer">
                                <svg className="w-5 text-blue-600" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"> <path d="M21 11V3h-8v2h4v2h-2v2h-2v2h-2v2H9v2h2v-2h2v-2h2V9h2V7h2v4h2zM11 5H3v16h16v-8h-2v6H5V7h6V5z" fill="currentColor"/> </svg>
                                </Link>
                            </span>
                            </li>
                            <li>
                                <span>
                                <b>Zero Bundle Size:</b> HTML만 전송하여 JS 최소화
                                <Link className="inline-flex items-center align-middle ml-1 mb-1" href={'/posts/rank_refactor#정리--비교-분석'} target="_blank" rel="noopener noreferrer">
                                <svg className="w-5 text-blue-600" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"> <path d="M21 11V3h-8v2h4v2h-2v2h-2v2h-2v2H9v2h2v-2h2v-2h2V9h2V7h2v4h2zM11 5H3v16h16v-8h-2v6H5V7h6V5z" fill="currentColor"/> </svg>
                                </Link>
                            </span>
                            </li>
                            <li>
                                <span>
                                <b>Parallel Fetching:</b> API Waterfall 제거로 병렬 데이터 fetching
                                <Link className="inline-flex items-center align-middle ml-1 mb-1" href={'/posts/rank_refactor#정리--비교-분석'} target="_blank" rel="noopener noreferrer">
                                <svg className="w-5 text-blue-600" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"> <path d="M21 11V3h-8v2h4v2h-2v2h-2v2h-2v2H9v2h2v-2h2v-2h2V9h2V7h2v4h2zM11 5H3v16h16v-8h-2v6H5V7h6V5z" fill="currentColor"/> </svg>
                                </Link>
                            </span>
                            </li>
                        </ul>
                    </div>
                    {/* Result */}
                    <div className="mt-auto">
                        <div className="w-[7rem] flex items-center gap-2 bg-green-100 text-green-600 px-1 py-0.5 text-sm md:text-base font-bold">
                            <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"> <path d="M6 16h10v2h2v-2h2v-2h-2v-2h-2v2H6V4H4v12h2zm10-4v-2h-2v2h2zm0 6v2h-2v-2h2z" fill="currentColor"/> </svg>
                            <span className="">Result</span>
                        </div>
                        <p className="text-base md:text-lg mt-2 font-bold text-gray-700 dark:text-white">클라이언트 JS 번들 40% 감소, 네트워크(273ms 소요) 횟수 감소</p>
                    </div>
                </div>
            </div>
    
            {/* [3] 핵심 경험 3: 반응형 웹 디자인 */}
            <div className={`col-span-1 border-2 border-black dark:border-gray-500 bg-white dark:bg-gray-800 p-5 ${pixelShadow} flex flex-col`}>
                <div className="flex items-center gap-3 mb-4 border-2 border-dashed border-gray-300 dark:border-gray-600 p-1 pl-2">
                    <svg className="w-7 h-7 text-indigo-600" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"> <path d="M4 2h16v20H4V2zm2 2v12h12V4H6zm0 14h12v2H6v-2z" fill="currentColor"/> </svg>
                    <h3 className="text-base md:text-xl font-bold">Function: Responsive Design</h3>
                </div>
                
                <div className="flex-1 space-y-3 mt-1">
                    {/* Problem */}
                    <div>
                        <div className="w-[7rem] flex items-center gap-2 bg-red-100 text-red-600 px-1 py-0.5 text-sm md:text-base font-bold">
                            <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"> <path d="M3 3h16v2H5v14h14v2H3V3zm18 0h-2v18h2V3zM11 15h2v2h-2v-2zm2-8h-2v6h2V7z" fill="currentColor"/> </svg>
                            <span className="">Problem</span>
                        </div>
                        <p className="text-sm md:text-base mt-2 text-gray dark:text-gray-300">데스크탑 중심 설계로 인한 모바일 환경 레이아웃 깨짐 및 가독성 저하</p>
                    </div>
                    {/* Solution */}
                    <div>
                        <div className="w-[7rem] flex items-center gap-2 bg-yellow-100 text-yellow-600 px-1 py-0.5 text-sm md:text-base font-bold">
                            <svg className="w-5 h-5 md:w-6 md:h-6" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"> <path d="M8 2h8v2H8V2ZM6 6V4h2v2H6Zm0 6H4V6h2v6Zm2 2H6v-2h2v2Zm8 0v4H8v-4h2v2h4v-2h2Zm2-2v2h-2v-2h2Zm0-6h2v6h-2V6Zm0 0V4h-2v2h2Zm-2 14H8v2h8v-2Z" /> </svg>
                            <span className="">Solution</span>
                        </div>
                        <ul className="text-sm md:text-base mt-2 list-disc list-inside text-gray-600 dark:text-gray-300">
                            <li>
                                <span>
                                <b>Breakpoints:</b> 모바일/태블릿/PC 분기 처리
                                <Link className="inline-flex items-center align-middle ml-1 mb-1" href={'/posts/layout_refactor#4-메인-layoutjs의-header와-footer'} target="_blank" rel="noopener noreferrer">
                                <svg className="w-5 text-blue-600" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"> <path d="M21 11V3h-8v2h4v2h-2v2h-2v2h-2v2H9v2h2v-2h2v-2h2V9h2V7h2v4h2zM11 5H3v16h16v-8h-2v6H5V7h6V5z" fill="currentColor"/> </svg>
                                </Link>
                            </span>
                            </li>
                            <li>
                                <span>
                                <b>Layout Shift 방지:</b> 디바이스별 레이아웃 통일
                                <Link className="inline-flex items-center align-middle ml-1 mb-1" href={'/posts/layout_refactor#1-tailwind의-브레이크-포인트-기준점'} target="_blank" rel="noopener noreferrer">
                                <svg className="w-5 text-blue-600" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"> <path d="M21 11V3h-8v2h4v2h-2v2h-2v2h-2v2H9v2h2v-2h2v-2h2V9h2V7h2v4h2zM11 5H3v16h16v-8h-2v6H5V7h6V5z" fill="currentColor"/> </svg>
                                </Link>
                            </span>
                            </li>
                            <li>
                                <span>
                                <b>Conditional UI:</b> 모바일 사이드바 숨김 및 메뉴 최적화
                                <Link className="inline-flex items-center align-middle ml-1 mb-1" href={'/posts/layout_refactor#1-카테고리-모음-컴포넌트-categorylistjs'} target="_blank" rel="noopener noreferrer">
                                <svg className="w-5 text-blue-600" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"> <path d="M21 11V3h-8v2h4v2h-2v2h-2v2h-2v2H9v2h2v-2h2v-2h2V9h2V7h2v4h2zM11 5H3v16h16v-8h-2v6H5V7h6V5z" fill="currentColor"/> </svg>
                                </Link>
                            </span>
                            </li>
                        </ul>
                    </div>
                    {/* Result */}
                    <div className="mt-auto">
                        <div className="w-[7rem] flex items-center gap-2 bg-green-100 text-green-600 px-1 py-0.5 text-sm md:text-base font-bold">
                            <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"> <path d="M6 16h10v2h2v-2h2v-2h-2v-2h-2v2H6V4H4v12h2zm10-4v-2h-2v2h2zm0 6v2h-2v-2h2z" fill="currentColor"/> </svg>
                            <span className="">Result</span>
                        </div>
                        <p className="text-base md:text-lg mt-2 font-bold text-gray-700 dark:text-white">모든 디바이스에서 최적의 가독성 확보</p>
                    </div>
                </div>
            </div>
        </section>
    )
}