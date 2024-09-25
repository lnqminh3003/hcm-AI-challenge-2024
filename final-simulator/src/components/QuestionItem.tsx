const QuestonItem = ({ index }: any) => {
  return (
    <div className="mt-8 mx-4">
      <button className="border-2 w-[100px] h-[100px] border-black text-2xl font-bold">{index}</button>
    </div>
  );
};

export default QuestonItem;
