import React, { useState, useEffect, useRef } from 'react'
import { Oval } from 'react-loader-spinner'
import '../Styles/styles.css'
import noDataLogo from '../Assets/imgs/nodata_svg.svg'
import CanvasJSReact from '../Assets/canvasjs.react';

var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

function RandomNum() {




    const [loading, setLoading] = useState(false);
    const [calculatedData, setCalculatedData] = useState([]);
    const [performanceObj, setPerformanceObj] = useState([]);
    const [lambda, setLambda] = useState();
    const [meu, setMeu] = useState();
    const [CustomerNum, setCustomerNum] = useState(1);
    const [serverQty, setServerQty] = useState(1)

    const e = 2.718281828;


    const options = {
        animationEnabled: true,
        theme: "dark2",
        title: {
            text: "Turnaround Time, Wait Time and Service"
        },
        axisY: {
            title: "Time in Minutes"
        },
        toolTip: {
            shared: true
        },
        data: [{
            type: "spline",
            name: "Turnaround Time",
            showInLegend: true,
            dataPoints: calculatedData.map((elem) => {
                return { y: elem.turnaroundTime, label: elem.customerId }
            })
        },
        {
            type: "spline",
            name: "Wait Time",
            showInLegend: true,
            dataPoints: calculatedData.map((elem) => {
                return { y: elem.waitTime, label: elem.customerId }
            })
        }, {
            type: "spline",
            name: "Service Time",
            showInLegend: true,
            dataPoints: calculatedData.map((elem) => {
                return { y: elem.serviceTime, label: elem.customerId }
            })
        }]
    }

    const initialRender = useRef(true)
    const initialRenderPerformance = useRef(true)
    useEffect(() => {
        if (initialRender.current) {
            initialRender.current = false;
        } else {
            performanceMeasures();

        }

    }, [calculatedData])

    useEffect(() => {
        if (initialRenderPerformance.current) {
            initialRenderPerformance.current = false;
        } else {
            console.log("performance Data", performanceObj);

        }

    }, [performanceObj])


    function factorialize(num) {
        var result = num;
        if (num === 0 || num === 1)
            return 1;
        while (num > 1) {
            num--;
            result *= num;
        }
        return result;
    }

    const cumulativeFrequencyValues = (lambda, x) => {
        return ((e ** (lambda * -1)) * (lambda ** x)) / factorialize(x);
    }

    const serviceTimeValues = (meu) => {
        return (Math.floor((meu * -1) * Math.log(Math.random())))
    }

    const cumulativeFrequencyGenerate = () => {
        let arr = [];
        for (let i = 0; i < CustomerNum; i++) {
            if (i === 0) {
                arr.push(cumulativeFrequencyValues(lambda, i))
            } else {
                arr.push(cumulativeFrequencyValues(lambda, i) + arr[i - 1])
            }
        }
        console.log("cumulative frequencies ==>>", arr);
        interArrivalColumn(arr)
    }


    const interArrivalColumn = (cumulativeArr) => {
        let arr = [];

        for (let i = 0; i < CustomerNum; i++) {
            if (i === 0) {
                arr.push(0)
            } else {

                let rand = Math.random();
                arr.push(cumulativeArr.findIndex((value) => { return rand - value < 0 }))
            }
        }
        console.log("inter arrival ==>>", arr);
        getInitialData(arr)
    }

    const getInitialData = (intArrivalArray) => {
        let arrivalArr = []
        let serviceArr = []

        for (let i = 0; i < CustomerNum; i++) {
            if (i === 0) {
                arrivalArr.push(intArrivalArray[i])
            } else {
                arrivalArr.push(intArrivalArray[i] + arrivalArr[i - 1])
            }
        }

        console.log("arrival array ==>>", arrivalArr);

        for (let j = 0; j < CustomerNum; j++) {
            let serviceValue = serviceTimeValues(meu)
            while (serviceValue === 0) {
                serviceValue = serviceTimeValues(meu)
            }
            serviceArr.push(serviceValue)

        }
        console.log("Service array ==>>", serviceArr);

        // for (let k = 0; k < CustomerNum; k++) {
        //     let obj = {
        //         customerId: "C" + (k+1),
        //         arrivalTime: arrivalArr[k],
        //         serviceTime: serviceArr[k],
        //         startTime: null,
        //         endTime: null,
        //         turnaroundTime: null,
        //         waitTime: null,
        //         responseTime: null
        //     }
        //     setInitialData((prev) => [...prev, obj])
        // }

        finalTableData(arrivalArr, serviceArr);

    }


    const finalTableData = (arrivals, serviceTimes) => {
        const servers = new Array(serverQty).fill(0);
        arrivals.forEach((val, i) => {
            let serverNum = 0;
            for (let index = 0; index < servers.length; index++) {
                if (servers[index] > servers[index + 1]) {
                    serverNum = index + 1;
                }
            }
            //let startTime = arrivals[i] < servers[serverNum] ? servers[serverNum] : arrivals[i];
            let startTime;
            if (arrivals[i] <= servers[serverNum]) {
              startTime = servers[serverNum];
            } else {
              servers[serverNum] = arrivals[i];
              startTime = arrivals[i];
            }
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
            servers[serverNum] += serviceTimes[i];
            setCalculatedData((prev) => [...prev, obj])
        });
    }


    const performanceMeasures = () => {
        for (let i = 1; i <= serverQty; i++) {
            const array = calculatedData.filter(elem => elem.server === i)
            let server = i
            let avgServiceTime = ((array.map(elem => { return elem.serviceTime })).reduce((partialSum, a) => partialSum + a, 0)) / CustomerNum
            let avgArrivalTime = ((array.map(elem => { return elem.arrivalTime })).reduce((partialSum, a) => partialSum + a, 0)) / CustomerNum
            let avgTurnaround = ((array.map(elem => { return elem.turnaroundTime })).reduce((partialSum, a) => partialSum + a, 0)) / CustomerNum
            let avgWaitTime = ((array.map(elem => { return elem.waitTime })).reduce((partialSum, a) => partialSum + a, 0)) / CustomerNum
            let avgWaitTimeWhoWait = ((array.map(elem => { return elem.waitTime })).reduce((partialSum, a) => partialSum + a, 0)) / (array.filter(elem => elem.waitTime !== 0).length)
            let avgResponseTime = ((array.map(elem => { return elem.responseTime })).reduce((partialSum, a) => partialSum + a, 0)) / CustomerNum

            setPerformanceObj(prev => [...prev, {
                avgArrivalTime,
                avgServiceTime,
                avgTurnaround,
                avgWaitTime,
                avgWaitTimeWhoWait,
                avgResponseTime,
                server
            }])
        }


    }

    const calculate = () => {
        setLoading(true)
        //setInitialData([])
        setCalculatedData([])
        setPerformanceObj([])
        cumulativeFrequencyGenerate();
        setLoading(false)

    }


    const check = () => {
        console.log(Math.random());
    }

    return (
        <div className='h-screen bg-gradient-to-bl from-[#21252B] to-[#2A323D] to-[#2D3C55]'>
            <div className='flex h-1/2'>
                <div className='flex border border-gray-600 m-3 rounded-lg flex-row flex-wrap text-white font-bold w-1/4 p-2 shadow-xl'>
                    <div className='flex justify-start items-center w-full'>
                        <label className='pt-3'>Enter Mean λ</label>
                        <input
                            className=' px-2 mt-2 ml-2 rounded-lg bg-white text-black focus:outline-none font-medium w-1/2'
                            placeholder='Enter Mean λ'
                            type="number"
                            onChange={(e) => { setLambda(parseFloat(e.target.value)) }}
                        />
                    </div>
                    <div className='flex justify-start items-center w-full'>
                        <label className='pt-3'>Enter Mean μ</label>
                        <input
                            className=' px-2 mt-2 ml-2 rounded-lg bg-white text-black focus:outline-none font-medium w-1/2'
                            placeholder='Enter Mean μ'
                            type="number"
                            onChange={(e) => { setMeu(parseFloat(e.target.value)) }}
                        />
                    </div>

                    <label className='pt-3'>Number of Customers</label>
                    <input
                        className=' px-2 mt-2 rounded-lg bg-white text-black focus:outline-none font-medium'
                        placeholder='Enter Number of Customers'
                        type="number"
                        defaultValue={1}
                        onChange={(e) => { setCustomerNum(parseInt(e.target.value)) }}
                    />
                    <label className='pt-3'>Number Of Servers</label>
                    <input
                        className=' px-2 mt-2 mr-3 rounded-lg bg-white text-black focus:outline-none font-medium'
                        placeholder='Number of servers'
                        type="number"
                        defaultValue={1}
                        max={6}
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
                                <button onClick={calculate} className='rounded-md bg-[#2E71FF] text-white font-bold w-1/2 h-10 mt-5 mb-2 text-center text-lg'>
                                    CALCULATE
                                </button>
                                {/* <button onClick={() => { console.log(calculatedData) }} className='rounded-md bg-[#2E71FF] text-white font-bold w-1/2 h-12 mt-2 mb-7 text-center text-lg'>
                                    log
                                </button> */}
                            </>

                        )
                    }
                </div>
                <div className='text-white border border-gray-600 grow overflow-y-auto m-3 scrollbar-hide rounded-lg shadow-xl'>
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
                                <div className="relative overflow-x-auto drop-shadow-xl sm:rounded-lg">
                                    <table className="w-full text-sm text-left text-gray-400">
                                        <caption className="p-3 text-lg font-semibold text-left text-white bg-gray-800">
                                            Tabular Form
                                        </caption>
                                        <thead className="text-xs uppercase bg-gray-700 text-gray-400">
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
                                            {
                                                calculatedData.map((elem, key) => (
                                                    <tr className="border-b bg-gray-800 border-gray-700" key={key}>
                                                        <th scope="row" className="px-3 py-4 font-medium text-white">
                                                            {elem.customerId}
                                                        </th>
                                                        <th scope="row" className="px-3 py-4 font-medium text-white text-center">
                                                            {elem.arrivalTime}
                                                        </th>
                                                        <th scope="row" className="px-3 py-4 font-medium text-white text-center">
                                                            {elem.serviceTime}
                                                        </th>
                                                        <th scope="row" className="px-3 py-4 font-medium text-white text-center">
                                                            {elem.startTime}
                                                        </th>
                                                        <th scope="row" className="px-3 py-4 font-medium text-white text-center">
                                                            {elem.endTime}
                                                        </th>
                                                        <th scope="row" className="px-3 py-4 font-medium text-white text-center">
                                                            {elem.turnaroundTime}
                                                        </th>
                                                        <th scope="row" className="px-3 py-4 font-medium text-white text-center">
                                                            {elem.responseTime}
                                                        </th>
                                                        <th scope="row" className="px-3 py-4 font-medium text-white text-center">
                                                            {elem.waitTime}
                                                        </th>
                                                        <th scope="row" className="px-3 py-4 font-medium text-white text-center">
                                                            S{elem.server}
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
            <div className='flex h-1/2'>
                <div className='flex border border-gray-600 mt-1.5 mb-3 mx-3 rounded-lg flex-row flex-wrap text-white text-lg font-bold w-3/5 p-2 shadow-xl'>
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
                                <CanvasJSChart containerProps={{ width: '100%', height: '100%' }} options={options}
                                /* onRef={ref => this.chart = ref} */
                                />)
                        )}
                </div>
                <div className='text-white border border-gray-600 grow overflow-y-auto m-3 scrollbar-hide rounded-lg shadow-xl'>
                    {
                        loading ? (
                            <div className='flex flex-col justify-center items-center h-full'>
                                <img src={noDataLogo} className="w-1/12" />
                                <h2 className='text-xl py-3.5 pl-4 font-semibold'>No Data To Display!</h2>
                            </div>
                        ) : (
                            performanceObj.length === 0 ? (
                                <div className='flex flex-col justify-center items-center h-full'>
                                    <img src={noDataLogo} className="w-1/12" />
                                    <h2 className='text-xl py-3.5 pl-4 font-semibold'>No Data To Display!</h2>
                                </div>
                            ) : (
                                <div className="relative overflow-x-auto drop-shadow-xl sm:rounded-lg">

                                    {
                                        performanceObj.map((elem, key) => (
                                            <table className="w-full text-sm text-left text-gray-400">
                                                <caption className="p-3 text-lg font-semibold text-left text-white bg-gray-800">
                                                    Performance Measure for Server {elem.server}
                                                </caption>
                                                <thead className="text-xs uppercase bg-gray-700 text-gray-400">
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
                                                    <tr className="border-b bg-gray-800 border-gray-700" key={key}>
                                                        <th scope="row" className="px-3 py-4 font-medium text-white text-center">
                                                            {(Math.round(elem.avgArrivalTime * 100) / 100).toFixed(3)}
                                                        </th>
                                                        <th scope="row" className="px-3 py-4 font-medium text-white text-center">
                                                            {(Math.round(elem.avgServiceTime * 100) / 100).toFixed(3)}
                                                        </th>
                                                        <th scope="row" className="px-3 py-4 font-medium text-white text-center">
                                                            {(Math.round(elem.avgTurnaround * 100) / 100).toFixed(3)}
                                                        </th>
                                                        <th scope="row" className="px-3 py-4 font-medium text-white text-center">
                                                            {(Math.round(elem.avgWaitTime * 100) / 100).toFixed(3)}
                                                        </th>
                                                        <th scope="row" className="px-3 py-4 font-medium text-white text-center">
                                                            {(Math.round(elem.avgWaitTimeWhoWait * 100) / 100).toFixed(3)}
                                                        </th>
                                                        <th scope="row" className="px-3 py-4 font-medium text-white text-center">
                                                            {(Math.round(elem.avgResponseTime * 100) / 100).toFixed(3)}
                                                        </th>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        ))
                                    }
                                </div>

                            )
                        )

                    }
                </div>
            </div>
        </div>
    )
}

export default RandomNum