require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const mogoose = require('mongoose')

mogoose.set('strictQuery', true);


const cors = require('cors')

app.use(cors())

const connectToDataBase = require("./scr/database");


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));



//Dados Publicos
app.get("/user/:id", async(req, res) => { //informações publicas
    //Chama os dados da pagina de acordo com a url inserida
    const id = req.params.id

    const data = await User.findById(id, 'username arrayLinks')

    if(!data){
        return res.status(404).json({msg:'Id não encontrado'})
    }

    res.status(200).json({data})
        
})

//privade routes
/*app.get("/user/:id", checkToken, async (req, res) => {
    const id = req.params.id

    //check if user exists
    const user = await User.findById(id, '-password');

    if(!user){
        return res.status(404).json({msg: 'usuario não encontrado',})
    }

    res.status(200).json({user})
})*/

function checkToken(req, res, next){
    //Checar token
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(" ")[1];

    if(!token){
        return res.status(401).json({msg: 'acesso negado',})
    }

    try {
        const secret = process.env.SECRET;

        jwt.verify(token,secret);

        next();
    } catch (error) {
        res.status(400).json({msg:"Token Invalido"})
    }

}

//model User
const User = require('./scr/model/User');
const { default: mongoose } = require('mongoose');

//registra usuario
app.post('/auth/register', async(req,res) => {


    const {_id, username, email, password, img,ig ,list,arrayLinks, idURL, title, linkURL,social ,idIconSocial, href} = req.body

    //check
    const userExist = await User.findOne({email: email})

    if(userExist){
        return res.status(422).json({msg: 'Esse email já está registrado',})
    }

    //create pass
    const salt = await bcrypt.genSalt(12)
    const passHash = await bcrypt.hash(password, salt)

    //create user
    const user = new User({
        _id,//id recebe o nome do usuario, não pode ser alterado
        username,//username pode ser alterado
        email,
        password: passHash,
        img,
        ig,
        arrayLinks,
        list,
        idURL,
        title,
        linkURL,
        social,
        idIconSocial,
        href
    })

    //const dataProfile = new DataProfile({})
    try {
        await user.save()
        const id = user._id;
        //await dataProfile.save()
        res.status(201).json({msg:'Usuario criado com sucesso',id})

    } catch (error) {
        console.log(error)
        res.status(500).json({msg:'Erro no servidor ',});
    }
})

app.put('/user/update', async (req, res) => {
    const {id,email, idURL, title, linkURL, arrayLinks } = req.body;

    //const userExist = await User.findOne({ email: email });

    //if (!userExist) {
       // return res.status(422).json({ msg: 'Email não encontrado' });
    //}

    const user = await User.findByIdAndUpdate(id, {arrayLinks, title, linkURL }, { new: true });
    
    if (!user) {
        return res.status(404).json({ msg: "Usuário não encontrado" });
    }

    try {
        await user.save();
        return res.status(201).json({ msg: 'Dados de usuário atualizados com sucesso' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: 'Erro no servidor' });
    }
});

//login
app.post('/auth/login', async (req,res) => {
    
    const {email, password} = req.body;

    if(!email){
        return res.status(422).json({msg:'Insira um email'});
    }
    if(!password){
        return res.status(422).json({msg:'Insira uma senha'});
    }

    const user = await User.findOne({email: email})
    
    //check user
    if(!user){
        return res.status(404).json({msg: 'Usuario não encontrado',})
    }

    //check PassWord
    const checkPassword = await bcrypt.compare(password, user.password)

    if(!checkPassword){
        return res.status(404).json({msg: 'Senha invalidada',})
    }
    
    try {
        //criar token
        const secret = process.env.SECRET;
        const token = jwt.sign(
        {
            id: user._id,
        },secret
        )
        const id = user._id

        res.status(200).json({msg:'Autenticação realizada com sucesso ', token, id});
    } catch (error) {
        console.log(error)
        res.status(500).json({msg:'Erro no servidor ',});
    }
})

//mogoose
connectToDataBase()
    
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});
