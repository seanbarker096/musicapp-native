import { RawAxiosRequestHeaders } from 'axios';

export interface StoreSlice {
  Name: string;
  ObjectType: { [property: string]: any };
  Get: {
    RequestParametersType: { [paramName: string]: any };
    ResultType: any;
    ErrorType: any;
  };
  Post: {
    RequestBodyType: {
      [fieldName: string]: any;
    };
    ResultType: any;
    ErrorType: any;
  };
  Search: {
    RequestBodyType: {
      [fieldName: string]: any;
    };
    ResultType: any;
    ErrorType: any;
  };
}

export interface GetRequestConfig<S extends StoreSlice> {
  Headers: RawAxiosRequestHeaders;
  Params: S['Get']['RequestParametersType'];
}

/**
 * Document represents requests for a single object from a given store slice. For example, a store * slice might be capable of requesting a collection of artists, or a single artist by their UUID
 */
export type GetRequestTypes = 'Collection' | 'Document';