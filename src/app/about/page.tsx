import Image from "next/image";
import Link from "next/link";
import RetroWindow from "@/components/RetroWindow";
import TechInventory from "@/components/TechInventory";

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
              <p>실수를 반복하지 않도록 기록하고 학습해나가는 과정을 중요하게 생각합니다.</p>
              <div className="font-bold text-lg flex-col gap-2 items-center">
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
           <p className="text-2xl font-bold text-green-600 dark:text-green-500">FCP 0.6s</p>
           <p className="text-2xl font-bold text-green-600 dark:text-green-500">LCP 0.7s</p>
           <p className="text-2xl font-bold text-green-600 dark:text-green-500">SEO Score 100</p>
        </div>

        {/* 기술 스택 */}
        <div className={`col-span-1 md:col-span-2 border-2 p-4 ${pixelShadow}`}>
           <h3 className="-mt-2 mb-2 font-bold">Tech Inventory</h3>
           {/* 아이콘들 */}
           <TechInventory />
        </div>

        {/* 핵심 경험 1: 날씨 API (크게) */}
        <div className="col-span-1 lg:col-span-2 border-2 p-4">
           <h3>Case Study: Weather Widget</h3>
           <p>Optimizing with Server Actions & Math...</p>
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