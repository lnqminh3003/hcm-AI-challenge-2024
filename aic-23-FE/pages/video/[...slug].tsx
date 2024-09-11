/* eslint-disable @next/next/no-img-element */
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { ImgType } from "..";
import { Modal, Row, Col, Image, Button, message } from "antd";
import { extractBatch, rmExt } from "src/functions";
import { API_SERVICES } from "src/infra/https";
import { NEXT_API_SESSION } from "@constants";

export const getStaticProps = async ({ params }: any) => {
  const fs = require("fs");
  const { slug } = params;

  const readfile = async () => {
    var loc = process.cwd();

    try {
      const file = await fs.promises.readdir(
        `${loc}/public/${extractBatch(slug[0])}/${slug[0]}`
      );
      return file.map((item: string) => ({
        video: slug[0],
        link: `/${extractBatch(slug[0])}/${slug[0]}/${item}`,
        frameId: item,
      }));
    } catch (e) {
      return [];
    }
  };

  const result = await readfile();

  return {
    props: {
      imgArr: result,
      baseUrl: process.cwd(),
    },
  };
};

const PREFIX = "app_prefix";

export type VideoProp = {
  imgArr: ImgType[];
};

const Video = ({ imgArr }: VideoProp) => {
  const router = useRouter();
  const [imgSource, setImgSource] = useState<ImgType[]>(imgArr);
  const [visible, setVisible] = useState(false);
  const [modalItem, setModalItem] = useState<ImgType>(imgArr[0]);
  const [confirmSubmit, SetConfirmSubmit] = useState(false);

  const handleMap = async (video: string, keyFrame: string) => {
    const responseData = await API_SERVICES.QUERY.map(video, keyFrame);
    return responseData;
  };

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
    console.log(`#${PREFIX}${router.query.frame}.jpg`);
    document
      .getElementById(`#${PREFIX}${router.query.frame}.jpg`)
      ?.scrollIntoView();
  }, [router]);

  const contentComponent = useMemo(() => {
    return (
      <Row gutter={[16, 16]} justify="center">
        {imgSource.length > 0 ? (
          imgSource.map((e) => (
            <Col key={e.frameId}>
              {e.frameId == `${router.query.frame}.jpg` ? (
                <div style={{ padding: 8, backgroundColor: "red" }}>
                  <Image
                    id={"#" + PREFIX + e.frameId}
                    style={{
                      height: "120px",
                      width: "160px",
                    }}
                    src={e.link}
                    alt="aic-img"
                    onClick={async () => {
                      const reponseData = await handleMap(
                        e.video,
                        rmExt(e.frameId)
                      );
                      e.youtubeUrl = reponseData.data.youtubeLink;

                      setModalItem(e);
                      setVisible(true);
                    }}
                    preview={false}
                  />
                </div>
              ) : (
                <Image
                  style={{
                    height: "120px",
                    width: "160px",
                  }}
                  src={e.link}
                  alt="aic-img"
                  onClick={async () => {
                    const reponseData = await handleMap(
                      e.video,
                      rmExt(e.frameId)
                    );
                    e.youtubeUrl = reponseData.data.youtubeLink;

                    setModalItem(e);
                    setVisible(true);
                  }}
                  preview={false}
                />
              )}
            </Col>
          ))
        ) : (
          <img
            style={{ width: "100%", height: "100vh" }}
            src={"/no-data.svg"}
            alt="nodata-img"
          />
        )}
      </Row>
    );
  }, [imgSource, router.query.frame]);

  return (
    <>
      {contentComponent}
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
          id={`${PREFIX}${modalItem.frameId}`}
          src={modalItem.link}
          alt="aic-img"
        />
        <h4>{modalItem.video + "/" + modalItem.frameId}</h4>
        <Button
          onClick={() => {
            window.open(modalItem.youtubeUrl);
          }}
        >
          View Youtube Link
        </Button>
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

export const getStaticPaths = async () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};
