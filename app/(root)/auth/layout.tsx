import React from 'react'

const layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  
      return (
        <div className='h-screen w-screen flex justify-center item-center'>{children}</div>
      )
}

export default layout
