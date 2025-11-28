import { getAllCategories } from "@/lib/posts";
import Link from "next/link";

export default function CategoryList() {
    const sortedCategories = getAllCategories()
    return (
        <aside> {/** 가장 바깥의 테두리 박스 */}
            <div>
            <ul>
                {sortedCategories.map((category) => (
                    <li key={category}>
                        <Link href={`/categories/${category}`}>
                            {category}
                        </Link>
                    </li>
                ))}
            </ul>
            </div>
        </aside>
    )
}