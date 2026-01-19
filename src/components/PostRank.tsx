import Link from "next/link";
import { getRank } from "@/lib/ranks";

export default async function PostRank() {
    const data = await getRank() || [];
    
    return (
        //  최상위 div
        <div className="relative top-6 w-60 flex flex-col items-start gap-3">
            {/* header */}
            <p className="flex items-center w-59 border-b-[2px] border-gray-400 border-dashed p-1 whitespace-wrap font-bold pb-3 gap-2">
                <svg className="w-6 dark:text-white" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"> <path d="M5 3H3v18h18V3H5zm14 2v14H5V5h14zM9 11H7v6h2v-6zm2-4h2v10h-2V7zm6 6h-2v4h2v-4z" fill="currentColor"/> </svg>
                <span className="dark:text-gray-200">인기 글</span>
            </p>
                <div className="w-full">
                    {data.length > 0 ? (
                    // top5 있을 때
                    <ul className="flex flex-col gap-1">
                        {data.map((post) => (
                            <li key={post.id}
                                className="group p-2 border border-gray-500 hover:border-indigo-700 w-full transition-colors"
                            >
                                <Link href={`/posts/${post.id}`} className="" prefetch={false}>
                                    <p className="font-bold text-black truncate group-hover-glitch dark:text-gray-300 mb-1">{post.title}</p>
                                    <p className="text-gray-400 text-xs">{post.date}</p>
                                </Link>
                            </li>
                        ))}
                    </ul>
                ) : (
                    // top5 없을 때
                    <div className="flex items-center absolute text-sm text-red-400 dark:text-red-200 top-[5em] left-[2em] border border-red-500 p-2 gap-2">
                        <svg className="w-5" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"> <path d="M3 3h16v2H5v14h14v2H3V3zm18 0h-2v18h2V3zM11 15h2v2h-2v-2zm2-8h-2v6h2V7z" fill="currentColor"/> </svg>
                        <span>DB 조회 실패</span>
                    </div>
                )}
            </div>
        </div>
    )
}