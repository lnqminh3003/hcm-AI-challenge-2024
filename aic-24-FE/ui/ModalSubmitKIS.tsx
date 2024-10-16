import { Modal } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";

function ModalSubmitKIS({
  visible,
  setVisible,
  videoId,
  milisecond,
  setIsLoading,
  isSuccess,
  setIsSuccess,
  name
}: any) {
  const [answer, setAnswer] = useState("");
  const [response, setResponse] = useState("");

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
    setIsLoading(true);

    try {
      const res = await axios.post(
        "https://aic24.onrender.com/add-user-to-query",
        {
          queryName: "query 10",
          user: {
            id: name,
            videoId: videoId,
            frameId: milisecond,
            QA: answer,
          },
        }
      );

      setIsLoading(false);
      setIsSuccess(true);
      setResponse(res.data);
      //   console.log("Submitted data:", res.data);
    } catch (error) {
      console.error("Error submitting data:", error);
      setIsLoading(false);
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

      <div className="z-50">
        <Modal
          centered
          onOk={async () => {
            await handleSubmit();
          }}
          okText="Loading"
          open={isSuccess}
        >
          <div className="font-bold text-xl mb-4">SUCCESS</div>
          <div>{JSON.stringify(response, null, 2)}</div>
        </Modal>
      </div>
    </div>
  );
}

export default ModalSubmitKIS;
