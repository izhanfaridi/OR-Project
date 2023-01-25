import React, { useState } from 'react'
import * as xlsx from "xlsx"
import { Oval } from 'react-loader-spinner'
import '../Styles/styles.css'
import noDataLogo from '../Assets/imgs/nodata_svg.svg'
function Graphs() {

    const [loading, setLoading] = useState(false);
    const [initialData, setInitialData] = useState([]);
    const [calculatedData, setCalculatedData] = useState([]);


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


    const calculate = () => {
        setCalculatedData([])
        setLoading(true)
        let arr = [];
        initialData.forEach((obj, index) => {
            if (index === 0) {
                let newObj = {
                    ...obj,
                    startTime: obj.arrivalTime,
                    endTime: obj.serviceTime,
                    get turnaroundTime() { return this.endTime - obj.arrivalTime },
                    get waitTime() { return this.turnaroundTime - obj.serviceTime },
                    get responseTime() { return this.startTime - obj.arrivalTime }
                }

                //setCalculatedData(prevState => [...prevState, newObj])
                arr.push(newObj)
            } else {
                let newObj = {
                    ...obj,
                    startTime: arr[index - 1].endTime,
                    get endTime() { return this.startTime + obj.serviceTime },
                    get turnaroundTime() { return this.endTime - obj.arrivalTime },
                    get waitTime() { return this.turnaroundTime - obj.serviceTime },
                    get responseTime() { return this.startTime - obj.arrivalTime }
                }
                arr.push(newObj)
                // setCalculatedData(prevState => [...prevState, newObj])
                //console.log(arr[index - 1]);

            }
        })

        setCalculatedData(arr)
        setLoading(false)
    }



    return (
        <div className='h-screen bg-gradient-to-bl from-[#21252B] to-[#2A323D] to-[#2D3C55]'>
            <div className='flex h-2/5'>
                <div className='flex border border-gray-600 m-4 rounded-lg flex-col text-white text-lg font-bold w-1/4 p-2 shadow-xl'>
                    <label className='pt-6' htmlFor="upload">Upload File</label>
                    <input
                        className='py-6 '
                        type="file"
                        name="upload"
                        id="upload"
                        onChange={readUploadFile}
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
                                <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
                                    <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                        <caption class="p-3 text-lg font-semibold text-left text-gray-900 bg-white dark:text-white dark:bg-gray-800">
                                            Tabular Form
                                        </caption>
                                        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                            <tr>
                                                <th scope="col" class="px-3 py-3">
                                                    CID
                                                </th>
                                                <th scope="col" class="px-3 py-3">
                                                    Arrival Time
                                                </th>
                                                <th scope="col" class="px-3 py-3">
                                                    Service Time
                                                </th>
                                                <th scope="col" class="px-3 py-3">
                                                    Start Time
                                                </th>
                                                <th scope="col" class="px-3 py-3">
                                                    End Time
                                                </th>
                                                <th scope="col" class="px-3 py-3">
                                                    Turnaround time
                                                </th>
                                                <th scope="col" class="px-3 py-3">
                                                    Response Time
                                                </th>
                                                <th scope="col" class="px-3 py-3">
                                                    Wait Time
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                calculatedData.map((elem, key) => (
                                                    <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700" key={key}>
                                                        <th scope="row" class="px-3 py-4 font-medium text-gray-900 dark:text-white">
                                                            {elem.customerId}
                                                        </th>
                                                        <th scope="row" class="px-3 py-4 font-medium text-gray-900 dark:text-white">
                                                            {elem.arrivalTime}
                                                        </th>
                                                        <th scope="row" class="px-3 py-4 font-medium text-gray-900 dark:text-white">
                                                            {elem.serviceTime}
                                                        </th>
                                                        <th scope="row" class="px-3 py-4 font-medium text-gray-900 dark:text-white">
                                                            {elem.startTime}
                                                        </th>
                                                        <th scope="row" class="px-3 py-4 font-medium text-gray-900 dark:text-white">
                                                            {elem.endTime}
                                                        </th>
                                                        <th scope="row" class="px-3 py-4 font-medium text-gray-900 dark:text-white">
                                                            {elem.turnaroundTime}
                                                        </th>
                                                        <th scope="row" class="px-3 py-4 font-medium text-gray-900 dark:text-white">
                                                            {elem.responseTime}
                                                        </th>
                                                        <th scope="row" class="px-3 py-4 font-medium text-gray-900 dark:text-white">
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