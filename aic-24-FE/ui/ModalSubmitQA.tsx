import { Modal } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";

function ModalSubmitQA({
  visible,
  setVisible,
  videoId,
  milisecond,
  setIsSuccess,
  setIsFail,
  setVisibleModal,
  setIsTrue
}: any) {
  const [answer, setAnswer] = useState("");

  const evaId = process.env.NEXT_PUBLIC_EVALUATIONID;
  const sessionId = process.env.NEXT_PUBLIC_SESSIONID;

  const [body, setBody] = useState({
    answerSets: [{ answers: [{ text: "" }] }],
  });

  useEffect(() => {
    setBody({
      answerSets: [
        { answers: [{ text: answer + "-" + videoId + "-" + milisecond }] },
      ],
    });
  }, [answer, videoId, milisecond]);

  const handleSubmit = async () => {
    try {
      const res = await axios.post(
        `https://eventretrieval.one/api/v2/submit/${evaId}?session=${sessionId}`,
        body,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const logText = `Status: ${res.data.status}, Submission: ${res.data.submission}, Video: ${videoId}, Frame: ${milisecond}, QA: ${answer}`;

      const log = await axios.post(
        `http://localhost:8000/print_log`,
        {
          text: logText || "This Is Log",
        }
      )

      setIsSuccess(true);
      setVisible(false);
      setVisibleModal(false);

      if (res.data.submission == "WRONG") {
        setIsTrue(false);
      }
      else {
        setIsTrue(true);
      }

      console.log("Submitted data:", res.data);
    } catch (error) {
      console.error("Error submitting data:", error);
      setIsFail(true);
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
          setAnswer("");
        }}
        okText="Confirm"
        onCancel={() => setVisible(false)}
        open={visible}
      >
        <div className="mt-4">
          <input
            id="input"
            type="text"
            value={answer}
            onChange={(event) => setAnswer(event.target.value)}
            className="shadow appearance-none border rounded w-full mb-2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter QA"
          />
        </div>

        <div>
          <pre>{JSON.stringify(body, null, 2)}</pre>
        </div>
      </Modal>
    </div>
  );
}

export default ModalSubmitQA;
