import {POS, toastType} from "./Arguments";

export interface Entry_Model {
    id: number,
    a: string,
    b: string,
    pos: POS,
    index: number
}

export interface Account_Model {
    id: number,
    username: string,
    name: string,
    creation_date: Date,
    quizzes: Quiz_Model[]
}

export interface Quiz_Model {
    id: number,
    owner_id: number,
    entries: Entry_Model[],
    title: string,
    description?: string
}

export interface ToastModel {
    open: boolean,
    title: string,
    description: string,
    type: toastType
}