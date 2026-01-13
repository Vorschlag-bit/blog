// 서버 함수 호출해서 initalData 제공하는 함수 컴포넌트
import VisitorCounter from "./VisitorCounter"
import { getCachedCounts } from "@/lib/visitor"

const DATE_PREFIX = "blog-visit-date"

export async function VisitorContainer() {
    // 서버 함수 호출
    // 2. 오늘 날짜 계산
    const now = new Date();
    const kstAbs = now.getTime() + (9 * 60 * 60 * 1000);
    const today = new Date(kstAbs);
    const iso = today.toISOString().slice(0,10).replace(/-/g, "");

    // 3. 일일 방문자 및 총 방문자 수
    const dateKey = `${DATE_PREFIX}:${iso}`
    const { total,date } = await getCachedCounts(dateKey)
    return (
        <VisitorCounter total={total} date={date} />
    )
}