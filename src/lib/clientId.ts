export function getClientId() {
    const currentUser =  localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : {_id:"",} ;
    console.log(currentUser, '--- getclientId----')
    return currentUser;
}