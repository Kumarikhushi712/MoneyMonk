import React, { useState } from 'react';
import styled from 'styled-components';
import { useGlobalContext } from '../../context/globalContext';
import Button from '../Button/Button';
import { Link } from 'react-router-dom';

function Login() {
    const { login } = useGlobalContext();
    const [inputState, setInputState] = useState({
        email: '',
        password: '',
    });

    const { email, password } = inputState;

    const handleInput = name => e => {
        setInputState({ ...inputState, [name]: e.target.value });
    };

    const handleSubmit = e => {
        e.preventDefault();
        login(inputState);
    };

    return (
        <LoginStyled>
            <div className="login-content">
                <h1>Login</h1>
                <form onSubmit={handleSubmit}>
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
                            name={'Login'}
                            bPad={'.8rem 1.6rem'}
                            bRad={'30px'}
                            bg={'var(--color-accent'}
                            color={'#fff'}
                        />
                    </div>
                </form>
                <p>Don't have an account? <Link to="/register">Click here to Register</Link></p>
            </div>
        </LoginStyled>
    );
}

const LoginStyled = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    .login-content {
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

export default Login;