import React from 'react'
import { useState } from 'react';

const Add = () => {
  const [task,settask] = useState('');
  const [statedescription,setdescription] = useState('');
    const handleAdd = async ()=>{
      const token = localStorage.getItem('token');

      if (!token) {
        alert('No token found. Please log in.');
        return;
    }
      // trying to navigate to server 
      try{
        const response = await fetch('http://localhost:4000/api/add', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Add the token here
        },  // Ensure content type is JSON
          body: JSON.stringify({ tittle: task, description:statedescription })     // Stringify the body
       });

       const result = await response.json();

      //  checking the task is sucessfull or not ?
      if(response.ok){
        alert('Data is Inserted Sucessfully !..');
      }

      else{
        alert('Data Insertion is Failed !..');
      }
      }

      // catching the erorr 
      catch(err){
        alert('Error:while redirecting to server ')
      }
    };

//  function to update tassk when it changes 
const handletask = (e) =>{
  settask(e.target.value);
}

//  function to update tassk when it changes 
const handledescription = (e) =>{
  setdescription(e.target.value);
}

  return (
    <>
    <div className="flex items-center justify-center h-screen">
    <div className="flex flex-col items-center space-y-4 border-gray-700 border-solid border-4 p-28">
        <h2 className='text-2xl font-extrabold'>Add Event :</h2>
  <input type="text" className="border p-2" placeholder="Event Name :"  onChange={(e) => settask(e.target.value)}/>
  <input type="text" className="border p-2" placeholder="Event Description :"  onChange={(e) => setdescription(e.target.value)}/>
  <button onClick={handleAdd} className='rounded-lg shadow-2xl text-white bg-blue-800 p-2 '>Create Event...</button>
</div>
</div>
    </>
  )
}

export default Add