function stringCheck(arg) {
    if (arg === undefined) {
        return {
            errors: [
                `You must provide a string input for your parameter ${arg}`,
            ],
            isValid: false,
        };
    } else if (typeof arg !== "string") {
        return {
            errors: [`Your parameter ${arg} must be a string`],
            isValid: false,
        };
    } else if (arg.trim().length === 0) {
        return {
            errors: [`Your parameter ${arg} must not be an empty string`],
            isValid: false,
        };
    }
    return arg.trim();
}

function usernameInputCheck(username, emailAddress, password) {
    if (!username || !emailAddress || !password) {
        return {
            errors: ["All fields must be filled in"],
            isValid: false,
        };
    }
    if (
        typeof username !== "string" ||
        typeof emailAddress !== "string" ||
        typeof password !== "string"
    ) {
        return {
            errors: ["All fields must be strings"],
            isValid: false,
        };
    }

    username = usernameValidation(username);
    password = passwordValidation(password);
    emailAddress = emailValidation(emailAddress);

    if (!username.isValid || !password.isValid || !emailAddress.isValid) {
        return {
            errors: [
                ...username.errors,
                ...password.errors,
                ...emailAddress.errors,
            ],
            isValid: false,
        };
    } else {
        return {
            errors: [],
            isValid: true,
        };
    }
}

function passwordInputCheck(emailAddress, password) {
    if (!emailAddress || !password) {
        return {
            errors: ["All fields must be filled in"],
            isValid: false,
        };
    }
    if (typeof emailAddress !== "string" || typeof password !== "string") {
        return {
            errors: ["All fields must be strings"],
            isValid: false,
        };
    }

    password = passwordValidation(password);
    emailAddress = emailValidation(emailAddress);

    if (!password.isValid || !emailAddress.isValid) {
        return {
            errors: [...password.errors, ...emailAddress.errors],
            isValid: false,
        };
    } else {
        return {
            errors: [],
            isValid: true,
        };
    }
}


function usernameValidation(username) {
    username = stringCheck(username);
    // Username trimmed in stringCheck

    let errors = [];
    if (username.length < 2) {
        errors.push("username must be at least 2 characters long");
    }
    if (username.length > 25) {
        errors.push("username cannot be more than 25 characters long");
    }
    if (/\s/.test(username)) {
        errors.push("username cannot contain empty spaces");
    }
    const nameRegex = /^[A-Za-z0-9]{2,}$/;
    if (!nameRegex.test(username)) {
        errors.push(
            "username must be at least 2 characters long and contain no special characters"
        );
    }

    return {
        errors: errors,
        isValid: errors.length === 0,
    };
}

function emailValidation(email) {
    email = stringCheck(email);
    // Email trimmed in stringCheck

    const emailCheck = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/i;
    if (!emailCheck.test(email)) {
        return {
            errors: ["emailAddress is not a valid email"],
            isValid: false,
        };
    }
    return {
        errors: [],
        isValid: true,
    };
}

function passwordValidation(password) {
    // No trim
    if (/\s/.test(password)) {
        return {
            errors: ["password cannot contain empty spaces"],
            isValid: false,
        };
    }

    const passRegex =
        /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^\&*\)\(+=._-])[a-zA-Z0-9!@#\$%\^\&*\)\(+=._-]{8,}$/;
    if (!passRegex.test(password)) {
        return {
            errors: [
                "password must be at least 8 characters long and contain 1 special character, number, and uppercase letter",
            ],
            isValid: false,
        };
    }
    return {
        errors: [],
        isValid: true,
    };
}

export {
    usernameInputCheck,
    passwordInputCheck,
};
