import { getAllCategories } from "@/lib/posts";
import Link from "next/link";

export default function CategoryList() {
    const sortedCategories = getAllCategories()
    return (
        <aside> {/** 가장 바깥의 테두리 박스 */}
            <div className="p-4 border-2 border-black dark:border-gray-500 bg-white dark:bg-gray-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]">
                <h3 className="font-bold mb-4 border-b-2 border-dashed border-gray-400 pb-2 text-lg font-[Galmuri11]">
                    카테고리 목록
                </h3>
                <ul>
                    {sortedCategories.map(({category, count}) => (
                        <li key={category}>
                            <Link 
                                // All이면 main으로 아니면 카테고리 분류 페이지로
                                href={category === "All" ? "/" : `/categories/${category}`}
                            >
                                <span>{category}</span>
                                <span>{`(${count})`}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </aside>
    )
}