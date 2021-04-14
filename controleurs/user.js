const dataBase = require('../BDD/dbConnect');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const fs = require('fs');
const verifInfoRequete = require('../assets/js/functionVerify');
const isValidEmail = (value) => {
    let reGex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    return reGex.test(value);
};
const isValidPassword = (value) => {
    let reGex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[-+!*$@%_])([-+!*$@%_\w]{8,15})$/;
    return reGex.test(value);
};
exports.signup = (req, res, next)=>{
    const corpRequete = req.body;
    if(isValidPassword(corpRequete.mot_de_passe)){
        if(isValidEmail(corpRequete.adresse_email)){
            bcrypt.hash(corpRequete.mot_de_passe, 10)
            .then(hash => {
                const user = {
                    email:corpRequete.adresse_email,
                    nom:corpRequete.nom,
                    prenom:corpRequete.prenom,
                    password: hash
                };
                const sqlRequete = `INSERT INTO users(nom, prenom, adresse_email, mot_de_passe)VALUES(
                    "${user.nom}",
                    "${user.prenom}",
                    "${user.email}",
                    "${user.password}"
                    );`;
                dataBase.query(sqlRequete, function(err, result){
                    if(err) {
                        console.log(err);
                    }else {
                        res.status(201).json({message:'tout est ok sur le POST, Utilisateur enregistre'});
                        return;
                    };
                });
            });
        }else{
            res.status(400).json({message:'Vérifiez votre adresse email'});
        };
    }else{
        res.status(404).json({message:'Vérifiez votre mot de passe'});
        return;
    };
};
exports.getAllAccount = (req,res,next)=>{
    dataBase.query( 
        `SELECT * FROM users;`, function(err, result){
            if(err){
                res.status(404).json({message:'GET EST BOGGER'});
                throw err;
            }else{
                res.status(200).json({message:'tout est ok sur le get', result});
            };
        }
    );
};
exports.getOneAccount = (req, res, next) => {
    const idCourant = req.params.id;
        dataBase.query(
            `SELECT * FROM users WHERE id = ${idCourant};`, function(err, result){
                if(err){
                    console.log(err);
                }else{
                    res.status(200).json({message:'get one est ok', result})
                };
        }); 
};
exports.deleteAccount = (req,res,next)=>{
    const user_out = req.body;
    const sql = `DELETE FROM users WHERE id = ${user_out.user_id};`;
    dataBase.query( sql, function(err, result){
        if(err){
            res.status(400).json({message: "Erreur d' identifiant"});
        }else{
            const pathname = user_out.image_url;
            if(pathname!=='user-base.png' || pathname!=='avatar-admin.png'){
                fs.unlink(`images/avatars/${pathname}`,()=>{
                })
            }
            res.status(200).json({message:"supression OK"});
        };
    });
}; 
exports.modifyAccount = (req,res,next) => {
    const idCourant = req.params.id;
    const UsersModify = req.body;
    const file = req.file;
    dataBase.query(`SELECT users.nom,users.prenom,users.adresse_email,users.mot_de_passe, users.image_url FROM users WHERE users.id = ${idCourant};`,
    function(err,result){
        if(err){
            throw err;
        }else{
            console.log(req.body)
            const compareBD = result;
            compareBD.forEach(element => {  
                bcrypt.compare(req.body.mot_de_passe, element.mot_de_passe)
                .then(valid=>{
                    if(valid){
                        if(
                            element.prenom != UsersModify.prenom ||
                            element.nom != UsersModify.nom ||
                            element.adresse_email != UsersModify.adresse_email ||
                            element.image_url != file.filename )
                            {
                                if(isValidEmail(UsersModify.adresse_email)){
                                    verifInfoRequete(UsersModify, file, element, idCourant);
                                    const pathname = element.image_url;
                                    if(file && pathname!=='user-base.png' && pathname!=='avatar-admin.png'){
                                        fs.unlink(`images/avatars/${pathname}`,()=>{
                                        });
                                    };
                                    return res.status(200).json({message:'utilisateur bien modifier'});
                                }else{
                                    res.status(400).json({message:"Probème avec l'adresse email"})
                                    return;
                                };
                            }else{
                                res.status(200).json({message:'tout est ok, rien a étais modifier'})
                                return;
                            };
                    }else{
                        if(isValidPassword(req.body.mot_de_passe)){
                            bcrypt.hash(UsersModify.mot_de_passe, 10)
                            .then(hash=>{
                                const user = {
                                    pass : hash
                                };
                            dataBase.query(`UPDATE users SET mot_de_passe = "${user.pass}" WHERE id = ${idCourant} `)
                            return res.status(201).json({message:'Mot de passe Modifier avec succés'});
                            });
                        }else{
                            res.status(400).json({error:"probleme avec le password"})
                            return
                        };
                    };
                });
            });
        };
    });
};
        /*-------------------------------------------LOGGIN----------------------------------------------*/
exports.login = (req, res, next) => {

    const userLog = req.body;
    dataBase.query(`SELECT * FROM users WHERE users.adresse_email = "${userLog.adresse_email}";`,
    function(err,result){
        let isCo = false;
        if(err){
            console.log("err");
            return res.status(500).json(err);
        }else{
            const compareBD = result;
            if(compareBD<1){
                return res.status(401).json({message:'vérifiez votre adresse email'});
            }else{
                compareBD.forEach(element=>{
                    const userBdd = element;
                    bcrypt.compare(userLog.mot_de_passe, userBdd.mot_de_passe)
                    .then(valid=>{
                        if(!valid){
                            return res.status(401).json({message:'vérifiez votre mot de passe'});
                        }else{
                            isCo = true;
                            res.status(200).json({
                                message:"login done",
                                isConected : isCo,
                                isAdmin: userBdd.isAdmin,
                                user_id : userBdd.id,
                                    password:userLog.mot_de_passe,
                                    token:jwt.sign(
                                    { user_id: userBdd.id,isAdmin: userBdd.isAdmin},
                                    `${process.env.JSW_SECRET}`,
                                    {expiresIn:`${process.env.TOKEN_EXPIRE}`}
                                    )
                            });
                        };
                    })
                    .catch(
                        error=>res.status(500).json(error));
                });
            };
        };
    });
};