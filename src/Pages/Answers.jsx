import React from 'react'
import { useLocation } from 'react-router-dom'

function Answers() {

  const location = useLocation()
  console.log("Location", location);

  return (
    <div className='h-screen bg-gradient-to-bl from-[#21252B] to-[#2A323D] to-[#2D3C55]'>
      <div className='flex flex-col text-white'>
        <h1 className='text-center text-4xl py-8 font-bold'>Performance Measures</h1>
        <div className='self-center my-8 flex w-1/2 justify-evenly '>
          <div className='text-xl font-bold'>
            <ol>
              <li className='pt-6'>1. Mean Number of Customers In The Queue (L<sub>q</sub>)</li>
              <li className='pt-6'>2. Mean Waiting Time In The Queue (W<sub>q</sub>)</li>
              <li className='pt-6'>3. Mean Waiting Time In The System (W)</li>
              <li className='pt-6'>4. Mean Number of Customers In The System (L)</li>
              <li className='py-6'>5. Proportion Of Time The Server Is Idle</li>
            </ol>
          </div>

          <div className='text-xl font-bold'>
            <ol>
              <li className='pt-6 underline underline-offset-8'>: {Math.round((location.state.lq + Number.EPSILON) * 100) / 100}</li>
              <li className='pt-6 underline underline-offset-8'>: {Math.round((location.state.wq + Number.EPSILON) * 100) / 100}</li>
              <li className='pt-6 underline underline-offset-8'>: {Math.round((location.state.W + Number.EPSILON) * 100) / 100}</li>
              <li className='pt-6 underline underline-offset-8'>: {Math.round((location.state.L + Number.EPSILON) * 100) / 100}</li>
              <li className='py-6 underline underline-offset-8'>: {Math.round((location.state.idle + Number.EPSILON) * 100) / 100}</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Answers