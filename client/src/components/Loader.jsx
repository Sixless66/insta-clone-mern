import React from 'react'

const Loader = () => {
  return (
    <div className='h-full flex justify-center items-center bg-slate-700'>
           <div className='w-20 h-20 rounded-full border-2 border-t-transparent border-blue-500 animate-spin ' />
    </div>
  )
}

export default Loader
