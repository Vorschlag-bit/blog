import CategoryList from "@/components/CategoryList";

export default function HomeLayout({ children }) {
    return (

    // justify-center로 전체 덩어리를 가운데 정렬
    <div className="flex justify-center max-w-[1920px] mx-auto px-4">

        {/** 1. 왼쪽 카테고리 사이드 바 */}
        <CategoryList />

        {/** 2. 중앙 메인 본문 */}
        <main className="max-w-4xl w-full min-w-0">
        {/* children = 내가 만들 main 페이지 들어가는 곳 */}
            {children}
        </main>
        
        {/** 3. 오른쪽 균형을 맞추기 위한 투명한 유령 박스 */}
        {/** 왼쪽 사이드바(w-64 + mr-8)와 합친 너비만큼 공간 차지 */}
        <div className="hidden xl:block w-52 ml-6 shrink-0" aria-hidden="true" />

    </div>
    )
}