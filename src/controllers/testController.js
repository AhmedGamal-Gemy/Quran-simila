const Test = require("../models/test")

const testController = {

    testUsingController : async (req, res) => {

        try{
            const { check } = req.body;

            return res.status(200).json({
                message : "GOOD BOY"
            })

        }catch{

                return res.status(401).json({
                    message : "GO FUCK YOURSELF AND GIVE ME CHECK !!!!!!!"
                })
        }
    },
    testTheTest : async (req, res) => { 

       try{

            const testData = req.body
            console.log(testData)
            
            const newTest = await Test.create(testData)
            
            res.status(200).json({
                message : "The test is created successfully",
                test : newTest
            })

       }catch (error){
            res.status(400).json({
                message : error
            })

       }


    }


}

module.exports = testController