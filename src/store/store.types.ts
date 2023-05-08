import { RawAxiosRequestHeaders } from 'axios';


export type RequestTypes = 'Get' | 'Post' | 'Search' | 'Delete' | 'Patch';

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
  Delete: {
    RequestParametersType: { [paramName: string]: any };
    ResultType: any;
    ErrorType: any;
  };
  Patch: {
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
 * Document represents requests for a single object from a given store slice. For example, a store * slice might be capable of requesting a collection of performers, or a single performer by their UUID
 */
export type GetRequestTypes = 'Collection' | 'Document';
