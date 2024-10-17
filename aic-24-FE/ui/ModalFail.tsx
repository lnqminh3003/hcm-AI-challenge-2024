import Image from "next/image";
import failImage from "../public/fail.png";

function ModalFail({ isFail, setIsFail }: any) {
  return (
    <>
      {isFail && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full flex flex-col items-center">
            <Image src={failImage} alt="Success" width={200} height={200} />
            <button
              className="bg-red-500 text-white font-bold py-2 px-4 rounded"
              onClick={() => setIsFail(false)}
            >
              Close Modal
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default ModalFail;
