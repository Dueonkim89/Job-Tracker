import axios from 'axios';

function formatPhoneNumber(phoneNumber) {
    /*  Input: user phone number in number format
        Output: user phone number in string format: xxx-xxx-xxxx
    */
    const phoneNumberToString = phoneNumber.toString();
    let formattedString = [];
    for (let i = 0; i < phoneNumberToString.length; i++) {
        if (i === 3 || i === 6) {
            formattedString.push('-');
        }
        formattedString.push(phoneNumberToString[i]) 
    }
    return formattedString.join('');
}

function checkIfTokenExists() {
    if (localStorage.getItem("user")) {
        return true;
    }
    return false;
}

function storeUserInfoIntoLocalStorage(data) {
    localStorage.setItem("user", JSON.stringify(data));
}

function getServerURL(nodeEnv) {
    /*  INPUT: node_env of application
        OUTPUT: url of server */
    return nodeEnv === "development" ? "http://localhost:3001" : "???";
}

function registerNewUser(userField) {
    return axios.post("/api/users", userField).then(function (response) {
        // send promise.resolve. Include token, userId and success value
        return Promise.resolve({"success": response.data.success, "token": response.data.token, "userID": response.data.userID});
    }).catch(function (error) {
        if (error.response && error.response.data.reason === "duplicate") {
            return Promise.reject({"success": false, "duplicate": true});
        }
        return Promise.reject({"success": false});
    });

}

export {formatPhoneNumber, getServerURL, registerNewUser, checkIfTokenExists, storeUserInfoIntoLocalStorage}