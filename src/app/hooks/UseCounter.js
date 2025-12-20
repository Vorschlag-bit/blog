import { useState,useEffect } from "react";

export function useCounter(target, duration = 1000) {
    const [count,setCount] = useState(0);

    useEffect(() => {
        if (!target) return;

        let start = 0
        const end = parseInt(target, 10);
        // 숫자 0부터 촤라락 올라가는 방식

        const totalFrames = Math.round(duration / 10); // 60fps 기준 프레임 수
        const increment = end / totalFrames; // 1프레임당 증가 수

        let currentFrames = 0

        const counter = setInterval(() => {
            currentFrames++
            const progress = currentFrames / totalFrames
            // easeOutExpo 효과 (처음엔 빠르다가 느려짐)
            const currentCount = Math.round(end * (1 - Math.pow(2, -10 * progress)))

            if (currentFrames === totalFrames) {
                setCount(end);
                clearInterval(counter);
            } else {
                setCount(currentCount);
            }
        },16);

        return () => clearInterval(counter)
    },[target, duration])

    return count;
}