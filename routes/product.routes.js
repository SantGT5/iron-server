const router = require("express").Router();

const attachCurrentUser = require("../middlewares/attachCurrentUser");
const isAdmin = require("../middlewares/isAdmin")

const isAuthenticated = require("../middlewares/isAuthenticated");


const productModule = require("../models/Product.model")

router.post("/newProduct",isAuthenticated,attachCurrentUser,isAdmin,async(req,res,next)=>{
    try{
        const data= req.body

const resposta = await productModule.create({userid:req.currentUser._id,
    ...data})

return res.status(200).json(resposta)

    }catch(err){
        next(err);
    }
})

router.put("/editProduct/:id",isAuthenticated,attachCurrentUser,isAdmin,async(req,res,next)=>{
try{

    const data= req.body
    const {id} = req.params

const resposta = await productModule.findByIdAndUpdate({_id:id},{...data},{ new: true })
return res.status(200).json(resposta)
}catch(err){
    next(err)
}

})

router.delete("/deleteProduct/:id",isAuthenticated,attachCurrentUser,isAdmin,async(req,res,next)=>{

try{
    const {id} = req.params

const resposta = await productModule.findOneAndDelete({_id:id})

if(resposta.n<1){

 return res.status(404).json({ error: "produto nao existe" });
}

return res.status(200).json({})
} catch (err) {
    next(err);
  }
}
);
router.get("/getAllProducts",isAuthenticated,attachCurrentUser,async(req,res,next)=>{
try{

    const data= req.body
    const resposta = await productModule.find()
    return res.status(200).json(resposta)
} catch (err) {
    next(err);
  }   

})

router.get("/search",async(req,res,next)=>{

    
    try{

const {name} = req.query
const {category} = req.query
       

      
        
if(category){
       let productCategory = await productModule.find( {category: category} )
       return res.status(200).json(productCategory); 

}
          let productname = await productModule.find({name:{$regex:name} } )
        
   
            return res.status(200).json(productname); 
       
        } catch (err) {
            next(err);
          } 
       
          
      
        
    });
module.exports = router;