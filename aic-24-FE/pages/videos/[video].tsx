import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ImgType } from "..";
import { Modal, Row, Col, Image as AntdImage, Button, message } from "antd";
import Image from "next/image";
import fs from "fs";
import path from "path";
import { GetServerSideProps } from "next";

import ModalSubmitQA from "ui/ModalSubmitQA";
import ModalSubmitKIS from "ui/ModalSubmitKIS";

import successImage from "../../public/submit.png";
import failImage from "../../public/fail.png";

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
  const [isTrue, setIsTrue] = useState(false);
  const [isFail, setIsFail] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitQA, setIsSubmitQA] = useState(false);
  const [isSubmitKIS, setIsSubmitKIS] = useState(false);

  function getMilisecond(frameId: string, fps: string) {
    return Math.floor((parseInt(frameId) / parseInt(fps)) * 1000);
  }

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
    <div>
      {isSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full flex flex-col items-center">
            {isTrue ? (
              <>
                <Image
                  src={successImage}
                  alt="Success"
                  width={200}
                  height={200}
                />
                <p className="mb-6 mt-6 text-xl">TRUE</p>
              </>
            ) : (
              <>
                <Image src={failImage} alt="Fail" width={200} height={200} />
                <p className="mb-6 mt-6 text-xl">WRONG</p>
              </>
            )}

            <button
              className="bg-red-500 text-white font-bold py-2 px-4 rounded"
              onClick={() => setIsSuccess(false)}
            >
              Close Modal
            </button>
          </div>
        </div>
      )}

      {isFail && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full flex flex-col items-center">
            <Image src={failImage} alt="Success" width={200} height={200} />
            <button
              className="bg-red-500 text-white font-bold py-2 px-4 rounded"
              onClick={() => setIsFail(false)}
            >
              Close Modal
            </button>
          </div>
        </div>
      )}

      <ModalSubmitQA
        visible={isSubmitQA}
        setVisible={setIsSubmitQA}
        setVisibleModal={setVisible}
        videoId={modalItem.video}
        milisecond={getMilisecond(
          modalItem.frameId.split(".")[0],
          modalItem.fps ? modalItem.fps : "25"
        )}
        setIsSuccess={setIsSuccess}
        setIsFail={setIsFail}
        setIsTrue={setIsTrue}
      />
      <ModalSubmitKIS
        visible={isSubmitKIS}
        setVisible={setIsSubmitKIS}
        setVisibleModal={setVisible}
        videoId={modalItem.video}
        milisecond={getMilisecond(
          modalItem.frameId.split(".")[0],
          modalItem.fps ? modalItem.fps : "25"
        )}
        name={"1"}
        setIsSuccess={setIsSuccess}
        setIsTrue={setIsTrue}
        setIsFail={setIsFail}
      />

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
          setIsSubmitKIS(true);
        }}
        okText="Submit"
        onCancel={() => setVisible(false)}
        width="600px"
        open={visible}
      >
        <AntdImage
          id={`${PREFIX}${modalItem.video}/${modalItem.frameId}`}
          src={modalItem.link}
          alt="aic-img"
        />
        <div className="text-2xl font-bold mb-2">
          {modalItem.video + "/" + modalItem.frameId}
        </div>
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

        <Button
          className="bg-blue-600 text-white mt-4 ml-4"
          onClick={() => {
            setIsSubmitQA(true);
          }}
        >
          Submit QA
        </Button>
      </Modal>
    </div>
  );
};

export default Video;
