import axios from 'axios';

function formatPhoneNumber(phoneNumber: number) : string {
    /*  Input: user phone number in number format
        Output: user phone number in string format: xxx-xxx-xxxx
    */
    const phoneNumberToString: string = phoneNumber.toString();
    let formattedString: string[] = [];
    for (let i = 0; i < phoneNumberToString.length; i++) {
        if (i === 3 || i === 6) {
            formattedString.push('-');
        }
        formattedString.push(phoneNumberToString[i]) 
    }
    return formattedString.join('');
}

function getServerURL(nodeEnv?: string) : string {
    /*  INPUT: node_env of application
        OUTPUT: url of server */
    return nodeEnv === "development" ? "http://localhost:3001" : "???";
}

interface newUserInfo {
    firstName: string;
    lastName: string;
    username: string;
    phoneNumber: string;
    emailAddress: string;
    password: string;
}

interface registerStatus {
    // to add JWT
    sucesss?: boolean
    reason?: string
}

// Promise<registerStatus>

function registerNewUser(userField: newUserInfo) : void {
    const endPoint: string = "/api/users";
    axios.post(endPoint, userField).then(function (response) {
        console.log(response);
    }).catch(function (error) {
        console.log(error.response);
    });

}

export {formatPhoneNumber, getServerURL, newUserInfo, registerNewUser}