import PrimaryButton from '@/app/components/button/PrimaryButton';
import CustomForm from '@/app/components/form/Form';
import FormItem from '@/app/components/form/FormItem';
import { Options } from '@/common/type';
import { useDeleteFile } from '@/hooks/reactQuery/upload/useDeleteFile';
import { useUploadFile } from '@/hooks/reactQuery/upload/useUploadFile';
import { useFormChanged } from '@/hooks/useFormChanged';
import { IProductResponse } from '@/services/product';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { Flex, FormInstance, Input, Select, Upload, UploadProps } from 'antd';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';

type AddProductFormProps = {
  form: FormInstance<any>;
  onSuccess: boolean;
  onSubmit: (data: any) => void;
  error: Error | null;
  loading: boolean;
  onlyView?: boolean;
  product?: IProductResponse;
  categories: Options;
};

const AddProductForm: React.FC<AddProductFormProps> = ({
  form,
  onSubmit,
  onSuccess,
  error,
  loading,
  onlyView,
  product,
  categories,
}) => {
  const router = useRouter();
  const [productImageUrls, setProductImageUrls] = useState<string[]>([]);
  const [productImages, setProductImages] = useState<string[]>([]);
  const { mutateAsync: deleteFileMutateAsync } = useDeleteFile();

  const productImagesRef = useRef<string[]>([]);
  const onSuccessRef = useRef(onSuccess);

  useEffect(() => {
    productImagesRef.current = productImages;
  }, [productImages]);

  useEffect(() => {
    onSuccessRef.current = onSuccess;
  }, [onSuccess]);

  const { isChanged, handleValuesChange } = useFormChanged(form, {
    name: product?.name,
  });

  const { mutateAsync, isPending } = useUploadFile();

  const handleEditProductClick = () => {
    router.push(`/products/list-product/${product?.id}${onlyView ? '?isEdit=true' : ''}`);
  };

  const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type="button">
      {isPending ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  const handleSelectedProductImage: UploadProps['onChange'] = async (info) => {
    if (info.file.status !== 'done') return;

    const formData = new FormData();
    formData.append('type', 'file');
    formData.append('file', info.file.originFileObj as File);
    const response = await mutateAsync(formData);
    setProductImageUrls((prev) => [...prev, response.url]);
    setProductImages((prev) => [...prev, response.fileName]);
  };

  const handleRemoveProductImage: UploadProps['onRemove'] = async (file) => {
    const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf('.'));

    const findImage = productImages.find((name) => name.includes(nameWithoutExt));

    if (findImage) {
      await deleteFileMutateAsync(findImage);
      setProductImageUrls((prev) => prev.filter((url) => !url.includes(findImage)));
      setProductImages((prev) => prev.filter((name) => name !== findImage));
    }
  };

  useEffect(() => {
    if (product) {
      form.setFieldsValue({
        name: product.name,
      });
    }
  }, [JSON.stringify(product)]);

  useEffect(() => {
    form.setFieldsValue({
      imageUrls: productImageUrls,
    });
  }, [productImageUrls]);

  useEffect(() => {
    return () => {
      if (!onSuccessRef.current && productImagesRef.current.length > 0) {
        setTimeout(() => {
          productImagesRef.current.forEach(async (name) => {
            try {
              await deleteFileMutateAsync(name);
            } catch (error) {
              console.error('Failed to delete file:', name, error);
            }
          });
        }, 0);
      }
    };
  }, []);

  useEffect(() => {
    if (error && form) {
      if (error instanceof Error && (error as any).data.message === 'INVALID_FIELD') {
        const errors = (error as any)?.data?.errors?.map((error: any) => ({
          name: error.field,
          errors: [error.issue],
        }));

        form.setFields([...errors]);
      }
    }
  }, [error]);

  return (
    <div className="flex flex-col">
      {product && (
        <div className="flex justify-end mb-6">
          <PrimaryButton onClick={handleEditProductClick}>
            {onlyView ? 'Edit' : 'Cancel'}
          </PrimaryButton>
        </div>
      )}
      <CustomForm
        layout="vertical"
        form={form}
        onFinish={onSubmit}
        style={{ width: 500 }}
        isHideButton
        disabled={onlyView}
        onValuesChange={handleValuesChange}
      >
        <FormItem
          name="imageUrls"
          label="Product Images"
          validateTrigger={['onChange', 'onBlur']}
          normalize={(value) => value.trim()}
        >
          <Flex gap="middle" wrap>
            <Upload
              name="file"
              listType="picture-circle"
              className="avatar-uploader"
              onChange={handleSelectedProductImage}
              onRemove={handleRemoveProductImage}
              maxCount={5}
              multiple
            >
              {uploadButton}
            </Upload>
          </Flex>
        </FormItem>

        <FormItem
          name="name"
          label="Name"
          validateTrigger={['onChange', 'onBlur']}
          rules={[{ required: true, message: '${label} is required' }]}
        >
          <Input maxLength={200} placeholder="Product" />
        </FormItem>

        <FormItem
          name="description"
          label="Description"
          validateTrigger={['onChange', 'onBlur']}
          normalize={(value) => value}
        >
          <Input.TextArea maxLength={200} placeholder="Description" />
        </FormItem>

        <FormItem
          name="price"
          label="Price"
          validateTrigger={['onChange', 'onBlur']}
          rules={[{ required: true, message: '${label} is required' }]}
        >
          <Input placeholder="Price" />
        </FormItem>

        <FormItem
          name="stockQuantity"
          label="Stock Quantity"
          validateTrigger={['onChange', 'onBlur']}
          rules={[{ required: true, message: '${label} is required' }]}
        >
          <Input placeholder="Stock Quantity" />
        </FormItem>

        <FormItem
          name="categoryId"
          label="Category"
          validateTrigger={['onChange', 'onBlur']}
          normalize={(value) => value.trim()}
        >
          <Select placeholder="Select a category" options={categories} />
        </FormItem>

        {!onlyView && (
          <PrimaryButton
            className="w-full mt-4"
            htmlType="submit"
            loading={loading}
            disabled={!isChanged}
          >
            {product ? 'Update product' : 'Create product'}
          </PrimaryButton>
        )}
      </CustomForm>
    </div>
  );
};

export default AddProductForm;
