import Link from "next/link";

export default function Notfound() {
    return (
        <div id="global-not-found" className="min-h-[70vh] flex flex-col items-center justify-center text-center p-10 font-[Galmuri11]">
            <h1 className="text-9xl text-blue-600 mb-4">404</h1>
            <h2 className="text-2xl mb-8">FILE_NOT_FOUND_EXCEPTION</h2>
            <div className="mb-8 flex items-center gap-2">
                <svg className="w-8 h-8 shrink-0 text-red-500" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"> <path d="M13 1h-2v2H9v2H7v2H5v2H3v2H1v2h2v2h2v2h2v2h2v2h2v2h2v-2h2v-2h2v-2h2v-2h2v-2h2v-2h-2V9h-2V7h-2V5h-2V3h-2V1zm0 2v2h2v2h2v2h2v2h2v2h-2v2h-2v2h-2v2h-2v2h-2v-2H9v-2H7v-2H5v-2H3v-2h2V9h2V7h2V5h2V3h2zm0 4h-2v6h2V7zm0 8h-2v2h2v-2z" fill="currentColor"/> </svg>
                <span className="text-gray-500">
                    찾으시려는 페이지가 삭제되었거나 주소가 유효하지 않습니다.
                </span>
            </div>
            <p className="mb-8 text-gray-500">시스템 관리자에게 문의하세요.</p>
            <Link href="/" className="bg-blue-600 text-white px-6 py-3 shadow-pixel cursor-pointer hover:bg-blue-800">
                시스템 초기화(홈으로)
            </Link>
        </div>
    );
}