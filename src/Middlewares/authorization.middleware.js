import {User} from "../DB/Models/index.js";

export const authorizationMiddleware = (allowedRoles) => {
    return (req, res, next) => {

    const {user:{role}} = req.loggedInUser

  
      if (allowedRoles.includes(role)) {
        return next()
      }
      return res.status(401).json({ message: "Unauthorized", allowedRoles })
    }
  }
  
