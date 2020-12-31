"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = void 0;
var not_authorised_error_1 = require("../errors/not-authorised-error");
exports.requireAuth = function (req, res, next) {
    if (!req.currentUser) {
        throw new not_authorised_error_1.NotAuthorised();
    }
    next();
};
// export const isAuthenticated = (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   // if cookie: req.session.jwt does not exists
//   if (!req.session || !req.session.jwt) {
//     return res.send({ currentUser: null })
//   }
//   // if the cookie is tampered
//   try {
//     const payload = jwt.verify(req.session.jwt, process.env.JWT_KEY!)
//     res.send({ currentUser: payload })
//     next()
//   } catch (err) {
//     return res.send({ currentUsr: null })
//   }
// }
