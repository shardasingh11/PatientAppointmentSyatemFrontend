const loadToken = () =>{
    const accessToken = localStorage.getItem("token");
    if(!accessToken){
        console.error("access token not found");
    }
    return accessToken;
}

export default loadToken;

