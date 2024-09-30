// Chave da API da RAWG para acessar os dados dos jogos
const apiKey = '455f61d9afdc4a71b37d81f8921e7229';

// Variável que armazenará o jogo correto
let correctGame;

// Array para armazenar as opções de jogos (incluindo o correto e opções erradas)
let options = [];

// Função que faz a requisição à API e configura o jogo para o usuário adivinhar
function adivinharGames() {
    // Faz uma requisição GET à API de jogos, buscando uma lista de 100 jogos
    fetch(`https://api.rawg.io/api/games?key=${apiKey}&page_size=100`)
        .then(response => response.json()) // Converte a resposta para JSON
        .then(data => {
            // Seleciona um jogo aleatório da lista de resultados da API
            const idAleatorio = Math.floor(Math.random() * data.results.length);
            correctGame = data.results[idAleatorio]; // Define o jogo correto

            // Inicializa o array de opções com o jogo correto
            options = [correctGame];

            // Gera outras 3 opções aleatórias que não sejam o jogo correto
            while (options.length < 4) {
                const randomOption = data.results[Math.floor(Math.random() * data.results.length)];
                // Verifica se a opção já está na lista de opções
                if (!options.includes(randomOption)) {
                    options.push(randomOption); // Adiciona a opção aleatória
                }
            }

            // Embaralha as opções para que o jogo correto não seja sempre o primeiro
            options.sort(() => Math.random() - 0.5);

            // Chama a função que exibe a pergunta e as opções na tela
            pergunta();
        })
        .catch(error => console.error('Erro:', error)); // Exibe erros, se houver
}

// Função que exibe a pergunta e as opções de resposta
function pergunta() {
    // Exibe o texto da pergunta
    document.getElementById('pergunta').innerHTML = '<p class="pergunta">Você consegue adivinhar Qual é o jogo?</p>';
    
    // Exibe a imagem do jogo correto
    document.getElementById('jogo_img').src = correctGame.background_image;
    document.getElementById('jogo_img').style.display = 'block'; // Mostra a imagem (caso estivesse oculta)

    // Limpa o conteúdo da div que vai conter as opções de resposta
    const optionsDiv = document.getElementById('options');
    optionsDiv.innerHTML = '';

    // Para cada opção, cria um botão e o adiciona à div de opções
    options.forEach(option => {
        const button = document.createElement('button'); // Cria um botão
        button.classList.add('opcoes_botao'); // Adiciona a classe para estilização
        button.innerText = option.name; // Define o nome do jogo como texto do botão
        button.onclick = () => checkAnswer(option); // Define a função que será chamada ao clicar no botão
        optionsDiv.appendChild(button); // Adiciona o botão à div de opções
    });
}

// Função que verifica se a resposta selecionada está correta
function checkAnswer(selected) {
    // Seleciona as divs para exibir a resposta e a imagem de "correto/errado"
    const resultDiv = document.getElementById('result');
    const img_correto = document.getElementById('correto_img');

    // Verifica se o jogo selecionado é o correto
    if (selected.id === correctGame.id) {
        // Exibe uma imagem de "acerto" e mensagem de sucesso
        img_correto.innerHTML = '<img src="./img/799b3fa3d4db853598a1628bff507655.gif" alt="">';
        resultDiv.innerHTML = '<p class="correto">Acertou Miseravi!</p>';
    } else {
        // Exibe uma imagem de "erro" e mensagem informando qual era o jogo correto
        img_correto.innerHTML = '<img src="./img/R.gif" alt="">';
        resultDiv.innerHTML = `<p class="errado">Eroooou! O jogo era: ${correctGame.name}</p>`;
    }

    // Exibe o botão para ir para o próximo jogo
    document.getElementById('proximo_jogo').style.display = 'block';
}

// Função chamada ao clicar no botão "Próximo Jogo"
document.getElementById('proximo_jogo').onclick = () => {
    // Limpa o conteúdo das divs, mas mantém as divs no DOM
    const resultDiv = document.getElementById('result');
    const img_correto = document.getElementById('correto_img');

    resultDiv.innerHTML = '';  // Limpa o conteúdo da div 'result'
    img_correto.innerHTML = '';  // Limpa o conteúdo da div 'correto_img'

    // Esconde o botão "Próximo Jogo" para que ele só apareça quando necessário
    document.getElementById('proximo_jogo').style.display = 'none';

    // Chama a função para iniciar um novo jogo
    adivinharGames();
};

// Inicia o jogo quando a página carrega
adivinharGames();
