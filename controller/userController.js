const {sendResponse, sendError} =require("./baseController")


const identifyUser=async(req,res)=>{
    try {
        var pNumber=req.body.phoneNumber;
        var email=req.body.email;
        if(pNumber!=undefined && pNumber!="" && email!=undefined && email!=""){

        }else{
            res.status(400).send(sendResponse("phoneNumber & email are required"));
        }
    } catch (error) {
        res.status(500).send(sendError(error.message,null));
    }
}


module.exports={identifyUser};