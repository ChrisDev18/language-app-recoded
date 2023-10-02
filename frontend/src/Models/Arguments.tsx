
import {Account_Model, Quiz_Model} from "./Models";


const parts_of_speech = ["NULL", "ADJ", "DET", "INTJ", "NOUN", "NUM","PRON", "PROPN", "VERB"] as const;
export type POS = typeof parts_of_speech[number];

export interface Home_Args {
    accountData: Account_Model,
    setAccountData: any,
    setQuiz: any,
    setMainContent: any
}

export interface Quiz_Args {
    setMainContent: any,
    init_data?: Quiz_Model,
    init_editMode?: boolean
}

export interface Entry_Args {
    dataModel: any,
    setDataModel: any,
    id: number,
    editable?: boolean
}

export interface Quiz_Instance_Args {
    quiz: Quiz_Model,
    setQuiz: any,
    setMainContent: any,
    getQuizzes: any,
    setToastProperty: any
}

export interface LoadingOverlayArgs {
    active: boolean,
    message: string
}

const toastTypes = ['error', 'success'] as const
export type toastType = typeof toastTypes[number];

export interface ToastArgs {
    properties: {
        open: boolean,
        title: string,
        description: string,
        type: toastType
    }

    setProperties: any
}