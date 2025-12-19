import { NextResponse } from "next/server";

export async function GET(request) {
    // 1. 유저 Ip 추출
    const Ip = request.ip;

    // 2. 오늘 날짜 계산
    const now = new Date();
    const kstAbs = now.getTime() + (9 * 60 * 60 * 1000);
    const today = new Date(kstAbs);
    const iso = today.toISOString().slice(0,10).replace(/-/g, "");

    // 3.
}