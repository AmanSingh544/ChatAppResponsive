import { authApi } from "@/api/authApi";
import AuthForm from "@/components/ui/authforn";
import { useAuth } from "@/hooks/useAuth-context";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface LoginPayload {
    username: String,
    password: String
}

const Login = () => {
    const [isLogin, setIsLogin] = useState(true);

    const {setLogin: saveUser} = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (payload: LoginPayload) => {
        try {
            const res = isLogin ? await authApi.login(payload) : await authApi.register(payload);
            if (res.success) {
                console.log("Authentication successful:", res);
                // addNotification({
                //     message: res?.data?.message,
                //     type: 'success',
                // });
                saveUser(res); // Save user data in AuthContext
                navigate('/dashboard'); // Redirect to chat page on successful authentication
            } else {
                console.error("Authentication failed:", res.message);
                // addNotification({
                //     message: "Authentication failed: " + res.message,
                //     type: 'error',
                // });
                // Handle authentication failure (e.g., show error message)
            }
        }
        catch (error) {
            console.error("Authentication error:", error);
            // addNotification({
            //     message: error.response?.data?.message || error.message || "Unexpected error",
            //     type: 'error',
            // });
        };
    }

    return (
        <AuthForm onSubmit={handleLogin} isLogin={isLogin} setIsLogin={setIsLogin} />
    )

}

export default Login;