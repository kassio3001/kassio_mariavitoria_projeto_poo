document.addEventListener('DOMContentLoaded', () => {
    carregarProdutos();
});

document.getElementById('formulario-produto').addEventListener('submit', function(event) {
    event.preventDefault();

    const nomeProduto = document.getElementById('nome-produto').value;
    const imagemProduto = document.getElementById('imagem-produto').value;

    if (nomeProduto && imagemProduto) {
        const idProdutoEditado = this.dataset.editingId;
        if (idProdutoEditado) {
            editarProduto({ id: parseInt(idProdutoEditado), nome: nomeProduto, imagem: imagemProduto });
        } else {
            adicionarProduto({ nome: nomeProduto, imagem: imagemProduto });
        }
        document.getElementById('nome-produto').value = '';
        document.getElementById('imagem-produto').value = '';
        delete this.dataset.editingId;
    }
});

// Função para adicionar produto ao Site
function adicionarProduto(produto) {
    const produtos = obterProdutos();
    produto.id = produtos.length ? produtos[produtos.length - 1].id + 1 : 1;
    produtos.push(produto);
    salvarProdutos(produtos);
    carregarProdutos();
}

//Função para editar os produtos que já foram adicionados ao Site
function editarProduto(produtoEditado) {
    let produtos = obterProdutos();
    produtos = produtos.map(produto => produto.id === produtoEditado.id ? produtoEditado : produto);
    salvarProdutos(produtos);
    carregarProdutos();
}

function obterProdutos() {
    return JSON.parse(localStorage.getItem('produtos') || '[]');
}


//LocalStorage (armazena as informações dos produtos para que não somem ao reiniciar o Site)
function salvarProdutos(produtos) {
    localStorage.setItem('produtos', JSON.stringify(produtos));
}

function carregarProdutos() {
    const produtos = obterProdutos();
    const containerProdutos = document.getElementById('container-produtos');
    containerProdutos.innerHTML = '';

    produtos.forEach(produto => {
        const produtoDiv = document.createElement('div');
        produtoDiv.className = 'produto';
        produtoDiv.innerHTML = `
            <img src="${produto.imagem}" alt="${produto.nome}">
            <p>${produto.nome}</p>
            <button class="edit-btn" onclick="prepararEdicaoProduto(${produto.id})">Editar</button>
            <button class="delete-btn" onclick="removerProduto(${produto.id})">Excluir</button>
        `;
        containerProdutos.appendChild(produtoDiv);
    });
}

//Função para remover algum produto do painel
function removerProduto(id) {
    let produtos = obterProdutos();
    produtos = produtos.filter(produto => produto.id !== id);
    salvarProdutos(produtos);
    carregarProdutos();
}

function prepararEdicaoProduto(id) {
    const produtos = obterProdutos();
    const produto = produtos.find(produto => produto.id === id);
    document.getElementById('nome-produto').value = produto.nome;
    document.getElementById('imagem-produto').value = produto.imagem;
    document.getElementById('formulario-produto').dataset.editingId = id;
}

function alternarBarraLateral() {
    const barraLateral = document.getElementById('barraLateral');
    barraLateral.style.width = barraLateral.style.width === '0px' ? '250px' : '0px';
    document.getElementById('principal').style.marginLeft = barraLateral.style.width === '0px' ? '0px' : '250px';
}
