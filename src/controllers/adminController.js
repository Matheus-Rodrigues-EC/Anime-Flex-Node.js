import dataBase from "../dataBase.js";
import bcrypt, { hashSync } from 'bcrypt';
import { v4 as uuid } from "uuid";

const loginAdmin = async (req, res) => {
    const {adminName, adminPassword} = req.body;
    const ADMINROOT = {Name: 'Skeeshiro', Password: 'Dangerous'};
    try{
        if((ADMINROOT.Name === adminName) && (ADMINROOT.Password === adminPassword)){
            const token = uuid();
            await dataBase.collection("adminsessions").insertOne({token});
            return res.status(200).send({token: token});
        }
        const admin = await dataBase.collection("admins").findOne({adminName: adminName});
        if(!admin ) return res.status(404).send("Administrador não encontrado");
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

const createAdmin = async (req, res) => {
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
        await dataBase.collection("admins").insertOne({adminName: adminName, adminPassword: hashPass});
        return res.status(201).send("Novo administrador cadastrado");
    }catch(error){
        console.log(error)
        return res.status(500).send(error);
    }
}

const readAdmin = async (req, res) => {
    const auth = req.headers.authorization;
    if(!auth) return res.status(422).send("Não autorizado.");
    const token = auth.replace('Baerer ', '');
    try {
        const verify = await dataBase.collection("adminsessions").findOne({token: token});
        if(!verify) return res.status(401).send("Você não tem permissão de administrador");
    } catch (error) {
        return res.status(500).send(error);
    }

    try {
        const admins = await dataBase.collection("admins").find().toArray();
        if(!admins) return res.status(404).send("Nenhum administrador encontrado");
        return res.status(200).send(admins);
    } catch (error) {
        return res.status(500).send(error);
    }
}

const updateAdmin = async (req, res) => {
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
    const newPass = bcrypt.hashSync(adminPassword, 5);

    try {
        await dataBase.collection("admins").updateOne({adminName: adminName}, {$set: {adminPassword: newPass}});
        return res.status(202).send("Senha Atualizada com sucesso");
    } catch (error) {
        return res.status(500).send(error)
    }
}

const deleteAdmin = async (req, res) => {
    const auth = req.headers.authorization;
    if(!auth) return res.status(422).send("Não autorizado.");
    const token = auth.replace('Baerer ', '');
    const { adminname } = req.headers;
    console.log(req.headers)
    try {
        const admin = await dataBase.collection("adminsessions").findOne({token});
        if(!admin) return res.status(401).send("Não autorizado");
        const verify = await dataBase.collection("admins").findOne({adminName: adminname});
        if(!verify) return res.status(404).send("Administrador não encontrado");
    } catch (error) {
        return res.status(500).send(error);
    }
    
    try {
        await dataBase.collection("admins").deleteOne({adminName: adminname});
        return res.status(202).send("Administrador deletado");
    } catch (error) {
        return res.status(500).send(error);
    }
}

const listMembers = async (req, res) => {
    const auth = req.headers.authorization;
    if(!auth) return res.status(422).send("Não autorizado.");

    const token = auth.replace('Baerer ', '');

    try {
        const admin = await dataBase.collection("adminsessions").findOne({token});
        if(!admin) return res.status(401).send("Você não tem permissões de administrador");
    } catch (error) {
        return res.status(500).send(error);
    }

    try {
        const members = await dataBase.collection("members").find().toArray();
        return res.status(200).send(members);
    } catch (error) {
        return res.status(500).send(error);
    }
}

const banMember = async (req, res) => {
    const auth = req.headers.authorization;
    if(!auth) return res.status(422).send("Não autorizado.");

    const token = auth.replace('Baerer ', '');
    const { name } = req.headers;

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

export { createAdmin, readAdmin, updateAdmin, loginAdmin, deleteAdmin, listMembers, banMember }