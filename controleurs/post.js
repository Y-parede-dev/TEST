const dataBase = require('../BDD/dbConnect');
const fs = require('fs');
exports.newPost = (req,res,next) => {
const post = req.body;
const file = req.file;
    if(req.file){
        dataBase.query(`INSERT INTO posts(content ,image_url, url_web, user_id, date_post)
                        VALUES("${post.content}", "${file.filename}", "${post.url_web}",${post.user_id}, "${post.date_post}");`,
                        function(err,result){
            if(err){
                res.status(400).json({message:"POST EST BOGGER"});
                console.log(err);
                return;
            }else{
                res.status(200).json({message:"le post a bien étais enregistré dans la BDD"});
            };
        });
    }else {
        dataBase.query(`INSERT INTO posts(content , url_web, user_id, date_post)
                        VALUES("${post.content}",  "${post.url_web}",${post.user_id}, "${post.date_post}");`,
                        function(err,result){
            if(err){
                res.status(400).json({message:"POST EST BOGGER"});
                console.log(err);
                return;
            }else{
                res.status(200).json({message:"le post a bien étais enregistré dans la BDD"});
            };
        });
    };
};
exports.getAllPost = (req,res,next)=>{
    dataBase.query(`SELECT posts.id AS id_post ,posts.likes ,posts.content AS content_post, posts.image_url AS image_post, posts.url_web, date_post ,
                    users.id AS user_id, users.nom AS nom_post,users.image_url AS avatar, users.prenom AS prenom_post 
                    FROM posts INNER JOIN users ON users.id= posts.user_id ORDER BY posts.id DESC;`, function(err, result){ 
        if(err){
            res.status(404).json({message:"GET ALL EST BUGER"});
            console.log(err);
            return;
        }else{
            res.status(200).json({message:"voici le resultat", result});
        };
    });
};
exports.getLikePost = (req,res,next)=>{ dataBase.query(`SELECT posts.likes 
    FROM posts WHERE posts.id = ${req.params.id} ORDER BY posts.id DESC;`, function(err, result){ 
        if(err){
            res.status(404).json({message:"GET ALL EST BUGER"});
            console.log(err);
        return;
        }else{
            res.status(200).json({message:"voici le resultat", result});
        };
    });
};
exports.getOneUserPost = (req,res,next)=>{
    const reqSQL = `SELECT posts.id AS id_post, 
                posts.likes ,
                posts.content AS content_post,
                posts.image_url AS image_post,
                posts.url_web, date_post ,
                users.id AS user_id,
                users.nom AS nom_post,
                users.image_url AS avatar,
                users.prenom AS prenom_post 
    
                FROM posts
                INNER JOIN
                users ON posts.user_id = users.id
                WHERE users.id = ${req.params.id};`;
    dataBase.query(reqSQL, function(err, result){
        if(err){
            res.status(404).json({message:"GET ONE EST BUGER"});
            return;
        }else{
            const resLength = result.length;
            if(resLength>0){
                res.status(202).json({message:"voici le resultat de get one", result, resLength});
                return;
            }else{
                res.status(200).json({message:"cet utilisateur n'a rien poster pour le moment"});
                return;
            };
        };
    });
};
exports.modifyPost = (req,res,next)=>{
    const post = req.body;
    const idCourant = req.params.id;
    const sqlSelect = `SELECT posts.image_url FROM posts WHERE posts.id =${post.post_id};`;
    let imageDelete = '';
    dataBase.query(sqlSelect,function(err,result){
        if(err){
            console.log(err);
        }else{
            result.forEach(element => {
                imageDelete = element.image_url;
                return imageDelete;
            });
            if(req.file && imageDelete!=req.file.filename){
                fs.unlink(`images/posts/${imageDelete}`,()=>{
                    console.log(imageDelete, 'a etait supr.');
                })
            };
        };
    });
    if(post.post_id == idCourant){
        let reqSQL = "";
        if(!req.file){
            reqSQL = `UPDATE posts SET content = "${post.content}",url_web = "${post.url_web}" WHERE posts.id = ${post.post_id}`;
        }else{
            console.log(imageDelete)
            reqSQL = `UPDATE posts SET content = "${post.content}", image_url ="${req.file.filename}",url_web = "${post.url_web}" WHERE id = ${post.post_id}`;
        };
        dataBase.query(reqSQL, function(err, result){
            if(err){
                console.log(err);
                res.status(400).json({message:"pb avec la modif du post"});
            }else{
                res.status(200).json({message:"modif est ok"});
            };
        });
    }else{
        res.status(500).json({message:"verifier votre id"})
    };
};
exports.deletePost=(req,res,next)=>{
    const post = req.body;
    const sqlSelect = `SELECT posts.image_url FROM posts WHERE posts.id =${post.post_id};`;
        let imageDelete = '';
        dataBase.query(sqlSelect,function(err,result){
            if(err){
                console.log(err);
            }else{
                result.forEach(element => {
                    imageDelete = element.image_url;
                    return imageDelete;
                });
                fs.unlink(`images/posts/${imageDelete}`,()=>{
                    console.log(imageDelete, 'a etait supr.');
                });
            };
        });
    const reqSQL = `DELETE FROM posts WHERE id = ${post.post_id}`;
    dataBase.query(reqSQL, function(err, result){
        if(err){
            res.status(400).json({message:'supresion impossible'});
            console.log(err);
            return;
        }else{
            res.status(200).json({message:'post bien supr'});
            return;
        };
    });
};