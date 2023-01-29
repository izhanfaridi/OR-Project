import React, { useState, useEffect, useRef } from "react";
import * as xlsx from "xlsx";
import { Oval } from "react-loader-spinner";
import "../Styles/styles.css";
import noDataLogo from "../Assets/imgs/nodata_svg.svg";
import CanvasJSReact from "../Assets/canvasjs.react";

var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

function Graphs() {
  const [loading, setLoading] = useState(false);
  const [initialData, setInitialData] = useState([]);
  const [performanceObj, setPerformanceObj] = useState([]);
  const [calculatedData, setCalculatedData] = useState([]);
  const [serverQty, setServerQty] = useState(1);

  const options = {
    animationEnabled: true,
    theme: "dark2",
    title: {
      text: "Turnaround Time, Wait Time and Service",
    },
    axisY: {
      title: "Time in Minutes",
    },
    toolTip: {
      shared: true,
    },
    data: [
      {
        type: "spline",
        name: "Turnaround Time",
        showInLegend: true,
        dataPoints: calculatedData.map((elem) => {
          return { y: elem.turnaroundTime, label: elem.customerId };
        }),
      },
      {
        type: "spline",
        name: "Wait Time",
        showInLegend: true,
        dataPoints: calculatedData.map((elem) => {
          return { y: elem.waitTime, label: elem.customerId };
        }),
      },
      {
        type: "spline",
        name: "Service Time",
        showInLegend: true,
        dataPoints: calculatedData.map((elem) => {
          return { y: elem.serviceTime, label: elem.customerId };
        }),
      },
    ],
  };

  const initialRender = useRef(true);
  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
    } else {
      performanceMeasures();
    }
  }, [calculatedData]);

  const manipulateData = (data) => {
    data.forEach((elem, index) => {
      let obj = {
        customerId: Object.values(elem)[0],
        arrivalTime: Object.values(elem)[1],
        serviceTime: Object.values(elem)[2],
        startTime: null,
        endTime: null,
        turnaroundTime: null,
        waitTime: null,
        responseTime: null,
      };
      setInitialData((prevState) => [...prevState, obj]);
    });
  };

  const readUploadFile = (e) => {
    setInitialData([]);
    setLoading(true);
    e.preventDefault();
    if (e.target.files) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target.result;
        const workbook = xlsx.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = xlsx.utils.sheet_to_json(worksheet);
        manipulateData(json);
        //setInitialData(json)
        // console.log(json);
      };
      reader.readAsArrayBuffer(e.target.files[0]);
    }
    setLoading(false);
  };

  // const calculate = () => {
  //     setCalculatedData([])
  //     setLoading(true)
  //     let arr = [];
  //     initialData.forEach((obj, index) => {
  //         if (index === 0) {
  //             let newObj = {
  //                 ...obj,
  //                 startTime: obj.arrivalTime,
  //                 endTime: obj.serviceTime,
  //                 get turnaroundTime() { return this.endTime - obj.arrivalTime },
  //                 get waitTime() { return this.turnaroundTime - obj.serviceTime },
  //                 get responseTime() { return this.startTime - obj.arrivalTime }
  //             }

  //             //setCalculatedData(prevState => [...prevState, newObj])
  //             arr.push(newObj)
  //         } else {
  //             let newObj = {
  //                 ...obj,
  //                 startTime: arr[index - 1].endTime,
  //                 get endTime() { return this.startTime + obj.serviceTime },
  //                 get turnaroundTime() { return this.endTime - obj.arrivalTime },
  //                 get waitTime() { return this.turnaroundTime - obj.serviceTime },
  //                 get responseTime() { return this.startTime - obj.arrivalTime }
  //             }
  //             arr.push(newObj)
  //             // setCalculatedData(prevState => [...prevState, newObj])
  //             //console.log(arr[index - 1]);

  //         }
  //     })

  //     setCalculatedData(arr)
  //     setLoading(false)
  // }

  const calculate = () => {
    setCalculatedData([]);
    setPerformanceObj([]);
    const arrivals = initialData.map((elem) => {
      return elem.arrivalTime;
    });
    const serviceTimes = initialData.map((elem) => {
      return elem.serviceTime;
    });
    const servers = new Array(serverQty).fill(0);
    arrivals.forEach((val, i) => {
      let serverNum = 0;
      for (let index = 0; index < servers.length; index++) {
        if (servers[index] > servers[index + 1]) {
          serverNum = index + 1;
        }
      }
      //   let startTime = arrivals[i] <= servers[serverNum] ? servers[serverNum] : arrivals[i];
      let startTime;
      if (arrivals[i] <= servers[serverNum]) {
        startTime = servers[serverNum];
      } else {
        servers[serverNum] = arrivals[i];
        startTime = arrivals[i];
      }

      let endTime = startTime + serviceTimes[i];
      let arrival = arrivals[i];
      let serviceTime = serviceTimes[i];
      let turnaroundTime = endTime - arrival;
      let waitTime = turnaroundTime - serviceTime;
      let responseTime = startTime - arrival;
      let obj = {
        //interArrival: interArrivals[i],
        customerId: "C" + (i + 1),
        arrivalTime: arrival,
        serviceTime: serviceTimes[i],
        server: serverNum + 1,
        startTime,
        endTime,
        turnaroundTime,
        waitTime,
        responseTime,
      };
      servers[serverNum] += serviceTimes[i];
      setCalculatedData((prev) => [...prev, obj]);
    });
  };

  const performanceMeasures = () => {
    for (let i = 1; i <= serverQty; i++) {
      const array = calculatedData.filter((elem) => elem.server === i);
      let server = i;
      let avgServiceTime =
        array
          .map((elem) => {
            return elem.serviceTime;
          })
          .reduce((partialSum, a) => partialSum + a, 0) / calculatedData.length;
      let avgArrivalTime =
        array
          .map((elem) => {
            return elem.arrivalTime;
          })
          .reduce((partialSum, a) => partialSum + a, 0) / calculatedData.length;
      let avgTurnaround =
        array
          .map((elem) => {
            return elem.turnaroundTime;
          })
          .reduce((partialSum, a) => partialSum + a, 0) / calculatedData.length;
      let avgWaitTime =
        array
          .map((elem) => {
            return elem.waitTime;
          })
          .reduce((partialSum, a) => partialSum + a, 0) / calculatedData.length;
      let avgWaitTimeWhoWait =
        array
          .map((elem) => {
            return elem.waitTime;
          })
          .reduce((partialSum, a) => partialSum + a, 0) /
        array.filter((elem) => elem.waitTime !== 0).length;
      let avgResponseTime =
        array
          .map((elem) => {
            return elem.responseTime;
          })
          .reduce((partialSum, a) => partialSum + a, 0) / calculatedData.length;

      setPerformanceObj((prev) => [
        ...prev,
        {
          avgArrivalTime,
          avgServiceTime,
          avgTurnaround,
          avgWaitTime,
          avgWaitTimeWhoWait,
          avgResponseTime,
          server,
        },
      ]);
    }
  };

  return (
    <div className="h-screen bg-gradient-to-bl from-[#21252B] to-[#2A323D] to-[#2D3C55]">
      <div className="flex h-1/2">
        <div className="flex border border-gray-600 m-4 rounded-lg flex-col text-white font-bold w-1/4 p-2 shadow-xl">
          <label className="pt-4" htmlFor="upload">
            Upload File
          </label>
          <input
            className="pt-6 pb-6 "
            type="file"
            name="upload"
            id="upload"
            onChange={readUploadFile}
          />
          <label className="">Number of Servers</label>
          <input
            className=" px-2 mt-2 w-1/2 rounded-lg bg-white text-black focus:outline-none font-medium mb-4"
            placeholder="Enter Number of Servers"
            type="number"
            defaultValue={1}
            onChange={(e) => {
              setServerQty(parseInt(e.target.value));
            }}
          />
          {loading ? (
            <div className="rounded-md bg-[#2E71FF] text-white font-bold w-1/2 h-12 mt-2 mb-7 flex justify-center items-center">
              <Oval
                height={35}
                width={35}
                color="#fff"
                wrapperStyle={{}}
                wrapperClass=""
                visible={true}
                ariaLabel="oval-loading"
                secondaryColor="#ddd"
                strokeWidth={4}
                strokeWidthSecondary={4}
              />
            </div>
          ) : (
            <>
              <button
                onClick={calculate}
                className="rounded-md bg-[#2E71FF] text-white font-bold w-1/2 h-10 mt-2 mb-7 text-center text-lg"
              >
                CALCULATE
              </button>
              {/* <button onClick={() => { console.log(calculatedData) }} className='rounded-md bg-[#2E71FF] text-white font-bold w-1/2 h-12 mt-2 mb-7 text-center text-lg'>
                                    log
                                </button> */}
            </>
          )}
        </div>
        <div className="text-white border border-gray-600 grow overflow-y-auto m-4 scrollbar-hide rounded-lg shadow-xl">
          {loading ? (
            <div className="flex flex-col justify-center items-center h-full">
              <img src={noDataLogo} className="w-1/12" />
              <h2 className="text-xl py-3.5 pl-4 font-semibold">
                No Data To Display!
              </h2>
            </div>
          ) : calculatedData.length === 0 ? (
            <div className="flex flex-col justify-center items-center h-full">
              <img src={noDataLogo} className="w-1/12" />
              <h2 className="text-xl py-3.5 pl-4 font-semibold">
                No Data To Display!
              </h2>
            </div>
          ) : (
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
              <table className="w-full text-sm text-left text-gray-400">
                <caption className="p-3 text-lg font-semibold text-left text-white bg-gray-800">
                  Tabular Form
                </caption>
                <thead className="text-xs text-gray-700 uppercase bg-gray-700 text-gray-400">
                  <tr>
                    <th scope="col" className="px-3 py-3">
                      CID
                    </th>
                    <th scope="col" className="px-3 py-3">
                      Arrival Time
                    </th>
                    <th scope="col" className="px-3 py-3">
                      Service Time
                    </th>
                    <th scope="col" className="px-3 py-3">
                      Start Time
                    </th>
                    <th scope="col" className="px-3 py-3">
                      End Time
                    </th>
                    <th scope="col" className="px-3 py-3">
                      Turnaround time
                    </th>
                    <th scope="col" className="px-3 py-3">
                      Response Time
                    </th>
                    <th scope="col" className="px-3 py-3">
                      Wait Time
                    </th>
                    <th scope="col" className="px-3 py-3">
                      Server Assigned
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {calculatedData.map((elem, key) => (
                    <tr
                      className="border-b bg-gray-800 border-gray-700"
                      key={key}
                    >
                      <th
                        scope="row"
                        className="px-3 py-4 font-medium text-white text-center"
                      >
                        {elem.customerId}
                      </th>
                      <th
                        scope="row"
                        className="px-3 py-4 font-medium text-white text-center"
                      >
                        {elem.arrivalTime}
                      </th>
                      <th
                        scope="row"
                        className="px-3 py-4 font-medium text-white text-center"
                      >
                        {elem.serviceTime}
                      </th>
                      <th
                        scope="row"
                        className="px-3 py-4 font-medium text-white text-center"
                      >
                        {elem.startTime}
                      </th>
                      <th
                        scope="row"
                        className="px-3 py-4 font-medium text-white text-center"
                      >
                        {elem.endTime}
                      </th>
                      <th
                        scope="row"
                        className="px-3 py-4 font-medium text-white text-center"
                      >
                        {elem.turnaroundTime}
                      </th>
                      <th
                        scope="row"
                        className="px-3 py-4 font-medium text-white text-center"
                      >
                        {elem.responseTime}
                      </th>
                      <th
                        scope="row"
                        className="px-3 py-4 font-medium text-white text-center"
                      >
                        {elem.waitTime}
                      </th>
                      <th
                        scope="row"
                        className="px-3 py-4 font-medium text-white text-center"
                      >
                        S{elem.server}
                      </th>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      <div className="flex h-1/2">
        <div className="flex border border-gray-600 mt-1.5 mb-3 mx-3 rounded-lg flex-row flex-wrap text-white text-lg font-bold w-3/5 p-2 shadow-xl">
          {loading ? (
            <div className="flex flex-col justify-center items-center h-full">
              <img src={noDataLogo} className="w-1/12" />
              <h2 className="text-xl py-3.5 pl-4 font-semibold">
                No Data To Display!
              </h2>
            </div>
          ) : calculatedData.length === 0 ? (
            <div className="flex flex-col justify-center items-center h-full">
              <img src={noDataLogo} className="w-1/12" />
              <h2 className="text-xl py-3.5 pl-4 font-semibold">
                No Data To Display!
              </h2>
            </div>
          ) : (
            <CanvasJSChart
              containerProps={{ width: "100%", height: "100%" }}
              options={options}
              /* onRef={ref => this.chart = ref} */
            />
          )}
        </div>
        <div className="text-white border border-gray-600 grow overflow-y-auto m-3 scrollbar-hide rounded-lg shadow-xl">
          {loading ? (
            <div className="flex flex-col justify-center items-center h-full">
              <img src={noDataLogo} className="w-1/12" />
              <h2 className="text-xl py-3.5 pl-4 font-semibold">
                No Data To Display!
              </h2>
            </div>
          ) : performanceObj.length === 0 ? (
            <div className="flex flex-col justify-center items-center h-full">
              <img src={noDataLogo} className="w-1/12" />
              <h2 className="text-xl py-3.5 pl-4 font-semibold">
                No Data To Display!
              </h2>
            </div>
          ) : (
            <div className="relative overflow-x-auto drop-shadow-xl sm:rounded-lg">
              {performanceObj.map((elem, key) => (
                <table className="w-full text-sm text-left text-gray-400">
                  <caption className="p-3 text-lg font-semibold text-left text-white bg-gray-800">
                    Performance Measure for Server {elem.server}
                  </caption>
                  <thead className="text-xs text-gray-700 uppercase bg-gray-700 text-gray-400">
                    <tr>
                      <th scope="col" className="px-3 py-3">
                        Avg Arrival
                      </th>
                      <th scope="col" className="px-3 py-3">
                        Avg Service
                      </th>
                      <th scope="col" className="px-3 py-3">
                        Avg Turnaround
                      </th>
                      <th scope="col" className="px-3 py-3">
                        Avg Wait Time
                      </th>
                      <th scope="col" className="px-3 py-3">
                        Avg Wait Time for Who Wait
                      </th>
                      <th scope="col" className="px-3 py-3">
                        Avg Response
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      className="border-b bg-gray-800 border-gray-700"
                      key={key}
                    >
                      <th
                        scope="row"
                        className="px-3 py-4 font-medium text-white text-center"
                      >
                        {(Math.round(elem.avgArrivalTime * 100) / 100).toFixed(
                          3
                        )}
                      </th>
                      <th
                        scope="row"
                        className="px-3 py-4 font-medium text-white text-center"
                      >
                        {(Math.round(elem.avgServiceTime * 100) / 100).toFixed(
                          3
                        )}
                      </th>
                      <th
                        scope="row"
                        className="px-3 py-4 font-medium text-white text-center"
                      >
                        {(Math.round(elem.avgTurnaround * 100) / 100).toFixed(
                          3
                        )}
                      </th>
                      <th
                        scope="row"
                        className="px-3 py-4 font-medium text-white text-center"
                      >
                        {(Math.round(elem.avgWaitTime * 100) / 100).toFixed(3)}
                      </th>
                      <th
                        scope="row"
                        className="px-3 py-4 font-medium text-white text-center"
                      >
                        {(
                          Math.round(elem.avgWaitTimeWhoWait * 100) / 100
                        ).toFixed(3)}
                      </th>
                      <th
                        scope="row"
                        className="px-3 py-4 font-medium text-white text-center"
                      >
                        {(Math.round(elem.avgResponseTime * 100) / 100).toFixed(
                          3
                        )}
                      </th>
                    </tr>
                  </tbody>
                </table>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Graphs;
