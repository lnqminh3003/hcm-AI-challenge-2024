import Image from "next/image";
import successImage from "../public/submit.png";

function ModalSuccess({ isSuccess, setIsSuccess, isTrue }: any) {
  return (
    <>
      {true && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full flex flex-col items-center">
            <Image src={successImage} alt="Success" width={200} height={200} />
            {isTrue ? (
              <p className="mb-6 mt-6 text-xl">TRUE</p>
            ) : (
              <p className="mb-6 mt-6 text-xl">WRONG</p>
            )}

            <button
              className="bg-red-500 text-white font-bold py-2 px-4 rounded"
              onClick={() => setIsSuccess(false)}
            >
              Close Modal
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default ModalSuccess;
