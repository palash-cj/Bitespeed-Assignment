const userIdentify = require("../services/userService");
const {sendResponse, sendError} =require("./baseController");



/**
 * identifyUser : Identifies the user based on the data stored in db, if user exists it retrieves the data else adds the data to the db and returns the respective response
 * @param {email, phoneNumber} req 
 * @param {primaryContactId, emails, phoneNumbers, secondaryContactIds} res 
 */
const identifyUser=async(req,res)=>{
    try {
        var pNumber=req.body.phoneNumber;
        var email=req.body.email;
        if((pNumber==undefined || pNumber==null) && (email==undefined || email==null)){
            res.status(400).send(sendError("Atleast phoneNumber or email are required", null));
        }else{
            const data=await userIdentify(req)
            if(data.data!=null){
                res.status(200).send(sendResponse(data.message,data.data));
            }else{
                res.status(500).send(sendError(data.message,data.data));
            }
        }
    } catch (error) {
        res.status(500).send(sendError(error.message,null));
    }
}


module.exports={identifyUser};