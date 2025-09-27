import React, { useState } from 'react';
import styled from 'styled-components';
import { useGlobalContext } from '../../context/globalContext';
import Button from '../Button/Button';
import { Link } from 'react-router-dom';

function Register() {
    const { register } = useGlobalContext();
    const [inputState, setInputState] = useState({
        name: '',
        email: '',
        password: '',
    });

    const { name, email, password } = inputState;

    const handleInput = name => e => {
        setInputState({ ...inputState, [name]: e.target.value });
    };

    const handleSubmit = e => {
        e.preventDefault(); // This line prevents the default GET request
        register(inputState);
    };

    return (
        <RegisterStyled>
            <div className="register-content">
                <h1>Register</h1>
                <form onSubmit={handleSubmit}>
                     <div className="input-control">
                        <input
                            type="text"
                            value={name}
                            name={'name'}
                            placeholder="Name"
                            onChange={handleInput('name')}
                        />
                    </div>
                    <div className="input-control">
                        <input
                            type="email"
                            value={email}
                            name={'email'}
                            placeholder="Email"
                            onChange={handleInput('email')}
                        />
                    </div>
                    <div className="input-control">
                        <input
                            type="password"
                            value={password}
                            name={'password'}
                            placeholder="Password"
                            onChange={handleInput('password')}
                        />
                    </div>
                    <div className="submit-btn">
                        <Button
                            name={'Register'}
                            bPad={'.8rem 1.6rem'}
                            bRad={'30px'}
                            bg={'var(--color-accent'}
                            color={'#fff'}
                        />
                    </div>
                </form>
                <p>Already have an account? <Link to="/login">Click here to Login</Link></p>
            </div>
        </RegisterStyled>
    );
}

const RegisterStyled = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    .register-content {
        padding: 2rem;
        background: rgba(252, 246, 249, 0.78);
        border: 3px solid #FFFFFF;
        backdrop-filter: blur(4.5px);
        border-radius: 32px;
        display: flex;
        flex-direction: column;
        gap: 2rem;
        width: 400px;
        
        h1 {
            text-align: center;
        }

        form {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
        }
         p {
            text-align: center;
        }
    }
`;

export default Register;