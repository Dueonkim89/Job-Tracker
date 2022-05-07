import axios from 'axios';

export function formatPhoneNumber(phoneNumber) {
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

export function checkIfTokenExists() {
    /*  INPUT: none
        OUTPUT: boolean if user information stored in local storage or expired token
     */
    if (!localStorage.getItem("user")) {
        return false;
    } return true;
}

export function companyNameAlreadyRecorded(companyList, newCompanyName) {
    /*  INPUT: list of companies and new company name
        OUTPUT: boolean value of company already recorded in database
    */
    // keyword of is used to get the object at each iteration
    for (const company of companyList) {
        if (company.name.toLowerCase() === newCompanyName.toLowerCase()) {
            return true;
        }
    }
    return false;
}

export function storeUserInfoIntoLocalStorage(data) {
    /*  INPUT: none
        OUTPUT:none
        Store user info into local storage as JSON
     */
    localStorage.setItem("user", JSON.stringify(data));
}

export function getUserToken() {
    /* INPUT: none, OUTPUT: user token held in localstorage*/
    const userData = JSON.parse(localStorage.getItem("user"));
    return userData.token;
}

export function checkIfTokenExpired() {
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

export function getServerURL(nodeEnv) {
    /*  INPUT: node_env of application
        OUTPUT: url of server */
    return nodeEnv === "development" ? "http://localhost:3001" : "???";
}

export function registerNewUser(userField) {
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

export function getListOfAllCompanies(jwt) {
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

export function checkIfCompanyAlreadyExists(company) {
    // INPUT: company name
    // OUTPUT: array of companies match name if true
    //         boolean false, if no match
    const jwt = getUserToken();
    const url = '/api/companies/search?name=' + company;
    return axios.get(url, {
        headers: {
            'Authorization': jwt
          }
    }).then(function (response) {
        console.log(response);
        if (response.data.length) {
            return Promise.resolve(response.data);
        }
        return Promise.reject(false);
      }).catch(function (error) {
        return Promise.reject(false);
      });
}
