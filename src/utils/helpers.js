class InvalidUsernameError extends Error {
    constructor(message) {
        super(message);
        this.name = "InvalidUsernameError";
    }
}

class InvalidEmailError extends Error {
    constructor(message) {
        super(message);
        this.name = "InvalidEmailError";
    }
}

class InvalidPasswordError extends Error {
    constructor(message) {
        super(message);
        this.name = "InvalidPasswordError";
    }
}

function stringCheck(arg) {
    const response = {
        validString: false,
        errors: [],
    };
    try {
        if (arg === undefined) {
            throw new Error(
                `You must provide a string input for your parameter ${arg}`
            );
        }
        if (typeof arg !== "string") {
            throw new Error(`Your parameter ${arg} must be a string`);
        }
        if (arg.trim().length === 0) {
            throw new Error(
                `Your parameter ${arg} must not be an empty string`
            );
        }
        response.validString = true;
        response.string = arg;
    } catch (e) {
        response.errors = e;
    }
    return response;
}

function usernameValidation(username) {
    username = stringCheck(username).string;
    // Username trimmed in stringCheck

    let response = {
        errors: [],
        isValid: false,
    };

    try {
        if (username.length < 2) {
            throw new InvalidUsernameError(
                "username must be at least 2 characters long"
            );
        }
        if (username.length > 25) {
            throw new InvalidUsernameError(
                "username cannot be more than 25 characters long"
            );
        }
        if (/\s/.test(username)) {
            throw new InvalidUsernameError(
                "username cannot contain empty spaces"
            );
        }
        const nameRegex = /^[A-Za-z0-9]{2,}$/;
        if (!nameRegex.test(username)) {
            throw new InvalidUsernameError(
                "username must be at least 2 characters long and contain no special characters"
            );
        }
        response.isValid = true;
    } catch (e) {
        response.errors = e;
    }

    return response;
}

function emailValidation(email) {
    email = stringCheck(email).string;
    // Email trimmed in stringCheck

    let response = {
        errors: [],
        isValid: false,
    };

    try {
        const emailCheck = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/i;
        if (!emailCheck.test(email)) {
            throw new InvalidEmailError("email address is not a valid email");
        }
        response.isValid = true;
    } catch (e) {
        response.errors = e;
    }

    return response;
}

function passwordValidation(password) {
    // No trim
    let response = {
        errors: [],
        isValid: false,
    };

    try {
        if (/\s/.test(password)) {
            throw new InvalidPasswordError(
                "password cannot contain empty spaces"
            );
        }

        const passRegex =
            /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^\&*\)\(+=._-])[a-zA-Z0-9!@#\$%\^\&*\)\(+=._-]{8,}$/;
        if (!passRegex.test(password)) {
            throw new InvalidPasswordError(
                "password must be at least 8 characters long and contain 1 special character, number, and uppercase letter"
            );
        }
        response.isValid = true;
    } catch (e) {
        response.errors = e;
    }

    return response;
}

function passwordMatch(passwordOne, passwordTwo) {
    let response = {
        errors: [],
        isValid: false,
    };

    try {
        if (passwordOne !== passwordTwo) {
            throw new InvalidPasswordError("passwords do not match");
        }
        response.isValid = true;
    } catch (e) {
        response.errors = e;
    }

    return response;
}

export {
    stringCheck,
    emailValidation,
    passwordValidation,
    usernameValidation,
    passwordMatch,
};
