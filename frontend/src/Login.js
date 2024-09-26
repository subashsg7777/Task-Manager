
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [user,setUser] = useState('');
    const [pass,setPass] = useState('');
    const navigate = useNavigate();
    const handleLogin = async ()=>{
        const token = localStorage.getItem('token');
        try{
            const response = await fetch('http://localhost:4000/api/login', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Add the token here
                },
                body: JSON.stringify({ user, pass})
            });
    
            if(response.ok){
                console.log('Login Sucessfull');
                const result = await response.json();
                console.log(`the token is : ${token}`);
                localStorage.setItem('token',result.token);
                navigate('/');  
            }
    
            else{
                console.log('Login Failed');
            }
        }

        catch(err){
            console.error(err.message);
        }
    };
    return (
        <div className="flex items-center justify-center h-screen">
            <div className="flex flex-col items-center space-y-4 border-gray-700 border-solid border-4 p-28">
                <h2 className="text-2xl font-extrabold">Log In :</h2>
                <input 
                    type="text" 
                    className="border p-2" 
                    placeholder="Username :" 
                    onChange={(e) => setUser(e.target.value)}
                />
                <input 
                    type="password" 
                    className="border p-2" 
                    placeholder="Password :" 
                    onChange={(e) => setPass(e.target.value)}
                />
                <button 
                    type="button"  // Added type="button" to prevent form submission
                     onClick={()=> handleLogin()} 
                    className="rounded-lg shadow-2xl text-white bg-blue-800 p-2"
                >
                    Log In
                </button>
            </div>
        </div>
    );
}

export default Login