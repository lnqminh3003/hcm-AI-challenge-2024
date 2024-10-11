function ModalSuccess({ isSuccess, setIsSuccess }: any) {
  return (
    <>
      {isSuccess && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-auto">
            <div className="flex justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-green-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.707a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 10-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>

            <div className="text-center mt-4">
              <h3 className="text-lg font-semibold text-gray-700">Success!</h3>
              <p className="text-gray-600 mt-2">
                Your action has been completed successfully.
              </p>
            </div>

            <div className="flex justify-center mt-6 bg-green-500 border-8 px-4 py-2 rounded hover:bg-green-600">
              <button
                className=""
                onClick={()=>setIsSuccess(false)}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ModalSuccess;
