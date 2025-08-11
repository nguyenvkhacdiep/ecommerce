'use client';

import React, { useMemo } from 'react';
import { ConfigProvider, Empty, Table, TableProps, Tooltip } from 'antd';
import { SorterResult, TablePaginationConfig } from 'antd/es/table/interface';
import { PAGE_SIZE_OPTIONS } from '@/common/constant';
import { formatNumberWithUnit } from '@/utils/common';
import { AppColor } from '@/styles/color';

export type Props = TableProps & {
  total?: number;
  params?: any;
  isNestedTable?: boolean;
  pageSizeOptions?: number[];
  setParams?: (v: any) => void;
  hasFilterParams?: (params: any) => boolean;
};

const CommonTable: React.FC<Props> = ({
  columns,
  dataSource,
  total = 0,
  params = {},
  setParams,
  hasFilterParams = () => false,
  isNestedTable,
  pageSizeOptions,
  ...props
}) => {
  const isSearching = useMemo(
    () => !!(params.searchKey && params.searchKey?.length > 0),
    [params.searchKey],
  );

  const customColumns = useMemo(() => {
    const orderBy = params?.orderBy;
    const normalizeOrderBy = orderBy && ((orderBy: string) => orderBy.replace(/^-/, ''));
    const sort = orderBy && ((orderBy: string) => (orderBy.startsWith('-') ? 'descend' : 'ascend'));
    return columns?.map((col) => {
      let currentCol = { ...col };

      if (orderBy && col.key === normalizeOrderBy) {
        currentCol = {
          ...currentCol,
          defaultSortOrder: sort,
        };
      }

      return currentCol;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columns]);

  const handleChange = (pagination: TablePaginationConfig, sorter: SorterResult<any>) => {
    const orderByParam: { orderBy?: string } = {};

    if (sorter.order) {
      orderByParam.orderBy = `${
        sorter.order === 'ascend' ? '' : '-'
      }${sorter.columnKey?.toString()}`;
    }

    const currentPage = pagination.current ? pagination.current : 1;

    setParams?.({
      ...params,
      pageIndex: currentPage,
      pageSize: pagination.pageSize ?? dataSource?.length,
      ...orderByParam,
    });
  };

  return (
    <ConfigProvider
      theme={{
        components: {
          Table: {
            cellPaddingBlock: 8,
            cellPaddingInline: 8,
            headerBg: isNestedTable ? AppColor.Gray100 : AppColor.Gray200,
            headerSortActiveBg: AppColor.Gray200,
            headerSplitColor: 'transparent',
            rowExpandedBg: AppColor.Gray100,
            rowHoverBg: isNestedTable ? AppColor.Primary200 : '',
          },
          Pagination: {
            itemActiveBg: AppColor.Primary200,
            borderRadius: 18,
            colorPrimary: AppColor.Primary800,
          },
          Tooltip: {
            colorTextLightSolid: AppColor.Gray900,
          },
        },
      }}
    >
      <Table
        className="common-table"
        dataSource={dataSource}
        pagination={{
          showTotal: (_, range) => (
            <span className="text-gray-500">{`${range[0]}-${range[1]} of ${formatNumberWithUnit(
              total,
              'item',
              'items',
            )}`}</span>
          ),
          pageSizeOptions: pageSizeOptions ?? PAGE_SIZE_OPTIONS,
          current: params?.pageSize,
          showSizeChanger: true,
          pageSize: (pageSizeOptions ?? PAGE_SIZE_OPTIONS).includes(params?.pageSize)
            ? params?.pageSize
            : 10,
          total,
        }}
        onChange={(pagination, _, sorter) => handleChange(pagination, sorter as SorterResult<any>)}
        showSorterTooltip={false}
        locale={{
          emptyText: (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={isSearching || hasFilterParams(params) ? 'No result found' : 'No data'}
            />
          ),
        }}
        {...props}
        columns={customColumns}
      />
    </ConfigProvider>
  );
};

export default CommonTable;
