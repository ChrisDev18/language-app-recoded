import {POS} from "./Arguments";
import {Account_Model} from "./Models";

export const PARTS_OF_SPEECH: {id: POS, name: string}[] = [
    {id: "NULL", name: "don't define"},
    {id: "ADJ", name: "adjective"},
    {id: "DET", name: "determiner"},
    {id: "INTJ", name: "interjection"},
    {id: "NOUN", name: "noun"},
    {id: "NUM", name: "numeral"},
    {id: "PRON", name: "pronoun"},
    {id: "PROPN", name: "proper noun"},
    {id: "VERB", name: "verb"}
]

export const account: Account_Model = {
    id: 1,
    name: "Chris",
    username: "",
    creation_date: new Date(2023, 5, 12),
    quizzes: []
};