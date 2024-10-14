import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ImgType } from "..";
import { Modal, Row, Col, Image, Button, message } from "antd";
import { rmExt } from "src/functions";
import { API_SERVICES } from "src/infra/https";
import { NEXT_API_SESSION } from "@constants";
import fs from "fs";
import path from "path";
import { GetServerSideProps } from "next";
import axios from "axios";
import ModalLoading from "ui/ModalLoading";
import ModalSuccess from "ui/ModalSuccess";

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
    .filter((file) => /\.(webp|jpeg|png|gif)$/i.test(file))
    .map((file) => ({
      link: `/data/video_frames/${video}/${file}`,
      video: video,
      frameId: file,
      youtubeUrl: "https://www.youtube.com/watch?v=5KiMl_1m5ck&t=786s",
      fps: "",
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
  const { frameId, video, prefix, fps, name } = router.query;
  const [visible, setVisible] = useState(false);
  const [modalItem, setModalItem] = useState<ImgType>(images[0]);
  const [confirmSubmit, SetConfirmSubmit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    SetConfirmSubmit(false);
    try {
      const res = await axios.post(
        "https://aic24.onrender.com/add-user-to-query",
        {
          queryName: "query 10",
          user: {
            id: name,
            videoId: modalItem.video,
            frameId: modalItem.frameId.split(".")[0],
          },
        }
      );

      setIsLoading(false);
      setIsSuccess(true);
      console.log("Submitted data:", res.data);
    } catch (error) {
      console.error("Error submitting data:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log(`${PREFIX}${video}/${frameId}`);

    const element = document.querySelector(
      `img[src="${PREFIX}${video}/${frameId}"]`
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
              width: `${frameId}` == image.frameId ? "500px" : "200px",
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
        <div className="text-2xl font-bold mb-2">{modalItem.video + "/" + modalItem.frameId}</div>
        {/* <h4>{parseInt(Array.isArray(fps) ? fps[0] : fps ? fps : "1")}</h4> */}
        <Button
          onClick={() => {
            window.open(
              `https://www.youtube.com/watch?v=${prefix}&t=${Math.floor(
                parseInt(modalItem.frameId) /
                parseInt(Array.isArray(fps) ? fps[0] : fps ? fps : "1")
              ).toString()}s`
            );
          }}
        >
          View Youtube Link
        </Button>
      </Modal>
      <Modal
        centered
        onOk={async () => {
          setVisible(false)
          await handleSubmit();
        }}
        okText="Confirm"
        onCancel={() => SetConfirmSubmit(false)}
        open={confirmSubmit}
      >
        Do You Want To Submit?
      </Modal>
      <ModalLoading isLoading={isLoading} />
      <ModalSuccess isSuccess={isSuccess} setIsSuccess={setIsSuccess} />
    </>
  );
};

export default Video;
