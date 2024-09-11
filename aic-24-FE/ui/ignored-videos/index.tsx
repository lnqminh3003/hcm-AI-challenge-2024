import { Select, Form, Affix, FormInstance } from "antd";

const { Item } = Form;

type Props = {
  formInstance: FormInstance;
};

const IgnoredVideos = (formProps: Props) => {
  const { formInstance } = formProps;
  return (
    <Affix offsetTop={50}>
      <Item name="ignoredVideos" initialValue={[]}>
        <Select
          mode="multiple"
          placeholder="Ignored Videos"
          value={formInstance.getFieldValue("ignoredVideos")}
          style={{ width: "50%", marginLeft: 2 }}
        />
      </Item>
    </Affix>
  );
};

export default IgnoredVideos;
