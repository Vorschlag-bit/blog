// RankPostData 타입
export interface RankPostData {
    id: string;
    title: string;
    date: string;
}

// Post 데이터 타입
export interface PostData {
    id: string;
    title: string;
    date: string;
    category: string;
    description: string | '내용 없음';
    content?: string;               // 순수 검색용
    htmlContent: string;           // 상세 페이지용
    [key: string]: any;             // 그 외 메타데이터 허용
}

export interface CategoryData {
    category: string;
    count: number;
}

export interface PaginatedResult<T> {
    posts: T[];
    currentPage: number;
    totalPages: number;
    totalCount: number;
    hasNext: boolean;
    hasPrev: boolean;           
}