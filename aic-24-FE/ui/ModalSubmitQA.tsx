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
}: any) {
  const [answer, setAnswer] = useState("");

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
      setVisible(false);
      setVisibleModal(false);
      console.log(res.data);

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
