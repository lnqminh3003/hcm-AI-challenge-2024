import { Modal } from "antd";

function ModalLoading({ isLoading, setIsLoading }: any) {
  return (
    <div className="z-50">
      <Modal
        centered
        // onOk={async () => {
        //   await handleSubmit();
        // }}
        okText="Loading"
    
        open={isLoading}
      >
        <div className="font-bold text-xl mb-4">LOADING</div>
      </Modal>
    </div>
  );
}

export default ModalLoading;
