import { IMessageResponse, PagingData, PagingRequest } from '@/common/type';
import axiosInstance from './axiosConfig';
import { queryParamsBuilder } from '@/utils/common';

export interface ICreateProductPayload {
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  availabilityStatus: boolean;
  categoryId: string;
  shopId: string;
  imageUrls: string[];
}

export interface IImagesProduct {
  id: string;
  imageUrl: string;
  isPrimary: boolean;
}

export interface IProductResponse {
  id: string;
  name: string;
  description: string;
  price: number;
  formatPrice: string;
  stockQuantity: number;
  availabilityStatus: boolean;
  rating: number;
  soldCount: number;
  createdAt: Date;
  categoryProduct: string;
  imageUrls: IImagesProduct[];
  reviews: string[];
}

export interface IEditProductPayload {
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  availabilityStatus: boolean;
  categoryId: string;
  imageUrls: string[];
}

export async function getAllProductsOfShop(
  shopId: string,
  option?: PagingRequest,
): Promise<PagingData<IProductResponse>> {
  const response = await axiosInstance.get(
    `/Product/get-all-products/${shopId}?${queryParamsBuilder(option)}`,
  );
  return response.data;
}

export async function getProduct(productId: string): Promise<IProductResponse> {
  const response = await axiosInstance.get(`/Product/${productId}`);
  return response.data;
}

export async function addProduct(payload: ICreateProductPayload): Promise<IMessageResponse> {
  const response = await axiosInstance.post(`/Product/add-product`, payload);
  return response.data;
}

export async function editProduct(
  productId: string,
  payload: IEditProductPayload,
): Promise<IMessageResponse> {
  const response = await axiosInstance.put(`/Product/edit-product/${productId}`, payload);
  return response.data;
}

export async function deleteProduct(productId: string): Promise<IMessageResponse> {
  const response = await axiosInstance.delete(`/Product/delete-product/${productId}`);
  return response.data;
}

export async function markOutOfStock(productId: string): Promise<IMessageResponse> {
  const response = await axiosInstance.patch(`/Product/mark-out-of-stock/${productId}`);
  return response.data;
}
