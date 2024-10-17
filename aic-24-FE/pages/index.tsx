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
import AsrItem from "ui/asr-item";
import axios from "axios";
import ModalLoading from "ui/ModalLoading";
import { set } from "lodash";
import ModalSuccess from "ui/ModalSuccess";
import GeminiComponent from "ui/GeminiComponent";
import ModalSubmitQA from "ui/ModalSubmitQA";
import ModalSubmitKIS from "ui/ModalSubmitKIS";
import ModalFail from "ui/ModalFail";

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
  highlight?: string;
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
  { label: "Heading", value: "heading" },
];

const NAME_OPTIONS = [
  { label: "Bao", value: "bao" },
  { label: "Chau", value: "chau" },
  { label: "Sang", value: "sang" },
  { label: "Hoang", value: "hoang" },
  { label: "Minh", value: "minh" },
];

const Home: NextPage = () => {
  const [form] = useForm();
  const [searchOption, setSearchOption] = useState<String>("simple");
  const [imgSource, setImgSource] = useState<ImgType[]>([]);
  const [visible, setVisible] = useState(false);
  const [modalItem, setModalItem] = useState<ImgType>(mock_item);
  const [asr, SetAsr] = useState(false);
  const [numPeople, setNumPeople] = useState("");
  const [numberPeopleOption, setNumberPeoplehOption] = useState<string>("off");
  const [nameOption, setNameOption] = useState<String>("minh");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitQA, setIsSubmitQA] = useState(false);
  const [isSubmitKIS, setIsSubmitKIS] = useState(false);
  const [historyQuery, setHistoryQuery] = useState<any>([]);
  const [searchHeading, setSearchHeading] = useState("");
  const [isTrue, setIsTrue] = useState(false);
  const [isFail, setIsFail] = useState(false);

  function extractParts(str: string) {
    const regex = /[\/\\]([^\/\\]+)[\/\\](\d+\.webp)$/;
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

  function getMilisecond(frameId: string, fps: string) {
    return Math.floor((parseInt(frameId) / parseInt(fps)) * 1000);
  }

  const imgContent = useMemo(() => {
    const newImgSrc = groupByVideo(imgSource);
    return (
      <Row style={{ margin: 16 }} gutter={[16, 16]} justify="center">
        <>
          {imgSource.length > 0 ? (
            Object.keys(newImgSrc).map((e) => (
              <>
                {!form.getFieldValue("ignoredVideos").includes(e) && (
                  <Col span={24} key={e}>
                    <Typography.Text style={{ fontSize: 20, fontWeight: 700 }}>
                      {e}
                    </Typography.Text>

                    <DeleteFilled
                      style={{ fontSize: 20, margin: 8, color: "red" }}
                      onClick={() => {
                        const ignoredVideos =
                          form.getFieldValue("ignoredVideos");
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
                                {
                                  extractParts(img.link ? img.link : "")
                                    ?.videoId
                                }
                              </p>
                              {img.highlight == "true" ? (
                                <Image
                                  style={{
                                    borderRadius: 0,
                                    height: "160px",
                                    width: "213px",
                                    borderColor: "red",
                                    borderWidth: 5,
                                  }}
                                  src={img.link}
                                  alt="aic-img"
                                  onClick={() => {
                                    setModalItem(img);
                                    setVisible(true);
                                  }}
                                  preview={false}
                                />
                              ) : (
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
                              )}

                              <p className="">
                                Frame ID:
                                {
                                  extractParts(img.link ? img.link : "")
                                    ?.frameId
                                }
                              </p>
                            </div>
                          )}
                        </Col>
                      ))}
                    </Row>
                  </Col>
                )}
              </>
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
                link: `/data/video_frames/${value.video_id}/${frameId}.webp`,
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

          return {
            video: videoId,
            frameId: frameId,
            link: value.img_path.toString(),
            youtubeUrl: value.youtube_link.toString(),
            fps: value.fps.toString(),
            highlight: value.highlight.toString(),
          };
        });

        setImgSource(newSource);
        setHistoryQuery([...historyQuery, enString]);
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

  async function handleGemini() {
    const geminiInput = form.getFieldValue("geminiInput");

    try {
      const apiKey = process.env.NEXT_PUBLIC_API_GEMINI_KEY;
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

      const requestBody = {
        contents: [
          {
            parts: [
              {
                text: geminiInput,
              },
            ],
          },
        ],
      };

      const response = await axios.post(url, requestBody, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const generatedText = response.data.candidates[0].content.parts[0].text;

      form.setFieldValue("geminiOutput", generatedText);
    } catch (error) {
      console.error("Error during the API call:", error);
    }
  }

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

            <Col className="mb-4">
              <Radio.Group
                options={NAME_OPTIONS}
                onChange={({ target: { value } }: RadioChangeEvent) => {
                  setNameOption(value);
                }}
                value={nameOption}
              />
            </Col>
          </Col>

          <Col span={12}>
            <Item name="queryString">
              <TextArea
                onChange={() => {
                  const { queryString } = form.getFieldsValue();
                  handleLiveSearchQuery(false);
                  form.setFieldValue(
                    "geminiInput",
                    "Hãy tưởng tượng tôi là search engine.... " + queryString
                  );
                }}
                showCount
                maxLength={800}
                style={{ height: 100, marginBottom: 24, borderWidth: 3 }}
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
                style={{ height: 100, marginBottom: 24, borderWidth: 3 }}
                placeholder="Eng Text"
              />
            </Item>
          </Col>

          <Col span={11}>
            <Item name="geminiInput">
              <TextArea
                onChange={() => {}}
                showCount
                maxLength={800}
                style={{ height: 120, marginBottom: 24, borderWidth: 3 }}
                placeholder="Gemini Input"
              />
            </Item>
          </Col>
          <button
            className="border-2  bg-blue-500 text-white rounded-xl mt-6 px-2 h-12"
            onClick={handleGemini}
          >
            Generate
          </button>
          <Col span={11}>
            <Item name="geminiOutput">
              <TextArea
                onChange={() => {}}
                showCount
                maxLength={800}
                style={{ height: 120, marginBottom: 24, borderWidth: 3 }}
                placeholder="Gemini Output"
              />
            </Item>
          </Col>

          <Col span={12} className="-mt-10 flex flex-col">
            <div className="mb-4">
              {historyQuery.length > 0 && (
                <div className="text-xl font-bold">History</div>
              )}
              {historyQuery.map((query: any) => (
                <div>{query}</div>
              ))}
            </div>

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
              {/* 
              <Col span={12}>
                <ModelOption />
              </Col> */}
            </Row>
          </Col>
          {searchOption == "asr" && (
            <Col span={12}>
              <Row gutter={[16, 16]}>
                <ASRForm form={form} />
              </Row>
            </Col>
          )}
          {searchOption == "heading" && (
            <Col span={12}>
              <div className="mt-4">
                <input
                  id="input"
                  type="text"
                  value={searchHeading}
                  onChange={(event) => setSearchHeading(event.target.value)}
                  className="shadow appearance-none border border-black rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Enter heading search"
                />
              </div>
            </Col>
          )}
          <div style={{ height: 20 }}></div>
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
        className="z-1"
        transitionName=""
        centered
        onOk={() => {
          setIsSubmitKIS(true);
        }}
        okText="Submit KIS"
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
          {modalItem.video + "-" + modalItem.frameId}
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
                  )}&name=${nameOption}`,
                  "_blank"
                );
              }}
            >
              View All Frames In Video
            </Button>
          </Col>
        </Row>

        <Button
          className="bg-blue-600 text-white mt-4"
          onClick={() => {
            setIsSubmitQA(true);
          }}
        >
          Submit QA
        </Button>
      </Modal>

      <ModalSuccess
        isSuccess={isSuccess}
        setIsSuccess={setIsSuccess}
        isTrue={isTrue}
      />
      <ModalFail isFail={isFail} setIsFail={setIsFail} />

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
        name={nameOption}
        setIsSuccess={setIsSuccess}
        setIsTrue={setIsTrue}
        setIsFail={setIsFail}
      />
    </>
  );
};

export default Home;
