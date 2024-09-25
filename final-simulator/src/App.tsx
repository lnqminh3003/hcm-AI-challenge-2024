import QuestionList from "./components/QuestionList";

export default function App() {
  return (
    
    <>
      <div className="flex flex-col items-center">
        <h1 className="text-5xl font-bold underline text-center pt-4">
          FINAL SIMULATOR
        </h1>
        <QuestionList />
      </div>
    </>
  );
}
