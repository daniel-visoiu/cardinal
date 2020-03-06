export interface StyleCustomisation{
    toast?: {
        header?: {
            style?: { [key: string]: string; },
            title?: string
        },
        body?:{
            style?: { [key: string]: string; },
            content?: string
        },
        feedback?: {
            style?: { [key: string]: string; }
        }
    }
    alert?: {
        style? :{ [key: string]: string; },
        content?: string
    }
}
