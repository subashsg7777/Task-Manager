import React from 'react'
import { useNavigate } from 'react-router-dom';
import Looper from './Looper';
import { MdLibraryAdd } from "react-icons/md";

const Notepad = () => {
    const navigate = useNavigate();
    const handleAdd = () =>{
        navigate('/add');
    };
  return (
    <div className=' border-gray-600 border-solid border-2 my-3 rounded mx-1'>
        {/* round shaped icon button */}
        <Looper />
        <button type="submit" 
        className='bg-blue-800 text-white rounded p-4' style={{borderRadius:'9999px', marginLeft:'90%', marginRight:'10%'}} onClick={handleAdd}>
            <MdLibraryAdd size={46} />
            </button>
    </div>
  )
}

export default Notepad