//You can add and export any helper functions you want here. If you aren't using any, then you can just leave this file as is.
import { ObjectId } from "mongodb";
import { users } from "./config/mongoCollections.js";

/**
 * Errors
 * TypeError (wrong type) -> 400
 * RangeError (bad value provided by user even though type is correct) -> 400
 * DBError (Database errors) -> 500
 * ResourcesError (resources not found) -> 404
 */

export class AuthError extends Error {
    constructor(msg) {
        super(msg);
    }
}
export class DBError extends Error {
    constructor(msg) {
        super(msg);
    }
}
export class ResourcesError extends Error {
    constructor(msg) {
        super(msg);
    }
}

export class RangeError extends Error {
    constructor(msg) {
        super(msg);
    }
}

export class TypeError extends Error {
    constructor(msg) {
        super(msg);
    }
}

export function errorToStatus(error) {
    switch (error.constructor.name) {
        case "TypeError":
        case "RangeError":
            return 400;
        case "AuthError":
            return 401;
        case "ResourcesError":
            return 404;
        case "DBError":
        default:
            return 500;
    }
}

export async function setDbInfo(emailAddress, user) {
    const usersCollection = await users();
    const updatedUser = await usersCollection.updateOne(
        { emailAddress: emailAddress },
        { $set: user },
        { returnDocument: "after" }
    );
    if (updatedUser.modifiedCount === 0) {
        throw new DBError("Could update DB");
    }
    return;
}

export async function getDbInfo(emailAddress) {
    emailAddress = exportedMethods.emailValidation(emailAddress);
    const usersCollection = await users();
    const user = await usersCollection.findOne({ emailAddress: emailAddress });
    return user;
}
export async function handleErrorChecking(emailAddress) {
    if (!emailAddress) {
        throw new TypeError("You must provide your email");
    }
    emailAddress = exportedMethods.emailValidation(emailAddress);
    let usersCollection = undefined;
    let user = undefined;
    try {
        usersCollection = await users();
        user = await usersCollection.findOne({ emailAddress: emailAddress });
    } catch {
        throw new DBError("Unable to query DB.");
    }
    if (user === null) {
        throw new ResourcesError("No user with provided email found.");
    }

    if (!user.steamAccountUsername || !user.steamProfileLink) {
        throw new RangeError(
            "You must link a Steam Account to get your account's games"
        );
    }
    return { user: user, usersCollection: usersCollection };
}
export const retrieveGamesOwnedFromDb = async (emailAddress) => {
    const dbInfo = await handleErrorChecking(emailAddress);
    const user = dbInfo.user;
    if (user.gamesOwned.length > 0) {
        return user.gamesOwned;
    } else {
        return []
    }
};
export async function updateFriendsList(senderData, recipientData) {
    const usersCollection = await users();
    let recipientFriends = recipientData.friendList;
    if (!recipientFriends) {
        recipientFriends = [];
    }

    let senderFriends = senderData.friendList;
    if (!senderFriends) {
        senderFriends = [];
    }

    recipientFriends.push({
        _id: new ObjectId(),
        username: senderData.username,
    });
    senderFriends.push({
        _id: new ObjectId(),
        username: recipientData.username,
    });

    const updatePendingFriend = {
        friendList: recipientFriends,
        friendCount: recipientFriends.length,
    };

    const updateSentFriend = {
        friendList: senderFriends,
        friendCount: senderFriends.length,
    };

    const updateSenderFriendsList = await usersCollection.updateOne(
        { username: senderData.username },
        { $set: updateSentFriend },
        { returnDocument: "after" }
    );

    const updateRecipientFriendsList = await usersCollection.updateOne(
        { username: recipientData.username },
        { $set: updatePendingFriend },
        { returnDocument: "after" }
    );

    if (updateSenderFriendsList.modifiedCount === 0)
        throw new DBError("Could not update friendList successfully");
    if (updateRecipientFriendsList.modifiedCount === 0)
        throw new DBError("Could not update friendList successfully");

    return true;
}
export async function updateSentPendingRequests(
    yourUsername,
    sentRequests,
    targetUsername,
    pendingRequests
) {
    const usersCollection = await users();

    const insertPending = {
        pendingRequests: pendingRequests,
        pendingCount: pendingRequests.length
    };

    const insertSent = {
        sentRequests: sentRequests,
        sentCount: sentRequests.length
    };

    const updatePending = await usersCollection.updateOne(
        { username: targetUsername },
        { $set: insertPending },
        { returnDocument: "after" }
    );

    const updatedSent = await usersCollection.updateOne(
        { username: yourUsername },
        { $set: insertSent },
        { returnDocument: "after" }
    );

    if (updatePending.modifiedCount === 0)
        throw new DBError("Could not update pendingRequests successfully");
    if (updatedSent.modifiedCount === 0)
        throw new DBError("Could not update sentRequests successfully");

    return true;
}

export async function getUserInfo(senderName, recipientName) {
    senderName = exportedMethods.stringCheck(senderName);
    recipientName = exportedMethods.stringCheck(recipientName);

    senderName = senderName.toLowerCase();
    recipientName = recipientName.toLowerCase();

    const usersCollection = await users();
    const sender = await usersCollection.findOne({
        username: senderName,
    });
    const recipient = await usersCollection.findOne({
        username: recipientName,
    });

    if (!sender) {
        throw new RangeError("Could not find your username");
    }
    if (!recipient) {
        throw new RangeError(
            "The person you are trying to add does not exist. Double check their username for spelling errors."
        );
    }

    return { sender, recipient };
}

export async function getUserByUsername(username) {
    username = exportedMethods.stringCheck(username);

    username = username.toLowerCase();

    const usersCollection = await users();
    const user = await usersCollection.findOne({
        username: username,
    });

    if (!user) {
        throw new RangeError(`Could not find user: ${username}`);
    }

    return user;
}

const exportedMethods = {
    matchType(arg) {
        arg = this.stringCheck(arg);
        const validTypes = "neitherAchieved , iAchieved , theyAchieved";
        if (!validTypes.includes(arg)) {
            throw new RangeError(
                "Matchtype can only be on of the following options: neitherAchieved, iAchieved, theyAchieved"
            );
        }
    },

    stringCheck(arg) {
        if (arg === undefined) {
            throw new TypeError(
                `You must provide a string input for your parameter ${arg}`
            );
        } else if (typeof arg !== "string") {
            throw new TypeError(`${arg} must be a string`);
        } else if (arg.trim().length === 0) {
            throw new RangeError(`string inputs cannot be empty space`);
        }
        return arg.trim();
    },

    inputCheck(username, emailAddress, password) {
        if (!username || !emailAddress || !password) {
            throw new TypeError("All inputs must be non-empty strings");
        }
        if (
            typeof username !== "string" ||
            typeof emailAddress !== "string" ||
            typeof password !== "string"
        ) {
            throw new TypeError("All inputs must be a string");
        }

        username = this.usernameValidation(username);
        password = this.passwordValidation(password);
        emailAddress = this.emailValidation(emailAddress);

        return true;
    },

    usernameValidation(username) {
        username = this.stringCheck(username);
        // Username trimmed in stringCheck
        if (username.length < 2) {
            throw new RangeError(
                "username cannot be less than 2 characters long"
            );
        }
        if (username.length > 25) {
            throw new RangeError(
                "username cannot be more than 25 characters long"
            );
        }
        if (/\s/.test(username)) {
            throw new RangeError("username cannot contain empty spaces");
        }
        const nameRegex = /^[A-Za-z0-9]{2,}$/;
        if (!nameRegex.test(username)) {
            throw new RangeError(
                "username must be at least 2 characters long and contain no special characters"
            );
        }
        return username;
    },

    emailValidation(email) {
        email = this.stringCheck(email);
        // Email trimmed in stringCheck
        const emailCheck = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/i;
        if (!emailCheck.test(email)) {
            throw new RangeError("emailAddress is not a valid email");
        }
        return email;
    },

    passwordValidation(password) {
        if (/\s/.test(password)) {
            throw new RangeError("password cannot contain empty spaces");
        }
        // No trim
        const passRegex =
            /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^\&*\)\(+=._-])[a-zA-Z0-9!@#\$%\^\&*\)\(+=._-]{8,}$/;
        if (!passRegex.test(password)) {
            throw new RangeError(
                "password must be at least 8 characters long and contain 1 special character, number, and uppercase letter"
            );
        }
        return password;
    },

    objectIdValidation(str) {
        str = this.stringCheck(str);

        if (!ObjectId.isValid(str))
            throw new TypeError(`Id ${str} is not of type ObjectId.`);

        return str;
    },
};

export default exportedMethods;
