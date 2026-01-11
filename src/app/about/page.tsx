import Image from "next/image";
import Link from "next/link";
import RetroWindow from "@/components/RetroWindow";
import TechInventory from "@/components/TechInventory";
import LighthouseCircle from "@/components/LighthouseCircle";

const pixelShadow = "shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto p-4 space-y-8">
      
      {/* 1. Hero: 자기소개 */}
      <RetroWindow title="Reading: Developer, Vorschlag" className="bg-gray-100 dark:bg-gray-800">
        <section className="flex gap-6">
          <div className="relative w-52 h-52">
              <Image fill className="object-contain" src={'/images/character.png'} alt="캐릭터 이미지" priority />
          </div>
          <div className="flex flex-col gap-2">
              <div className="flex gap-2 items-center">
                <svg className="w-8" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"> <path d="M3 3h18v18H3V3zm16 16V5H5v14h14zM14 7h-4v4h4V7zm1 6H9v2H7v2h2v-2h6v2h2v-2h-2v-2z" fill="currentColor"/> </svg>
                <h1 className="text-2xl font-bold">Developer: <span className="text-blue-600">Vorschlag</span></h1>
              </div>
              <p>Full-stack Developer</p>
              <p>최적화와 DX(개발자 경험)을 고민하는 개발자입니다.</p>
              <p>단순한 기능 구현을 넘어, 시스템의 비효율을 발견하고 개선하는 과정에 몰입합니다.<br></br>
              문제를 기술적 근거를 바탕으로 해결책을 설계하고, 그 경험을 기록하여 자산으로 만듭니다.
              </p>
              <div className="font-bold text-lg flex-col gap-2 items-center">
                  <div className="flex items-center gap-2">
                    <svg className="w-7 h-7" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"> <path d="M2 3H0v18h24V3H2zm20 2v14H2V5h20zM10 7H6v4h4V7zm-6 6h8v4H4v-4zm16-6h-6v2h6V7zm-6 4h6v2h-6v-2zm6 4h-6v2h6v-2z" fill="currentColor"/> </svg>
                    <span>Contact</span>
                  </div>
                  <div className="text-base flex items-center gap-2" >
                      <svg className="w-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"> <path fill="currentColor" d="M5 2h4v2H7v2H5V2Zm0 10H3V6h2v6Zm2 2H5v-2h2v2Zm2 2v-2H7v2H3v-2H1v2h2v2h4v4h2v-4h2v-2H9Zm0 0v2H7v-2h2Zm6-12v2H9V4h6Zm4 2h-2V4h-2V2h4v4Zm0 6V6h2v6h-2Zm-2 2v-2h2v2h-2Zm-2 2v-2h2v2h-2Zm0 2h-2v-2h2v2Zm0 0h2v4h-2v-4Z"/> </svg>
                      <span>Github: </span>
                      <Link href={'https://github.com/Vorschlag-bit'}>github.com/Vorschlag-bit</Link>
                  </div>
                  <div className="text-base flex items-center gap-2">
                      <svg className="w-8" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"> <path d="M22 4H2v16h20V4zM4 18V6h16v12H4zM8 8H6v2h2v2h2v2h4v-2h2v-2h2V8h-2v2h-2v2h-4v-2H8V8z" fill="currentColor"/> </svg>
                      <span>Mail: bustout@naver.com</span>
                  </div>
              </div>
          </div>
        </section>
      </RetroWindow>

      {/* 2. Grid Layout 시작 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        
        {/* 성능 지표 (Lighthouse) */}
        <div className={`col-span-1 border-2 p-4 ${pixelShadow}`}>
           <div className="flex gap-2 items-center">
              <svg className="w-7 -mt-2" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"> <path d="M3 3h18v18H3V3zm16 2H5v14h14V5zM7 12h2v5H7v-5zm10-5h-2v10h2V7zm-6 3h2v2h-2v-2zm2 4h-2v3h2v-3z" fill="currentColor"/> </svg>
              <span className="font-bold mb-2 -mt-1">
                System Status
              </span>
           </div>
           {/* 그래프 영역 */}
           <div className="flex flex-col items-center">
            <LighthouseCircle score={100} label="Performance" size={150} strokeWidth={8} />
            <div className="flex justify-around w-full gap-2 mt-2">
              <div className="flex flex-col items-center">
                <span className="text-2xl font-bold text-green-500">0.6s</span>
                <span className="text-xs text-gray-500">FCP</span>
              </div>
              <div className="w-[1px] h-8 bg-gray-300"></div>
              <div className="flex flex-col items-center">
                <span className="text-2xl font-bold text-green-500">0.7s</span>
                <span className="text-xs text-gray-500">LCP</span>
              </div>
              <div className="w-[1px] h-8 bg-gray-300"></div>
              <div className="flex flex-col items-center">
                <span className="text-2xl font-bold text-green-500">100</span>
                <span className="text-xs text-gray-500">SEO</span>
              </div>
            </div>
           </div>
        </div>

        {/* 기술 스택 */}
        <div className={`col-span-1 md:col-span-2 border-2 p-4 ${pixelShadow}`}>
          <div className="flex items-center gap-1">
            <svg className="w-7 h-7 -mt-3" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"> <path d="M3 3h2v18H3V3zm16 0H5v2h14v14H5v2h16V3h-2zm-8 6h2V7h-2v2zm2 8h-2v-6h2v6z" fill="currentColor"/> </svg>
             <span className="-mt-2 mb-2 font-bold">Tech Inventory</span>
          </div>
           {/* 아이콘들 */}
           <TechInventory />
        </div>

        {/* 핵심 경험 1: 날씨 API */}
        <div className={`col-span-1 lg:col-span-2 border-2 border dark:border-gray-500 dark:bg-gray-700 p-5 ${pixelShadow}`}>
           <div className="flex items-center gap-3 mb-3 border-2 border-dashed border-gray-300 p-1 pl-2">
            <svg className="w-7 h-7 text-blue-600" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"> <path d="M16 4h-6v2H8v2H4v2H2v2H0v6h2v2h20v-2h2v-6h-2v-2h-2V8h-2V6h-2V4zm2 8h4v6H2v-6h2v-2h4v2h2v-2H8V8h2V6h6v2h2v4zm0 0v2h-2v-2h2z" fill="currentColor"/> </svg>
            <h3 className="text-xl font-bold">Function: Weather Widget Optimization</h3>
           </div>
           <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 space-y-3 mt-1">
              {/* 설명 */}
              <div className="">
                <div className="w-[7rem] flex items-center gap-2 bg-red-100 text-red-600 px-1 py-0.5 text-base font-bold">
                  <svg className="w-6 h-6" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"> <path d="M3 3h16v2H5v14h14v2H3V3zm18 0h-2v18h2V3zM11 15h2v2h-2v-2zm2-8h-2v6h2V7z" fill="currentColor"/> </svg>
                  <span className="">Problem</span>
                </div>
                <p className="text-base mt-2 list-disc list-inside text-gray dark:text-gray-600">잦은 API 호출로 인한 서버 부하 및 렌더링 지연 발생</p>
              </div>
              {/* solution */}
              <div className="">
                <div className="w-[7rem] flex items-center gap-2 bg-yellow-100 text-yellow-600 px-1 py-0.5 text-base font-bold">
                  <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"> <path d="M8 2h8v2H8V2ZM6 6V4h2v2H6Zm0 6H4V6h2v6Zm2 2H6v-2h2v2Zm8 0v4H8v-4h2v2h4v-2h2Zm2-2v2h-2v-2h2Zm0-6h2v6h-2V6Zm0 0V4h-2v2h2Zm-2 14H8v2h8v-2Z" /> </svg>
                  <span className="">Solution</span>
                </div>
                <ul className="text-base mt-2 list-disc list-inside text-gray-600 dark:text-gray-300">
                  <li>
                    <span>
                      <b>Server Actions</b> 도입으로 클라이언트 번들 사이즈 최소화
                     <Link className="inline-flex items-center align-middle ml-1 mb-1" href={'https://vorschlag-blog.vercel.app/posts/weather_refactor'} target="_blank" rel="noopener noreferrer">
                        <svg className="w-5" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"> <path d="M21 11V3h-8v2h4v2h-2v2h-2v2h-2v2H9v2h2v-2h2v-2h2V9h2V7h2v4h2zM11 5H3v16h16v-8h-2v6H5V7h6V5z" fill="currentColor"/> </svg>
                      </Link>
                    </span>
                  </li>
                  <li>
                    <span>
                      <b>좌표 소수점 최적화</b>를 통한 캐시 적중률 극대화
                      <Link className="inline-flex items-center align-middle ml-1 mb-1" href={'https://vorschlag-blog.vercel.app/posts/weather#위치-데이터-캐싱'} target="_blank" rel="noopener noreferrer">
                        <svg className="w-5" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"> <path d="M21 11V3h-8v2h4v2h-2v2h-2v2h-2v2H9v2h2v-2h2v-2h2V9h2V7h2v4h2zM11 5H3v16h16v-8h-2v6H5V7h6V5z" fill="currentColor"/> </svg>
                      </Link>
                    </span>
                  </li>
                </ul>
              </div>
              {/* result */}
              <div className="">
                <div className="w-[7rem] flex items-center gap-2 bg-green-100 text-green-600 px-1 py-0.5 text-base font-bold">
                  <svg className="w-6 h-6" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"> <path d="M6 16h10v2h2v-2h2v-2h-2v-2h-2v2H6V4H4v12h2zm10-4v-2h-2v2h2zm0 6v2h-2v-2h2z" fill="currentColor"/> </svg>
                  <span className="">Result</span>
                </div>
                <p className="text-lg mt-1 font-bold">API 호출 70% 감소, LCP 0.2s 단축</p>
              </div>
            </div>
            {/* 코드 비주얼 */}
            
           </div>
        </div>

        {/* 핵심 경험 2: RSC */}
        <div className="col-span-1 border-2 p-4">
           <h3>Refactoring to RSC</h3>
        </div>

      </div>
      
      {/* 3. 개발 로그 링크 */}
      <section>
        <h3>Build Logs</h3>
        {/* PostCard 컴포넌트 재사용 */}
      </section>

    </div>
  );
}