import { IMessageResponse, PagingData, PagingRequest } from '@/common/type';
import axiosInstance from './axiosConfig';
import { queryParamsBuilder } from '@/utils/common';

export interface IShopResponse {
  id: string;
  name: string;
  address: string;
  phoneNumber: string;
  logoUrl?: string | null;
  description?: string | null;
  followerCount: number;
  rating: number;
  type: number;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export interface IShopCreatePayload {
  name: string;
  description: string;
  address: string;
  phoneNumber: string;
  logoUrl: string;
  type: 0 | 1 | 2;
  userId: string;
}

export interface IShopEditPayload {
  name: string;
  description: string;
  address: string;
  phoneNumber: string;
  logoUrl: string;
  type: 0 | 1 | 2;
}

export interface IShopChangeTypePayload {
  type: 0 | 1 | 2;
}

export async function getAllShops(option?: PagingRequest): Promise<PagingData<IShopResponse>> {
  const response = await axiosInstance.get(`/Shop/get-all-shops?${queryParamsBuilder(option)}`);
  return response.data;
}

export async function getShop(shopId: string): Promise<IShopResponse> {
  const response = await axiosInstance.get(`/Shop/${shopId}`);
  return response.data;
}

export async function addShop(payload: IShopCreatePayload): Promise<IMessageResponse> {
  const response = await axiosInstance.post('/Shop/add-shop', payload);
  return response.data;
}

export async function deleteShop(shopId: string): Promise<IMessageResponse> {
  const response = await axiosInstance.delete(`/Shop/${shopId}`);
  return response.data;
}

export async function updateShop(
  shopId: string,
  payload: IShopEditPayload,
): Promise<IMessageResponse> {
  const response = await axiosInstance.put(`/Shop/edit-shop/${shopId}`, payload);
  return response.data;
}

export async function changeTypeShop(
  shopId: string,
  payload: IShopChangeTypePayload,
): Promise<IMessageResponse> {
  const response = await axiosInstance.patch(`/Shop/change-type-shop/${shopId}`, payload);
  return response.data;
}

export async function followShop(shopId: string): Promise<IMessageResponse> {
  const response = await axiosInstance.patch(`/Shop/follow-shop/${shopId}`);
  return response.data;
}
