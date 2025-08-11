export type PagingRequest = {
  pageIndex?: number;
  pageSize?: number;
  orderBy?: string;
  searchKey?: string;
};

export type PagingData<T> = {
  data: T[];
  pageSize: number;
  pageIndex: number;
  totalPages: number;
  totalItems: number;
};

export interface IMessageResponse {
  message: string;
}

export type OptionType = {
  value?: string | number | null;
  label?: string | React.ReactNode;
};

export type Options = OptionType[];
