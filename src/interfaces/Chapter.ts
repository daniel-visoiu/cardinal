export interface Chapter {
    index?: number;
    title: string;
    guid: string;
    children: Array<Chapter>;
}