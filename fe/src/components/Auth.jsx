import { useState } from "react";
import PropTypes from 'prop-types'

function Auth({setToken}){
    const[email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleSignUp = async () => {
        const res = await fetch(`http://localhost:3000/signUp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringift({email, password})
        })
        
        if(res.ok){
            alert('Successful SignUp')
        }else{
            const errorData = await res.json();
            alert(errorData.message)
        }
    
    }

    


}

export default Auth