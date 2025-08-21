import PrimaryButton from '@/app/components/button/PrimaryButton';
import CustomForm from '@/app/components/form/Form';
import FormItem from '@/app/components/form/FormItem';
import { Options } from '@/common/type';
import { useDeleteFile } from '@/hooks/reactQuery/upload/useDeleteFile';
import { useUploadFile } from '@/hooks/reactQuery/upload/useUploadFile';
import { useFormChanged } from '@/hooks/useFormChanged';
import { useUserDetailValueClient } from '@/recoil/atoms/userDetailAtom';
import { IShopResponse } from '@/services/shop';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { Flex, FormInstance, Input, Select, Upload, UploadProps } from 'antd';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

type AddShopFormProps = {
  form: FormInstance<any>;
  onSubmit: (data: any) => void;
  error: Error | null;
  loading: boolean;
  onlyView?: boolean;
  shop?: IShopResponse;
};

const types: Options = [
  {
    value: 0,
    label: 'Normal',
  },
  {
    value: 1,
    label: 'Favorite',
  },
  {
    value: 2,
    label: 'Mall',
  },
];

const AddShopForm = ({ form, onSubmit, error, loading, onlyView, shop }: AddShopFormProps) => {
  const router = useRouter();
  const userDetail = useUserDetailValueClient();
  const [imageUrl, setImageUrl] = useState<string>();
  const [preFileName, setPrefileName] = useState<string>();

  const { mutateAsync, isPending } = useUploadFile();
  const { mutateAsync: deleteFileMutateAsync } = useDeleteFile();

  const { isChanged, handleValuesChange } = useFormChanged(form, {
    name: shop?.name,
    description: shop?.description,
    address: shop?.address,
    phoneNumber: shop?.phoneNumber,
    type: shop?.type,
    logoUrl: shop?.logoUrl,
  });

  const handleEditShopClick = () => {
    router.push(`/shop/${shop?.id}${onlyView ? '?isEdit=true' : ''}`);
  };

  const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type="button">
      {isPending ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  const handleSelectedAvatar: UploadProps['onChange'] = async (info) => {
    if (info.file.status !== 'done') return;
    if (preFileName) {
      await deleteFileMutateAsync(preFileName);
    }

    const formData = new FormData();
    formData.append('type', 'file');
    formData.append('file', info.file.originFileObj as File);
    const response = await mutateAsync(formData);
    setPrefileName(info.file.name);
    setImageUrl(response.url);
    form.setFields([{ name: 'logoUrl', value: response.url, errors: [] }]);
  };

  useEffect(() => {
    if (shop) {
      form.setFieldsValue({
        name: shop.name,
        description: shop.description,
        address: shop.address,
        phoneNumber: shop.phoneNumber,
        type: shop.type,
        logoUrl: shop.logoUrl,
      });
    }
  }, [JSON.stringify(shop)]);

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
      {shop && (
        <div className="flex justify-end mb-6">
          <PrimaryButton onClick={handleEditShopClick}>
            {onlyView ? 'Edit' : 'Cancel'}
          </PrimaryButton>
        </div>
      )}
      <CustomForm
        layout="vertical"
        form={form}
        onFinish={onSubmit}
        style={{ width: 400 }}
        isHideButton
        disabled={onlyView}
        onValuesChange={handleValuesChange}
      >
        <FormItem
          name="logoUrl"
          label="Logo"
          validateTrigger={['onChange', 'onBlur']}
          normalize={(value) => value.trim()}
        >
          <Flex gap="middle" wrap>
            <Upload
              name="file"
              listType="picture-circle"
              className="avatar-uploader"
              showUploadList={false}
              onChange={handleSelectedAvatar}
            >
              {imageUrl ? (
                <span className="w-[100px] h-[100px] relative">
                  <Image
                    src={imageUrl}
                    alt="avatar"
                    className="rounded-[999px] h-full w-full absolute"
                    fill={true}
                  />
                </span>
              ) : (
                uploadButton
              )}
            </Upload>
          </Flex>
        </FormItem>

        <FormItem
          name="name"
          label="Name"
          validateTrigger={['onChange', 'onBlur']}
          rules={[{ required: true, message: '${label} is required' }]}
        >
          <Input maxLength={200} placeholder="Shop name" />
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
          name="address"
          label="Address"
          validateTrigger={['onChange', 'onBlur']}
          normalize={(value) => value}
          rules={[{ required: true, message: '${label} is required' }]}
        >
          <Input maxLength={200} placeholder="Address" />
        </FormItem>

        <FormItem
          name="phoneNumber"
          label="Phone Number"
          validateTrigger={['onChange', 'onBlur']}
          normalize={(value) => value}
          rules={[{ required: true, message: '${label} is required' }]}
        >
          <Input maxLength={200} placeholder="Phone Number" />
        </FormItem>

        {userDetail?.role.name == 'Super Admin' ||
          (userDetail?.role.name == 'Admin' && (
            <FormItem
              name="type"
              label="Type"
              validateTrigger={['onChange', 'onBlur']}
              normalize={(value) => value}
              rules={[{ required: true, message: '${label} is required' }]}
            >
              <Select placeholder="Select a type" options={types} />
            </FormItem>
          ))}

        {!onlyView && (
          <PrimaryButton
            className="w-full mt-4"
            htmlType="submit"
            loading={loading}
            disabled={!isChanged}
          >
            {shop ? 'Update shop' : 'Create shop'}
          </PrimaryButton>
        )}
      </CustomForm>
    </div>
  );
};

export default AddShopForm;
