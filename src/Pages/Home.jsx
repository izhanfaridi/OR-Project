import React, { useState, useEffect } from 'react'
import { mm1_calculation } from '../Functions_formulas/MM1'
import { mg1_calculation } from '../Functions_formulas/MG1'
import { gg1_calculation } from '../Functions_formulas/GG1'
import { mmc_calculation } from '../Functions_formulas/MMC'
import { ggc_calculation } from '../Functions_formulas/GGC'
import { useNavigate } from 'react-router-dom'
import { Oval } from 'react-loader-spinner'
import {BsFillFileBarGraphFill} from 'react-icons/bs'
import {SiMicrosoftexcel} from 'react-icons/si'

function Home() {
    const navigate = useNavigate();
    const [interArrivalType, setInterArrivalType] = useState("M");
    const [serviceType, setServiceType] = useState("M");
    const [serverQty, setServerQty] = useState(1);
    const [lambda, setLambda] = useState();
    const [meu, setMeu] = useState();
    const [variance_A, setVariance_A] = useState();
    const [variance_S, setVariance_S] = useState();
    // const [coefficient_S, setCoefficient_S] = useState();
    // const [coefficient_A, setCoefficient_A] = useState();
    const [rho, setRho] = useState();
    const [queueLength, setQueueLength] = useState();
    const [systemLength, setSystemLength] = useState();
    const [waitInQueue, setWaitinQueue] = useState();
    const [waitInSystem, setWaitinSystem] = useState();
    const [idleTime, setIdleTime] = useState();
    const [Loading, setLoading] = useState(null)



    useEffect(() => {
      if (Loading === false) {
        navigate('/answers', {
            state: {
                lq: queueLength,
                wq: waitInQueue,
                L: systemLength,
                W: waitInSystem,
                idle: idleTime
            }
        })
      }

    }, [Loading])
    


    const calculate = () => {
        setLoading(true)
        const p = rhoCalculation()
        setRho(p);

        if (serverQty > 1) {
            if (interArrivalType === "M" && serviceType === "M") {
                const mmc_answer = mmc_calculation(p, lambda, meu, serverQty);
                setQueueLength(mmc_answer.lq)
                setWaitinQueue(mmc_answer.wq)
                setWaitinSystem(mmc_answer.w)
                setSystemLength(mmc_answer.l)
                setIdleTime(mmc_answer.idle)
                console.log("done");
            } else {
                const ggc_answer = ggc_calculation(p, lambda, meu, serverQty, interArrivalType, variance_S, variance_A);
                setQueueLength(ggc_answer.lq)
                setWaitinQueue(ggc_answer.wq)
                setWaitinSystem(ggc_answer.w)
                setSystemLength(ggc_answer.l)
                setIdleTime(ggc_answer.idle)
                console.log("done");
            }
        } else {
            if (interArrivalType === "M" && serviceType === "M") {
                const mm1_answer = mm1_calculation(p, lambda, meu);
                setQueueLength(mm1_answer.lq)
                setWaitinQueue(mm1_answer.wq)
                setWaitinSystem(mm1_answer.w)
                setSystemLength(mm1_answer.l)
                setIdleTime(mm1_answer.idle)
                console.log("done");
            } else if (interArrivalType === "M" && serviceType === "G") {
                const mg1_answer = mg1_calculation(p, lambda, meu, variance_S);
                setQueueLength(mg1_answer.lq)
                setWaitinQueue(mg1_answer.wq)
                setWaitinSystem(mg1_answer.w)
                setSystemLength(mg1_answer.l)
                setIdleTime(mg1_answer.idle)
                console.log("done");
            } else if (interArrivalType === "G" && serviceType === "G") {
                const gg1_answer = gg1_calculation(p, lambda, meu, variance_S, variance_A);
                setQueueLength(gg1_answer.lq)
                setWaitinQueue(gg1_answer.wq)
                setWaitinSystem(gg1_answer.w)
                setSystemLength(gg1_answer.l)
                setIdleTime(gg1_answer.idle)
                console.log("done");
            } else {
                //do nothing
            }
        }

        setLoading(false)

    }

    const rhoCalculation = () => {
        let p = lambda / (serverQty * meu)
        return p;
    }




    return (
        // bg-[#1A1D21]
        <div className='h-screen bg-gradient-to-bl from-[#21252B] to-[#2A323D] to-[#2D3C55]'>
            <BsFillFileBarGraphFill onClick={()=>{navigate('/randomNum')}} className='absolute right-28 text-5xl text-white top-8 hover:text-gray-400'/>
            <SiMicrosoftexcel onClick={()=>{navigate('/graphs')}} className='absolute right-10 text-5xl text-white top-8 hover:text-gray-400'/>
            <div className='bg-gradient-to-bl from-[#21252B] to-[#2A323D] to-[#2D3C55] flex flex-row flex-wrap justify-evenly content-start items-baseline h-full py-5'>
                <h1 className='text-center text-white text-2xl py-6 font-bold'>Operation Research Simulator</h1>
                <div className='border-t w-full flex flex-row justify-center items-center py-6'>
                    <h3 className='text-lg text-white font-bold'>Number of Servers: </h3>
                    <input className='mx-4 rounded-md border border-black p-2 text-md focus:outline-none' onKeyDown={(e) => e.preventDefault()} onChange={(e) => setServerQty(parseInt(e.target.value))} type="number" defaultValue={1} max={6} min={1} />
                </div>
                <div className='border rounded-md text-white w-1/4 p-5'>
                    <h3 className='text-lg font-bold pb-5'>Arrival Time Distribution</h3>
                    <select className='text-[#1A1D21] rounded-md w-2/5 h-10 focus:outline-none' onChange={e => setInterArrivalType(e.target.value)}>
                        <option value="M">Exponential</option>
                        <option value="G">Uniform</option>
                        <option value="G">Gamma</option>
                        <option value="G">Normal</option>
                    </select>

                    <h3 className='text-lg font-bold py-5'>Mean of Inter Arrival Time (λ)</h3>
                    <input type="number" placeholder='Enter λ Value In Minutes' className='text-[#1A1D21] rounded-md w-3/5 h-10 focus:outline-none pl-2' onChange={(e) => setLambda(1 / (parseFloat(e.target.value)))} />

                    <h3 className='text-lg font-bold py-5'>Variance of Inter Arrival ( σ<sup>2</sup><sub>a</sub> )</h3>
                    <input type="number" disabled={interArrivalType === 'M' ? true : false} placeholder='Enter σ Value In min^2' className='text-[#1A1D21] rounded-md w-3/5 h-10 focus:outline-none pl-2' onChange={(e) => setVariance_A(parseFloat(e.target.value))} />
                </div>
                <div className='border rounded-md text-white w-1/4 p-5'>
                    <h3 className='text-lg font-bold pb-5'>Service Time Distribution</h3>
                    <select onChange={e => setServiceType(e.target.value)} className='text-[#1A1D21] rounded-md w-2/5 h-10 focus:outline-none'>
                        <option hidden={interArrivalType === "G" ? true : false} value="M">Exponential</option>
                        <option value="G">Uniform</option>
                        <option value="G">Gamma</option>
                        <option value="G">Normal</option>
                    </select>

                    <h3 className='text-lg font-bold py-5'>Mean of Service Time (μ)</h3>
                    <input type="number" placeholder='Enter μ Value In Minutes' className='text-[#1A1D21] rounded-md w-3/5 h-10 focus:outline-none pl-2' onChange={(e) => setMeu(1 / (parseFloat(e.target.value)))} />

                    <h3 className='text-lg font-bold py-5'>Variance of Service Time ( σ<sup>2</sup><sub>s</sub> )</h3>
                    <input type="number" disabled={serviceType === 'M' ? true : false} placeholder='Enter σ Value In min^2' className='text-[#1A1D21] rounded-md w-3/5 h-10 focus:outline-none pl-2' onChange={(e) => setVariance_S(parseFloat(e.target.value))} />
                </div>
                <div className='w-full flex justify-center pt-8'>
                    {
                        Loading ? (

                            <div className='rounded-md bg-[#2E71FF] flex justify-center items-center font-bold w-1/4 h-12 mt-10'>
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
                            <button onClick={calculate} className='rounded-md bg-[#2E71FF] text-white font-bold w-1/4 h-12 text-center text-lg'>
                                CALCULATE
                            </button>

                        )
                    }
                    {/* <button onClick={() => console.log({
                        Lq: queueLength,
                        Wq: waitInQueue,
                        W: waitInSystem,
                        L: systemLength,
                        proportion_idle: idleTime,
                    })} className='rounded-md bg-[#2E71FF] text-white font-bold w-1/4 h-12 mt-10 text-center text-lg'>
                        log
                    </button> */}
                </div>
            </div>
        </div>
    )
}

export default Home