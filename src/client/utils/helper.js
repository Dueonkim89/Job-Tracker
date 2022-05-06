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
    /*  INPUT: none
        OUTPUT: boolean if user information stored in local storage or expired token
     */
    if (!localStorage.getItem("user")) {
        return false;
    } return true;

}

function storeUserInfoIntoLocalStorage(data) {
    /*  INPUT: none
        OUTPUT:none
        Store user info into local storage as JSON
     */
    localStorage.setItem("user", JSON.stringify(data));
}

function getUserToken() {
    /* INPUT: none, OUTPUT: user token held in localstorage*/
    const userData = JSON.parse(localStorage.getItem("user"));
    return userData.token;
}

function checkIfTokenExpired() {
    // input: none
    // output: async function that returns promise
    const token = getUserToken();
    
    return axios.get('/api/users/protected', {
        headers: {
            'Authorization': token
          }
    }) .then(function (response) {
        return Promise.resolve(response.data.success);
      }).catch(function (error) {
        return Promise.reject(false);
      });
}

function getServerURL(nodeEnv) {
    /*  INPUT: node_env of application
        OUTPUT: url of server */
    return nodeEnv === "development" ? "http://localhost:3001" : "???";
}

function registerNewUser(userField) {
    // Register new user
    // Input: map of user data
    // OUTPUT: Promise of success status and userID and token if successful
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

function getListOfAllCompanies(jwt) {
    // INPUT: user jwt
    // OUTPUT: array of all companies if succesful, else empty array
    return axios.get('/api/companies/search?name=', {
        headers: {
            'Authorization': jwt
          }
    }) .then(function (response) {
        return response.data;
      }).catch(function (error) {
        return [];
      });
}

export {formatPhoneNumber, getServerURL, registerNewUser, checkIfTokenExists, storeUserInfoIntoLocalStorage, getUserToken, getListOfAllCompanies, checkIfTokenExpired}