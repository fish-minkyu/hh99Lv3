const express = require("express")
const router = express.Router()
const jwt = require("jsonwebtoken")
const {Users} = require("../models");


// 로그인 API
router.post("/login", async(req, res) => {
    const {nickname, password} = req.body
    try {
        const user = await Users.findOne({where: {nickname}})
        // 해당하는 유저가 존재하지 않거나 비밀번호가 틀린 경우
        if (!user || password !== user.password) {
            res.status(412).json({errorMessage: '닉네임 또는 패스워드를 확인해주세요.'})
        }

        const token = jwt.sign({userId: user.userId}, 'secretKey')

        res.cookie('Authorization', `Bearer ${token}`)
        res.status(200).json({token})

  } catch (err) {
    console.log(err)
    res.status(400).json({errorMessage: '로그인에 실패하였습니다.'})
    return
  }
});


module.exports = router