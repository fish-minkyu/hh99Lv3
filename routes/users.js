// routes/users.route.js
const express = require("express");
const jwt = require("jsonwebtoken")
const {Users} = require("../models");
const router = express.Router();

// 회원가입 API
router.post("/signup", async (req, res) => {
    function rightSyntax(item) { 
        const regex = /^[a-zA-Z0-9]{3,}$/
        return regex.test(item) // true, false
    }

    const {nickname, password, confirm} = req.body

    try {
        const isExistUser = await Users.findOne({where: {nickname}})
        // 닉네임 형식이 비정상적인 경우
        if (!rightSyntax(nickname)) {
            res.status(412).json({errorMessage: '닉네임의 형식이 일치하지 않습니다.'})
            return
        }
        // password가 일치하지 않는 경우
        if (password !== confirm) {
            res.status(412).json({errorMessage: '패스워드가 일치하지 않습니다.'})
            return
        }
        // password 형식이 비정상적인 경우
        if (password.length < 4 || password.includes(nickname)) {
            res.status(412).json({errorMessage: '패스워드 형식이 일치하지 않습니다.'})
            return
        } 
        // 닉네임이 포함되어 있는 경우
        if (password.includes(nickname)) {
            res.status(412).json({errorMessage: '패스워드에 닉네임이 포함되어 있습니다.'})
            return
        } 
        // 닉네임이 중복된 경우
        if (isExistUser) {
            res.status(412).json({errorMessage: '중복된 닉네임입니다.'})
            return
        }

        // 계정 생성
        const user = await Users.create({nickname, password})
    } catch (err) {
        console.log(err)
        res.status(400).json({errorMessage: '요청한 데이터 형식이 올바르지 않습니다.'})
        return
    }

    return res.status(201).json({message: '회원 가입에 성공하였습니다.'})
})

module.exports = router