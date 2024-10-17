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
        "https://eventretrieval.one/api/v2/submit/3b1c6888-f0c7-412a-b21f-813d07b2e914?session=9MH-KbTyrD76R1iD5st_VyQ1BJfWcJuP",
        body,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setIsSuccess(true);
      console.log(res.data.submission);
      if (res.data.submission == "WRONG") {
        setIsTrue(false);
      }

      setVisible(false);
      setVisibleModal(false);
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
