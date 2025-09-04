import React from 'react'

const EmptyState = ({label}) => {
  return (
    <div className='w-full h-screen flex items-center justify-center bg-slate-100'>
          <p className='text-gray-700'>you don't have any {label} for yet</p>
    </div>
  )
}

export default EmptyState
