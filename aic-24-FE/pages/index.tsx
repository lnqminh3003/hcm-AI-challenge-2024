import {
  Row,
  Col,
  Input,
  Button,
  Divider,
  Typography,
  Image,
  Form,
  Modal,
  Radio,
  RadioChangeEvent,
  message,
  Affix,
} from "antd";
import { SearchOutlined, DeleteFilled } from "@ant-design/icons";
import type { NextPage } from "next";
import Head from "next/head";
import { useMemo, useState } from "react";
import { API_SERVICES } from "src/infra/https";
import { checkLiveSearch, extractBatch, groupByVideo } from "src/functions";
import ASRForm from "ui/asr-form";
import ModelOption from "ui/model-option";
import IgnoredVideos from "ui/ignored-videos";
import { NEXT_API_CREDENTIAL, NEXT_API_SESSION } from "@constants";
import AsrItem from "ui/asr-item";

function extractVideoYoutubeId(url: string) {
  const urlObj = new URL(url);

  return urlObj.searchParams.get("v");
}

export type ImgType = {
  link?: string;
  video: string;
  frameId: string;
  youtubeUrl?: string;
  text?: string;
  fps?: string;
  listFrameId?: string[];
};

const { TextArea } = Input;

const mock_item = {
  link: "",
  video: "",
  frameId: "",
  youtubeUrl: "",
  img_path: "",
  fps: "",
};

const PREFIX = "app_prefix";

const { Item, useForm } = Form;

const SEARCH_OPTIONS = [
  { label: "Simple", value: "simple" },
  { label: "Live Search", value: "live-search" },
  { label: "Asr", value: "asr" },
];

const NUMPEOPLE_OPTIONS = [
  { label: "Off", value: "off" },
  { label: "Less", value: "less" },
  { label: "More", value: "more" },
  { label: "Equal", value: "equal" },
];

const Home: NextPage = () => {
  const [form] = useForm();
  const [searchOption, setSearchOption] = useState<String>("simple");
  const [imgSource, setImgSource] = useState<ImgType[]>([]);
  const [visible, setVisible] = useState(false);
  const [modalItem, setModalItem] = useState<ImgType>(mock_item);
  const [confirmSubmit, SetConfirmSubmit] = useState(false);
  const [asr, SetAsr] = useState(false);
  const [numPeople, setNumPeople] = useState("");
  const [numberPeopleOption, setNumberPeoplehOption] = useState<string>("off");

  function extractParts(str: string) {
    const regex = /[\/\\]([^\/\\]+)[\/\\](\d+\.jpg)$/;
    const match = str.match(regex);

    if (match) {
      return {
        videoId: match[1],
        frameId: match[2],
      };
    } else {
      return null;
    }
  }

  const imgContent = useMemo(() => {
    const newImgSrc = groupByVideo(imgSource);
    return (
      <Row style={{ margin: 16 }} gutter={[16, 16]} justify="center">
        <>
          {imgSource.length > 0 ? (
            Object.keys(newImgSrc).map((e) => (
              <Col span={24} key={e}>
                <Typography.Text style={{ fontSize: 20, fontWeight: 700 }}>
                  {e}
                </Typography.Text>

                <DeleteFilled
                  style={{ fontSize: 20, margin: 8, color: "red" }}
                  onClick={() => {
                    const ignoredVideos = form.getFieldValue("ignoredVideos");
                    if (ignoredVideos) {
                      if (!ignoredVideos.includes(e)) {
                        form.setFieldValue("ignoredVideos", [
                          ...ignoredVideos,
                          e,
                        ]);
                      }
                    } else {
                      form.setFieldValue("ignoredVideos", [e]);
                    }
                  }}
                  rev={undefined}
                />
                <Row gutter={[8, 8]}>
                  {newImgSrc[e].map((img) => (
                    <Col key={img.frameId}>
                      {asr ? (
                        <AsrItem
                          imgData={img}
                          setVisible={setVisible}
                          setModalItem={setModalItem}
                        />
                      ) : (
                        <div className="">
                          <p>
                            Video ID:
                            {extractParts(img.link ? img.link : "")?.videoId}
                          </p>
                          <Image
                            style={{
                              borderRadius: 0,
                              height: "160px",
                              width: "213px",
                            }}
                            src={img.link}
                            alt="aic-img"
                            onClick={() => {
                              setModalItem(img);
                              setVisible(true);
                            }}
                            preview={false}
                          />

                          <p className="">
                            Frame ID:
                            {extractParts(img.link ? img.link : "")?.frameId}
                          </p>
                        </div>
                      )}
                    </Col>
                  ))}
                </Row>
              </Col>
            ))
          ) : (
            <img
              style={{ width: "100%", height: "100vh" }}
              src={"/no-data.svg"}
              alt="nodata-img"
            />
          )}
        </>
      </Row>
    );
  }, [asr, form, imgSource]);

  const handleLiveSearchQuery = async (engText: boolean) => {
    const { queryString, enString, limit, model } = form.getFieldsValue();
    const isLiveSearch = searchOption === "live-search";
    if (!engText) {
      await handleTranslate();
      if (enString && checkLiveSearch(queryString, isLiveSearch)) {
        API_SERVICES.QUERY.query(
          enString,
          limit,
          model,
          numberPeopleOption,
          numPeople
        ).then((responseData) => {
          const newSource = responseData.data.map((value) => {
            const videoId: string =
              extractParts(value.img_path.toString())?.videoId ?? "";
            const frameId: string =
              extractParts(value.img_path.toString())?.frameId ?? "";
            return {
              video: videoId,
              frameId: frameId,
              link: value.img_path.toString(),
              youtubeUrl: value.youtube_link.toString(),
              fps: value.fps.toString(),
            };
          });

          setImgSource(newSource);
        });
      }
    } else {
      if (enString && checkLiveSearch(enString, isLiveSearch)) {
        API_SERVICES.QUERY.query(
          enString,
          limit,
          model,
          numberPeopleOption,
          numPeople
        ).then((responseData) => {
          const newSource = responseData.data.map((value) => {
            const videoId: string =
              extractParts(value.img_path.toString())?.videoId ?? "";
            const frameId: string =
              extractParts(value.img_path.toString())?.frameId ?? "";
            return {
              video: videoId,
              frameId: frameId,
              link: value.img_path.toString(),
              youtubeUrl: value.youtube_link.toString(),
              fps: value.fps.toString(),
            };
          });

          setImgSource(newSource);
        });
      }
    }
  };

  const handleQuery = async () => {
    const { asrText, enString, limit, model } = form.getFieldsValue();
    if (searchOption === "asr") {
      API_SERVICES.ASR.asr(asrText, limit).then((responseData) => {
        const newSource: ImgType[] = [];

        responseData.forEach((value) => {
          value.listFrameId.forEach((frameId) => {
            if (frameId != "") {
              newSource.push({
                video: value.video_id,
                frameId: frameId,
                link: `/data/video_frames/${value.video_id}/${frameId}.jpg`,
                text: value.text,
                fps: value.fps,
                youtubeUrl: `https://www.youtube.com/watch?v=${
                  value.prefix
                }k&t=${(parseInt(frameId) / parseInt(value.fps)).toString()}s`,
              });
            }
          });
        });

        console.log(newSource);
        setImgSource(newSource);
      });
    } else {
      API_SERVICES.QUERY.query(
        enString,
        limit,
        model,
        numberPeopleOption,
        numPeople
      ).then((responseData) => {
        const newSource = responseData.data.map((value) => {
          const videoId: string =
            extractParts(value.img_path.toString())?.videoId ?? "";
          const frameId: string =
            extractParts(value.img_path.toString())?.frameId ?? "";
          console.log("Minh");
          console.log(value.fps.toString());

          return {
            video: videoId,
            frameId: frameId,
            link: value.img_path.toString(),
            youtubeUrl: value.youtube_link.toString(),
            fps: value.fps.toString(),
          };
        });

        setImgSource(newSource);
      });
    }
  };

  const handleFilter = () => {
    const newFrames = imgSource.filter((frame) => {
      const ignoredVideos: string[] = form.getFieldValue("ignoredVideos");
      return !ignoredVideos.includes(frame.video);
    });

    form.setFieldValue("ignoredVideos", []);
    setImgSource(newFrames);
  };

  const handleSubmit = async () => {
    const session = NEXT_API_SESSION || "";

    try {
      const data = await API_SERVICES.SUBMIT.Submit(
        modalItem.video,
        modalItem.frameId,
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
        `Status: ${data.status}, Submission: ${data.submission}, Video: ${modalItem.video}, Frame: ${modalItem.frameId}`
      );
    } catch (error) {
      message.error("Error", 3);
    }
  };

  const handleTranslate = async () => {
    const queryString = form.getFieldValue("queryString");
    if (checkLiveSearch(queryString, true)) {
      try {
        const response = await fetch("/api/translate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ queryString }),
        });

        const data = await response.json();

        if (data.error) {
          console.error(`Translation error: ${data.error}`);
        } else {
          console.log(`Translated text: ${data.translatedText}`);
          form.setFieldValue("enString", data.translatedText);
        }
      } catch (error) {
        console.error(`Error during translation: ${error}`);
      }
    }
  };

  return (
    <>
      <Head>
        <title>AIC 2024</title>
      </Head>
      <Form form={form} style={{ padding: 16 }}>
        <Row gutter={[12, 0]}>
          <Col span={24}>
            <Typography.Text style={{ fontSize: "24px" }}>
              AIC 2024 - Nitzche
            </Typography.Text>
          </Col>
          <Col span={12}>
            <Item name="queryString">
              <TextArea
                onChange={() => {
                  handleLiveSearchQuery(false);
                }}
                showCount
                maxLength={1000}
                style={{ height: 120, marginBottom: 24, borderWidth: 3 }}
                placeholder="Vi Text"
              />
            </Item>
          </Col>
          <Col span={12}>
            <Item name="enString">
              <TextArea
                onChange={() => {
                  handleLiveSearchQuery(true);
                }}
                showCount
                maxLength={1000}
                style={{ height: 120, marginBottom: 24, borderWidth: 3 }}
                placeholder="Eng Text"
              />
            </Item>
          </Col>
          <Col span={12} className="-mt-4 flex flex-col">
            <div className="-mt-4 mb-4">
              <div className="flex flex-row items-center">
                <p>Number of people:</p>
                <input
                  type="number"
                  id="numPeople"
                  value={numPeople}
                  onChange={(e) => setNumPeople(e.target.value)}
                  placeholder="Enter number of people"
                  className="border-2 ml-4 border-gray-300 rounded px-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <Col className="mb-8">
              <Radio.Group
                options={NUMPEOPLE_OPTIONS}
                onChange={({ target: { value } }: RadioChangeEvent) => {
                  setNumberPeoplehOption(value);
                }}
                value={numberPeopleOption}
              />
            </Col>

            <Col className="mb-4">
              <Radio.Group
                options={SEARCH_OPTIONS}
                onChange={({ target: { value } }: RadioChangeEvent) => {
                  setSearchOption(value);
                  if (value === "asr") {
                    SetAsr(true);
                  } else {
                    SetAsr(false);
                  }
                }}
                value={searchOption}
              />
            </Col>

            <Row gutter={[8, 8]}>
              <Col span={12}>
                <Item name="limit">
                  <Input addonBefore="Limit" placeholder="400" />
                </Item>
              </Col>
              <Col span={12}>
                <Button
                  type="primary"
                  icon={<SearchOutlined rev={undefined} />}
                  onClick={() => handleQuery()}
                >
                  Query
                </Button>
              </Col>

              <Col span={12}>
                <ModelOption />
              </Col>
            </Row>
          </Col>
          {searchOption == "asr" ? (
            <Col span={12}>
              <Row gutter={[16, 16]}>
                <ASRForm form={form} />
              </Row>
            </Col>
          ) : (
            <div style={{ height: 160 }}></div>
          )}
        </Row>
        <Affix offsetTop={10}>
          <Button
            type="primary"
            style={{ marginBottom: 16 }}
            onClick={handleFilter}
          >
            Filter
          </Button>
        </Affix>
        <IgnoredVideos formInstance={form} />
      </Form>

      <div className="font-bold text-2xl text-center w-full"> Images </div>
      {imgContent}
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
        <p className="text-2xl font-bold">
          {modalItem.video + "/" + modalItem.frameId}
        </p>
        <Row gutter={[8, 8]} className="mt-4">
          <Col>
            <Button
              onClick={() => {
                const ignoredVideos = form.getFieldValue("ignoredVideos");
                if (ignoredVideos) {
                  if (!ignoredVideos.includes(modalItem.video)) {
                    form.setFieldValue("ignoredVideos", [
                      ...ignoredVideos,
                      modalItem.video,
                    ]);
                  }
                } else {
                  form.setFieldValue("ignoredVideos", [modalItem.video]);
                }
              }}
            >
              Ignore This Video
            </Button>
          </Col>
          <Col>
            <Button
              onClick={() => {
                window.open(modalItem.youtubeUrl);
              }}
            >
              View Youtube Link
            </Button>
          </Col>
          <Col>
            <Button
              onClick={() => {
                window.open(
                  `/videos/${modalItem.video}?video=${modalItem.video}&fps=${
                    modalItem.fps
                  }&frameId=${modalItem.frameId}&prefix=${extractVideoYoutubeId(
                    modalItem.youtubeUrl?.toString() || ""
                  )}`,
                  "_blank"
                );
              }}
            >
              View All Frames In Video
            </Button>
          </Col>
        </Row>
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

export default Home;
