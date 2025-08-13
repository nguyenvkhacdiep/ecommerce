import PrimaryButton from '@/app/components/button/PrimaryButton';
import { PagingRequest } from '@/common/type';
import { SearchOutlined } from '@ant-design/icons';
import { Input } from 'antd';
import { debounce } from 'lodash';
import { useRouter } from 'next/navigation';
import React, { useMemo, useState } from 'react';

type AccountTableHeaderProps = {
  params: PagingRequest;
  setParams: (v: PagingRequest) => void;
};

const AccountTableHeader: React.FC<AccountTableHeaderProps> = ({ params, setParams }) => {
  const router = useRouter();
  const [searchText, setSearchText] = useState<string | undefined>(params.searchKey);

  const debouncedSearch = useMemo(
    () =>
      debounce((value: string | undefined) => {
        setParams({ ...params, searchKey: value?.trim() });
      }, 1000),
    [params, setParams],
  );

  const handleSearch = (event: any) => {
    const value = event?.target.value;
    setSearchText(value);
    debouncedSearch(value);
  };

  const handleAddUserClick = () => {
    router.push('/account/add-user');
  };

  return (
    <div className="w-full flex justify-between px-4 py-2">
      <PrimaryButton onClick={handleAddUserClick}>Add User</PrimaryButton>
      <Input
        placeholder="Search by email"
        className="!w-1/5"
        defaultValue={params.searchKey}
        value={searchText}
        onChange={handleSearch}
        prefix={<SearchOutlined />}
      />
    </div>
  );
};

export default AccountTableHeader;
