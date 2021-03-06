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

export function getUserID() {
    /*  INPUT: none
        OUTPUT: userID
     */
    const user = localStorage.getItem("user");
    return JSON.parse(user).userID;
}

export function getCompanyID(companyList, companyName) {
    /*  INPUT: list of companies & string value of company name
        OUTPUT: companyID
     */

    for (const company of companyList) {
        if (company.name === companyName) {
            return company.companyID;
        }
    }
}

export function dataAlreadyRecorded(dataList, newName) {
    /*  INPUT: list of companies/skill and new company/skill name
        OUTPUT: boolean value of company/skill already recorded in database
    */

    let lowerCase = newName.toLowerCase();

    // keyword of is used to get the object at each iteration
    for (const data of dataList) {
        if (data.name.toLowerCase() === lowerCase) {
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
    }).then(function (response) {
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

export function createCompany(company) {
    return axios.post("/api/companies", company).then(function (response) {
        return Promise.resolve(response.data);
    }).catch(function (error) {
        return Promise.reject(error.response);
    });;
}

export function stringContainsAlphabet(str) {
    /*  INPUT: string
        OUTPUT: boolean value of whether string is numeric or not
    */
    let charFound = false;
    for (let char of str) {
        if (/^[a-zA-Z]+$/.test(char)) {
            charFound = true;
        }
    }
    return charFound;
}

export function titleCase(str) {
    // INPUT: string
    // OUTPUT: formatted string in title case
    return str.toLowerCase().split(' ').map(function(word) {
        return (word.charAt(0).toUpperCase() + word.slice(1));
    }).join(' ');
}

export function getAllSkills() {
    //  INPUT: none
    // OUTPUT: get request of all skills in promise
    return axios.get('/api/skills').then(function (response) {
        return Promise.resolve(response.data);
    }).catch(function (error) {
        return Promise.reject(error.response);
    });
}

export function getUserSkills() {
    //  INPUT: none
    // OUTPUT: SUCCESS: map of user skills in promise (KEY = skillID, value = name)
    //         FAILURE: error message
    const jwt = getUserToken();
    const apiURL = '/api/skills/user?userID=' + getUserID();
    return axios.get(apiURL, {
        headers: {
            'Authorization': jwt
          }
    }).then(function (response) {
        // payload contains: array of user skill id and skillName
        const mapOfUserSkills = response.data.reduce((accumulator, data) => {
            const {skillID, name} = data;
            return {...accumulator, [skillID]: name};
        }, {});
        return Promise.resolve(mapOfUserSkills);
    }).catch(function (error) {
        // send back error
        return Promise.reject(error.response.data);
    });
}

export function scrapeJobURL(jobURL) {
    // INPUT: url of job application
    // OUTPUT: map with company location, title and success - true if succesful.
    //         map with succes - false if unable to scrape
    const jwt = getUserToken();
    const apiURL = '/api/scrape?url=' + jobURL;

    return axios.get(apiURL, {
        headers: {
            'Authorization': jwt
          }
    }).then(function (response) {
        // payload contains: location, company, success and title
        return Promise.resolve(response.data);
    }).catch(function (error) {
        // send back error
        return Promise.reject(error.response.data);
    });

}

export function postSkill(jobSkill) {
    // POST new job skill into data base
    // Input: string type for jobSkill
    // OUTPUT: Promise of {skillID, name}

    return axios.post("/api/skills", {"name": titleCase(jobSkill)}).then(function (response) {
        // send promise.resolve. Include token, userId and success value
        return Promise.resolve(response.data);
    }).catch(function (error) {
        return Promise.reject(error.response);
    });
}

export function postApplication(appDetails) {
    // POST new app into data base
    // Input: map of {companyID, jobPostingURL, position, userID, status, location, notes}
    // OUTPUT: Success: Promise of {success: true, applicationID, datetime}
    //         Fail: Promise rejection: Error

    const jwt = getUserToken();
    return axios.post("/api/applications", appDetails, {
        headers: {
            'Authorization': jwt
        }
    }).then(function (response) {
        return Promise.resolve(response.data);
    }).catch(function (error) {
        return Promise.reject(error.response);
    });
}

export function postSkillToApplication(skills) {
    //  POST required skills into application
    //  INPUT: map. { applicationID (string), skillIDs: number[] }
    //  OUTPUT: Success: Promise {success: true, applicationID, skillID, name}
    //          Fail:   Promise rejection: Error

    const jwt = getUserToken();
    return axios.post("/api/skills/application", skills, {
        headers: {
            'Authorization': jwt
        }
    }).then(function (response) {
        return Promise.resolve(response.data);
    }).catch(function (error) {
        return Promise.reject(error.response);
    });
}

export function postSkillToUser(skillID, rating) {
    // inputs: skillID (int) and rating(int)
    //  OUTPUT: Success: Promise {success: true}
    //          Fail:   Promise rejection: Error

    const jwt = getUserToken();
    const userID = getUserID();

    return axios.post("/api/skills/user", {skillID, userID, rating}, {
        headers: {
            'Authorization': jwt
        }
    }).then(function (response) {
        return Promise.resolve(response.data);
    }).catch(function (error) {
        return Promise.reject(error.response);
    });
}

export function getUserApplications(companyName) {
    // input: company name (string)
    // output: array of applications that have company name

    const jwt = getUserToken();
    const userID = getUserID();
    companyName = companyName.toLowerCase();

    const apiURL = '/api/applications?userID=' + userID;

    return axios.get(apiURL, {
        headers: {
            'Authorization': jwt
          }
    }).then(function (response) {
        // filter applications by company name
        const results = response.data.filter(app => app.companyName.toLowerCase() === companyName);
        return Promise.resolve(results);
    }).catch(function (error) {
        // send back error
        return Promise.reject(error);
    });
}

export function getCommentsForCompany(companyID) {
    // INPUT: companyID (INT)
    // OUTPUT: Promise of array of companies if succesful
    //         Else, Promise rejection
    const jwt = getUserToken();
    const apiURL = '/api/comments?companyID=' + companyID;

    return axios.get(apiURL, {
        headers: {
            'Authorization': jwt
          }
    }).then(function (response) {
        // send all comments
        return Promise.resolve(response.data);
    }).catch(function (error) {
        // send back error
        return Promise.reject(error);
    });

}

export function getSkillsForApplication(appID) {
    // INPUT: appID (INT)
    // OUTPUT: Promise of array of skills if succesful
    //         Else, Promise rejection
    const jwt = getUserToken();
    const apiURL = '/api/skills/application?applicationID=' + appID;

    return axios.get(apiURL, {
        headers: {
            'Authorization': jwt
          }
    }).then(function (response) {
        // send name of skills in array
        let appSkills = response.data.map(skill => skill.name);
        return Promise.resolve(appSkills);
    }).catch(function (error) {
        // send back error
        return Promise.reject(error);
    });

}

export function arrayOfSkillsToMap(skillList) {
    // input: array of maps with keys skillID and name
    // output: map with name as keys and skillID as value
    return skillList.reduce((accumulator, data) => {
        const {skillID, name} = data;
        return {...accumulator, [name.toLowerCase()]: skillID};
    }, {});
}

export function appSkillToMap(currentAppSkill, mapOfSkillID) {
    // input: array of skills & mapOfSkillID
    // output: map with name as keys and skillID as value

    return currentAppSkill.reduce((accumulator, skill) => {
        skill = skill.trim().toLowerCase();
        return {...accumulator, [skill]: mapOfSkillID[skill]};
    }, {});
}

export function getCompanyNameFromURL(url) {
    // input: url of current page (STRING)
    // output: company name in page (STRING)

    // sanitize url link, replace encoding with white space
    url = url.replace(/%20/g," ");

    for (let i = url.length - 1; i >= 0; i--) {
        if (url[i] === "/") {
            return url.slice(i + 1, url.length);
        }
    }
}

export function formatDate(dt) {
    // input: datetime in string
    // output: formatted date as M/DD/YYYY
    dt = new Date(dt);

    // convert month, day and year to string
    const month = '' + (dt.getMonth() + 1);
    const day = '' + dt.getDate();
    const year = '' + dt.getFullYear();

    return month + "/" + day + "/" + year;
}