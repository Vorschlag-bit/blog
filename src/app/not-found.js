import Link from "next/link";

export default function Notfound() {
    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-10 font-[Galmuri11]">
            <h1 className="text-9xl text-blue-600 mb-4">404</h1>
            <h2 className="text-2xl mb-8">FILE_NOT_FOUND_EXCEPTION</h2>
            <p className="mb-8 text-gray-500">
                찾으시려는 페이지가 삭제되었거나 주소가 유효하지 않습니다.<br/>
                시스템 관리자에게 문의하세요.
            </p>
            <Link href="/" className="bg-blue-600 text-white px-6 py-3 shadow-pixel cursor-pointer hover:bg-blue-800">
                시스템 초기화(홈으로)
            </Link>
        </div>
    );
}