// import { useState } from "react"

// export default function RegisterPage() {
//     const [username,setUsername]=useState('');
//     const [password,setPassword]=useState('');
//     async function register(ev) {
//         ev.preventDefault();
//         const response = await fetch('http://localhost:4000/register',{
//             method: 'POST',
//             body: JSON.stringify({username,password}),
//             headers: {'Content-Type': 'application/json'}
//         })
//         if(response.status !== 200){
//             alert('register failed');
//         } else{
//             alert('registration successful')
//         }
//     }
//     return(
//         <form className="register" onSubmit={register}>
//             <h1>Register</h1>
//             <input type="text"
//              placeholder="username"
//               value={username}
//                onChange={ev => setUsername(ev.target.value)}/>
//             <input type="password"
//              placeholder="password" 
//              value={password}
//               onChange={ev => setPassword(ev.target.value)}/>
//             <button>Register</button>
//         </form>
//     )
// }

import { useState } from "react";

export default function RegisterPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [email, setEmail] = useState('');
    const [fullName, setFullName] = useState('');

    async function register(ev) {
        ev.preventDefault();
        
        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }
        
        const response = await fetch('http://localhost:4000/auth/register', {
            method: 'POST',
            body: JSON.stringify({ username, password, email, fullName }),
            headers: { 'Content-Type': 'application/json' }
        });

        if (response.status !== 200) {
            alert('Registration failed');
        } else {
            alert('Registration successful');
        }
    }

    return (
        <form className="register" onSubmit={register}>
            <h1>Register</h1>
            <input type="text" placeholder="Username" value={username} onChange={ev => setUsername(ev.target.value)} />
            <input type="password" placeholder="Password" value={password} onChange={ev => setPassword(ev.target.value)} />
            <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={ev => setConfirmPassword(ev.target.value)} />
            <input type="email" placeholder="Email" value={email} onChange={ev => setEmail(ev.target.value)} />
            <input type="text" placeholder="Full Name" value={fullName} onChange={ev => setFullName(ev.target.value)} />
            <button>Register</button>
        </form>
    );
}
