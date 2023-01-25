import React, { useState } from 'react'
import {Link} from "react-router-dom"
function Login() {
    return (
        <div className="h-screen flex flex-col items-center justify-center bg-[#1A1D21]">
          <div className='flex flex-col items-center justify-center w-1/4 h-auto'>
          <h2 className='text-white font-bold text-3xl pb-12'>Log in 👋</h2>
            <div className="border rounded-md flex flex-col justify-self-center border border-[#52565C] w-full">
              <input type={"email"} placeholder="Email" className='border-b border-[#52565C] rounded-t-md bg-[#1F2227] h-16 focus:outline-none px-2'></input>
              <input type={"password"} placeholder="Password" className='rounded-b-md bg-[#1F2227] h-16 focus:outline-none px-2'></input>
            </div>
            <Link className='rounded-md bg-[#2E71FF] text-white font-bold w-1/3 h-12 mt-10 text-center pt-3' to={"/home"}>
                Log in
            </Link>
          </div>
        </div>
      );
}

export default Login