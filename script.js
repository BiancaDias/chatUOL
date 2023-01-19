let nome;
let usuario;
let chat;
entrada();
//se o status responder = a 400 é pq ja tem um usuario com esse nome e deve pedir um novo
//se responder = a 200 deu certo
function entrada(){    
    nome = prompt("Digite seu lindo nome");
    usuario = {name:`${nome}`};
    const requisicao = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants',usuario)
    console.log(requisicao);
    requisicao.then(sucesso);
    requisicao.catch(trataErro);
}

function sucesso(resposta){
    console.log("usuario fez loguin");
    setInterval(manterLogado, 3000);  
}

function trataErro(erro){
    console.log("nome ja existe");
    console.log("Status code: " + erro.response.status);
	if(erro.response.status === 400){
        window.location.reload();
    }
}

function manterLogado(){
    const requisicao = axios.post('https://mock-api.driven.com.br/api/v6/uol/status',usuario);
    requisicao.then(sucessoOnline);
    requisicao.catch(erroOnline);
}

function sucessoOnline(resposta){
    console.log(resposta.status) // se responde 200, vamos atualizar as mensagens
    if(resposta.status === 200){
        carregarChat();
    }
}

function erroOnline(erro){
    console.log("Status code: " + erro.response.status);
    if(erro.response.status === 400){
        window.location.reload();
    }
}

function carregarChat(){
    chatRecebido = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages')
    chatRecebido.then(processarChat);
    chatRecebido.catch(erroCarregarChat);
}

function processarChat(carregarMensagens){
    console.log(carregarMensagens.data);
    chat = carregarMensagens.data;
    exibeChat();
}

function erroCarregarChat(erro){
    console.log("Status code: " + erro.response.status);
}

function exibeChat(){
    const conversas = document.querySelector('.chat');
    conversas.innerHTML = '';
    let template = "";
    for(let i=0; i< chat.length; i++){
        if(chat[i].type == "status"){
            template =`
            <!--entrada//saida na sala-->
            <div class="mensagem entrou">
                <span class="hora">(${chat[i].time}) </span><span class="nome"> ${chat[i].from} </span>${chat[i].text}
            </div>`
        }
        if(chat[i].type == "message"){
            template =`
            <div class="mensagem">
                <span class="hora">(${chat[i].time}) </span><span class="nome"> ${chat[i].from} </span> para <span class="nome"> ${chat[i].to} </span>${chat[i].text}
            </div>`
        }
        if(chat[i].type == "private_message"){
            if(chat[i].to === nome){
                template =`
                <div class="mensagem reservadamente">
                    <span class="hora">(${chat[i].time}) </span><span class="nome"> ${chat[i].from} </span> reservadamente para <span class="nome"> ${chat[i].to} </span>${chat[i].text}
                </div>`
            }
        }
        conversas.innerHTML = conversas.innerHTML + template;
        
    }
}

function enviaMensagens(){
    let msg = document.querySelector("input").value;
    const novaMsg = {
        from:`${nome}`,
        to:`Todos`,
        text:`${msg}`,
        type:`message`
    }

    document.querySelector("input").value = "";

    const envio = axios.post('https://mock-api.driven.com.br/api/v6/uol/messages', novaMsg);
    envio.then(sucessoEnvio);
    envio.catch(erroEnvio);
}

function sucessoEnvio(certim){
    console.log(certim);
    carregarChat();
}

function erroEnvio(erro){
    console.log("Status code: " + erro.response.status);
}

