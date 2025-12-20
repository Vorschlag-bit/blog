import { useState,useEffect } from "react";

export function useCounter(target, duration = 1200) {
    const [count,setCount] = useState(0);

    useEffect(() => {
        if (!target || target === null || target === undefined) return;

        const end = parseInt(target, 10);

        const intervalTime = 30;
        const totalFrames = Math.round(duration / intervalTime); // 40fps
        let currentFrames = 0

        const counter = setInterval(() => {
            currentFrames++

            if (currentFrames >= totalFrames) {
                setCount(end);
                clearInterval(counter);
            } else {
                const randomNum = Math.floor(Math.random() * 100000000);
                setCount(randomNum);
            }
        },intervalTime);

        return () => clearInterval(counter)
    },[target, duration])

    return count;
}