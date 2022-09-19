// export interface User{
//    UID:String,
//    city:String | null,
//    fullName:String,
//    streetAddress:String | null,
//    phoneNumber:String | null,
//    occupation: String[],
//    description:String | null,
//    rate: Number;
//    reviewsNumber:Number;
//    recommendationNumber:Number;
//    profilePicture:String | null;
//    primaryOccupation:String | null;
// };
// export function defaultUser():User{
//     return {UID:"Nema",
//     city:null,
//     fullName:"Nema",
//     streetAddress:null,
//     phoneNumber:null,
//     occupation:[],
//     description:null,
//     rate:0,
//     reviewsNumber:0,
//     recommendationNumber:0,
//     profilePicture:"https://www.personality-insights.com/wp-content/uploads/2017/12/default-profile-pic-e1513291410505.jpg",
//     primaryOccupation:null
// } as User;
// };

export interface User{
    username:String,
    password:String,
    rooms:String[],
    admin: Boolean
}