import Image from "next/image";
import Link from "next/link";
import RetroWindow from "@/components/main/RetroWindow";
import TechInventory from "@/components/about/TechInventory";
import LighthouseCircle from "@/components/about/LighthouseCircle";
import BuildingLogs from "@/components/about/Buildinglogs";
import ExComponent from "@/components/about/ExComponent";
import { getPostsByCategory } from "@/lib/posts";
import CerComponent from "@/components/about/CerComponent";

// 아이콘 정적 로딩
import Git from '@/assets/icons/git.svg'
import Github from '@/assets/icons/github.svg'
import Java from '@/assets/icons/java.svg'
import Js from '@/assets/icons/js.svg'
import Kotlin from '@/assets/icons/kotlin.svg'
import MariaDB from '@/assets/icons/mariadb.svg'
import Next from '@/assets/icons/nextjs2.svg'
import Postgresql from '@/assets/icons/postgresql.svg'
import Python from '@/assets/icons/python.svg'
import React from '@/assets/icons/react.svg'
import Redis from '@/assets/icons/redis.svg'
import Spring from '@/assets/icons/spring.svg'
import Tailwind from '@/assets/icons/tailwindcss.svg'
import Ts from '@/assets/icons/typescript.svg'
import Vercel from '@/assets/icons/vercel.svg'
import { Techitem } from "@/types/tech_type";

const TECH_STACK: Techitem[] = [
    { name: "Javascript", icon: Js, tags: ["Language", "Frontend"] },
    { name: "Typescript", icon: Ts, tags: ["Language", "Frontend"] },
    { name: "Java", icon: Java, tags: ["Language", "Backend"] },
    { name: "Kotlin", icon: Kotlin, tags: ["Language", "Backend"] },
    { name: "Python", icon: Python, tags: ["Language", "Database"] },
    { name: "React", icon: React, tags: ["Framework", "Frontend"] },
    { name: "Next.js", icon: Next, tags: ["Framework", "Frontend"] },
    { name: "TailwindCSS", icon: Tailwind, tags: ["Framework", "Frontend"] },
    { name: "Spring", icon: Spring, tags: ["Framework", "Backend"] },
    { name: "Redis", icon: Redis, tags: ["Database"] },
    { name: "MariaDB", icon: MariaDB, tags: ["Database"] },
    { name: "Postgresql", icon: Postgresql, tags: ["Database"] },
    { name: "Git", icon: Git, tags: ["Tools & Deployment"] },
    { name: "Github", icon: Github, tags: ["Tools & Deployment"] },
    { name: "GithubActions", icon: Github, tags: ["Tools & Deployment"] },
    { name: "VercelDeployment", icon: Vercel, tags: ["Tools & Deployment"] },
]

const CATEGORIES = ["ALL", "Frontend", "Backend", "Database", "Tools & Deployment"]


const pixelShadow = "shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
const devPosts = getPostsByCategory('개발')

export default async function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto p-4 space-y-8">
      {/* 1. Hero: 자기소개 */}
      <RetroWindow title="Reading: Developer, Vorschlag" className="bg-gray-100 dark:bg-gray-800">
        <section className="flex-col md:flex md:flex-row gap-6 md:items-center">
          <div className="relative w-30 h-30 lg:w-52 lg:h-52">
              <Image fill className="object-contain" src={'/images/character.png'} alt="캐릭터 이미지" priority={true} sizes="(max-width: 768px) 100vw, 300px" />
          </div>
          <div className="flex flex-col gap-2">
              <div className="flex gap-2 items-center">
                <svg className="w-8" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"> <path d="M3 3h18v18H3V3zm16 16V5H5v14h14zM14 7h-4v4h4V7zm1 6H9v2H7v2h2v-2h6v2h2v-2h-2v-2z" fill="currentColor"/> </svg>
                <h1 className="text-base lg:text-2xl font-bold">Developer: <span className="text-blue-600">Vorschlag</span></h1>
              </div>
              <p className="text-sm lg:text-base font-bold">1998.03.12</p>
              <p className="text-sm lg:text-base">Full-stack Developer</p>
              <p className="text-xs lg:text-base">최적화와 DX(개발자 경험)을 고민하는 개발자입니다.</p>
              <p className="text-xs lg:text-base">단순한 기능 구현을 넘어, 시스템의 비효율을 발견하고 개선하는 과정에 몰입합니다.<br></br>
              문제를 기술적 근거를 바탕으로 해결책을 설계하고, 그 경험을 기록하여 자산으로 만듭니다.
              </p>
              <div className="text-sm font-bold lg:text-lg flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 w-5 lg:w-7 lg:h-7" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"> <path d="M2 3H0v18h24V3H2zm20 2v14H2V5h20zM10 7H6v4h4V7zm-6 6h8v4H4v-4zm16-6h-6v2h6V7zm-6 4h6v2h-6v-2zm6 4h-6v2h6v-2z" fill="currentColor"/> </svg>
                    <span>Contact</span>
                  </div>
                  <div className="text-xs lg:text-base flex items-center gap-2" >
                      <svg className="w-5 lg:w-7" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"> <path fill="currentColor" d="M5 2h4v2H7v2H5V2Zm0 10H3V6h2v6Zm2 2H5v-2h2v2Zm2 2v-2H7v2H3v-2H1v2h2v2h4v4h2v-4h2v-2H9Zm0 0v2H7v-2h2Zm6-12v2H9V4h6Zm4 2h-2V4h-2V2h4v4Zm0 6V6h2v6h-2Zm-2 2v-2h2v2h-2Zm-2 2v-2h2v2h-2Zm0 2h-2v-2h2v2Zm0 0h2v4h-2v-4Z"/> </svg>
                      <span>Github: </span>
                      <Link href={'https://github.com/Vorschlag-bit'}>github.com/Vorschlag-bit</Link>
                  </div>
                  <div className="text-xs lg:text-base flex items-center gap-2">
                      <svg className="w-5 lg:w-7" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"> <path d="M22 4H2v16h20V4zM4 18V6h16v12H4zM8 8H6v2h2v2h2v2h4v-2h2v-2h2V8h-2v2h-2v2h-4v-2H8V8z" fill="currentColor"/> </svg>
                      <span>Mail: bustout@naver.com</span>
                  </div>
                  <div className="text-xs lg:text-base flex items-center gap-2">
                      <svg className="w-5 lg:w-7" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"> <path d="M2 3h20v18H2V3zm18 16V7H4v12h16z" fill="currentColor"/> </svg>  
                      <span>Blog: </span>
                      <Link href={'https://github.com/Vorschlag-bit'}>vorschlag-blog.vercel.app</Link>
                  </div>
              </div>
          </div>
        </section>
      </RetroWindow>

      {/* 2. Grid Layout 시작 */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
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
            <LighthouseCircle score={93} label="Performance" size={150} strokeWidth={8} />
            <div className="flex justify-around w-full gap-2 mt-2">
              <div className="flex flex-col items-center">
                <span className="text-2xl font-bold text-green-500">0.5s</span>
                <span className="text-xs text-gray-500">FCP</span>
              </div>
              <div className="w-[1px] h-8 bg-gray-300"></div>
              <div className="flex flex-col items-center">
                <span className="text-2xl font-bold text-green-500">1.3s</span>
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
           <TechInventory techStack={TECH_STACK} categories={CATEGORIES} />
        </div>
      </section>

      {/* 3. ExpCompnent 시작 */}
      <ExComponent />
      
      {/* 3. Build Logs (Terminal Style) */}
      <section className={`border-2 border-black dark:border-gray-500 bg-gray-900 text-gray-200 p-4 font-mono text-sm ${pixelShadow}`}>
          <div className="flex justify-between items-center mb-4 border-b border-gray-700 pb-2">
              <span className="text-green-400 font-bold">{`> cat build_logs.txt`}</span>
              <div className="flex gap-1">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
          </div>

          <BuildingLogs posts={devPosts} />
      </section>

      {/* 4. 교육 및 어학(자격증) */}
      <CerComponent />

    </div>
  );
}