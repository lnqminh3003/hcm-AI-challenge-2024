import { Form, Select } from "antd";

const items = [
  {
    label: "VIT 32",
    value: "b32",
    disabled: true,
  },
  {
    label: "VIT 16",
    value: "b16",
  },
  {
    label: "bH-14",
    value: "b14",
    disabled: true,
  },
];

const { Item } = Form;

const ModelOption = () => {
  return (
    <Item name="model" initialValue="b16">
      <Select style={{ width: 120 }} options={items} />
    </Item>
  );
};

export default ModelOption;
