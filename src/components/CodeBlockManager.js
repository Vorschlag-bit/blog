"use client";

import { useEffect } from "react";

export default function CodeBlockManager() {
  useEffect(() => {
    // 1. 모든 코드 블록 찾기
    const preTags = document.querySelectorAll("pre");

    preTags.forEach((pre) => {
      // 중복 방지
      if (pre.querySelector(".copy-btn")) return;

      pre.style.position = "relative";

      // 2. 버튼 생성
      const button = document.createElement("button");
      button.className = "copy-btn";

      // --- 아이콘 SVG 정의 (Heroicons 스타일) ---
      const copyIcon = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        </svg>
      `;

      const checkIcon = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="green" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      `;
      // ---------------------------------------

      // 초기 내용 설정 (아이콘 + 텍스트)
      button.innerHTML = `${copyIcon} <span>Copy</span>`;

      // 3. 버튼 스타일링 (Flexbox로 아이콘과 글자 정렬)
      button.style.position = "absolute";
      button.style.top = "12px";
      button.style.right = "12px";
      button.style.display = "flex"; // 가로 정렬
      button.style.alignItems = "center"; // 수직 중앙 정렬
      button.style.gap = "6px"; // 아이콘과 글자 사이 간격
      button.style.backgroundColor = "rgba(74, 85, 104, 0.8)"; // 약간 투명한 배경
      button.style.color = "white";
      button.style.fontSize = "12px";
      button.style.padding = "6px 10px"; // 패딩을 조금 더 넉넉하게
      button.style.borderRadius = "6px";
      button.style.cursor = "pointer";
      button.style.border = "none";
      button.style.transition = "all 0.2s"; // 부드러운 효과

      // 마우스 올렸을 때 효과
      button.onmouseenter = () =>
        (button.style.backgroundColor = "rgba(74, 85, 104, 1)");
      button.onmouseleave = () =>
        (button.style.backgroundColor = "rgba(74, 85, 104, 0.8)");

      // 4. 클릭 이벤트
      button.addEventListener("click", async () => {
        const code = pre.querySelector("code")?.innerText;
        if (!code) return;

        try {
          await navigator.clipboard.writeText(code);

          // 성공 시 아이콘과 텍스트 변경
          button.innerHTML = `${checkIcon} <span style="color: #86efac;">Copied!</span>`;

          // 1초 뒤 원상복구
          setTimeout(() => {
            button.innerHTML = `${copyIcon} <span>Copy</span>`;
          }, 1000);
        } catch (err) {
          console.error("복사 실패", err);
        }
      });

      pre.appendChild(button);
    });
  }, []);

  return null;
}
