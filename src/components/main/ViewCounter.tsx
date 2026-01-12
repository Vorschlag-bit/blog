"use client"

import { useEffect } from "react";
import { ViewCountAction } from "@/lib/viewactions";

// 클라이언트 컴포넌트로서, 화면의 id가 바뀔 때마다 ViewCountAction이라는 server action 호출
export default function ViewCounter({ id }: { id: string }) {
    useEffect(() => {
        ViewCountAction(id);
    },[id])
    return null
}