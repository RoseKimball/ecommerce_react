import React, { useState } from 'react';
import { auth, googleAuthProvider } from '../../firebase';
import { toast } from 'react-toastify';
import { Button } from 'antd';
import { MailOutlined, GoogleOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

const Login = ({ history }) => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setloading] = useState(false);
    let dispatch = useDispatch();
    

    const loginForm = () => <form onSubmit={handleSubmit}>
        <div className='form-group'>
            <input 
                type="email" 
                className="form-control" 
                value={email} 
                onChange={e => setEmail(e.target.value)}
                placeholder='email'
                autoFocus
            />
        </div>
        <div className='form-group'>
            <input 
                type="password" 
                className="form-control" 
                value={password} 
                onChange={e => setPassword(e.target.value)}
                placeholder='password'
            />
        </div>
        <br/>
        <Button onClick={handleSubmit} 
            type='primary'
            className='mb-3'
            shape='round'
            block
            icon={<MailOutlined />}
            size='large'
            disabled={!email || password.length < 6}
        >Login with email/password
        </Button>

        <Button onClick={googleLogin} 
            type='danger'
            className='mb-3'
            shape='round'
            block
            icon={<GoogleOutlined />}
            size='large'
        >Login with Google
        </Button>
    </form>

    const handleSubmit = async (e) => {
        e.preventDefault();
        setloading(true);
        // console.table(email, password);

        if(!email || !password) {
            toast.error('Email and password is required');
            return;
        }

        try {
            const result = await auth.signInWithEmailAndPassword(email, password);
            const { user } = result;
            const idTokenResult = await user.getIdTokenResult();
            dispatch({
                type: 'LOGGED_IN_USER',
                payload: {
                    email: user.email,
                    token: idTokenResult.token,
                }
            })
            setloading(false);
            history.push('/');
            // console.log(result);
        } catch (error) {
            console.log(error);
            toast.error(error.message);
            setloading(false);
        }
   

    }

    const googleLogin = async () => {
        auth.signInWithPopup(googleAuthProvider)
        .then(async (result) => {
            const { user } = result
            const idTokenResult = await user.getIdTokenResult();
            dispatch({
                type: 'LOGGED_IN_USER',
                payload: {
                    email: user.email,
                    token: idTokenResult.token,
                }
            })
            setloading(false);
            history.push('/');
        })
        .catch((error) => {
            console.log(error)
            toast.error(error.message);
            setloading(false);
        })
    }

    return (
        <div className="container p-5">
           <div className="row"> 
              <div className="col-md-6 offset-md-3">
                {loading ? (<h4 className='text-danger'>Loading...</h4>) : (<h4>Login</h4>)}
                {loginForm()}
                <Link to="/forgot/password" className="float-right text-danger">Forgot password?</Link>
              </div>  
           </div> 
        </div>
    );
};

export default Login;






