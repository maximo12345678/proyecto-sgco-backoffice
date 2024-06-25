import { RequiredParams } from "../ApiCommons";

export interface ConfigContadorPutParam {
  id: number;
  diasMaximos: number;
}

export interface ParamsPutConfigContadores extends RequiredParams {
  marca_id: number;
  configuraciones: ConfigContadorPutParam[];
}
