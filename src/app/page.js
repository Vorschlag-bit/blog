import Link from "next/link";
import { getSortedPostsData } from "@/lib/posts";

export default function Home() {
  const allPostsData = getSortedPostsData();

  return (
    <div className="p-10">
      <section>
        <h1 className="flex items-center text-4xl font-bold mb-8 font-[Galmuri11]">
        <svg className="w-10 h-10" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="M2 3h20v18H2V3zm18 16V5H4v14h16zM8 7H6v2h2V7zm2 0h8v2h-8V7zm-2 4H6v2h2v-2zm2 0h8v2h-8v-2zm-2 4H6v2h2v-2zm2 0h8v2h-8v-2z" fill="currentColor"/>
        </svg>
        <span className="ml-3">블로그 글 목록</span>
        </h1>
        
        <ul className="space-y-6 list-none"> 
          {allPostsData.map(({ id, title, date, description, category }) => (
            <li 
              key={id} 
              // 2. text-black을 줘서 currentColor가 검은색을 잡도록 명시
              className="relative p-4 bg-white dark:bg-gray-800 shadow-pixel hover:translate-x-1 hover:translate-y-1 transition-transform text-black dark:text-gray-100"
            >
              {/* <div className="absolute -left-3 top-4 hidden sm:block">
                👾
              </div> */}

              <div className="flex items-center gap-2 mb-2">
                <Link href={`/categories/${category}`}>
                  {/* 뱃지도 픽셀 스타일 (rounded 제거) */}
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 border-2 border-blue-200 hover:underline cursor-pointer dark:bg-blue-900 dark:text-blue-300 dark:border-blue-700">
                    {category}
                  </span>
                </Link>
                <p className="text-gray-500 text-sm font-[Galmuri11]">{date}</p>
              </div>

              <Link href={`/posts/${id}`}>
                <h2 className="text-2xl font-bold text-blue-600 cursor-pointer dark:text-blue-400 font-[Galmuri11]">
                  <span className="mr-2 text-black dark:text-white"></span>
                  {title}
                </h2>
              </Link>
              <p className="mt-2 text-gray-700 dark:text-gray-300">{description}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}