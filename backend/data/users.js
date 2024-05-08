import { users } from "../config/mongoCollections.js";
import validation, { DBError, ResourcesError, RangeError } from "../helpers.js";
import { getSteamUser } from "./steam.js";
import bcrypt from "bcrypt";
const saltRounds = 16;

export const registerUser = async (username, emailAddress, password) => {
    validation.inputCheck(username, emailAddress, password);
    emailAddress = emailAddress.toLowerCase();
    username = username.toLowerCase();
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const usersCollection = await users();
    let existingUser = await usersCollection.findOne({
        emailAddress: emailAddress,
    });
    if (existingUser !== null) {
        throw new RangeError("User with provided email already exists");
    }
    let existingUsername = await usersCollection.findOne({
        username: username,
    });
    if (existingUsername !== null) {
        throw new RangeError(
            "username already taken, please provide a new username"
        );
    }

    let newUser = {
        username: username,
        emailAddress: emailAddress,
        hashedPassword: hashedPassword,
        steamProfileLink: "",
        avatarLink: "",
        steamAccountUsername: "",
        steamId: "",
        top5MostPlayed: [],
        gamesOwned: [],
        recentlyPlayedCount: 0,
        gamesOwnedCount: 0,
        recentlyPlayed: [],
        pendingRequests: [],
        pendingCount: [],
        sentRequests: [],
        sentCount: 0,
        friendList: [],
        friendCount: 0
    };

    const insertedInfo = await usersCollection.insertOne(newUser);
    if (!insertedInfo.acknowledged || !insertedInfo.insertedId) {
        throw new DBError("User could not be added");
    }

    return { insertedUser: true };
};

export const loginUser = async (emailAddress, password) => {
    if (!emailAddress || !password) {
        throw new TypeError("You must provide both an email and a password");
    }

    if (typeof emailAddress !== "string" || typeof password !== "string") {
        throw new TypeError("Both username and password must be string inputs");
    }
    emailAddress = emailAddress.toLowerCase();
    emailAddress = validation.emailValidation(emailAddress);
    password = validation.passwordValidation(password);
    const usersCollection = await users();
    const user = await usersCollection.findOne({ emailAddress: emailAddress });
    // For login data functions, not finding user should return RangeError
    if (user === null) {
        throw new RangeError("Either the email or password is invalid");
    }
    const passwordCheck = await bcrypt.compare(password, user.hashedPassword);
    if (!passwordCheck) {
        throw new RangeError("Either the email or password is invalid");
    }

    return {
        _id: user._id,
        username: user.username,
        emailAddress: user.emailAddress,
        steamProfileLink: user.steamProfileLink,
        steamAccountUsername: user.steamAccountUsername,
        steamId: user.steamId,
        top5MostPlayed: user.top5MostPlayed,
        gamesOwned: user.gamesOwned,
        recentlyPlayed: user.recentlyPlayed,
        pendingRequests: user.pendingRequests,
        sentRequests: user.sentRequests,
        friendList: user.friendList,
        friendCount: user.friendCount,
    };
};

export const deleteUser = async (emailAddress) => {
    if (!emailAddress) {
        throw new TypeError("You must provide your email");
    }
    emailAddress = validation.emailValidation(emailAddress);
    let usersCollection = undefined;
    let user = undefined;
    try {
        usersCollection = await users();
        user = await usersCollection.findOne({ emailAddress: emailAddress });
    } catch {
        throw new DBError("Unable to query DB.");
    }
    if (!user === null) {
        throw new ResourcesError("No user with provided email found.");
    }

    await usersCollection.deleteOne({ emailAddress: emailAddress });
    const verifyDeletedUser = await usersCollection.findOne({
        emailAddress: emailAddress,
    });
    if (!verifyDeletedUser) {
        return { userDeleted: true };
    } else {
        throw new DBError("Unable to delete user");
    }
};

export const linkSteamAccount = async (emailAddress, steamId) => {
    steamId = validation.stringCheck(steamId);
    if (!emailAddress) {
        throw new TypeError("You must provide your email");
    }
    if (!steamId) {
        throw new TypeError("You must provide your steamId");
    }
    emailAddress = validation.emailValidation(emailAddress);
    let usersCollection = undefined;
    let user = undefined;
    try {
        usersCollection = await users();
        user = await usersCollection.findOne({ emailAddress: emailAddress });
    } catch {
        throw new DBError("Unable to query DB.");
    }
    if (!user === null) {
        throw new ResourcesError("No user with provided email found.");
    }

    if (user.steamAccountUsername || user.profileurl) {
        throw new RangeError("You already have a linked Steam Account");
    }
    const steamUserData = await getSteamUser(steamId);

    user.steamAccountUsername = steamUserData.personaname;
    user.steamProfileLink = steamUserData.profileurl;
    user.steamId = steamUserData.steamid;
    user.avatarLink = steamUserData.avatarfull



    const updatedUser = await usersCollection.updateOne(
        { emailAddress: emailAddress },
        { $set: user },
        { returnDocument: "after" }
    );

    if (updatedUser.modifiedCount === 0)
        throw new DBError("Could not link Steam Account successfully");

    return { steamAccountLinked: steamUserData.profileurl, status: true };
};

export const unlinkSteamAccount = async (emailAddress) => {
    if (!emailAddress) {
        throw new TypeError("You must provide your email");
    }
    emailAddress = validation.emailValidation(emailAddress);
    let usersCollection = undefined;
    let user = undefined;
    try {
        usersCollection = await users();
        user = await usersCollection.findOne({ emailAddress: emailAddress });
    } catch {
        throw new DBError("Unable to query DB.");
    }
    if (!user) {
        throw new ResourcesError("No user with provided email found.");
    }

    if (!user.steamAccountUsername || !user.steamProfileLink) {
        throw new RangeError("You do not have a linked Steam Account");
    }
    const steamUrl = user.steamProfileLink;
    user.steamAccountUsername = null;
    user.steamProfileLink = null;
    user.steamId = null;
    const updatedUser = await usersCollection.updateOne(
        { emailAddress: emailAddress },
        { $set: user },
        { returnDocument: "after" }
    );

    if (updatedUser.modifiedCount === 0)
        throw new DBError("Could not unlink Steam Account successfully");

    return { steamAccountUnlinked: steamUrl, status: true };
};

export const isAccountLinked = async (emailAddress) => {
    if (!emailAddress) {
        throw new TypeError("You must provide your email");
    }
    emailAddress = validation.emailValidation(emailAddress);
    let usersCollection = undefined;
    let user = undefined;
    try {
        usersCollection = await users();
        user = await usersCollection.findOne({ emailAddress: emailAddress });
    } catch {
        throw new DBError("Unable to query DB.");
    }
    if (!user) {
        throw new ResourcesError("No user with provided email found.");
    }

    if (!user.steamAccountUsername || !user.steamProfileLink) {
        return false;
    } else {
        return true;
    }
};
