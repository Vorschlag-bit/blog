import Link from "next/link";
import LoadingLink from "@/components/LoadingLink";
import RetroWindow from "@/components/RetroWindow";
// pagination을 위한 함수 및 리모컨 컴포넌트
import { getPaginatedPosts } from "@/lib/posts";
import Pagination from "@/components/Pagination";

interface HomeProps {
  // Next.js에선 쿼리 파라미터는 string, string[](같은 키 중복), 혹은 undefined 가능
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function Home({ searchParams }: HomeProps) {
  // Next.js 15부턴 searchParams에 await
  const params = await searchParams;
  
  const pageParam = params.page;
  const page = Number(Array.isArray(pageParam) ? pageParam[0] : pageParam) || 1;
  // 최대 보여줄 개수
  const LIMIT = 10;
  // 데이터 가져오기
  const { posts, totalPages, currentPage } = getPaginatedPosts(page,LIMIT);
  
  return (
    <div className="w-full mx-auto xl:p-4">
      {/** RetroWindow로 감싸기 */}
      <RetroWindow title="C:\Users\DevLog\posts_list.exe" className="">
        <section>
          <h1 className="flex items-center mb-1 font-bold text-xl md:text-2xl lg:text-4xl lg:mb-8">
          <svg className="w-7 h-7 md:w-10 h-10" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path d="M2 3h20v18H2V3zm18 16V5H4v14h16zM8 7H6v2h2V7zm2 0h8v2h-8V7zm-2 4H6v2h2v-2zm2 0h8v2h-8v-2zm-2 4H6v2h2v-2zm2 0h8v2h-8v-2z" fill="currentColor"/>
          </svg>
          <span className="ml-3">블로그 글 목록</span>
          </h1>
        
          <ul className="space-y-6 list-none">
            {posts.map(({ id, title, date, description, category }) => (
              <li
                key={id}
                // 2. text-black을 줘서 currentColor가 검은색을 잡도록 명시
                className={`
                  relative p-2 lg:p-4 transition-all duration-200 group
                  bg-white text-black shadow-pixel
                  dark:bg-gray-900 dark:text-gray-100 dark:border-gray-500
                  hover:bg-blue-50 dark:hover:bg-gray-800
                `}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Link href={`categories/${category}`}>
                    {/* 뱃지도 픽셀 스타일 (rounded 제거) */}
                    <span className="bg-blue-100 text-blue-800 text-xs px-1 lg:px-2 py-1 border-1 lg:border-2 border-blue-200 hover:underline cursor-pointer dark:bg-blue-900 dark:text-blue-300 dark:border-blue-700">
                      {category}
                    </span>
                  </Link>
                  <p className="text-gray-500 text-xs lg:text-sm font-[Galmuri11]">{date}</p>
                </div>
                <LoadingLink href={`posts/${id}`} className={``}>
                  <h2 className="text-base md:text-xl lg:text-2xl font-bold text-blue-600 cursor-pointer dark:text-blue-400 font-[Galmuri11] gap-2">
                    {title}
                  </h2>
                  <p className="text-xs md:text-sm lg:text-base mt-1 text-gray-700 dark:text-gray-300">{description}</p>
                </LoadingLink>
              </li>
            ))}
          </ul>
          {/* Pagination UI 추가 */}
          <Pagination currentPage={currentPage} totalPages={totalPages} />
        </section>
      </RetroWindow>
    </div>
  );
}