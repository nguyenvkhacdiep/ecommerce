import PrimaryButton from '@/app/components/button/PrimaryButton';
import CustomForm from '@/app/components/form/Form';
import { useFormChanged } from '@/hooks/useFormChanged';
import { ICategoryResponse } from '@/services/category';
import { FormInstance, Input } from 'antd';
import FormItem from 'antd/es/form/FormItem';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

type AddCategoryFormProps = {
  form: FormInstance<any>;
  onSubmit: (data: any) => void;
  error: Error | null;
  loading: boolean;
  onlyView?: boolean;
  category?: ICategoryResponse;
};

const AddCategoryForm = ({
  form,
  onSubmit,
  error,
  loading,
  onlyView,
  category,
}: AddCategoryFormProps) => {
  const router = useRouter();

  const { isChanged, handleValuesChange } = useFormChanged(form, {
    name: category?.name,
  });

  const handleEditCategoryClick = () => {
    router.push(`/products/list-category/${category?.id}${onlyView ? '?isEdit=true' : ''}`);
  };

  useEffect(() => {
    if (category) {
      form.setFieldsValue({
        name: category.name,
      });
    }
  }, [JSON.stringify(category)]);

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
      {category && (
        <div className="flex justify-end mb-6">
          <PrimaryButton onClick={handleEditCategoryClick}>
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
          name="name"
          label="Name"
          validateTrigger={['onChange', 'onBlur']}
          rules={[{ required: true, message: '${label} is required' }]}
        >
          <Input maxLength={200} placeholder="Shop name" />
        </FormItem>

        {!onlyView && (
          <PrimaryButton
            className="w-full mt-4"
            htmlType="submit"
            loading={loading}
            disabled={!isChanged}
          >
            {category ? 'Update category' : 'Create category'}
          </PrimaryButton>
        )}
      </CustomForm>
    </div>
  );
};

export default AddCategoryForm;
