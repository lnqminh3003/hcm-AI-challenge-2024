import { useRouter } from "next/router";
import { use, useEffect, useLayoutEffect, useMemo, useState } from "react";
import { ImgType } from "..";
import { Modal, Row, Col, Image, Button, message } from "antd";
import { extractBatch, rmExt } from "src/functions";
import { API_SERVICES } from "src/infra/https";
import { NEXT_API_SESSION } from "@constants";
import fs from "fs";
import path from "path";
import { GetServerSideProps } from "next";

const PREFIX = "/data/video_frames/";

interface Props {
  images: ImgType[];
  videoId: string;
}
export type VideoProp = {
  imgArr: ImgType[];
};

export const getServerSideProps: GetServerSideProps<Props> = async (
  context
) => {
  const { video } = context.params as { video: string };

  const directoryPath = path.join(
    process.cwd(),
    "public/data/video_frames",
    video
  );

  if (!fs.existsSync(directoryPath)) {
    return { notFound: true };
  }

  const files = fs.readdirSync(directoryPath);
  const imagePaths = files
    .filter((file) => /\.(jpg|jpeg|png|gif)$/i.test(file))
    .map((file) => ({
      link: `/data/video_frames/${video}/${file}`,
      video: video,
      frameId: file,
    }));

  return {
    props: {
      images: imagePaths,
      videoId: video,
    },
  };
};

const Video = ({ images, videoId }: Props) => {
  const router = useRouter();
  const { frameId, video } = router.query;
  const [visible, setVisible] = useState(false);
  const [modalItem, setModalItem] = useState<ImgType>(images[0]);
  const [confirmSubmit, SetConfirmSubmit] = useState(false);

  const handleSubmit = async () => {
    const session = NEXT_API_SESSION || "";

    try {
      const data = await API_SERVICES.SUBMIT.Submit(
        modalItem.video,
        rmExt(modalItem.frameId),
        session
      );
      if (data.status == false) {
        message.error(data.status);
      } else {
        if (data.submission == "WRONG") {
          message.error(data.submission, 3);
        } else message.success(data.submission, 3);
      }

      await API_SERVICES.Log.log(
        `Status: ${data.status}, Submission: ${data.submission}, Video: ${
          modalItem.video
        }, Frame: ${rmExt(modalItem.frameId)}`
      );
    } catch (error) {
      message.error("Error", 3);
    }
  };

  useEffect(() => {
    console.log(`${PREFIX}${video}/${frameId}.jpg`);

    const element = document.querySelector(
      `img[src="${PREFIX}${video}/${frameId}.jpg"]`
    );

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
    console.log("minh");
  }, [video, frameId, router]);

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        {images.map((image, index) => (
          <div
            key={index}
            style={{
              width: `${frameId}.jpg` == image.frameId ? "500px" : "200px",
            }}
          >
            <img
              onClick={async () => {
                // const reponseData = await handleMap(e.video, rmExt(e.frameId));
                // e.youtubeUrl = reponseData.data.youtubeLink;

                setModalItem(image);
                setVisible(true);
              }}
              src={image.link}
              alt={`Image ${index}`}
              style={{ width: "100%", height: "auto" }}
            />
          </div>
        ))}
      </div>
      <Image
        alt=""
        style={{ width: "100%", height: "100vh" }}
        src={`/data/video_frames/${video}/${frameId}.jpg`}
      ></Image>
      <Modal
        transitionName=""
        centered
        onOk={() => {
          SetConfirmSubmit(true);
        }}
        okText="Submit"
        onCancel={() => setVisible(false)}
        width="600px"
        open={visible}
      >
        <Image
          id={`${PREFIX}${modalItem.video}/${modalItem.frameId}`}
          src={modalItem.link}
          alt="aic-img"
        />
        <h4>{modalItem.video + "/" + modalItem.frameId}</h4>
        {/* <Button
          onClick={() => {
            window.open(modalItem.youtubeUrl);
          }}
        >
          View Youtube Link
        </Button> */}
      </Modal>
      <Modal
        centered
        onOk={async () => {
          await handleSubmit();
          SetConfirmSubmit(false);
        }}
        okText="Confirm"
        onCancel={() => SetConfirmSubmit(false)}
        open={confirmSubmit}
      >
        Do You Want To Submit?
      </Modal>
    </>
  );
};

export default Video;
