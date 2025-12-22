"use client"
import mermaid from "mermaid"
import { useEffect } from "react"

export default function MermaidInit() {
    useEffect(() => {
        mermaid.initialize({ 
            startOnLoad: true,
            theme: 'dark',
        })
        mermaid.contentLoaded()
    },[]);
    return null;
}