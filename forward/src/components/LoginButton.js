import { useAuth0 } from "@auth0/auth0-react";

const LoginButton =()=>{
    const {logout, isAuthenticated} = useAuth0();
    return(
        isAuthenticated && (
            <button onClick={()=> logout()}>
                Sign Out
            </button>
        )
    )

}

export default LoginButton