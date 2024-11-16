const mongoose = require('mongoose');
const { ObjectId } = require("mongodb")

// Conexão com o MongoDB
mongoose.connect('mongodb://localhost:27017/esportistas').then(() => {
    console.log('Conectado ao MongoDB!');
}).catch((err) => {
    console.error('Erro ao conectar ao MongoDB:', err);
});

const esportistasSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    idade: { type: Number, required: true },
    sexo: { type: String, required: true },
    cidade: { type: ObjectId, ref: "Cidades" },
    esporte: [{ type: ObjectId, ref: "Esportes" }]
});

const cidadesSchema = new mongoose.Schema({
    cidade: { type: String, required: true },
});

const esportesSchema = new mongoose.Schema({
    esportes: { type: String, required: true }
});

const Cidades = mongoose.model("Cidades", cidadesSchema);
const Esportes = mongoose.model("Esportes", esportesSchema);
const Esportistas = mongoose.model("Esportistas", esportistasSchema);

const criarEsporte = async (nome) => {
    try {
        const novoEsporte = new Esportes({ esportes: nome });
        const resultado = await novoEsporte.save();
        console.log(resultado);
        if(resultado){
            return true;
        }
        else{
            return false;
        }
    } catch (err) {
        console.log(err);
    }

};

const criarCidade = async (cidade) => {
    try {
        const novaCidade = new Cidades({ cidade: cidade });
        const resultado = await novaCidade.save();
        console.log(resultado);
        if(resultado){
            return true;
        }
        else{
            return false;
        }
    } catch (err) {
        console.error(err);
    }
}

const criarEsportista = async (nome, idade, sexo, cidade, esportes) => {
    try {
        const idCidade = await buscarIdCidade(cidade);
        const novosEsportes = [];
        for (let i = 0; i < esportes.length; i++) {
            const element = esportes[i];
            const idEsporte = await buscarIdEsporte(element);
            novosEsportes.push(idEsporte._id);
        }
        const novoEsportista = new Esportistas({ nome: nome, idade: idade, sexo: sexo, cidade: idCidade._id, esporte: novosEsportes });
        const resultado = await novoEsportista.save();
        console.log(resultado);
        if (resultado){
            return true;
        }
        else {
            return false;
        }
    } catch (err) {
        console.error(err);
    }
}

const buscarIdCidade = async (nome) => {
    try {
        const cidade = await Cidades.findOne({ cidade: nome });
        if (cidade) {
            return cidade._id;
        }
        else {
            console.log(`Cidade ${cidade} não encontrada.`);
            return false;
        }
    } catch (err) {
        console.error("Erro ao buscar cidade", err);
    }
};

const buscarIdEsporte = async (nome) => {
    try {
        const esporte = await Esportes.findOne({ esportes: nome });
        if (esporte) {
            return esporte._id;
        }
        else {
            console.log(`Esporte ${esporte} não encontrado.`);
            return false;
        }
    } catch (err) {
        console.error("Erro ao buscar esporte", err);
    }
};

const buscarEsportistas = async (nome) => {
    try {
        const esportistas = await Esportistas.find({ nome: nome }).populate("esporte").populate("cidade");
        if (esportistas) {

            console.log(JSON.stringify(esportistas, null, 2));
            return esportistas;
        }
        else {
            console.log(`Esportista ${esportistas} não encontrado.`);
            return false;
        }
    } catch (err) {
        console.error("Erro ao buscar esportista", err);
    }
};

const buscarTodosEsportistas = async () => {
    try {
        const todosEsportistas = await Esportistas.find();
        if (todosEsportistas) {
            console.log(todosEsportistas);
            return todosEsportistas;
        }
        else {
            console.log("Nenhum esportista foi encontrado")
            return false;
        }
    } catch (err) {
        console.error("Erro ao buscar todos os esportistas", err);
    }
};

const buscarTodasCidades = async () => {
    try {
        const todasCidades = await Cidades.find();
        if (todasCidades) {
            console.log(todasCidades);
            return todasCidades;
        }
        else {
            console.log("Nenhuma cidade foi encontrada");
            return false;
        }
    } catch (err) {
        console.error("Erro ao buscar todas as cidades", err);
    }
};

const buscarTodosEsportes = async () => {
    try {
        const todosEsportes = await Esportes.find();
        if (todosEsportes) {
            console.log(todosEsportes);
            return todosEsportes;
        }
        else {
            console.log("Nenhum esporte foi encontrado")
            return false;
        }
    } catch (err) {
        console.error("Erro ao buscar todos os esportes", err);
    }
};

const buscarEsportistaPorID = async (id) => {
    try {
        const esportista = await Esportistas.findById(id).populate("cidade").populate("esporte");

        if (esportista) {
            console.log(esportista);
            return esportista;
        }
        else {
            console.log(`Esportista ${esportista} não encontrado`);
            return false;
        }
    } catch (err) {
        console.error(err)
    }
};

const excluirEsportista = async (id) => {
    try {
        const excluirEsportista = await Esportistas.findByIdAndDelete(id);

        if (excluirEsportista) {
            console.log("Esportista excluído com sucesso!");
            return true;
        }
        else {
            console.log("Esportista não encontrado");
            return false;
        }
    } catch (err) {
        console.error("Erro ao excluir esportista", err);
    }
};

const excluirCidade = async (id) => {
    try {
        const excluirCidade = await Cidades.findByIdAndDelete(id);

        if (excluirCidade) {
            console.log("Cidade excluída com sucesso!")
            return true;
        }
        else {
            console.log("Cidade não encontrada")
            return false;
        }
    } catch (err) {
        console.error("Erro ao excluir cidade", err);
    }
};

const excluirEsporte = async (id) => {
    try {
        const excluirEsporte = await Esportes.findByIdAndDelete(id);

        if (excluirEsporte) {
            console.log("Esporte excluído com sucesso!")
            return true;
        }
        else {
            console.log("Esporte não encontrado")
            return false;
        }
    } catch (err) {
        console.error("Erro ao excluir esporte", err);
    }
};

const editarEsportista = async (id, nome, idade, sexo, cidade, esportes) => {
    try {
        const esportista = await Esportistas.findById(id);
        if (esportista) {
            esportista.nome = nome;
            esportista.idade = idade;
            esportista.sexo = sexo;
            const cidadeId = await buscarIdCidade(cidade);
            for (let i = 0; i < esportes.length; i++) {

                const esporte = esportes[i];
                const IdEsporte = buscarIdEsporte(esporte);
                esportista.esporte[i] = IdEsporte;
            }
            esportista.cidade = cidadeId;

            await esportista.save();
            console.log("Esportista editado com sucesso!", esportista);
            return true;
        }
        else {
            console.log("Esportista não encontrado");
            return false;
        }
    } catch (err) {
        console.error("Erro ao editar esportista", err);
    }
};

const editarCidade = async (id, novaCidade) => {
    try {
        const cidade = await Cidades.findById(id);
        if (cidade) {
            cidade.cidade = novaCidade;
            await cidade.save();
            console.log("Cidade editada com sucesso!", cidade);
            return true;
        }
        else {
            console.log("Cidade não encontrada");
            return false;
        }
    } catch (err) {
        console.error("Erro ao editar a cidade", err);
    }
};

const editarEsporte = async (id, novoEsporte) => {
    try {
        const esporte = await Esportes.findById(id);
        if (esporte) {
            esporte.esportes = novoEsporte;
            await esporte.save();
            console.log("Esporte editado com sucesso!");
            return true;
        }
        else {
            console.log("Esporte não encontrado");
            return false;
        }
    } catch (err) {
        console.error("Erro ao editar o esporte", err);
    }
};

const buscarPorCidade = async (cidadeNome) => {

    try {
        const cidade = await Cidades.findOne({ cidade: cidadeNome });

        if (cidade) {
            const todosEsportistas = await Esportistas.find({ cidade: cidade._id });
            console.log(todosEsportistas);
            return todosEsportistas;
        }
        else {
            console.log(`Cidade ${cidadeNome} não encontrada`)
            return false;
        }


    } catch (err) {
        console.error("Erro ao buscar por cidade", err);
    }
};

const buscarPorEsporte = async (esporteNome) => {
    try {
        const esporte = await Esportes.findOne({ esportes: esporteNome});

        if(esporte) {
            const todosEsportistas = await Esportistas.find({ esporte: esporte._id});
            console.log(todosEsportistas);
            return todosEsportistas;
        }
        else {
            console.log(`Esporte ${esporteNome} não encontrado`)
            return false;
        }
    } catch (error) {
        console.error("Erro ao buscar por esporte", err);
    }
};


const ordenarEsportistas = async (campo, ordem = 'asc') => {
    try {
        const direcao = ordem === 'asc' ? 1 : -1; // 1 para ascendente, -1 para descendente
        const esportistasOrdenados = await Esportistas.find().sort({ [campo]: direcao }).populate("cidade").populate("esporte");
        
        console.log(`Esportistas ordenados por ${campo} (${ordem}):`);
        console.log(esportistasOrdenados);
        
        return esportistasOrdenados;
    } catch (err) {
        console.error(`Erro ao ordenar esportistas por ${campo} (${ordem}):`, err);
    }
};

/* ordenarEsportistas("cidade", "desc"); */

const express = require('express');
const app = express();

app.get("/esportistas", async (req, res) => {
    try {
        // Busca todos os esportistas no banco de dados e popula as referências de esporte e cidade
        const esportistas = await Esportistas.find().populate("esporte").populate("cidade");

        // Se não encontrar nenhum esportista
        if (esportistas.length === 0) {
            return res.status(404).json({ mensagem: "Nenhum esportista encontrado." });
        }

        // Retorna os esportistas encontrados
        res.status(200).json(esportistas);
    } catch (err) {
        console.error("Erro ao buscar os esportistas:", err);
        res.status(500).json({ mensagem: "Erro interno no servidor!" });
    }
});


app.put("esportistas/:id", async (req, res) => {

    try {
        const esportistaId = req.params.id;
        const dadosAtualizados = req.body;

        const esportistaEditado = await editarEsportista(
            esportistaId,
            dadosAtualizados.nome,
            dadosAtualizados.idade,
            dadosAtualizados.sexo,
            dadosAtualizados.cidade,
            dadosAtualizados.esportes
        );
        if (esportistaEditado){
            res.status(200).json({ mensagem: "Esportista atualizado com sucesso!"});
        }
        else{
            res.status(404).json({ mensagem: "Esportista não encontrado!" });
        }
        
    } catch (err) {
        console.error("Erro ao editar esportista:", err);
        res.status(500).json({ mensagem: "Erro interno no servidor!"});
    }
});

app.post("/esportistas", async (req, res) => {
    try {
        const { nome, idade, sexo, cidade, esportes } = req.body;

        // Verifica se todos os campos necessários foram passados
        if (!nome || !idade || !sexo || !cidade || !esportes) {
            return res.status(400).json({ mensagem: "Todos os campos são obrigatórios." });
        }

        // Chama a função de criação do esportista
        const esportistaCriado = await criarEsportista(nome, idade, sexo, cidade, esportes);

        // Responde com sucesso
        res.status(201).json({ mensagem: "Esportista criado com sucesso!"});
    } catch (err) {
        console.error("Erro ao criar esportista:", err);
        res.status(500).json({ mensagem: "Erro interno no servidor!" });
    }
});

app.get("/esportistas/:id", async (req, res) => {
    try {
        const { id } = req.params;  // Captura o ID da URL

        // Procura o esportista no banco de dados pelo ID
        const esportista = await Esportistas.findById(id).populate('cidade').populate('esporte');

        // Verifica se o esportista existe
        if (!esportista) {
            return res.status(404).json({ mensagem: "Esportista não encontrado." });
        }

        // Retorna o esportista encontrado
        res.status(200).json(esportista);
    } catch (err) {
        console.error("Erro ao buscar esportista:", err);
        res.status(500).json({ mensagem: "Erro interno no servidor!" });
    }
});

app.delete("/esportistas/:id", async (req, res) => {
    try {
        const { id } = req.params;  // Captura o ID da URL

        // Deleta o esportista do banco de dados pelo ID
        const esportista = await Esportistas.findByIdAndDelete(id);

        // Verifica se o esportista foi encontrado e excluído
        if (!esportista) {
            return res.status(404).json({ mensagem: "Esportista não encontrado." });
        }

        // Retorna uma resposta de sucesso
        res.status(200).json({ mensagem: "Esportista excluído com sucesso!" });
    } catch (err) {
        console.error("Erro ao excluir esportista:", err);
        res.status(500).json({ mensagem: "Erro interno no servidor!" });
    }
});

app.get("/esportes", async (req, res) => {
    try {
        // Busca todos os esportes no banco de dados
        const esportes = await Esportes.find();

        // Verifica se há esportes no banco
        if (esportes.length === 0) {
            return res.status(404).json({ mensagem: "Nenhum esporte encontrado." });
        }

        // Retorna os esportes encontrados com um status 200 (OK)
        res.status(200).json(esportes);
    } catch (err) {
        console.error("Erro ao buscar os esportes:", err);
        res.status(500).json({ mensagem: "Erro interno no servidor!" });
    }
});

app.get("/cidades", async (req, res) => {
    try {
        // Busca todas as cidades no banco de dados
        const cidades = await Cidades.find();

        // Se não encontrar nenhuma cidade
        if (cidades.length === 0) {
            return res.status(404).json({ mensagem: "Nenhuma cidade encontrada." });
        }

        // Retorna as cidades encontradas
        res.status(200).json(cidades);
    } catch (err) {
        console.error("Erro ao buscar as cidades:", err);
        res.status(500).json({ mensagem: "Erro interno no servidor!" });
    }
});








