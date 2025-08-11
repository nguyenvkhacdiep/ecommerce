import { PagingData, PagingRequest } from '@/common/type';
import axiosInstance from './axiosConfig';
import { queryParamsBuilder } from '@/utils/common';
import { IUserResponse } from './auth';

export interface IAddUserPayload {
  username: string;
  email: string;
  urlAvatar?: string;
  roleId: string;
}

export async function getAllUsers(option?: PagingRequest): Promise<PagingData<IUserResponse>> {
  const response = await axiosInstance.get(`/Users/get-all-users?${queryParamsBuilder(option)}`);
  return response.data;
}

export async function addUser(payload: IAddUserPayload): Promise<string> {
  const response = await axiosInstance.post('/Users/add-user', payload);
  return response.data;
}
