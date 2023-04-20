const db = require("../../../models");
const sanitizeHtml = require("sanitize-html");

const sanitizeOption = {
    allowedTags: [
        'h1',
        'h2',
        'b',
        'i',
        'u',
        's',
        'p',
        'ul',
        'ol',
        'li',
        'blockquote',
        'a',
        'img'
    ],
    allowedAttributes: {
        a: ['href', 'name', 'target'],
        img: ['src'],
        li: ['class']
    },
    allowedSchemes: ['data', 'http']
};

const removeHtmlAndShorten = body => {
    const filtered = sanitizeHtml(body, {
        allowedTags: [],
    });
    return filtered.length < 200 ? filtered : `${filtered.slice(0, 200)}...`;
}

const Post = db.post;
const User = db.user;
/*
* 포스트 작성
* POST /api/posts
* {title, body}
* */
exports.write = async ctx => {
    // REST API의 Request Body는 ctx.request.body에서 조회할 수 있다.
    const {title, body, tags, writer} = ctx.request.body;
    const regex = /[^a-zA-Z0-9 \\,ㄱ-ㅎㅏ-ㅣ가-힣]/g;

    ctx.body = await Post.create({
        title: title,
        body: sanitizeHtml(body, sanitizeOption),
        tags: JSON.stringify(tags).replaceAll(regex, ""),
        writer: writer
    }).catch(e => console.log(e));
};

/*
* 포스트 목록 조회
* GET /api/posts
* */
exports.list = async ctx => {
    let {page} = ctx.request.query
    if(!page) page = 1;

    let offset = 0;

    if (page > 1) {
        offset = 10 * (page - 1);
    }

    let posts = await Post.findAll({include: [{model: User, attributes: {exclude: ['password']}}], limit: 10, offset: offset}).catch(e => console.log(e));
    posts = JSON.parse(JSON.stringify(posts));
    ctx.body = posts.map(post => ({
        ...post,
        tags: post.tags ? post.tags.split(',') : '',
        body:removeHtmlAndShorten(post.body)
    }));
};

/*
* 특정 포스트 조회
* GET /api/posts/:id
* */
exports.read = async ctx => {
    const {id} = ctx.params;

    let post = await Post.findOne({include: [{model: User, attributes: {exclude: ['password']}}], where: {id: id}}).catch(e => console.log(e));

    if(!post) {
        ctx.status = 404;
        ctx.body = {
            message: '포스트가 존재하지 않습니다.'
        };
        return;
    }

    post = JSON.parse(JSON.stringify(post));

    if(post.tags) {
        post = {
            ...post,
            tags: post.tags ? post.tags.split(',') : '',
        }
    }

    ctx.body = post;
};

/*
* 특정 포스트 제거
* DELETE /api/posts/:id
* */
exports.remove = async ctx => {
    const {id} = ctx.params;

    const post = await Post.destroy({where: {id: id}}).catch(e=>{
        ctx.status = 404;
        ctx.body = {
            message: '포스트가 존재하지 않습니다.'
        };
    });

    ctx.status = 204;
    ctx.body = {
        message: '삭제 완료',
        post: post
    }
};

/*
* 특정 포스트 수정
*  /api/posts/:id
* {title, body}
* */
exports.update = async ctx => {
    const {id} = ctx.params;

    const nextData = {...ctx.request.body};
    const regex = /[^a-zA-Z0-9 \\,ㄱ-ㅎㅏ-ㅣ가-힣]/g;


    if(nextData.body) {
        nextData.body = sanitizeHtml(nextData.body, sanitizeOption);
    }

    const tags = nextData.tags && JSON.stringify(nextData.tags).replaceAll(regex, "");

    const post = await Post.update({body:  nextData.body , title: nextData.title, tags: tags}, {where: {id: id}}).catch(e => console.log(e));

    if(!post) {
        ctx.status = 404;
        ctx.body = {
            message: '포스트가 존재하지 않습니다.'
        };
        return;
    }
    ctx.body = post;
};