express = require("express")

testController = require('../controllers/testController')

router = express.Router()


router.get("/test", (req, res) => {

    return res.status(200).json({
        message : " GOOD JOB CREATING THE TEST ROUTE "
    })

})

router.get("/testUsingController", testController.testUsingController)

router.post("/testModel", testController.testTheTest)

module.exports = router 