function GeminiComponent({
    geminiInput,
    geminiOutput,
    setGeminiInput,
    setGeminiOutput,
  }: any) {
    return (
      <div className="h-[200px] w-[1000px] bg-yellow-400" >
        <div className="text-2xl font-bold mb-2">GEMINI</div>
        <div className="flex flex-row ">
          <input
            id="input"
            type="text"
            value={geminiInput}
            onChange={(event)=>setGeminiInput(event.target.value)}
            className="shadow appearance-none border rounded py-2 mt-8 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter something"
          />
  
          <input
            id="input"
            type="text"
            value={geminiOutput}
            onChange={setGeminiOutput}
            className="shadow appearance-none border rounded  py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter something"
          />
        </div>
      </div>
    );
  }
  
  export default GeminiComponent;
  