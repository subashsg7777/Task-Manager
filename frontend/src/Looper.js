import React from 'react'
import { useState, useEffect } from 'react';

const Looper = () => {
    // initializing all hooks
    const [tasks,settasks] = useState([]);
    const [loading,setloading] = useState(true);
    const [error, setError] = useState(null);
    // let index = 1;

    // using the useEffect hook as like a constructor 
    useEffect( ()=>{
        const fetchdata = async ()=>{
          const token = localStorage.getItem('token');
            try{
                const response = await fetch('http://localhost:4000/api/getdata',{
                  headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Add the token here
                }
                });
            if(response.ok){
                console.log('server is connected');
            }
    
            else{
                setError('error while connecting to server');
            }
    
            const data = await response.json();
    
            settasks(data);
            }
    
            catch(err){
                console.error('error while trying to connect with server ');
            }
    
            finally{
                setloading(false);
            }
        };

        // calling the function
        fetchdata();
    },[]);

    // checking the data is loaded or not \
    if (loading) {
        return <div>Loading...</div>;
      }
    
      if (error) {
        return <div>Error: {error}</div>;
      }

      const handleChange = async (id, newStatus) => {
        const token = localStorage.getItem('token');
        try {
          const response = await fetch('http://localhost:4000/api/update-status', {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json'
          },
            body: JSON.stringify({ id, status: newStatus })
          });
    
          if (!response.ok) {
            throw new Error('Failed to update status');
          }
    
          const result = await response.json();
          console.log(result.success);
    
          // Optionally, you can update the local state if needed
          settasks(tasks.map(task => task.id === id ? { ...task, status: newStatus } : task));
        } catch (err) {
          console.error('Error updating task status', err);
        }
      };

  return (
    <div className='p-4 w-full'>
    <h1 className='font-extrabold' style={{fontSize:'1.87rem'}} >Tasks :</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" >
                {tasks.map((task,index) => (
                    <div className="border p-4 rounded-lg shadow-lg" style={{marginBottom:'20px', position:'relative'}}>
                        <h2 className=" font-extrabold" style={{fontSize:'1.5rem'}}>{index+1}. {task.title}</h2>
                        <h4 className="text-lg" style={{color:'lightslategray'}}>{task.description}</h4>
                        <p className="text-sm text-gray-500">Status: <p style={{color
                            :'red', display:'inline'
                        }}>{task.status}</p></p>
                        <input
            type="checkbox"
            className="absolute transform -translate-y-1/2"
            style={{top:'0.5rem', right:'0.5rem', position:'absolute',transform:'translateY(-50%);'}}
            onChange={(e) => handleChange(task.id, e.target.checked ? 'completed' : 'pending')}
          />
                    </div>
                
                ))}
            </div>
    </div>
  )
}

export default Looper