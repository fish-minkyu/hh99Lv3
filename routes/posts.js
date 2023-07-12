const express = require("express")
const { Op } = require("sequelize");
const router = express.Router()
const {Posts} = require("../models")
const authMiddleware = require("../middleware/auth-middleware.js")

// const jwt = require("jsonwebtoken")
// const {Users} = require("../models")


// 게시글 작성 API(done)
// 토큰 검사
router.post("/posts", authMiddleware, async (req, res) => {
    const {userId, nickname} = res.locals.user
    const {title, content} = req.body

    try {
        // body 데이터가 정상적으로 전달되지 않는 경우
        if (!title || !content) {
            res.status(412).json({errorMessage: '데이터 형식이 올바르지 않습니다.'})
            return
        }
        // title의 형식이 비정상적인 경우
        if (title.length > 10) {
            res.status(412).json({errorMessage: '게시글 제목의 형식이 일치하지 않습니다.'})
            return
        }
        // content 형식이 비정상적인 경우
        if (content.length > 255) {
            res.status(412).json({errorMessage: '게시글 내용의 형식이 일치하지 않습니다.'})
            return
        }
        
        const post = await Posts.create({
            userId: userId,
            nickname: nickname,
            title: title,
            content: content
        })

        return res.status(201).json({message: '게시글 작성에 성공하였습니다.'})
    } catch (err) {
        console.log(err)
        res.status(400).json({errorMessage: '게시글 작성에 실패하였습니다.'})    
    }
});

// 게시글 조회 API(done)
router.get("/posts", async (req, res) => {
   
    try {
        const posts = await Posts.findAll({
            attributes: ['postId', 
                        'userId',
                        'nickname', 
                        'title', 
                        'createdAt', 
                        'updatedAt'],
            order: [['createdAt', 'DESC']]
        })
        res.status(200).json({post: posts})

    } catch (err) {
        console.log(err)
        res.status(400).json({errorMessage: '게시글 조회에 실패하였습니다.'})    
    }
});


// 게시글 상세 조회 API(done)
router.get("/posts/:postId", async (req, res) => {
    const {postId} = req.params

    try {
        const post = await Posts.findOne({
            attributes: ['postId', 
                        'userId', 
                        'nickname', 
                        'title', 
                        'content', 
                        'createdAt', 
                        'updatedAt'],
            where: {postId: postId}});

            return res.status(200).json({post: post})

    } catch (err) {
        res.status(400).json({errorMessage: '게시글 조회에 실패하였습니다.'})
        return
    }
})


// 게시글 수정 API(done)
// 토큰 검사
router.put("/posts/:postId", authMiddleware, async (req, res) => {
    const {postId} = req.params
    const {userId} = res.locals.user
    const {title, content} = req.body

    try {
        const post = await Posts.findOne({where: {postId: postId}})
        // body 데이터가 정상적으로 전달되지 않는 경우
        if (!title || !content) {
            res.status(412).json({errorMessage: '데이터 형식이 올바르지 않습니다.'})
        }
        // title 형식이 비정상적인 경우
        if (title.length > 10) {
            res.status(412).json({errorMessage: '게시글 제목의 형식이 일치하지 않습니다.'})
            return
        }
        // content 형식이 비정상적인 경우
        if (content.length > 255) {
            res.status(412).json({errorMessage: '게시글 내용의 형식이 일치하지 않습니다.'})
            return
        }
        // 게시글을 수정할 권한이 존재하지 않는 경우
        if (userId !== post.userId) {
            res.status(403).json({errorMessage: '게시글 수정의 권한이 존재하지 않습니다.'})
			return
        }
        

        // 게시글 수정
        const result = await Posts.update(
            {title, content},
            {where: {[Op.and]: [{postId}, {userId: userId}]}}
        )
        
        // 게시글 수정이 실패한 경우
        if (result[0] === 1) {
            return res.status(200).json({message: '게시글을 수정하였습니다.'})
        } else {
            res.status(401).json({errorMessage: '게시글이 정상적으로 수정되지 않았습니다.'})
            return
        }

    } catch (err) {
         res.status(400).json({errorMessage: '게시글 수정에 실패하였습니다.'})
        return
    }
})


// 게시글 삭제 API (1개 수정필요)
// 토큰 검사
router.delete("/posts/:postId", authMiddleware, async (req, res) => {
    const {postId} = req.params
    const {userId} = res.locals.user

    try {
        const post = await Posts.findOne({where: {postId: postId}})

        // 게시글이 존재하지 않는 경우
        if (!post) {
            res.status(404).json({errorMessage: '게시글이 존재하지 않습니다.'})
            return
        }
        // 게시글을 삭제할 권한이 존재하지 않는 경우
        if (userId !== post.userId) {
            res.status(403).json({errorMessage: '게시글의 삭제 권한이 존재하지 않습니다.'})
            return
        }

        // 게시글 삭제
        const result = await Posts.destroy({
            where: {[Op.and]: [{postId: postId}, {userId: userId}]}
        })

        // 게시글 삭제에 실패한 경우
        if (result === 1) {
            return res.status(200).json({ data: "게시글이 삭제되었습니다." });
        } else {
            res.status(401).json({errorMessage: '게시글이 정상적으로 삭제되지 않았습니다.'})
            return
        }

    } catch (err) {
        console.log(err)
        res.status(400).json({errorMessage: '게시글 삭제에 실패하였습니다.'})
        return
    }
})


module.exports = router