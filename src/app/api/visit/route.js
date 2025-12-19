import { NextResponse } from "next/server";

// INCR을 통해서 값 return받을 걸 그대로 response로 보내줄 예정
export async function POST(request) {
    const DATE_PREFIX = "blog-visit-date"
    const TOTAL_PREFIX = "blog-visit-total"

    // 1. 유저 Ip 추출
    const Ip = request.ip;

    // 2. 오늘 날짜 계산
    const now = new Date();
    const kstAbs = now.getTime() + (9 * 60 * 60 * 1000);
    const today = new Date(kstAbs);
    const iso = today.toISOString().slice(0,10).replace(/-/g, "");
    

    // 3. 일일 방문자 수
    const date_key = `${DATE_PREFIX}:${iso}-${Ip}`



    // 4. 전체 방문자 수
    // 해당 일일 방문이 유니크하면 INCR
}