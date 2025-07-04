import React from 'react';
import { TableWrapper, StyledTable, Th, Td } from './style';

const serviceItems = [
  {
    no: 1,
    name: 'Khám Nội tổng quát',
    appliesTo: ['f_u60', 'f_60', 'fm_u60', 'fm_60', 'm_u60', 'm_60']
  },
  {
    no: 2,
    name: 'Khám Phụ khoa',
    appliesTo: ['f_u60', 'fm_u60']
  },
  {
    no: 3,
    name: 'Khám Tuyến vú',
    appliesTo: ['fm_u60', 'fm_60']
  },
  {
    no: 4,
    name: 'Xét nghiệm tế bào cổ tử cung',
    appliesTo: ['fm_u60']
  },
  {
    no: 5,
    name: 'Soi tươi huyết trắng',
    appliesTo: ['fm_u60']
  },
  {
    no: 6,
    name: 'Soi cổ tử cung',
    appliesTo: ['fm_u60']
  },
  {
    no: 7,
    name: 'HPV genotype PCR hệ tự động',
    appliesTo: ['fm_u60']
  },
];

const columns = [
  { key: 'f_u60', label: 'Nữ độc thân <60' },
  { key: 'f_60', label: 'Nữ độc thân ≥60' },
  { key: 'fm_u60', label: 'Nữ có gia đình <60' },
  { key: 'fm_60', label: 'Nữ có gia đình ≥60' },
  { key: 'm_u60', label: 'Nam <60' },
  { key: 'm_60', label: 'Nam ≥60' },
];

const ServicePackageTable = ({ services = [] }) => {
  const columns = [
    { key: 'f_u60', label: 'Nữ độc thân <60' },
    { key: 'f_60', label: 'Nữ độc thân ≥60' },
    { key: 'fm_u60', label: 'Nữ có gia đình <60' },
    { key: 'fm_60', label: 'Nữ có gia đình ≥60' },
    { key: 'm_u60', label: 'Nam <60' },
    { key: 'm_60', label: 'Nam ≥60' },
  ];

  return (
    <TableWrapper>
      <StyledTable>
        <thead>
          <tr>
            <Th>STT</Th>
            <Th>Nội dung gói khám</Th>
            {columns.map(col => (
              <Th key={col.key}>{col.label}</Th>
            ))}
          </tr>
        </thead>
        <tbody>
          {services.map((service, index) => (
            <tr key={service.id}>
              <Td>{index + 1}</Td>
              <Td>{service.title}</Td>
              {columns.map((col) => (
  <Td key={col.key}>
    {service.package_service?.appliesTo?.includes(col.key) ? "✕" : ""}
  </Td>
))}

            </tr>
          ))}
        </tbody>
      </StyledTable>
    </TableWrapper>
  );
};


export default ServicePackageTable;
