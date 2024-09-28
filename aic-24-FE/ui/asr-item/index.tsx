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

  return (
    <Card
      onClick={() => {
        setModalItem({
          link: imgData.link,
          video: imgData.video,
          frameId: `${imgData.frameId}.jpg`,
          youtubeUrl: imgData.youtubeUrl,
          text: imgData.text,
          fps: imgData.fps,
        });
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
            height: "160px",
            width: "213px",
          }}
          src={imgData.link}
          alt="aic-img"
          preview={false}
        />
      }
    >
      <Typography.Text style={{ fontSize: 10, maxWidth: 160 }}>
        {imgData.text || "Place Holder"}
      </Typography.Text>
    </Card>
  );
};

export default AsrItem;
