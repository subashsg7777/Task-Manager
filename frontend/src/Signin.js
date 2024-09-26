import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Signin = () => {
    console.log("Component Loaded");  
    const [username, setUser] = useState('');
    const [password, setPass] = useState('');
    const navigate = useNavigate();

    const handleAdd = async () => {
        const token = localStorage.getItem('token');
        // Ensuring the username and password fields are filled
        if (!username || !password) {
            alert("Please fill in both username and password");
            return;
        }

        console.log('button is working');
        try{
            const response = await fetch('http://localhost:4000/api/signin', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Add the token here
                },
                body: JSON.stringify({ username, password })
            });
    
            const result = await response.json();
    
            if (!response.ok) {
                console.log("Server is connected! Login successful");
                alert('signin Successful');
                localStorage.setItem('token', result.token);
                navigate('/');
            } 
        }

        catch(err){
            console.error(err);
        }
    };

    return (
        <div className="flex items-center justify-center h-screen">
            <div className="flex flex-col items-center space-y-4 border-gray-700 border-solid border-4 p-28">
                <h2 className="text-2xl font-extrabold">Sign In :</h2>
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
                    onClick={()=> handleAdd()} 
                    className="rounded-lg shadow-2xl text-white bg-blue-800 p-2"
                >
                    Sign In
                </button>
            </div>
        </div>
    );
};

export default Signin;
