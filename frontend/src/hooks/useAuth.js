// API
import api from '../utils/api.js';

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useFlashMessage from './useFlashMessage';

export default function useAuth() {
    const [authenticated, setAuthenticated] = useState(false);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const { setFlashMessage } = useFlashMessage();

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (token) {
            api.defaults.headers.Authorization = `Bearer ${JSON.parse(token)}`;
            setAuthenticated(true);
        }

        setLoading(false);
    }, []);

    async function register(user) {
        let messageText = 'Cadastro realizado com sucesso!';
        let messageType = 'success';

        try {
            const data = await api.post('/users/register', user).then((response) => {
                return response.data;
            });

            await authUser(data);
        } catch (error) {
            messageText = error.response.data.message;
            messageType = 'error';
        }

        setFlashMessage(messageText, messageType);
    }

    async function login(user) {
        let messageText = 'Login realizado com sucesso!';
        let messageType = 'success';

        try {
            const data = await api.post('/users/login', user).then((response) => {
                return response.data;
            });

            await authUser(data);
        } catch (error) {
            // tratar erro
            messageText = error.response.data.message;
            messageType = 'error';
        }

        setFlashMessage(messageText, messageType);
    }

    async function authUser(data) {
        setAuthenticated(true);
        localStorage.setItem('token', JSON.stringify(data.token));

        navigate('/');
    }

    function logout() {
        const messageText = 'Logout realizado com sucesso!';
        const messageType = 'success';

        setAuthenticated(false);
        localStorage.removeItem('token');
        api.defaults.headers.Authorization = undefined;
        navigate('/login');

        setFlashMessage(messageText, messageType);
    }

    return { authenticated, loading, register, logout, login };
}