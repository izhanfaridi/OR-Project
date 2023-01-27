import React, { useState } from 'react'
import * as xlsx from "xlsx"
import { Oval } from 'react-loader-spinner'
import '../Styles/styles.css'
import noDataLogo from '../Assets/imgs/nodata_svg.svg'
function Graphs() {

    const [loading, setLoading] = useState(false);
    const [initialData, setInitialData] = useState([]);
    const [calculatedData, setCalculatedData] = useState([]);
    const [serverQty, setServerQty] = useState(1);



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
                responseTime: null
            }
            setInitialData((prevState) => [...prevState, obj])
        })
    }

    const readUploadFile = (e) => {
        setInitialData([])
        setLoading(true)
        e.preventDefault();
        if (e.target.files) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const data = e.target.result;
                const workbook = xlsx.read(data, { type: "array" });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const json = xlsx.utils.sheet_to_json(worksheet);
                manipulateData(json)
                //setInitialData(json)
                // console.log(json);
            };
            reader.readAsArrayBuffer(e.target.files[0]);
        }
        setLoading(false)
    }


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


    const calculate = ()=>{
        setCalculatedData([])
        const arrivals = initialData.map(elem=>{return elem.arrivalTime})
        const serviceTimes = initialData.map(elem=>{return elem.serviceTime})
        const servers = new Array(serverQty).fill(0);
        arrivals.forEach((val, i) => {
            let serverNum = 0;
            for (let index = 0; index < servers.length; index++) {
                if (servers[index] > servers[index + 1]) {
                    serverNum = index + 1;
                }
            }
            let startTime = arrivals[i] <= servers[serverNum] ? servers[serverNum] : arrivals[i];
            let endTime = startTime + serviceTimes[i];
            let arrival = arrivals[i];
            let serviceTime = serviceTimes[i]
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
            //servers[serverNum] += serviceTimes[i];
            servers[serverNum] += endTime;
            setCalculatedData((prev) => [...prev, obj])
        });
    }


    return (
        <div className='h-screen bg-gradient-to-bl from-[#21252B] to-[#2A323D] to-[#2D3C55]'>
            <div className='flex h-2/5'>
                <div className='flex border border-gray-600 m-4 rounded-lg flex-col text-white text-lg font-bold w-1/4 p-2 shadow-xl'>
                    <label className='pt-6' htmlFor="upload">Upload File</label>
                    <input
                        className='pt-6 pb-12 '
                        type="file"
                        name="upload"
                        id="upload"
                        onChange={readUploadFile}
                    />
                     <label className=''>Number of Servers</label>
                    <input
                        className=' px-2 mt-2 w-1/2 rounded-lg bg-white text-black focus:outline-none font-medium mb-4'
                        placeholder='Enter Number of Servers'
                        type="number"
                        defaultValue={1}
                        onChange={(e) => { setServerQty(parseInt(e.target.value)) }}
                    />
                    {

                        loading ? (

                            <div className='rounded-md bg-[#2E71FF] text-white font-bold w-1/2 h-12 mt-2 mb-7 flex justify-center items-center'>
                                <Oval
                                    height={35}
                                    width={35}
                                    color="#fff"
                                    wrapperStyle={{}}
                                    wrapperClass=""
                                    visible={true}
                                    ariaLabel='oval-loading'
                                    secondaryColor="#ddd"
                                    strokeWidth={4}
                                    strokeWidthSecondary={4}

                                />
                            </div>
                        ) : (
                            <>
                                <button onClick={calculate} className='rounded-md bg-[#2E71FF] text-white font-bold w-1/2 h-12 mt-2 mb-7 text-center text-lg'>
                                    CALCULATE
                                </button>
                                {/* <button onClick={() => { console.log(calculatedData) }} className='rounded-md bg-[#2E71FF] text-white font-bold w-1/2 h-12 mt-2 mb-7 text-center text-lg'>
                                    log
                                </button> */}
                            </>

                        )
                    }
                </div>
                <div className='text-white border border-gray-600 grow overflow-y-auto m-4 scrollbar-hide rounded-lg shadow-xl'>
                    {
                        loading ? (
                            <div className='flex flex-col justify-center items-center h-full'>
                                <img src={noDataLogo} className="w-1/12" />
                                <h2 className='text-xl py-3.5 pl-4 font-semibold'>No Data To Display!</h2>
                            </div>
                        ) : (
                            calculatedData.length === 0 ? (
                                <div className='flex flex-col justify-center items-center h-full'>
                                    <img src={noDataLogo} className="w-1/12" />
                                    <h2 className='text-xl py-3.5 pl-4 font-semibold'>No Data To Display!</h2>
                                </div>
                            ) : (
                                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                        <caption className="p-3 text-lg font-semibold text-left text-gray-900 bg-white dark:text-white dark:bg-gray-800">
                                            Tabular Form
                                        </caption>
                                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
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
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                calculatedData.map((elem, key) => (
                                                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" key={key}>
                                                        <th scope="row" className="px-3 py-4 font-medium text-gray-900 dark:text-white">
                                                            {elem.customerId}
                                                        </th>
                                                        <th scope="row" className="px-3 py-4 font-medium text-gray-900 dark:text-white">
                                                            {elem.arrivalTime}
                                                        </th>
                                                        <th scope="row" className="px-3 py-4 font-medium text-gray-900 dark:text-white">
                                                            {elem.serviceTime}
                                                        </th>
                                                        <th scope="row" className="px-3 py-4 font-medium text-gray-900 dark:text-white">
                                                            {elem.startTime}
                                                        </th>
                                                        <th scope="row" className="px-3 py-4 font-medium text-gray-900 dark:text-white">
                                                            {elem.endTime}
                                                        </th>
                                                        <th scope="row" className="px-3 py-4 font-medium text-gray-900 dark:text-white">
                                                            {elem.turnaroundTime}
                                                        </th>
                                                        <th scope="row" className="px-3 py-4 font-medium text-gray-900 dark:text-white">
                                                            {elem.responseTime}
                                                        </th>
                                                        <th scope="row" className="px-3 py-4 font-medium text-gray-900 dark:text-white">
                                                            {elem.waitTime}
                                                        </th>
                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                    </table>
                                </div>

                            )
                        )

                    }


                </div>
            </div>
        </div>
    )
}

export default Graphs