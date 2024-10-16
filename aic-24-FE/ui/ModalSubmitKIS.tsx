import { Modal } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";

function ModalSubmitKIS({
  visible,
  setVisible,
  videoId,
  milisecond,
  setIsLoading,
  name,
}: any) {
  const [answer, setAnswer] = useState("");
  const [response, setResponse] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

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

      // const res = await axios.post(
      //   "https://eventretrieval.one/api/v2/submit/4df14a14-4641-49a4-80be-8d61d5de58b6",
      //   body,
      //   {
      //     params: {
      //       session: "9MH-KbTyrD76R1iD5st_VyQ1BJfWcJuP",
      //     },
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //   }
      // );

      setIsLoading(false);
      setIsSuccess(true);
      setResponse(res.data);
      console.log("Submitted data:", res.data);
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
          onOk={() => setIsSuccess(false)}
          okText="SUCCESS"
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
