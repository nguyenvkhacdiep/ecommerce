import axiosInstance from './axiosConfig';

export interface IUploadResponse {
  url: string;
  fileName: string;
}

export async function uploadFile(payload: FormData): Promise<IUploadResponse> {
  const response = await axiosInstance.post('/Upload', payload);
  return response.data;
}

export async function deleteFile(fileName: string): Promise<string> {
  const response = await axiosInstance.delete(`/Upload/${fileName}`);
  return response.data;
}
