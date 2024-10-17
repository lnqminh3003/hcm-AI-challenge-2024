import { Modal } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import ModalSuccess from "./ModalSuccess";

function ModalSubmitKIS({
  visible,
  setVisible,
  videoId,
  milisecond,
  name,
  setIsSuccess,
  setIsTrue,
  setIsFail
}: any) {
  const [answer, setAnswer] = useState("");

  const [body, setBody] = useState({
    answerSets: [
      {
        answers: [
          {
            mediaItemName: "",
            start: "",
            end: "",
          },
        ],
      },
    ],
  });

  useEffect(() => {
    setBody({
      answerSets: [
        {
          answers: [
            {
              mediaItemName: videoId,
              start: milisecond,
              end: milisecond,
            },
          ],
        },
      ],
    });
  }, [answer, videoId, milisecond]);

  const handleSubmit = async () => {

    try {
      // const res = await axios.post(
      //   "https://aic24.onrender.com/add-user-to-query",
      //   {
      //     queryName: "query 2",
      //     user: {
      //       id: name,
      //       videoId: videoId,
      //       frameId: milisecond.toString(),
      //       QA: "A",
      //     },
      //   }
      // );

      const res = await axios.post(
        "https://eventretrieval.one/api/v2/submit/3b1c6888-f0c7-412a-b21f-813d07b2e914",
        body,
        {
          params: {
            session: "5bc243e3-c59e-4793-bbb1-5714f770935e",
          },
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setIsSuccess(true);
      console.log(res.data)
      setIsTrue(true);
      console.log("Submitted data:", res.data);
    } catch (error) {
      console.error("Error submitting data:", error);
      setIsFail(true);
    }
  };

  return (
    <div>
      <Modal
        centered
        onOk={async () => {
          await handleSubmit();
        }}
        okText="Confirm"
        onCancel={() => setVisible(false)}
        open={visible}
      >
        <div className="font-bold text-xl mb-4">Do You Want To Submit?</div>

        <div>
          <pre>{JSON.stringify(body, null, 2)}</pre>
        </div>
      </Modal>
    </div>
  );
}

export default ModalSubmitKIS;
