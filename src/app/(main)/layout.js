import CategoryList from "@/components/CategoryList";
import WeatherWidget from "@/components/WeatherWidget";
import VisitorCounter from "@/components/VisitorCounter";

export default function HomeLayout({ children }) {
    return (

    // justify-center로 전체 덩어리를 가운데 정렬 + gap3로 3개의 div 균일한 거리감 조성
    <div className="flex justify-center max-w-[1920px] mx-auto px-4 gap-3">

        <aside className="hidden xl:flex flex-col w-52 gap-4 shrink-0 mt-14 items-center">
            {/** 왼쪽 카테고리 사이드 바 */}
            <CategoryList />
            {/** 날씨 위젯 테스트 */}
            <WeatherWidget />
        </aside>
        {/** 2. 중앙 메인 본문 flex-1로 남은 공간 다 차지 */}
        <main className="flex-1 max-w-4xl w-full min-w-0">
        {/* children = 내가 만들 main 페이지 들어가는 곳 */}
            {children}
        </main>
        
        {/** 3. 오른쪽 균형을 맞추기 위한 투명한 유령 박스 */}
        <div className="hidden xl:block w-52 mr-2 mt-14 shrink-0" aria-hidden="true">
            <VisitorCounter />
        </div>
    </div>
    )
}