// src/components/ScrollProgress.js
"use client";

import { useEffect, useState } from "react";

export default function ScrollProgress() {
const [scrollWidth, setScrollWidth] = useState(0);

useEffect(() => {
    const handleScroll = () => {
      // 전체 스크롤 가능한 높이
    const totalHeight = document.body.scrollHeight - window.innerHeight;
    if (totalHeight === 0) return;

      // 현재 위치
    const currentScroll = window.scrollY;
      // 퍼센트 계산
      setScrollWidth((currentScroll / totalHeight) * 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
}, []);

return (
    <div className="mt-6">
    <div className="flex justify-between text-xs mb-1 font-bold text-gray-500">
        <span>READING...</span>
        <span>{Math.round(scrollWidth)}%</span>
    </div>
      {/* 바깥 테두리 */}
    <div className="w-full h-4 border-2 border-black dark:border-gray-500 bg-gray-200 dark:bg-gray-700 p-0.5">
        {/* 채워지는 막대 (그라데이션 효과) */}
        <div 
            className="h-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-150 ease-out"
            style={{ width: `${scrollWidth}%` }}
        />
    </div>
    </div>
);
}