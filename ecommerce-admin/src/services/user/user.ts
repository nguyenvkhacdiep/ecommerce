import axiosInstance from '../axiosConfig';

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
  createdAt: Date;
  updatedAt: Date;
  role: IRole;
}
export interface IUserLoginResponse {
  user: IUserResponse;
  token: string;
  tokenExpiresIn: number;
}

export async function login(payload: ILoginPayload): Promise<IUserLoginResponse> {
  const response = await axiosInstance.post('/Auth/login', payload);
  return response.data;
}
