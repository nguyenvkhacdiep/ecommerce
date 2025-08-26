import { IMessageResponse, PagingData, PagingRequest } from '@/common/type';
import axiosInstance from './axiosConfig';
import { queryParamsBuilder } from '@/utils/common';

export interface ICreateCategoryPayload {
  name: string;
  shopId: string;
}

export interface ICategoryResponse {
  id: string;
  name: string;
}

export interface IEditCategoryPayload {
  name: string;
}

export async function getAllCategoriesOfShop(
  shopId: string,
  option?: PagingRequest,
): Promise<PagingData<ICategoryResponse>> {
  const response = await axiosInstance.get(
    `/Category/get-all-categories/${shopId}?${queryParamsBuilder(option)}`,
  );
  return response.data;
}

export async function addCategory(payload: ICreateCategoryPayload): Promise<IMessageResponse> {
  const response = await axiosInstance.post(`/Category/add-category`, payload);
  return response.data;
}

export async function editCategory(
  categoryId: string,
  payload: IEditCategoryPayload,
): Promise<IMessageResponse> {
  const response = await axiosInstance.put(`/Category/edit-category/${categoryId}`, payload);
  return response.data;
}

export async function deleteCategory(categoryId: string): Promise<IMessageResponse> {
  const response = await axiosInstance.delete(`/Category/delete-category/${categoryId}`);
  return response.data;
}

export async function getCategory(categoryId: string): Promise<ICategoryResponse> {
  const response = await axiosInstance.get(`/Category/${categoryId}`);
  return response.data;
}
