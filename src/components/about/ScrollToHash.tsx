"use client"

import { useEffect } from "react"

export default function ScrollToHash() {
    useEffect(() => {
        // hash 태그가 있을 경우에만 사용
        if(window.location.hash) {
            
            const id = decodeURI(window.location.hash.replace("#", ""))

            setTimeout(() => {
                const element = document.getElementById(id)
                if (element) {
                    // console.log('태그로 검색된 element: ', element);
                    
                    element.scrollIntoView({ behavior: "smooth", block: "start" })
                }
            }, 200);
        }
    },[])
    return null
}