import dataBase from "./../dataBase.js";
import bcrypt from "bcrypt";
import { ObjectId } from "mongodb";
import { v4 as uuid} from "uuid";

const signIn = async (req, res) => {
    const {email, password} = req.body;

    try{
        const user = await dataBase.collection("members").findOne({email: email});
        if(!user) return res.status(404).send("Usuário e/ou senha incorretos");
        if(user && bcrypt.compareSync(password, user.password)){
            const token = uuid();
            await dataBase.collection("sessions").insertOne({userId: user._id, token: token});
            return res.status(200).send({token: token, Id: user._id, Name: user.name, Image: user.image, Email: user.email});
        }else{
            return res.status(401).send("Usuário e/ou senha incorretos");
        }

    }catch(error){
        res.status(500).send(error);
    }
}

const createMember = async (req, res) =>{
    const {name, image, email, password} = req.body;
    const hashPass = bcrypt.hashSync(password, 5);

    try{

        const user = await dataBase.collection("members").findOne({email: email});
        if(user) return res.status(409).send("Email já cadastrado");
        await dataBase.collection("members").insertOne({name, image, email, password: hashPass})
        return res.sendStatus(201);
    }catch(error){
        return res.status(401).send(error);
    }
}

const updateMember = async (req, res) => {
    const auth = req.headers.authorization;
    if(!auth) return res.status(422).send("Não autorizado");

    const token = auth.replace('Baerer ', '');
    const { id } = req.headers;
    const { name, image } = req.body;

    try {
        const user = await dataBase.collection("sessions").findOne({token});
        if(!user) return res.status(401).send("Não autorizado");
        const member = await dataBase.collection("members").findOne({_id: new ObjectId(id)});
        if(!member) return res.status(404).send("Usuário não encontrado");
        
        await dataBase.collection("members").updateOne({_id: new ObjectId(id)}, {$set: {name, image}});
        const upMember = await dataBase.collection("members").findOne({_id: new ObjectId(id)});

        return res.status(202).send({token, Id: upMember._id,Name: upMember.name, Image: upMember.image, Email: upMember.email});
    } catch (error) {
        return res.status(500).send(error);
    }
}

const logOut = async (req, res) => {
    const auth = req.headers.authorization;
    if(!auth) return res.status(422).send("Não autorizado");

    const token = auth.replace('Baerer ', '');

    try {
        const session = await dataBase.collection("sessions").findOne({token});
        if(!session){
            return res.status(404).send("Sessão encerrada, usuário não logado");
        }else{
            await dataBase.collection("sessions").deleteOne({token});
            return res.status(202).send("Sessão encerrada");
        }
    } catch (error) {
        return res.status(500).send(error);
    }
}

const unsubscribe = async (req, res) => {
    const auth = req.headers.authorization;
    if(!auth) return res.status(422).send("Não autorizado.");

    const token = auth.replace('Baerer ', '');
    let session;
    try {
        session = await dataBase.collection("sessions").findOne({token});
        if(!session) return res.status(401).send("Sessão encerrada");
        const user = await dataBase.collection("members").findOne({_id: new ObjectId(session.userId)});
        if(!user) return res.status(404).send("Usuário não encontrado");
    } catch (error) {
        return res.status(500).send(error);
    }

    try {
        await dataBase.collection("members").deleteOne({_id: new ObjectId(session.userId)});
        return res.status(202).send("Usuário Descadastrado");
    } catch (error) {
        return res.status(500).send(error);
    }

}

const favoritar = async (req, res) => {
    const auth = req.headers.authorization;
    if(!auth) return res.status(422).send("Não autorizado.");
    const token = auth.replace('Baerer ', '');
    const { Name } = req.body;
    if(!Name) return res.status(404).send("Anime não fornecido");
    try {
        const user = await dataBase.collection("sessions").findOne({token});
        if(!user) return res.status(401).send("Não autorizado");
        const anime = await dataBase.collection("animes").findOne({Name: Name});
        // console.log(anime)
        if(!anime) return res.status(404).send("Anime não encontrado.");
        const favoritos = await dataBase.collection("favorites").findOne({$and: [{Anime: Name}, {userId: new ObjectId(user.userId)}]});
        if(favoritos) return res.status(409).send("Anime já favoritado");


        await dataBase.collection("favorites").insertOne({userId: user.userId, Anime: Name});
        return res.status(202).send("Anime Favoritado com sucesso.");

    } catch (error) {
        return res.status(500).send(error);
    }
}

const favoritesList = async (req, res) => {
    const auth = req.headers.authorization;
    if(!auth) return res.status(422).send("Não autorizado.");
    const token = auth.replace('Baerer ', '');
    try {
        const user = await dataBase.collection("sessions").findOne({token});
        if(!user) return res.status(401).send("Não autorizado");

        const list = await dataBase.collection("favorites").find({userId: user.userId}).toArray();

        return res.status(200).send(list);
    }catch(error){
        return res.status(500).send(error);
    }
}

const desfavoritar = async (req, res) => {
    const auth = req.headers.authorization;
    console.log(req.headers)
    if(!auth) return res.status(422).send("Não autorizado.");
    const token = auth.replace('Baerer ', '');
    const { name } = req.headers;
    if(!name) return res.status(404).send("Anime não fornecido");
    try {
        const user = await dataBase.collection("sessions").findOne({token});
        if(!user) return res.status(401).send("Não autorizado");
        const anime = await dataBase.collection("animes").findOne({Name: name});
        if(!anime) return res.status(404).send("Anime não encontrado.");
        const favoritos = await dataBase.collection("favorites").findOne({Anime: name});
        if(!favoritos) return res.status(404).send("Anime não encontrado");


        await dataBase.collection("favorites").deleteOne({userId: user.userId, Anime: name});
        return res.status(202).send("Anime removido dos favoritos.");

    } catch (error) {
        return res.status(500).send(error);
    }
}

export {signIn, createMember, updateMember, favoritar, favoritesList, desfavoritar, logOut, unsubscribe}