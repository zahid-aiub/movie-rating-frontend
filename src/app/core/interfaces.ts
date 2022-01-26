export interface ApiResponse<T> {
    statusCode: number;
    message: string;
    data: T
}

export interface PaginatedData<T> {
    totalElements: number;
    next?: string;
    previous: string;
    content: T[];
}
