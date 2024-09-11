import { Card, Image, Typography } from "antd";
import { ImgType } from "pages";
import { Dispatch, SetStateAction } from "react";
import { extractBatch } from "src/functions";
import { API_SERVICES } from "src/infra/https";

type Props = {
  imgData: ImgType;
  setVisible: Dispatch<SetStateAction<boolean>>;
  setModalItem: Dispatch<SetStateAction<ImgType>>;
};

const AsrItem = (props: Props) => {
  const { imgData, setModalItem, setVisible } = props;

  const handleYoutubeLink = () => {
    API_SERVICES.QUERY.map(imgData.video, imgData.frameId).then(
      (responseData) => {
        setModalItem({
          link: imgData.link,
          video: imgData.video,
          frameId: imgData.frameId,
          youtubeUrl: responseData.data.youtubeLink,
          text: imgData.text,
        });
      }
    );
  };
  return (
    <Card
      onClick={() => {
        handleYoutubeLink();
        setVisible(true);
      }}
      style={{ borderRadius: 0, padding: 0 }}
      bodyStyle={{
        paddingLeft: 4,
        paddingRight: 4,
        paddingTop: 0,
        paddingBottom: 0,
        maxWidth: 160,
      }}
      cover={
        <Image
          style={{
            borderRadius: 0,
            height: "120px",
            width: "160px",
          }}
          src={`${extractBatch(imgData.video)}/${imgData.video}/${
            imgData.frameId
          }.jpg`}
          alt="aic-img"
          preview={false}
        />
      }
    >
      <Typography.Text style={{ fontSize: 8 }}>
        {imgData.text || "Place Holder"}
      </Typography.Text>
    </Card>
  );
};

export default AsrItem;
