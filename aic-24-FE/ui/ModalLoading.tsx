function ModalLoading({ isLoading }: any) {
  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center  z-50">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-black border-opacity-100"></div>
            <p className="mt-4 text-white">Loading...</p>
          </div>
        </div>
      )}
    </>
  );
}

export default ModalLoading;
