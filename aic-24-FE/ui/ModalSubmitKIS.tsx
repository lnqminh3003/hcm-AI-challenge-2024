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
  setIsFail,
  setVisibleModal,
}: any) {
  const [answer, setAnswer] = useState("");

  const evaId = process.env.NEXT_PUBLIC_EVALUATIONID;
  const sessionId = process.env.NEXT_PUBLIC_SESSIONID;

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
      const res = await axios.post(
        "https://aic24.onrender.com/add-user-to-query",
        {
          queryName: "query 2",
          user: {
            id: name,
            videoId: videoId,
            frameId: milisecond.toString(),
            QA: "A",
          },
        }
      );

      // const res = await axios.post(
      //   `https://eventretrieval.one/api/v2/submit/${evaId}?session=${sessionId}`,
      //   body,
      //   {
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //   }
      // );

      // const logText = `Status: ${res.data.status}, Submission: ${res.data.submission}, Video: ${videoId}, Frame: ${milisecond}`

      // const log = await axios.post(
      //   `http://localhost:8000/print_log`,
      //   {
      //     text: logText || "This Is Log",
      //   }
      // )

      // setIsSuccess(true);
      // console.log(res.data.submission);
      // if (res.data.submission == "WRONG") {
      //   setIsTrue(false);
      // }
      // else {
      //   setIsTrue(true);
      // }

      setVisible(false);
      setVisibleModal(false);
      console.log("Submitted data:", res.data);
    } catch (error) {
      console.error("Error submitting data:", error);
      // setIsFail(true);
      setVisible(false);
      setVisibleModal(false);
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
