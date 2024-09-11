import {
  Row,
  Col,
  Form,
  Input,
  Radio,
  FormInstance,
  RadioChangeEvent,
} from "antd";

const asrParams = {
  name: "asrText",
  text: "ASR Text",
  placeHolder: "Input ASR Text",
};
const ASR_OPTIONS = [
  { label: "Fuzzy", value: "fuzzy" },
  { label: "Full Text", value: "fulltext" },
];

const { Item } = Form;

type Props = {
  form: FormInstance;
};

const ASRForm = (props: Props) => {
  const { form } = props;
  return (
    <Col span={24} key={asrParams.name}>
      <Item name={asrParams.name}>
        <Input
          addonBefore={asrParams.text}
          placeholder={asrParams.placeHolder}
        />
      </Item>
    </Col>
  );
};

export default ASRForm;
