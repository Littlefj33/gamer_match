import { users } from "../config/mongoCollections.js";
import validation, {
  DBError,
  ResourcesError,
  RangeError
} from "../helpers.js";
import { verifySteamAccount } from "./steam.js";
import bcrypt from "bcrypt";
import { ObjectId } from "mongodb";
const saltRounds = 16;
/*const client = await createClient()
    .on("error", (err) => console.log("redis client error", err))
    .connect();*/


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
    steamAccountUsername: "",
    top5MostPlayed: [],
    gamesOwned: [],
    recentlyPlayed: [],
    pendingRequests: [],
    sentRequests: [],
    friendList: [],
    friendCount: 0,
    
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
    throw new RangeError("Either the username or password is invalid");
  }
  const passwordCheck = await bcrypt.compare(password, user.hashedPassword);
  if (!passwordCheck) {
    throw new RangeError("Either the username or password is invalid");
  }

  return {
    _id: user._id,
    username: user.username,
    emailAddress: user.emailAddress,
    steamProfileLink: user.steamProfileLink,
    steamAccountUsername: user.steamAccountUsername,
    top5MostPlayed: user.top5MostPlayed,
    gamesOwned: user.gamesOwned,
    recentlyPlayed: user.recentlyPlayed,
    pendingRequests: user.pendingRequests,
    sentRequests: user.sentRequests,
    friendList: user.friendList,
    friendCount: user.friendCount    
  };
};

export const linkSteamAccount = async (emailAddress, steamId) => {
  if (!emailAddress) {
    throw new TypeError("You must provide your email");
  }
  if(!steamId){
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
    throw new RangeError(
      "You already have a linked Steam Account"
    );
  }
  const steamUserData = await verifySteamAccount(steamId);
  
  user.steamAccountUsername = steamUserData.personaname
  user.steamProfileLink = steamUserData.profileurl

  const updatedUser = await usersCollection.updateOne(
    { emailAddress: emailAddress },
    { $set: user },
    { returnDocument: "after" }
  );

  if (updatedUser.modifiedCount === 0)
    throw new DBError("Could not link Steam Account successfully");

  return { steamAccountLinked: steamUserData.profileurl, status: true };
  
}

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
    throw new RangeError(
      "You do not have a linked Steam Account"
    );
  }
  const steamUrl = user.steamProfileLink
  user.steamAccountUsername = null
  user.steamProfileLink = null

  const updatedUser = await usersCollection.updateOne(
    { emailAddress: emailAddress },
    { $set: user },
    { returnDocument: "after" }
  );

  if (updatedUser.modifiedCount === 0)
    throw new DBError("Could not unlink Steam Account successfully");

  return { steamAccountUnlinked: steamUrl, status: true };
  
}