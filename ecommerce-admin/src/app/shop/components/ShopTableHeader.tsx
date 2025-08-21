import { PagingRequest } from '@/common/type';
import { SearchOutlined } from '@ant-design/icons';
import { Input } from 'antd';
import { debounce } from 'lodash';
import React, { useMemo, useState } from 'react';

type AccountTableHeaderProps = {
  params: PagingRequest;
  setParams: (v: PagingRequest) => void;
};

const AccountTableHeader: React.FC<AccountTableHeaderProps> = ({ params, setParams }) => {
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

  return (
    <div className="w-full flex justify-end px-4 py-2">
      <Input
        placeholder="Search by shop name"
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
