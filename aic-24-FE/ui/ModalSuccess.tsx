import { Modal } from "antd";

function ModalSuccess({ isSuccess, setIsSuccess }: any) {
  return (
    <div className="z-50">
      <Modal
        centered
        // onOk={async () => {
        //   await handleSubmit();
        // }}
        okText="Loading"
        open={isSuccess}
      >
        <div className="font-bold text-xl mb-4">SUCCESS</div>
      </Modal>
    </div>
  );
}

export default ModalSuccess;
