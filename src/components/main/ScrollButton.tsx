"use client"

export default function ScrollButton() {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" })
    }
    const scrollToBottom = () => {
        const footer = document.querySelector('footer')
        if (footer) {
            footer.scrollIntoView({ behavior: "smooth", block: "end" })
        } else {
            window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" })
        }
    }

    return (
        <div className="xl:hidden fixed bottom-6 right-8 flex flex-col gap-2 z-80">
            {/* top */}
            <button
                onClick={scrollToTop}
                className="flex items-center border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-500 p-2 hover:bg-gray-200 dark:hover:bg-gray-500 transition shadow-pixel cursor-pointer" title="맨 위로"
            >
                <svg className="w-5 h-5" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"> <path d="M4 6h16V4H4v2zm7 14h2v-8h2v2h2v-2h-2v-2h-2V8h-2v2H9v2H7v2h2v-2h2v8z" fill="currentColor"/> </svg>
            </button>
            {/* bottom */}
            <button
                onClick={scrollToBottom}
                className="flex items-center border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-500 p-2 hover:bg-gray-200 dark:hover:bg-gray-500 transition shadow-pixel cursor-pointer" title="맨 아래로"
            >
                <svg className="w-5 h-5" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"> <path d="M11 4h2v8h2v2h-2v2h-2v-2H9v-2h2V4zm-2 8H7v-2h2v2zm6 0v-2h2v2h-2zM4 18h16v2H4v-2z" fill="currentColor"/> </svg>
            </button>
        </div>
    )
}
