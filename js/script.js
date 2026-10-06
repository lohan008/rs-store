let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];


// ADICIONAR PRODUTO

function adicionarCarrinho(nome, preco, imagem) {

    let produto = carrinho.find(item => item.nome === nome);

    if (produto) {

        produto.quantidade++;

    } else {

        carrinho.push({
            nome: nome,
            preco: preco,
            imagem: imagem,
            quantidade: 1
        });

    }

    salvarCarrinho();

    alert("Produto adicionado ao carrinho!");

}


// SALVAR CARRINHO

function salvarCarrinho() {

    localStorage.setItem(
        "carrinho",
        JSON.stringify(carrinho)
    );

}


// MOSTRAR CARRINHO

function mostrarCarrinho() {

    const lista = document.getElementById("listaCarrinho");

    const totalElemento = document.getElementById("totalCarrinho");


    // Se não estiver na página do carrinho, não faz nada

    if (!lista) {
        return;
    }


    lista.innerHTML = "";

    let total = 0;


    // CARRINHO VAZIO

    if (carrinho.length === 0) {

        lista.innerHTML = `
            <p class="carrinho-vazio">
                Seu carrinho está vazio.
            </p>
        `;

        totalElemento.textContent = "0,00";

        return;
    }


    // PRODUTOS

    carrinho.forEach((produto, index) => {

        let subtotal =
            produto.preco * produto.quantidade;

        total += subtotal;


        lista.innerHTML += `

            <div class="item-carrinho">

                <img
                    src="${produto.imagem}"
                    alt="${produto.nome}"
                >

                <div class="info-carrinho">

                    <h3>
                        ${produto.nome}
                    </h3>

                    <p>
                        R$ ${produto.preco
                            .toFixed(2)
                            .replace(".", ",")}
                    </p>


                    <div class="quantidade">

                        <button
                            onclick="diminuirQuantidade(${index})"
                        >
                            -
                        </button>


                        <span>
                            ${produto.quantidade}
                        </span>


                        <button
                            onclick="aumentarQuantidade(${index})"
                        >
                            +
                        </button>

                    </div>


                    <button
                        class="remover"
                        onclick="removerProduto(${index})"
                    >
                        Remover
                    </button>

                </div>

            </div>

        `;

    });


    totalElemento.textContent =
        total.toFixed(2).replace(".", ",");

}


// AUMENTAR

function aumentarQuantidade(index) {

    carrinho[index].quantidade++;

    salvarCarrinho();

    mostrarCarrinho();

}


// DIMINUIR

function diminuirQuantidade(index) {

    if (carrinho[index].quantidade > 1) {

        carrinho[index].quantidade--;

    } else {

        carrinho.splice(index, 1);

    }

    salvarCarrinho();

    mostrarCarrinho();

}


// REMOVER

function removerProduto(index) {

    carrinho.splice(index, 1);

    salvarCarrinho();

    mostrarCarrinho();

}


// FINALIZAR
function finalizarCompra() {

    if (carrinho.length === 0) {

        alert("Seu carrinho está vazio!");

        return;
    }

    window.location.href = "pagamento.html";

}


// EXECUTAR

mostrarCarrinho();
// FINALIZAR PAGAMENTO

const formPagamento = document.getElementById("formPagamento");

if (formPagamento) {

    formPagamento.addEventListener("submit", function(event) {

        event.preventDefault();

        localStorage.removeItem("carrinho");

        document.getElementById("mensagemCompra").innerHTML = `
            <h2>Compra finalizada!</h2>
            <p>Obrigado pela sua compra na RS Store.</p>
            <a href="index.html">Voltar para a loja</a>
        `;

        formPagamento.style.display = "none";

    });

}
// =============================
// FILTRO DE CATEGORIAS
// =============================

function filtrarCategoria(categoria, event) {

    event.preventDefault();

    const produtos = document.querySelectorAll(".produto");

    const titulo = document.getElementById("tituloProdutos");

    produtos.forEach(function(produto) {

        if (produto.dataset.categoria === categoria) {

            produto.style.display = "block";

        } else {

            produto.style.display = "none";

        }

    });


    const nomesCategorias = {
        camiseta: "Camisetas",
        calca: "Calças",
        moletom: "Moletons",
        short: "Shorts",
        bone: "Bonés"
    };

    titulo.textContent =
        nomesCategorias[categoria];


    document
        .querySelector(".destaques")
        .scrollIntoView({
            behavior: "smooth"
        });
}


// MOSTRAR TODOS OS PRODUTOS

function mostrarTodos(event) {

    event.preventDefault();

    const produtos = document.querySelectorAll(".produto");

    produtos.forEach(function(produto) {

        produto.style.display = "block";

    });

    document.getElementById("tituloProdutos").textContent =
        "Produtos em destaque";


    document
        .querySelector(".destaques")
        .scrollIntoView({
            behavior: "smooth"
        });
}
// =============================
// FORMULÁRIO DE CONTATO
// =============================

const formContato =
    document.getElementById("formContato");

if (formContato) {

    formContato.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();

            const nome =
                document.getElementById("nomeContato").value;

            formContato.style.display = "none";

            document.getElementById(
                "mensagemContatoEnviada"
            ).innerHTML = `
                <h3>Mensagem enviada!</h3>

                <p>
                    Obrigado, ${nome}!
                    Recebemos sua mensagem.
                </p>

                <p>
                    Em breve entraremos em contato.
                </p>
            `;

        }
    );

}