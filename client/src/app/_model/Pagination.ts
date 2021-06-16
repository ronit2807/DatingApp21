export interface Pagination {
    currenPage: number;
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
};

export class PaginatedResult<T> {
    result: T;
    pagination: Pagination;
    

}

export class PaginatedResult2<T> {
    result: T;
    pagination: Pagination;

    constructor(result: T,pagination: Pagination){
        this.result=result;
        this.pagination=pagination;
    }
    

}