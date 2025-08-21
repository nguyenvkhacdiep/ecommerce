import { IMessageResponse, PagingData, PagingRequest } from '@/common/type';
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

export async function getUserById(id: string): Promise<IUserResponse> {
  const response = await axiosInstance.get(`/Users/get-user/${id}`);
  return response.data;
}

export async function addUser(payload: IAddUserPayload): Promise<string> {
  const response = await axiosInstance.post('/Users/add-user', payload);
  return response.data;
}

export async function editUser(
  userId: string,
  payload: IAddUserPayload,
): Promise<IMessageResponse> {
  const response = await axiosInstance.put(`/Users/edit-user/${userId}`, payload);
  return response.data;
}

export async function inactiveUser(userId: string): Promise<IMessageResponse> {
  const response = await axiosInstance.patch(`/Users/inactive-user/${userId}`);
  return response.data;
}

export async function deleteUser(userId: string): Promise<IMessageResponse> {
  const response = await axiosInstance.delete(`/Users/${userId}`);
  return response.data;
}
