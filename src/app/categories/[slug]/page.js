/** main과 비슷하지만 전체가 아니라 필터링된 데이터만 가져오는 함수 */
import Link from "next/link";
import { getPostsByCategory } from "@/lib/posts";

export default async function CategoryPage({ params }) {
    // url에서 카테고리 이름 갖고 오기 (ex: "개발")
    // 한글을 깨지므로 decodeURIComponent 사용
    const { slug } = await params
    const category = decodeURIComponent(slug)
    
    // 해당 카테고리 글만 가져오기
    const categoryPosts = getPostsByCategory(category)

    return (
        <div className="p-10">
            <h1 className="text-3xl font-bold mb-8">
                📂 <span className="text-blue-600">{category}</span> 관련 글
            </h1>

            { categoryPosts.length === 0 ? (
                <p>이 카테고리에는 아직 글이 없습니다.</p>
            ) : (
                <ul className="space-y-4">
                    {categoryPosts.map(({ id,title,date,description }) => (
                        <li key={id} className="border p-4 shadow-sm hover:shadow-md transition">
                            <p className="text-gray-500 text-sm mb-1">{date}</p>
                            <Link href={`/posts/${id}`}>
                                <h2 className="text-2xl font-bold hover:underline">{title}</h2>
                            </Link>
                            <p className="mt-2 text-gray-600 dark:text-gray-400">{description}</p>
                        </li>
                    ))}
                </ul>
            ) }
        </div>
    )
}