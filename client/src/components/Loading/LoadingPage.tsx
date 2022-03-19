import React from "react";
import ReactLoading from "react-loading";

export default class ExportPage extends React.Component {
  constructor(props = {}) {
    super(props);
  }

  render() {
    return (
      <div className="bg-[#ededed] flex flex-row justify-center items-center h-screen">
        {" "}
        <ReactLoading
          type={"spin"}
          color={"#rgb(40 58 81)"}
          height={100}
          width={100}
        />{" "}
        <p className="p-8 flex justify-center text-2xl font-bold text-center text-gray-700">
          Loading.....
        </p>
      </div>
    );
  }
}
