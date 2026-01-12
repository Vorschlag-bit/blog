/** main과 비슷하지만 전체가 아니라 필터링된 데이터만 가져오는 함수 */
import Link from "next/link";
import { getPaginatedCategories,getAllCategories } from "@/lib/posts";
import Pagination from "@/components/page/Pagination";
import { notFound } from "next/navigation";

interface CategoryPageProps {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

// paging을 위한 searchParams와 라우팅을 위한 카테고리 params
export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
    // url에서 카테고리 이름 갖고 오기 (ex: "개발")
    // 한글을 깨지므로 decodeURIComponent 사용
    const { slug } = await params
    const category = decodeURIComponent(slug)
    
    // 해당 카테고리 글만 가져오기
    const query = await searchParams
    const page = Number(query?.page) || 1
    const LIMIT = 10

    // return 받은 객체 fields
    const { posts, totalPages, currentPage } = getPaginatedCategories(page, LIMIT, category)

    if (!posts || posts.length === 0) {
        return notFound();
    }

    return (
        <section className="lg:px-1 xl:p-10">
            <h1 className="text-xl lg:text-3xl font-bold mb-2 lg:mb-5 xl:mb-8 flex items-center">
                <svg 
                className="w-6 h-6 lg:w-8 lg:h-8"
                fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M4 4h8v2h10v14H2V4h2zm16 4H10V6H4v12h16V8z" fill="currentColor"/>
                </svg>
                <span className="text-blue-600 ml-2 mr-1.5">{category} </span>관련 글
            </h1>

            { posts.length === 0 ? (
                <p>이 카테고리에는 아직 글이 없습니다.</p>
            ) : (
                <ul className="space-y-2 md:space-y-4">
                    {posts.map(({ id,title,date,description }) => (
                        <li key={id} className="border p-2 lg:p-4 shadow-sm hover:shadow-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                            <p className="text-gray-500 text-xs md:text-sm mb-1">{date}</p>
                            <Link href={`/posts/${id}`}>
                                <h2 className="lg:text-2xl font-bold text-blue-600">{title}</h2>
                            </Link>
                            <p className="text-xs lg:text-base lg:mt-2 text-gray-600 dark:text-gray-400">{description}</p>
                        </li>
                    ))}
                </ul>
            ) }
            <Pagination currentPage={currentPage} totalPages={totalPages} basePath={`/categories/${slug}`} />
        </section>
    )
}