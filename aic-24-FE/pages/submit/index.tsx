import { Col, Radio, RadioChangeEvent } from "antd";
import { useState } from "react";
import axios from "axios";

const NAME_OPTIONS = [
  { label: "Bao", value: "bao" },
  { label: "Chau", value: "chau" },
  { label: "Sang", value: "sang" },
  { label: "Hoang", value: "hoang" },
  { label: "Minh", value: "minh" },
];

function SubmitPage() {
  const [nameOption, setNameOption] = useState<String>("minh");
  const [videoId, setVideoId] = useState("");
  const [frameId, setFrameId] = useState("");
  const [selectedOption, setSelectedOption] = useState("");

  const handleChange = (event: any) => {
    setSelectedOption(event.target.value);
  };

  const onClickSubmit = async () => {
    try {
      const res = await axios.post("http://localhost:2000/add-user-to-query", {
        "queryName": selectedOption,
        "user": {
          "id": nameOption,
          "videoId": videoId,
          "frameId": frameId,
        },
      });

      console.log("Submitted data:", res.data);
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  return (
    <div className="flex flex-col items-center pt-8">
      <div className="text-3xl font-bold mb-8">Submit Page</div>

      <Col className="mb-4">
        <Radio.Group
          options={NAME_OPTIONS}
          onChange={({ target: { value } }: RadioChangeEvent) => {
            setNameOption(value);
          }}
          value={nameOption}
        />
      </Col>

      <div className="flex items-center justify-center my-4">
        <div className="relative inline-block text-left">
          <select
            value={selectedOption}
            onChange={handleChange}
            className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="">Select an option</option>
            {Array.from({ length: 30 }, (_, index) => (
              <option key={index} value={`query ${index + 1}`}>
                Query {index + 1}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg
              className="fill-current h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M8.293 11.293a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414l-3.293-3.293-3.293 3.293a1 1 0 01-1.414-1.414l4-4z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
      </div>

      <input
        id="videoId"
        value={videoId}
        onChange={(e) => setVideoId(e.target.value)}
        placeholder="Enter Video Id"
        className="border-2 ml-4 border-gray-800 rounded py-2 px-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <input
        id="frameId"
        value={frameId}
        onChange={(e) => setFrameId(e.target.value)}
        placeholder="Enter Frame Id"
        className="border-2 ml-4 border-gray-800 rounded py-2 px-2 mt-4  focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <button onClick={onClickSubmit} className="px-4 py-1 border-2 border-gray-800 rounded-lg bg-slate-600 text-white mt-4">
        SUBMIT
      </button>
    </div>
  );
}

export default SubmitPage;
