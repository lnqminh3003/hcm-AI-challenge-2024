import { Modal } from "antd";
import { useEffect, useState } from "react";

function ModalSubmitQA({ visible, setVisible, submit, videoId, milisecond }: any) {
  const [answer, setAnswer] = useState("");
  const [isConfirmSubmit, SetConfirmSubmit] = useState(false);
  const [body, setBody] = useState({
    answerSets: [{ answers: [{ text: "" }] }],
  });

  useEffect(() => {
    setBody({
      answerSets: [
        { answers: [{ text: answer + "-" + videoId + "-" + milisecond}] },
      ],
    });
  }, [answer, videoId, milisecond]);

  return (
    <div>
      <Modal
        centered
        onOk={async () => {
          SetConfirmSubmit(false);
          await submit();
          setAnswer("");
        }}
        okText="Confirm"
        onCancel={() => SetConfirmSubmit(false)}
        open={isConfirmSubmit}
      >
        Do You Want To Submit?
      </Modal>

      <Modal
        centered
        onOk={async () => {
          SetConfirmSubmit(true);
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
