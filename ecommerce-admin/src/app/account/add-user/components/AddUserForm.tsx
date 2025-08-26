'use client';

import PrimaryButton from '@/app/components/button/PrimaryButton';
import CustomForm from '@/app/components/form/Form';
import { Options } from '@/common/type';
import { useDeleteFile } from '@/hooks/reactQuery/upload/useDeleteFile';
import { useUploadFile } from '@/hooks/reactQuery/upload/useUploadFile';
import { useFormChanged } from '@/hooks/useFormChanged';
import { IUserResponse } from '@/services/auth';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { Flex, FormInstance, Input, Select, Upload, UploadProps } from 'antd';
import FormItem from 'antd/es/form/FormItem';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

type AddUserFormProps = {
  form: FormInstance<any>;
  onSubmit: (data: any) => void;
  roles: Options;
  error: Error | null;
  loading: boolean;
  onlyView?: boolean;
  user?: IUserResponse;
};

const AddUserForm: React.FC<AddUserFormProps> = ({
  form,
  error,
  roles,
  loading,
  onlyView = false,
  user,
  onSubmit,
}) => {
  const { mutateAsync, isPending } = useUploadFile();
  const { mutateAsync: deleteFileMutateAsync } = useDeleteFile();
  const [imageUrl, setImageUrl] = useState<string>();
  const [preFileName, setPrefileName] = useState<string>();
  const router = useRouter();
  const { isChanged, handleValuesChange } = useFormChanged(form, {
    username: user?.username,
    email: user?.email,
    urlAvatar: user?.urlAvatar,
    roleId: user?.role.id,
  });

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        username: user.username,
        email: user.email,
        urlAvatar: user.urlAvatar,
        roleId: user.role.id,
      });
      setImageUrl(user.urlAvatar);
    }
  }, [JSON.stringify(user)]);

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
    setPrefileName(response.fileName);
    setImageUrl(response.url);
    form.setFields([{ name: 'urlAvatar', value: response.url, errors: [] }]);
  };

  const handleEditUserClick = () => {
    router.push(`/account/${user?.id}${onlyView ? '?isEdit=true' : ''}`);
  };

  return (
    <div className="flex flex-col">
      {user && (
        <div className="flex justify-end mb-6">
          <PrimaryButton onClick={handleEditUserClick}>
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
          name="urlAvatar"
          label="Avatar"
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
          name="username"
          label="Username"
          validateTrigger={['onChange', 'onBlur']}
          rules={[{ required: true, message: '${label} is required' }]}
        >
          <Input maxLength={200} placeholder="Username" />
        </FormItem>

        <FormItem
          name="email"
          label="Email"
          validateTrigger={['onChange', 'onBlur']}
          normalize={(value) => value.trim()}
          rules={[
            { required: true, message: '${label} is required' },
            {
              type: 'email',
              message: 'Invalid email format. Please enter a valid email (e.g., user@domain.com).',
            },
          ]}
        >
          <Input maxLength={200} placeholder="Email" />
        </FormItem>

        <FormItem
          name="roleId"
          label="Role"
          validateTrigger={['onChange', 'onBlur']}
          normalize={(value) => value.trim()}
          rules={[{ required: true, message: '${label} is required' }]}
        >
          <Select placeholder="Select a role" options={roles} />
        </FormItem>

        {!onlyView && (
          <PrimaryButton
            className="w-full mt-4"
            htmlType="submit"
            loading={loading}
            disabled={!isChanged}
          >
            {user ? 'Update user' : 'Create user'}
          </PrimaryButton>
        )}
      </CustomForm>
    </div>
  );
};

export default AddUserForm;
