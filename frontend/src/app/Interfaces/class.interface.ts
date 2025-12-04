
export interface AddClass {
    name: string;
}


export interface Class {
    id: string;
    courseName: string;
    className: string;

    showEdit?: boolean;
    showDelete?: boolean;
}

export interface ConnectCLass {
    id: string;
}
