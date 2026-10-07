let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];


// ========================================
// ADICIONAR PRODUTO
// ========================================

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


// ========================================
// SALVAR CARRINHO
// ========================================

function salvarCarrinho() {

    localStorage.setItem(
        "carrinho",
        JSON.stringify(carrinho)
    );

}


// ========================================
// MOSTRAR CARRINHO
// ========================================

function mostrarCarrinho() {

    const lista =
        document.getElementById("listaCarrinho");

    const totalElemento =
        document.getElementById("totalCarrinho");


    // Se não estiver na página do carrinho
    if (!lista) {
        return;
    }


    lista.innerHTML = "";

    let subtotal = 0;


    // ========================================
    // CARRINHO VAZIO
    // ========================================

    if (carrinho.length === 0) {

        lista.innerHTML = `
            <p class="carrinho-vazio">
                Seu carrinho está vazio.
            </p>
        `;

        if (totalElemento) {
            totalElemento.textContent = "0,00";
        }

        const subtotalElemento =
            document.getElementById("subtotalCarrinho");

        if (subtotalElemento) {
            subtotalElemento.textContent = "0,00";
        }

        const descontoElemento =
            document.getElementById("descontoCarrinho");

        if (descontoElemento) {
            descontoElemento.textContent = "0,00";
        }

        return;
    }


    // ========================================
    // PRODUTOS
    // ========================================

    carrinho.forEach((produto, index) => {

        let subtotalProduto =
            produto.preco * produto.quantidade;

        subtotal += subtotalProduto;


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


    // ========================================
    // CALCULAR DESCONTO DO CUPOM
    // ========================================

    let desconto =
        parseFloat(
            localStorage.getItem("descontoCupom")
        ) || 0;


    let valorDesconto =
        subtotal * (desconto / 100);


    let totalFinal =
        subtotal - valorDesconto;


    // ========================================
    // MOSTRAR SUBTOTAL
    // ========================================

    const subtotalElemento =
        document.getElementById("subtotalCarrinho");

    if (subtotalElemento) {

        subtotalElemento.textContent =
            subtotal
                .toFixed(2)
                .replace(".", ",");

    }


    // ========================================
    // MOSTRAR DESCONTO
    // ========================================

    const descontoElemento =
        document.getElementById("descontoCarrinho");

    if (descontoElemento) {

        descontoElemento.textContent =
            valorDesconto
                .toFixed(2)
                .replace(".", ",");

    }


    // ========================================
    // MOSTRAR TOTAL
    // ========================================

    if (totalElemento) {

        totalElemento.textContent =
            totalFinal
                .toFixed(2)
                .replace(".", ",");

    }

}


// ========================================
// AUMENTAR QUANTIDADE
// ========================================

function aumentarQuantidade(index) {

    carrinho[index].quantidade++;

    salvarCarrinho();

    mostrarCarrinho();

}


// ========================================
// DIMINUIR QUANTIDADE
// ========================================

function diminuirQuantidade(index) {

    if (carrinho[index].quantidade > 1) {

        carrinho[index].quantidade--;

    } else {

        carrinho.splice(index, 1);

    }

    salvarCarrinho();

    mostrarCarrinho();

}


// ========================================
// REMOVER PRODUTO
// ========================================

function removerProduto(index) {

    carrinho.splice(index, 1);

    salvarCarrinho();

    mostrarCarrinho();

}


// ========================================
// FINALIZAR COMPRA
// ========================================

function finalizarCompra() {

    if (carrinho.length === 0) {

        alert("Seu carrinho está vazio!");

        return;
    }

    window.location.href = "pagamento.html";

}


// ========================================
// EXECUTAR CARRINHO
// ========================================

mostrarCarrinho();


// ========================================
// PAGAMENTO - RESUMO DA COMPRA
// ========================================

const formPagamento =
    document.getElementById("formPagamento");


// ========================================
// ATUALIZAR RESUMO DO PAGAMENTO
// ========================================

function atualizarResumoPagamento() {

    const subtotalElemento =
        document.getElementById("subtotalPagamento");

    const descontoElemento =
        document.getElementById("descontoPagamento");

    const freteElemento =
        document.getElementById("fretePagamento");

    const totalElemento =
        document.getElementById("totalPagamento");


    // Se não estiver na página de pagamento
    if (
        !subtotalElemento ||
        !descontoElemento ||
        !freteElemento ||
        !totalElemento
    ) {

        return;

    }


    // ========================================
    // CALCULAR SUBTOTAL
    // ========================================

    let subtotal = 0;


    carrinho.forEach(function(produto) {

        subtotal +=
            produto.preco * produto.quantidade;

    });


    // ========================================
    // PEGAR DESCONTO
    // ========================================

    const percentualDesconto =
        parseFloat(
            localStorage.getItem("descontoCupom")
        ) || 0;


    const valorDesconto =
        subtotal *
        (percentualDesconto / 100);


    // ========================================
    // PEGAR FRETE
    // ========================================

    const frete =
        parseFloat(
            localStorage.getItem("freteAtual")
        ) || 0;


    // ========================================
    // CALCULAR TOTAL
    // ========================================

    const total =
        subtotal -
        valorDesconto +
        frete;


    // ========================================
    // MOSTRAR SUBTOTAL
    // ========================================

    subtotalElemento.textContent =
        subtotal
            .toFixed(2)
            .replace(".", ",");


    // ========================================
    // MOSTRAR DESCONTO
    // ========================================

    descontoElemento.textContent =
        valorDesconto
            .toFixed(2)
            .replace(".", ",");


    // ========================================
    // MOSTRAR FRETE
    // ========================================

    freteElemento.textContent =
        frete
            .toFixed(2)
            .replace(".", ",");


    // ========================================
    // MOSTRAR TOTAL
    // ========================================

    totalElemento.textContent =
        total
            .toFixed(2)
            .replace(".", ",");

}


// ========================================
// ATUALIZAR RESUMO AO ABRIR PAGAMENTO
// ========================================

atualizarResumoPagamento();


// ========================================
// FRETE POR ESTADO
// ========================================

const estadoPagamento =
    document.getElementById("estado");


// Valores de frete simulados para a loja
// com origem em Indaiatuba - SP

const fretesPorEstado = {

    SP: 14.90,

    RJ: 19.90,
    MG: 19.90,
    PR: 19.90,

    ES: 24.90,
    SC: 24.90,

    RS: 29.90,
    GO: 29.90,
    MS: 29.90,
    MT: 29.90,

    BA: 34.90,
    DF: 34.90,
    PE: 34.90,
    CE: 34.90

};


// ========================================
// PRAZO DE ENTREGA
// ========================================

const prazosPorEstado = {

    SP: {
        minimo: 3,
        maximo: 5
    },

    RJ: {
        minimo: 4,
        maximo: 6
    },

    MG: {
        minimo: 4,
        maximo: 6
    },

    PR: {
        minimo: 4,
        maximo: 6
    },

    ES: {
        minimo: 4,
        maximo: 6
    },

    SC: {
        minimo: 5,
        maximo: 7
    },

    RS: {
        minimo: 5,
        maximo: 7
    },

    GO: {
        minimo: 6,
        maximo: 9
    },

    MS: {
        minimo: 6,
        maximo: 9
    },

    MT: {
        minimo: 6,
        maximo: 9
    },

    DF: {
        minimo: 6,
        maximo: 9
    },

    BA: {
        minimo: 7,
        maximo: 10
    },

    PE: {
        minimo: 7,
        maximo: 10
    },

    CE: {
        minimo: 7,
        maximo: 10
    }

};


// ========================================
// ADICIONAR DIAS ÚTEIS
// ========================================

function adicionarDiasUteis(data, quantidade) {

    let novaData =
        new Date(data);

    let diasAdicionados = 0;


    while (diasAdicionados < quantidade) {

        novaData.setDate(
            novaData.getDate() + 1
        );


        const diaSemana =
            novaData.getDay();


        // 0 = domingo
        // 6 = sábado

        if (
            diaSemana !== 0 &&
            diaSemana !== 6
        ) {

            diasAdicionados++;

        }

    }


    return novaData;

}


// ========================================
// FORMATAR DATA
// ========================================

function formatarData(data) {

    const dia =
        String(data.getDate())
            .padStart(2, "0");

    const mes =
        String(data.getMonth() + 1)
            .padStart(2, "0");

    const ano =
        data.getFullYear();


    return `${dia}/${mes}/${ano}`;

}


// ========================================
// CALCULAR FRETE
// ========================================

function calcularFrete() {

    if (!estadoPagamento) {
        return;
    }


    const estado =
        estadoPagamento.value;


    const valorFreteElemento =
        document.getElementById("valorFrete");

    const fretePagamentoElemento =
        document.getElementById("fretePagamento");

    const prazoElemento =
        document.getElementById("prazoEntrega");


    // ========================================
    // NENHUM ESTADO SELECIONADO
    // ========================================

    if (!estado) {

        if (valorFreteElemento) {

            valorFreteElemento.textContent =
                "0,00";

        }

        if (fretePagamentoElemento) {

            fretePagamentoElemento.textContent =
                "0,00";

        }


        localStorage.setItem(
            "freteAtual",
            "0"
        );


        if (prazoElemento) {

            prazoElemento.textContent =
                "Selecione seu estado para calcular o frete.";

        }


        atualizarResumoPagamento();

        return;

    }


    // ========================================
    // PEGAR VALOR DO FRETE
    // ========================================

    const frete =
        fretesPorEstado[estado] || 39.90;


    // Salvar frete
    localStorage.setItem(
        "freteAtual",
        frete
    );


    // ========================================
    // MOSTRAR VALOR DO FRETE
    // ========================================

    if (valorFreteElemento) {

        valorFreteElemento.textContent =
            frete
                .toFixed(2)
                .replace(".", ",");

    }


    if (fretePagamentoElemento) {

        fretePagamentoElemento.textContent =
            frete
                .toFixed(2)
                .replace(".", ",");

    }


    // ========================================
    // CALCULAR PRAZO
    // ========================================

    const prazo =
        prazosPorEstado[estado] || {
            minimo: 7,
            maximo: 12
        };


    const hoje =
        new Date();


    const dataMinima =
        adicionarDiasUteis(
            hoje,
            prazo.minimo
        );


    const dataMaxima =
        adicionarDiasUteis(
            hoje,
            prazo.maximo
        );


    if (prazoElemento) {

        prazoElemento.innerHTML = `
            Entrega estimada entre
            <strong>
                ${formatarData(dataMinima)}
            </strong>
            e
            <strong>
                ${formatarData(dataMaxima)}
            </strong>.
        `;

    }


    // Atualizar resumo
    atualizarResumoPagamento();

}


// ========================================
// DETECTAR ALTERAÇÃO DO ESTADO
// ========================================

if (estadoPagamento) {

    estadoPagamento.addEventListener(
        "change",
        calcularFrete
    );

}


// ========================================
// CALCULAR FRETE AO ABRIR PAGAMENTO
// ========================================

if (estadoPagamento) {

    calcularFrete();

}


// ========================================
// FINALIZAR PAGAMENTO
// ========================================

if (formPagamento) {

    formPagamento.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            localStorage.removeItem(
                "carrinho"
            );


            localStorage.removeItem(
                "descontoCupom"
            );


            localStorage.removeItem(
                "freteAtual"
            );


            document.getElementById(
                "mensagemCompra"
            ).innerHTML = `

                <h2>
                    Compra finalizada!
                </h2>

                <p>
                    Obrigado pela sua compra na RS Store.
                </p>

                <a href="index.html">
                    Voltar para a loja
                </a>

            `;


            formPagamento.style.display =
                "none";

        }
    );

}


// ========================================
// FILTRO DE CATEGORIAS
// ========================================

function filtrarCategoria(categoria, event) {

    event.preventDefault();

    const produtos =
        document.querySelectorAll(".produto");

    const titulo =
        document.getElementById("tituloProdutos");


    produtos.forEach(function(produto) {

        if (
            produto.dataset.categoria === categoria
        ) {

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


// ========================================
// MOSTRAR TODOS OS PRODUTOS
// ========================================

function mostrarTodos(event) {

    event.preventDefault();

    const produtos =
        document.querySelectorAll(".produto");


    produtos.forEach(function(produto) {

        produto.style.display = "block";

    });


    document.getElementById(
        "tituloProdutos"
    ).textContent =
        "Produtos em destaque";


    document
        .querySelector(".destaques")
        .scrollIntoView({
            behavior: "smooth"
        });

}


// ========================================
// FORMULÁRIO DE CONTATO
// ========================================

const formContato =
    document.getElementById("formContato");

if (formContato) {

    formContato.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();

            const nome =
                document.getElementById(
                    "nomeContato"
                ).value;


            formContato.style.display =
                "none";


            document.getElementById(
                "mensagemContatoEnviada"
            ).innerHTML = `

                <h3>
                    Mensagem enviada!
                </h3>

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


// ========================================
// LOGIN
// ========================================

const formLogin =
    document.getElementById("formLogin");

if (formLogin) {

    formLogin.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const usuario =
                document.getElementById(
                    "usuario"
                ).value.trim();


            const senha =
                document.getElementById(
                    "senha"
                ).value;


            const mensagem =
                document.getElementById(
                    "mensagemLogin"
                );


            // SENHA DO SITE
            if (senha === "123") {

                localStorage.setItem(
                    "usuarioLogado",
                    usuario
                );


                window.location.href =
                    "index.html";


            } else {

                mensagem.textContent =
                    "Senha incorreta. Tente novamente.";

                mensagem.style.color =
                    "red";

            }

        }
    );

}


// ========================================
// MOSTRAR USUÁRIO LOGADO
// ========================================

const usuarioElemento =
    document.getElementById(
        "usuarioLogado"
    );


if (usuarioElemento) {

    const usuario =
        localStorage.getItem(
            "usuarioLogado"
        );


    if (usuario) {

        usuarioElemento.textContent =
            "Olá, " + usuario + "!";

    }

}


// ========================================
// SAIR DA CONTA
// ========================================

function sairDaConta() {

    localStorage.removeItem(
        "usuarioLogado"
    );


    window.location.href =
        "login.html";

}


// ========================================
// CUPONS DE DESCONTO
// ========================================

function aplicarCupom() {

    const campo =
        document.getElementById(
            "codigoCupom"
        );


    const mensagem =
        document.getElementById(
            "mensagemCupom"
        );


    if (!campo || !mensagem) {
        return;
    }


    const codigo =
        campo.value
            .trim()
            .toUpperCase();


    let desconto = 0;


    // ========================================
    // CUPOM RS10
    // ========================================

    if (codigo === "RS10") {

        desconto = 10;


        mensagem.textContent =
            "Cupom RS10 aplicado! Você ganhou 10% de desconto.";


        mensagem.style.color =
            "green";

    }


    // ========================================
    // CUPOM RS20
    // ========================================

    else if (codigo === "RS20") {

        desconto = 20;


        mensagem.textContent =
            "Cupom RS20 aplicado! Você ganhou 20% de desconto.";


        mensagem.style.color =
            "green";

    }


    // ========================================
    // CUPOM INVÁLIDO
    // ========================================

    else {

        localStorage.removeItem(
            "descontoCupom"
        );


        mensagem.textContent =
            "Cupom inválido.";


        mensagem.style.color =
            "red";


        mostrarCarrinho();

        return;
    }


    // ========================================
    // SALVAR DESCONTO
    // ========================================

    localStorage.setItem(
        "descontoCupom",
        desconto
    );


    // Atualizar valores
    mostrarCarrinho();

}