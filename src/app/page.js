import Link from "next/link"
import { getSortedPostsData } from "@/lib/posts"

export default function Home() {
  // 함수 실행시켜 글목록 가져오기
  const allPosts = getSortedPostsData()

  return (
    // Tailwind CSS(className="...")
    <div className="p-10">
      <section>
      <h1 className="text-4xl font-bold mb-8">블로그 글 목록 📝</h1>
      
      <ul className="space-y-4"></ul>
      {/** map으로 반복문 돌리기 */}
      {allPosts.map(({id, title, date, description}) => (
        <li key={id} className="border p-4 rounded-lg shadow-sm hover:shadow-md transition">
          <p className="text-gray-500 text-sm">{date}</p>

          {/** Link 컴포넌트로 감싸기 */}
          <Link href={`/posts/${id}`}>
            <h2 className="text-2xl font-bold text-blue-600 cursor-pointer hover:underLine">
              {title}
            </h2>
          </Link>
          <p className="mt-2 text-gray-700">{description}</p>
        </li>
      ))}
      </section>
    </div>
  )
}