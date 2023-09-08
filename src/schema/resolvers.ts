import User from '../models/userModels';
import { genToken, comparePassWord} from '../utilis/auth';
import bcrypt from 'bcrypt';
import { GraphQLError } from "graphql";

const graphQlError = (message:string) => {
  throw new GraphQLError(message, {
    extensions: {
      code: "BAD_USER_INPUT",
    },
  });
};

export const resolvers = {
    Query: {
     getUsers: async () => {
         try {
             const users = await User.find();
             if (!users) {
              return graphQlError("Users not found");
             }
             return users;
         } catch (error) {
             console.log(error)
         }
     },
 
     getUser: async (_: unknown, {id}:{id:String}) => {
           try {
              const user = await User.findById(id)
              if (!user) {
                return graphQlError("User not found");
               }
              return user;
           } catch (error) {
             console.log(error)
           }
     }
    },
 
 //    MUTATIONS
       Mutation: {
         // SIGNUP USER
      Signup: async (_: unknown, userData: any) => {
 
         try {
         const {firstName, lastName, email, password} = await userData.newUser;

         const user = await User.findOne({ email });
         if (user) {
          return graphQlError(`${user} is already in use`);
         }
 
         if (!password) {
             return graphQlError('Password is required.');
           }
 
          //  const hashedPassword = await hashPassword(userData.password);
          //  userData.password = hashedPassword;
          const saltRounds = 10;
          const salt = await bcrypt.genSalt(saltRounds);
          const hashedPassword = await bcrypt.hash(password, salt)
 
       const newUserWithHashedPassword = {
         firstName,
         lastName,
         email,
         password: hashedPassword,

       }
       const newUser = await User.create(newUserWithHashedPassword);
            return newUser
         } catch (error) {
             console.log(error)
         }
      },
          
     //  USER LOGIN
      Login: async (_: unknown, { loginUser }: any) => {
           const { email, password } = loginUser;
           const user = await User.findOne({ email });
       
           if (!user) {
             return graphQlError('Invalid credentials. Please check your email.');
           }
       
           const validate = await comparePassWord(user, password)
       
           if (!validate) {
            return graphQlError("Invalid Login");
           }
       
           const token = genToken({ email, id: user?._id?.toString() as string });
       
           return {
             user,
             token,
           };
         },
 
         // UPDATE USER
         UpdateUser: async (_: unknown, { updateUser }: any, context: any) => {

          if (!context.user) {
            return graphQlError('Authentication required to update user');
          }
             const { id, firstName, lastName, email, password } = updateUser;
         
             // Check if the user exists
             const existingUser = await User.findById(id);
             if (!existingUser) {
               return graphQlError('User not found');
             }
         
             if (context.user.id !== id) {
              return graphQlError('Unauthorized to update this user');
            }
             // Update user fields if provided
             if (firstName) existingUser.firstName = firstName;
             if (lastName) existingUser.lastName = lastName;
             if (email) existingUser.email = email;
             if (password) {
               const saltRounds = 10;
               const salt = await bcrypt.genSalt(saltRounds);
               const hashedPassword = await bcrypt.hash(password, salt)
               existingUser.password = hashedPassword;
             }
         
             // Save the updated user
             const updatedUser = await existingUser.save();
             return updatedUser;        
         },
 
         // DELETE USER    
         DeleteUser: async (_: unknown, { id }: any, context: any) => {

          if (!context.user) {
            return graphQlError('Unauthorized. Please log in.');
          }
             // Check if the user exists
             try {
                 const existingUser = await User.findByIdAndDelete(id);
             if (!existingUser) {
               return graphQlError('User not found');
             }

             if (existingUser._id.toString() !== context.user.id) {
              return graphQlError('Unauthorized. You can only delete your own account.');
            }
              
            await User.deleteOne({ _id: id });
               return existingUser;
             } catch (error) {
              return graphQlError("User not found")
             }
            
             },   
       
       }
     }