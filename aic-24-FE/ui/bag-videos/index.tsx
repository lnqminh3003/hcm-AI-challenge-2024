import { Select, Form, Affix, FormInstance } from "antd";

const { Item } = Form;

type Props = {
  formInstance: FormInstance;
};

const BagVideos = (formProps: Props) => {
  const { formInstance } = formProps;
  return (
    <Affix offsetTop={20}>
      <Item name="badVideos" initialValue={[]}>
        <Select
          mode="multiple"
          placeholder="Bag Videos"
          value={formInstance.getFieldValue("badVideos")}
          style={{  
            width: "100%",
            marginLeft: 2,
            borderWidth: 1,
            borderColor: "black",
          }}
        />
      </Item>
    </Affix>
  );
};

export default BagVideos;
