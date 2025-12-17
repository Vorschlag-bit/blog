/** main과 비슷하지만 전체가 아니라 필터링된 데이터만 가져오는 함수 */
import LoadingLink from "@/components/LoadingLink";
import { getPaginatedCategories } from "@/lib/posts";
import Pagination from "@/components/Pagination";

// paging을 위한 searchParams와 라우팅을 위한 카테고리 params
export default async function CategoryPage({ params, searchParams }) {
    // url에서 카테고리 이름 갖고 오기 (ex: "개발")
    // 한글을 깨지므로 decodeURIComponent 사용
    const { slug } = await params
    const category = decodeURIComponent(slug)
    
    // 해당 카테고리 글만 가져오기
    const query = await searchParams
    const page = Number(query?.page) || 1
    const LIMIT = 10

    // return 받은 객체 fields
    const { posts, totalPages, curPage } = getPaginatedCategories(page, LIMIT, category)

    return (
        <section className="p-10">
            <h1 className="text-3xl font-bold mb-8 flex items-center">
                <svg 
                className="w-8 h-8"
                fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M4 4h8v2h10v14H2V4h2zm16 4H10V6H4v12h16V8z" fill="currentColor"/>
                </svg>
                <span className="text-blue-600 ml-2 mr-1.5">{category} </span>관련 글
            </h1>

            { posts.length === 0 ? (
                <p>이 카테고리에는 아직 글이 없습니다.</p>
            ) : (
                <ul className="space-y-4">
                    {posts.map(({ id,title,date,description }) => (
                        <li key={id} className="border p-4 shadow-sm hover:shadow-md transition">
                            <p className="text-gray-500 text-sm mb-1">{date}</p>
                            <LoadingLink href={`/posts/${id}`}>
                                <h2 className="text-2xl font-bold text-blue-600">{title}</h2>
                            </LoadingLink>
                            <p className="mt-2 text-gray-600 dark:text-gray-400">{description}</p>
                        </li>
                    ))}
                </ul>
            ) }
            <Pagination currentPage={curPage} totalPages={totalPages} basePath={`/categories/${slug}`} />
        </section>
    )
}