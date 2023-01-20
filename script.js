let nome;
let usuario;
let chat;
entrada();
//se o status responder = a 400 é pq ja tem um usuario com esse nome e deve pedir um novo
//se responder = a 200 deu certo
function entrada(){  
    nome = "";
    while(nome === undefined || nome=== null || nome === ""){  
        nome = prompt("Digite seu nome");
    }
    usuario = {name:nome };
 
    const requisicao = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants',usuario)
    requisicao.then(sucesso);
    requisicao.catch(trataErro);
}

function sucesso(resposta){
    console.log("usuario fez loguin");
    carregarChat();
    setInterval(manterLogado, 5000); 
    setInterval(carregarChat, 3000); 
}

function trataErro(erro){
    console.log("nome ja existe");
    console.log("Status code: " + erro.response.status);
	if(erro.response.status === 400){
        alert("Nome de usuário inválido! Por favor, digite outro");
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
    chat = carregarMensagens.data;
    exibeChat();
}

function erroCarregarChat(erro){
    console.log("Status code: " + erro.response.status);
    window.location.reload();
}

function exibeChat(){
    const conversas = document.querySelector('.chat');
    conversas.innerHTML = '';
    let template = "";
    for(let i=0; i< chat.length; i++){
        if(chat[i].type === "status"){
            template =`
            <!--entrada//saida na sala-->
            <div data-test="message" class="mensagem entrou">
                <span class="hora">(${chat[i].time}) </span><span class="nome"> ${chat[i].from} </span>${chat[i].text}
            </div>`
        }
        if(chat[i].type === "message"){
            template =`
            <div data-test="message" class="mensagem">
                <span class="hora">(${chat[i].time}) </span><span class="nome"> ${chat[i].from} </span> para <span class="nome"> ${chat[i].to}: </span>${chat[i].text}
            </div>`
        }
        if(chat[i].type === "private_message" && (chat[i].to === nome || chat[i].from === nome)){
           
                template =`
                <div data-test="message" class="mensagem reservadamente">
                    <span class="hora">(${chat[i].time}) </span><span class="nome"> ${chat[i].from} </span> reservadamente para <span class="nome"> ${chat[i].to}: </span>${chat[i].text}
                    </div>`
        
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
    carregarChat();
}

function erroEnvio(erro){
    console.log("Status code: " + erro.response.status);
    window.location.reload();
}

