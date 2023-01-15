import { RawAxiosRequestHeaders } from 'axios';

export interface StoreSlice {
  Name: string;
  Get: {
    RequestParametersType: { [paramName: string]: any };
    ResultType: any;
    ErrorType: any;
  };
}

export interface GetRequestConfig<S extends StoreSlice> {
  Headers: RawAxiosRequestHeaders;
  Params: S['Get']['RequestParametersType'];
}
