import { RequiredParams } from "../ApiCommons";

export interface ParamsPostDescargaCsv extends RequiredParams{
  page: number;
  page_size: number;
}

export interface RespuestaPostDescargaCsv{
  body: string;
  message: string;
}

