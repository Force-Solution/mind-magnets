export const enum ValidationSource {
  HEADERS = 'headers',
  BODY = 'body',
  QUERY = 'query',
  PARAM = 'params',
}

export interface IRequest{
  page: string;
  size: string;
  search?: string;
  sort?: string;
  order?: string;
}