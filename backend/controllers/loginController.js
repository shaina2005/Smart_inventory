export const loginUser = (req,res)=>{
    const {role , password} = req.body;
    
    if( (role==="admin" && password==="1234")|| (role==="staff" && password==="9878") )
    {
        res.status(200).json({success:true , message : "Valid user"})
    }
    else{
        res.status(401).json({ success : false , message : "Invalid user"})
    }
}