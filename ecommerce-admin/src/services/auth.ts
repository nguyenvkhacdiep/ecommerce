import { IMessageResponse } from '@/common/type';
import axiosInstance from './axiosConfig';

export interface ILoginPayload {
  email: string;
  password: string;
}

export interface IRole {
  id: string;
  name: string;
}

export interface IUserResponse {
  id: string;
  username: string;
  email: string;
  isActive: boolean;
  urlAvatar: string;
  createdAt: Date;
  updatedAt: Date;
  role: IRole;
}
export interface IUserLoginResponse {
  user: IUserResponse;
  token: string;
  tokenExpiresIn: number;
}

export interface IForgotPasswordPayload {
  email: string;
}

export interface IResetPasswordPayload {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface IRoleResponse {
  id: string;
  name: string;
}

export interface ICheckToken {
  type: string;
  token: string;
}

export interface IActiveUserResponse {
  setPasswordToken: string;
}

export async function login(payload: ILoginPayload): Promise<IUserLoginResponse> {
  const response = await axiosInstance.post('/Auth/login', payload);
  return response.data;
}

export async function forgotPassword(payload: IForgotPasswordPayload): Promise<IMessageResponse> {
  const response = await axiosInstance.post('/Auth/forgot-password', payload);
  return response.data;
}

export async function checkToken(data: ICheckToken): Promise<boolean> {
  const response = await axiosInstance.get(
    `/Auth/check-token?token=${data.token}&type=${data.type}`,
  );
  return response.data;
}

export async function resetPassword(payload: IResetPasswordPayload): Promise<IMessageResponse> {
  const response = await axiosInstance.post('/Auth/reset-password', payload);
  return response.data;
}

export async function getAllRoles(): Promise<IRoleResponse[]> {
  const response = await axiosInstance.get('/Auth/get-all-roles');
  return response.data;
}

export async function setPassword(payload: IResetPasswordPayload): Promise<IMessageResponse> {
  const response = await axiosInstance.post('/Auth/set-password', payload);
  return response.data;
}

export async function activeUser(token: string): Promise<IActiveUserResponse> {
  const response = await axiosInstance.get(`/Auth/activate?token=${token}`);
  return response.data;
}
