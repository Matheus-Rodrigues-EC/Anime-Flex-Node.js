import dataBase from "../dataBase.js";
import bcrypt from 'bcrypt';
import { v4 as uuid } from "uuid";

const loginAdmin = async (req, res) => {
    const {adminName, adminPassword} = req.body;

    try{
        const admin = await dataBase.collection("admins").findOne({adminName: adminName});
        if(!admin) return res.status(404).send("Administrador não encontrado");
        if(admin && bcrypt.compareSync(adminPassword, admin.adminPassword)){
            const token = uuid();
            await dataBase.collection("adminsessions").insertOne({adminId: admin._id,token});
            return res.status(200).send({token: token});
        }else{
            return res.status(401).send("Administrador e/ou senha incorretos");
        }
    }catch(error){
        console.log(error)
        return res.status(500).send(error);
    }
}

const addAdmin = async (req, res) => {
    const auth = req.headers.authorization;
    if(!auth) return res.status(422).send("Não autorizado.");
    const token = auth.replace('Baerer ', '');
    try {
        const verify = await dataBase.collection("adminsessions").findOne({token: token});
        if(!verify) return res.status(401).send("Você não tem permissão de administrador");
    } catch (error) {
        return res.status(500).send(error);
    }

    const {adminName, adminPassword} = req.body;
    const hashPass = bcrypt.hashSync(adminPassword, 5);
    try{
        const admin = await dataBase.collection("admins").findOne({adminName: adminName});
        if(admin) return res.status(409).send("Administrador já cadastrado");
        const result = await dataBase.collection("admins").insertOne({adminName: adminName, adminPassword: hashPass});
        return res.status(201).send("Novo administrador cadastrado");
    }catch(error){
        console.log(error)
        return res.status(500).send(error);
    }
}

const removeAdmin = async (req, res) => {
    const auth = req.headers.authorization;
    if(!auth) return res.status(422).send("Não autorizado.");
    const token = auth.replace('Baerer ', '');
    const { adminName } = req.body;
    try {
        const admin = await dataBase.collection("adminsessions").findOne({token});
        if(!admin) return res.status(401).send("Não autorizado");
        const verify = await dataBase.collection("admins").findOne({adminName});
        if(!verify) return res.status(404).send("Administrador não encontrado");
    } catch (error) {
        return res.status(500).send(error);
    }
    
    try {
        await dataBase.collection("admins").deleteOne({adminName});
        return res.status(202).send("Administrador deletado");
    } catch (error) {
        return res.status(500).send(error);
    }
}

const banMember = async (req, res) => {
    const auth = req.headers.authorization;
    if(!auth) return res.status(422).send("Não autorizado.");

    const token = auth.replace('Baerer ', '');
    const { name } = req.body;

    try {
        const admin = await dataBase.collection("adminsessions").findOne({token});
        if(!admin) return res.status(401).send("Você não tem permissões de administrador");
        const user = await dataBase.collection("members").findOne({name});
        if(!user) return res.status(404).send("Usuário não encontrado");
    } catch (error) {
        return res.status(500).send(error);
    }

    try {
        await dataBase.collection("members").deleteOne({name});
        return res.status(202).send("Usuário deletado");
    } catch (error) {
        return res.status(500).send(error);
    }

}

export { addAdmin, loginAdmin, removeAdmin, banMember }