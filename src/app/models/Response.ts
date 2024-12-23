export interface Response{
    code:string;
    message:string;
    body:any;
}

export interface ErrorDTO<T> {
    code: string;
    message: string;
    body: T;
  }
  