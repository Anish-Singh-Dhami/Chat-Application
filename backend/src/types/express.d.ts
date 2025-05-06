interface IUser {
  id: string;
  fullName: string;
  email: string;
  profilePic: string;
  createdAt: Date;
  updatedAt: Date;
}

namespace Express {
  interface Request {
    user?: IUser;
  }
}
