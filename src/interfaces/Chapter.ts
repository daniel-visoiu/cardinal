export interface Chapter {
    index?: number;
    data: string;
    guid: string;
    children: Array<Chapter>;
}