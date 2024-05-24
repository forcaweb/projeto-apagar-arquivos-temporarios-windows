import * as React from 'react'
import * as IconsAi from 'react-icons/ai';

export default function Loading() {

  return (
    <div className='loading'>
      <div className='box-l'>
      <IconsAi.AiOutlineLoading3Quarters />
      <h2>Aguarde...</h2>
      </div>
    </div>
  )
}
