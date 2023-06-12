const connection =require('../connection');

const userIdentify=async(req)=>{
    const pNumber=req.body.phoneNumber;
    console.log(pNumber);
    const email=req.body.email;
    console.log(email);
    const query=`SELECT * FROM Contact WHERE phoneNumber=${pNumber} OR email=${email};`
    await connection.query(query,(err,results)=>{
        console.log(results);
        if(err){
            return {
                data:null,
                message:err.message
            };
        }
        console.log("entering")

        return {
            data:results,
            message:"Data fetched successfully"
        };

    })
}

module.exports=userIdentify;