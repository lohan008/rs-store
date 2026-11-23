
let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];


// ========================================
// ADICIONAR PRODUTO
// ========================================

function adicionarCarrinho(nome, preco, imagem, tamanho = "") {

    let produto = carrinho.find(item =>
        item.nome === nome && item.tamanho === tamanho
    );

    if (produto) {

        produto.quantidade++;

    } else {

        carrinho.push({
            nome: nome,
            preco: preco,
            imagem: imagem,
            tamanho: tamanho,
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
                        Tamanho:
                        <strong>
                            ${produto.tamanho || "Não informado"}
                        </strong>
                    </p>

                    <p>
                        R$ ${Number(produto.preco)
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
    // CALCULAR DESCONTO
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
// REMOVER PRODUTO
// ========================================

function removerProduto(index) {

    carrinho.splice(index, 1);

    salvarCarrinho();

    mostrarCarrinho();

}

// ========================================
// AUMENTAR QUANTIDADE
// ========================================

function aumentarQuantidade(index) {

    if (!carrinho[index]) {
        return;
    }

    carrinho[index].quantidade =
        Number(carrinho[index].quantidade || 1) + 1;

    salvarCarrinho();
    mostrarCarrinho();

}


// ========================================
// DIMINUIR QUANTIDADE
// ========================================

function diminuirQuantidade(index) {

    if (!carrinho[index]) {
        return;
    }

    if (Number(carrinho[index].quantidade || 1) <= 1) {
        removerProduto(index);
        return;
    }

    carrinho[index].quantidade =
        Number(carrinho[index].quantidade) - 1;

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

    const freteGratis =
        localStorage.getItem("freteGratis") === "true";


    let frete =
        parseFloat(
            localStorage.getItem("freteAtual")
        ) || 0;


    if (freteGratis) {

        frete = 0;

    }


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

    if (freteGratis) {

        freteElemento.textContent =
            "GRÁTIS";

    } else {

        freteElemento.textContent =
            frete
                .toFixed(2)
                .replace(".", ",");

    }


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


    // ========================================
    // SALVAR FRETE
    // ========================================

    localStorage.setItem(
        "freteAtual",
        frete
    );


    // ========================================
    // MOSTRAR VALOR DO FRETE
    // ========================================

    const freteGratis =
        localStorage.getItem("freteGratis") === "true";


    if (valorFreteElemento) {

        if (freteGratis) {

            valorFreteElemento.textContent =
                "GRÁTIS";

        } else {

            valorFreteElemento.textContent =
                frete
                    .toFixed(2)
                    .replace(".", ",");

        }

    }


    if (fretePagamentoElemento) {

        if (freteGratis) {

            fretePagamentoElemento.textContent =
                "GRÁTIS";

        } else {

            fretePagamentoElemento.textContent =
                frete
                    .toFixed(2)
                    .replace(".", ",");

        }

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


    if (titulo) {

        titulo.textContent =
            nomesCategorias[categoria];

    }


    const destaques =
        document.querySelector(".destaques");


    if (destaques) {

        destaques.scrollIntoView({
            behavior: "smooth"
        });

    }

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


    const titulo =
        document.getElementById("tituloProdutos");


    if (titulo) {

        titulo.textContent =
            "Produtos em destaque";

    }


    const destaques =
        document.querySelector(".destaques");


    if (destaques) {

        destaques.scrollIntoView({
            behavior: "smooth"
        });

    }

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


        localStorage.removeItem(
            "freteGratis"
        );


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


        localStorage.removeItem(
            "freteGratis"
        );


        mensagem.textContent =
            "Cupom RS20 aplicado! Você ganhou 20% de desconto.";


        mensagem.style.color =
            "green";

    }


    // ========================================
    // CUPOM FRETE GRÁTIS
    // ========================================

    else if (codigo === "FRETEGRATIS") {

        desconto = 0;


        localStorage.setItem(
            "freteGratis",
            "true"
        );


        mensagem.textContent =
            "Cupom FRETEGRATIS aplicado! Você ganhou frete grátis.";


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


        localStorage.removeItem(
            "freteGratis"
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


    // ========================================
    // ATUALIZAR CARRINHO
    // ========================================

    mostrarCarrinho();


    // ========================================
    // ATUALIZAR PAGAMENTO
    // ========================================

    atualizarResumoPagamento();


    calcularFrete();

}


/* =====================================================
   PAGAMENTO INTERATIVO
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        const formaPagamento =
            document.getElementById(
                "formaPagamento"
            );


        if (!formaPagamento) {
            return;
        }


        const pagamentoPix =
            document.getElementById(
                "pagamentoPix"
            );


        const pagamentoCartao =
            document.getElementById(
                "pagamentoCartao"
            );


        const pagamentoBoleto =
            document.getElementById(
                "pagamentoBoleto"
            );


        // ========================================
        // MOSTRAR FORMA DE PAGAMENTO
        // ========================================

        function mostrarPagamento() {

            if (pagamentoPix) {

                pagamentoPix.style.display =
                    "none";

            }


            if (pagamentoCartao) {

                pagamentoCartao.style.display =
                    "none";

            }


            if (pagamentoBoleto) {

                pagamentoBoleto.style.display =
                    "none";

            }


            if (formaPagamento.value === "pix") {

                pagamentoPix.style.display =
                    "block";

            }


            else if (
                formaPagamento.value === "cartao"
            ) {

                pagamentoCartao.style.display =
                    "block";

            }


            else if (
                formaPagamento.value === "boleto"
            ) {

                pagamentoBoleto.style.display =
                    "block";


                atualizarValorBoleto();

            }

        }


        formaPagamento.addEventListener(
            "change",
            mostrarPagamento
        );


        // ========================================
        // NÚMERO DO CARTÃO
        // ========================================

        const numeroCartao =
            document.getElementById(
                "numeroCartao"
            );


        const numeroCartaoVisual =
            document.getElementById(
                "numeroCartaoVisual"
            );


        if (
            numeroCartao &&
            numeroCartaoVisual
        ) {

            numeroCartao.addEventListener(
                "input",
                function() {

                    let valor =
                        this.value.replace(
                            /\D/g,
                            ""
                        );


                    valor =
                        valor.substring(
                            0,
                            16
                        );


                    let grupos =
                        valor.match(
                            /.{1,4}/g
                        );


                    this.value =
                        grupos
                            ? grupos.join(" ")
                            : "";


                    let visual =
                        this.value;


                    while (
                        visual.length < 19
                    ) {

                        visual += "•";

                    }


                    numeroCartaoVisual.textContent =
                        visual;

                }
            );

        }


        // ========================================
        // NOME DO CARTÃO
        // ========================================

        const nomeCartao =
            document.getElementById(
                "nomeCartao"
            );


        const nomeCartaoVisual =
            document.getElementById(
                "nomeCartaoVisual"
            );


        if (
            nomeCartao &&
            nomeCartaoVisual
        ) {

            nomeCartao.addEventListener(
                "input",
                function() {

                    nomeCartaoVisual.textContent =
                        this.value.toUpperCase()
                        || "SEU NOME";

                }
            );

        }


        // ========================================
        // VALIDADE
        // ========================================

        const validadeCartao =
            document.getElementById(
                "validadeCartao"
            );


        const validadeCartaoVisual =
            document.getElementById(
                "validadeCartaoVisual"
            );


        if (
            validadeCartao &&
            validadeCartaoVisual
        ) {

            validadeCartao.addEventListener(
                "input",
                function() {

                    let valor =
                        this.value.replace(
                            /\D/g,
                            ""
                        );


                    valor =
                        valor.substring(
                            0,
                            4
                        );


                    if (
                        valor.length >= 3
                    ) {

                        valor =
                            valor.substring(
                                0,
                                2
                            )
                            + "/"
                            + valor.substring(
                                2
                            );

                    }


                    this.value =
                        valor;


                    validadeCartaoVisual.textContent =
                        valor || "MM/AA";

                }
            );

        }


        // ========================================
        // CVV + VIRAR CARTÃO
        // ========================================

        const cvvCartao =
            document.getElementById(
                "cvvCartao"
            );


        const cvvCartaoVisual =
            document.getElementById(
                "cvvCartaoVisual"
            );


        const cartaoVisual =
            document.getElementById(
                "cartaoVisual"
            );


        if (
            cvvCartao &&
            cvvCartaoVisual &&
            cartaoVisual
        ) {


            cvvCartao.addEventListener(
                "focus",
                function() {

                    cartaoVisual.classList.add(
                        "virado"
                    );

                }
            );


            cvvCartao.addEventListener(
                "blur",
                function() {

                    cartaoVisual.classList.remove(
                        "virado"
                    );

                }
            );


            cvvCartao.addEventListener(
                "input",
                function() {

                    let valor =
                        this.value.replace(
                            /\D/g,
                            ""
                        );


                    valor =
                        valor.substring(
                            0,
                            3
                        );


                    this.value =
                        valor;


                    cvvCartaoVisual.textContent =
                        valor || "•••";

                }
            );

        }


        // ========================================
        // VALOR DO BOLETO
        // ========================================

        function atualizarValorBoleto() {

            const totalPagamento =
                document.getElementById(
                    "totalPagamento"
                );


            const valorBoleto =
                document.getElementById(
                    "valorBoleto"
                );


            if (
                totalPagamento &&
                valorBoleto
            ) {

                valorBoleto.textContent =
                    totalPagamento.textContent;

            }

        }

    }
);


/* =====================================================
   COPIAR CHAVE PIX
===================================================== */

function copiarPix() {

    const chavePix =
        document.getElementById(
            "chavePix"
        );


    const mensagemPix =
        document.getElementById(
            "mensagemPix"
        );


    if (
        !chavePix ||
        !mensagemPix
    ) {

        return;

    }


    chavePix.select();

    chavePix.setSelectionRange(
        0,
        99999
    );


    if (
        navigator.clipboard &&
        navigator.clipboard.writeText
    ) {

        navigator.clipboard
            .writeText(
                chavePix.value
            )
            .then(function() {

                mensagemPix.textContent =
                    "Chave PIX copiada!";

                mensagemPix.style.color =
                    "green";

            })
            .catch(function() {

                mensagemPix.textContent =
                    "Copie a chave PIX manualmente.";

                mensagemPix.style.color =
                    "red";

            });

    }

    else {

        document.execCommand("copy");

        mensagemPix.textContent =
            "Chave PIX copiada!";

        mensagemPix.style.color =
            "green";

    }

}
/* =====================================================
   CONFIRMAÇÃO DE PAGAMENTO
===================================================== */


/* IR PARA A PÁGINA DE CONFIRMAÇÃO */

function irParaConfirmacao(event) {

    event.preventDefault();


    const formaPagamento =
        document.getElementById("formaPagamento").value;


    if (!formaPagamento) {

        alert("Selecione uma forma de pagamento.");

        return;

    }


    /*
        Guardamos a forma de pagamento escolhida
        para a próxima página.
    */

    localStorage.setItem(
        "formaPagamento",
        formaPagamento
    );


    /*
        Guardamos alguns dados do cliente.
    */

    const nome =
        document.getElementById("nome").value;

    const email =
        document.getElementById("email").value;

    const endereco =
        document.getElementById("endereco").value;

    const numero =
        document.getElementById("numero").value;

    const cidade =
        document.getElementById("cidade").value;

    const estado =
        document.getElementById("estado").value;


    localStorage.setItem(
        "dadosCliente",
        JSON.stringify({

            nome: nome,

            email: email,

            endereco: endereco,

            numero: numero,

            cidade: cidade,

            estado: estado

        })
    );


    /*
        IMPORTANTE:
        Aqui NÃO apagamos o carrinho.

        O carrinho só será apagado depois
        que o usuário clicar em "Confirmar compra".
    */


    window.location.href =
        "confirmacao.html";

}



/* =====================================================
   CARREGAR CONFIRMAÇÃO
===================================================== */

function carregarConfirmacao() {

    const forma =
        localStorage.getItem("formaPagamento");

    // Se não escolheu uma forma de pagamento,
    // volta para a página de pagamento.

    if (!forma) {

        window.location.href =
            "pagamento.html";

        return;

    }

    // Esconde todos os métodos.

    const pix =
        document.getElementById("confirmacaoPix");

    const cartao =
        document.getElementById("confirmacaoCartao");

    const boleto =
        document.getElementById("confirmacaoBoleto");

    if (pix) {
        pix.style.display = "none";
    }

    if (cartao) {
        cartao.style.display = "none";
    }

    if (boleto) {
        boleto.style.display = "none";
    }

    // Mostra somente o método escolhido.

    if (forma === "pix" && pix) {
        pix.style.display = "block";
    }

    if (forma === "cartao" && cartao) {
        cartao.style.display = "block";
    }

    if (forma === "boleto" && boleto) {
        boleto.style.display = "block";
    }

    // Calcula o subtotal.

    let subtotal = 0;

    const carrinhoAtual =
        JSON.parse(
            localStorage.getItem("carrinho")
        ) || [];

    carrinhoAtual.forEach(function(item) {

        subtotal +=
            Number(item.preco) *
            Number(item.quantidade || 1);

    });

    // Recupera o desconto.

    const desconto =
        Number(
            localStorage.getItem("descontoCupom")
        ) || 0;

    // Calcula o valor real do desconto em reais.

    const valorDesconto =
        subtotal * (desconto / 100);

    // Recupera o frete.

    let frete =
        Number(
            localStorage.getItem("freteAtual")
        ) || 0;

    const freteGratis =
        localStorage.getItem("freteGratis") === "true";

    if (freteGratis) {
        frete = 0;
    }

    // Calcula o total corretamente.

    const total =
        subtotal -
        valorDesconto +
        frete;

    const totalFormatado =
        total.toFixed(2).replace(".", ",");

    // Mostra o total da confirmação.

    const totalConfirmacao =
        document.getElementById("totalConfirmacao");

    if (totalConfirmacao) {

        totalConfirmacao.textContent =
            "R$ " + totalFormatado;

    }

    // Atualiza o valor do boleto.

    const valorBoleto =
        document.getElementById(
            "valorBoletoConfirmacao"
        );

    if (valorBoleto) {

        valorBoleto.textContent =
            totalFormatado;

    }

}

/* =====================================================
   PIX
===================================================== */

function copiarPixConfirmacao() {


    const chave =
        document.getElementById(
            "chavePixConfirmacao"
        );


    if (!chave) {
        return;
    }


    navigator.clipboard.writeText(
        chave.value
    );


    const mensagem =
        document.getElementById(
            "mensagemPixConfirmacao"
        );


    if (mensagem) {

        mensagem.textContent =
            "Chave PIX copiada!";

        mensagem.style.color =
            "#00aaff";

    }

}



/* =====================================================
   CARTÃO
===================================================== */

function formatarNumeroCartaoConfirmacao() {


    const input =
        document.getElementById(
            "numeroCartaoConfirmacao"
        );


    const visual =
        document.getElementById(
            "numeroCartaoVisualConfirmacao"
        );


    if (!input || !visual) {
        return;
    }


    let valor =
        input.value.replace(/\D/g, "");


    valor =
        valor.substring(0, 16);


    let formatado =
        valor.match(/.{1,4}/g);


    if (formatado) {

        formatado =
            formatado.join(" ");

    } else {

        formatado = "";

    }


    input.value =
        formatado;


    visual.textContent =
        formatado ||
        "0000 0000 0000 0000";

}



/* =====================================================
   NOME DO CARTÃO
===================================================== */

function atualizarNomeCartaoConfirmacao() {


    const input =
        document.getElementById(
            "nomeCartaoConfirmacao"
        );


    const visual =
        document.getElementById(
            "nomeCartaoVisualConfirmacao"
        );


    if (!input || !visual) {
        return;
    }


    const nome =
        input.value.trim();


    visual.textContent =
        nome.toUpperCase() ||
        "SEU NOME";

}



/* =====================================================
   VALIDADE
===================================================== */

function formatarValidadeCartaoConfirmacao() {


    const input =
        document.getElementById(
            "validadeCartaoConfirmacao"
        );


    const visual =
        document.getElementById(
            "validadeCartaoVisualConfirmacao"
        );


    if (!input || !visual) {
        return;
    }


    let valor =
        input.value.replace(/\D/g, "");


    valor =
        valor.substring(0, 4);


    if (valor.length >= 3) {

        valor =
            valor.substring(0, 2) +
            "/" +
            valor.substring(2);

    }


    input.value =
        valor;


    visual.textContent =
        valor ||
        "00/00";

}



/* =====================================================
   CVV
===================================================== */

function atualizarCvvCartaoConfirmacao() {


    const input =
        document.getElementById(
            "cvvCartaoConfirmacao"
        );


    const visual =
        document.getElementById(
            "cvvCartaoVisualConfirmacao"
        );


    if (!input || !visual) {
        return;
    }


    let valor =
        input.value.replace(/\D/g, "");


    valor =
        valor.substring(0, 3);


    input.value =
        valor;


    visual.textContent =
        valor ||
        "000";

}



/* =====================================================
   VIRAR CARTÃO
===================================================== */

function virarCartaoConfirmacao(virar) {


    const cartao =
        document.getElementById(
            "cartaoConfirmacao"
        );


    if (!cartao) {
        return;
    }


    if (virar) {

        cartao.classList.add(
            "virado-confirmacao"
        );

    } else {

        cartao.classList.remove(
            "virado-confirmacao"
        );

    }

}



/* =====================================================
   CONFIRMAR COMPRA
===================================================== */

function confirmarCompraFinal() {

    const mensagem =
        document.getElementById(
            "mensagemCompraConfirmacao"
        );

    // Recuperar os dados antes de limpar o carrinho.

    const produtos =
        JSON.parse(
            localStorage.getItem("carrinho")
        ) || [];

    const cliente =
        JSON.parse(
            localStorage.getItem("dadosCliente")
        ) || {};

    const formaPagamento =
        localStorage.getItem("formaPagamento") || "";

    // Calcular os valores da compra.

    let subtotal = 0;

    produtos.forEach(function(produto) {

        subtotal +=
            Number(produto.preco) *
            Number(produto.quantidade || 1);

    });

    const percentualDesconto =
        Number(
            localStorage.getItem("descontoCupom")
        ) || 0;

    const valorDesconto =
        subtotal * (percentualDesconto / 100);

    let frete =
        Number(
            localStorage.getItem("freteAtual")
        ) || 0;

    if (
        localStorage.getItem("freteGratis") === "true"
    ) {
        frete = 0;
    }

    const total =
        subtotal - valorDesconto + frete;

    // Gerar número do pedido.

    const numeroPedido =
        "RS" + Date.now().toString().slice(-8);

    // Guardar comprovante completo.

    const comprovante = {

        numero: numeroPedido,

        data: new Date().toLocaleDateString("pt-BR"),

        produtos: produtos,

        cliente: cliente,

        pagamento: formaPagamento,

        subtotal: subtotal,

        desconto: valorDesconto,

        frete: frete,

        total: total

    };

    localStorage.setItem(
        "comprovanteCompra",
        JSON.stringify(comprovante)
    );

    // Limpar dados da compra atual.

    localStorage.removeItem("carrinho");
    localStorage.removeItem("descontoCupom");
    localStorage.removeItem("freteAtual");
    localStorage.removeItem("freteGratis");
    localStorage.removeItem("formaPagamento");
    localStorage.removeItem("dadosCliente");

    // Mostrar confirmação.

    if (mensagem) {

        mensagem.innerHTML = `

            <div class="compra-sucesso">

                <div class="icone-sucesso">
                    ✓
                </div>

                <h2>Compra finalizada!</h2>

                <p>Seu pedido foi registrado com sucesso.</p>

                <p>
                    Número do pedido:
                    <strong>${numeroPedido}</strong>
                </p>

                <p>Obrigado por comprar na RS Store!</p>

                <a href="comprovante.html">
                    Ver comprovante e acompanhar pedido
                </a>

            </div>

        `;

    }

    // Esconder botão depois da compra.

    const botao =
        document.querySelector(
            ".btn-confirmar-compra"
        );

    if (botao) {

        botao.disabled = true;
        botao.style.display = "none";

    }

}



/* =====================================================
   INICIALIZAÇÃO DA CONFIRMAÇÃO
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function() {


        /*
            Só executa na página confirmacao.html.
        */

        if (
            window.location.pathname.endsWith(
                "confirmacao.html"
            )
        ) {

            carregarConfirmacao();

        }


    }
);

function copiarBoletoConfirmacao() {

    const codigo = document.getElementById(
        "codigoBoletoConfirmacao"
    );

    const mensagem = document.getElementById(
        "mensagemBoletoConfirmacao"
    );

    navigator.clipboard.writeText(codigo.value)
        .then(function() {
            mensagem.textContent = "Código copiado!";
        })
        .catch(function() {
            mensagem.textContent = "Não foi possível copiar o código.";
        });

}
// ========================================
// SISTEMA DE AVALIAÇÕES
// ========================================

function avaliarProduto(nomeProduto) {

    const produto = [...document.querySelectorAll(".produto")]
        .find(item => item.querySelector("h3")?.textContent.trim() === nomeProduto);

    if (!produto) return;

    const comentario = produto.querySelector("textarea").value.trim();

    if (comentario === "") {
        alert("Escreva um comentário antes de enviar!");
        return;
    }

    const campoNota = produto.querySelector(".nota-avaliacao");

    const nota = campoNota ? Number(campoNota.value) : 5;

    let avaliacoes = JSON.parse(localStorage.getItem("avaliacoesRS")) || {};

    if (!avaliacoes[nomeProduto]) {
        avaliacoes[nomeProduto] = [];
    }

    avaliacoes[nomeProduto].push({
        comentario: comentario,
        nota: nota,
        data: new Date().toLocaleDateString("pt-BR")
    });

    localStorage.setItem("avaliacoesRS", JSON.stringify(avaliacoes));

    produto.querySelector("textarea").value = "";

    mostrarAvaliacoes(nomeProduto);
}


// ========================================
// MOSTRAR AVALIAÇÕES
// ========================================

function mostrarAvaliacoes(nomeProduto) {

    let avaliacoes = JSON.parse(localStorage.getItem("avaliacoesRS")) || {};

    const produto = [...document.querySelectorAll(".produto")]
        .find(item => item.querySelector("h3")?.textContent.trim() === nomeProduto);

    if (!produto) return;

    const lista = produto.querySelector(".lista-avaliacoes");

    if (!lista) return;

    lista.innerHTML = "";

    (avaliacoes[nomeProduto] || []).forEach(avaliacao => {

        lista.innerHTML += `
            <div class="avaliacao-item">
                <p>${"⭐".repeat(Number(avaliacao.nota || 5))}</p>
                <p>${avaliacao.comentario}</p>
                <small>${avaliacao.data}</small>
            </div>
        `;

    });
}


// ========================================
// CARREGAR AVALIAÇÕES AO ABRIR A LOJA
// ========================================

document.addEventListener("DOMContentLoaded", function() {

    document.querySelectorAll(".produto h3").forEach(titulo => {
        mostrarAvaliacoes(titulo.textContent.trim());
    });

});

// ========================================
// FILTROS DE PRODUTOS
// ========================================

let categoriaSelecionada = "";

function aplicarFiltros() {

    const busca = document
        .getElementById("buscaProduto")
        .value.toLowerCase();

    const marca = document
        .getElementById("filtroMarca")
        .value;

    const precoMinimo = parseFloat(
        document.getElementById("precoMinimo").value
    ) || 0;

    const valorMaximo = document.getElementById("precoMaximo").value;

    const precoMaximo = valorMaximo === ""
        ? Infinity
        : parseFloat(valorMaximo);

    const produtos = document.querySelectorAll(".produto");

    produtos.forEach(produto => {

        const nome = produto.querySelector("h3").textContent;

        const nomeMinusculo = nome.toLowerCase();

        const textoPreco = produto.querySelector("p").textContent;

        const preco = parseFloat(
            textoPreco
                .replace("R$", "")
                .replace(/\./g, "")
                .replace(",", ".")
                .trim()
        );

        let marcaProduto = "Sem marca";

        const marcas = [
            "Louis Vuitton",
            "Tommy Hilfiger",
            "Quiksilver",
            "Adidas",
            "Nike",
            "Lacoste"
        ];

        marcas.forEach(nomeMarca => {

            if (nome.includes(nomeMarca)) {
                marcaProduto = nomeMarca;
            }

        });

        const correspondeNome = nomeMinusculo.includes(busca);

        const correspondeMarca =
            marca === "" || marcaProduto === marca;

        const correspondePreco =
            preco >= precoMinimo && preco <= precoMaximo;

        const correspondeCategoria =
            categoriaSelecionada === "" ||
            produto.dataset.categoria === categoriaSelecionada;

        if (
            correspondeNome &&
            correspondeMarca &&
            correspondePreco &&
            correspondeCategoria
        ) {
            produto.style.display = "";
        } else {
            produto.style.display = "none";
        }

    });

}


// ========================================
// FILTRAR POR MENOR PREÇO
// ========================================

function ordenarMenorPreco() {

    const container = document.querySelector(".produtos");

    const produtos = Array.from(
        container.querySelectorAll(".produto")
    );

    produtos.sort((a, b) => {

        function pegarPreco(produto) {

            return parseFloat(
                produto.querySelector("p").textContent
                    .replace("R$", "")
                    .replace(/\./g, "")
                    .replace(",", ".")
                    .trim()
            );

        }

        return pegarPreco(a) - pegarPreco(b);

    });

    produtos.forEach(produto => {
        container.appendChild(produto);
    });

    aplicarFiltros();

}


// ========================================
// LIMPAR TODOS OS FILTROS
// ========================================

function limparFiltros() {

    document.getElementById("buscaProduto").value = "";
    document.getElementById("filtroMarca").value = "";
    document.getElementById("precoMinimo").value = "";
    document.getElementById("precoMaximo").value = "";

    categoriaSelecionada = "";

    aplicarFiltros();

}
// ========================================
// MOSTRAR PRODUTOS EM OFERTA
// ========================================

function mostrarOfertas(event) {

    if (event) {
        event.preventDefault();
    }

    // Limpa os filtros anteriores
    document.getElementById("buscaProduto").value = "";
    document.getElementById("filtroMarca").value = "";
    document.getElementById("precoMinimo").value = "";
    document.getElementById("precoMaximo").value = "";

    categoriaSelecionada = "";

    const produtos = document.querySelectorAll(".produto");

    produtos.forEach(produto => {

        if (produto.dataset.oferta === "sim") {
            produto.style.display = "";
        } else {
            produto.style.display = "none";
        }

    });

    document.getElementById("tituloProdutos").textContent = "Ofertas";

    const totalOfertas = document.querySelectorAll(
        '.produto[data-oferta="sim"]'
    ).length;
    
    const contador = document.getElementById("contadorOfertas");
    
    contador.textContent = totalOfertas + " produtos em oferta";
    
    contador.style.display = "block";

    document.getElementById("produtos").scrollIntoView({
        behavior: "smooth"
    });

}
// ========================================
// APLICAR DESCONTO NAS OFERTAS
// ========================================

document.querySelectorAll(".produto").forEach(produto => {

    if (produto.dataset.oferta === "sim") {

        const precoElemento = produto.querySelector("p");

        const precoOriginal = parseFloat(
            precoElemento.textContent
                .replace("R$", "")
                .replace(/\./g, "")
                .replace(",", ".")
                .trim()
        );

        const precoOferta = (precoOriginal * 0.85).toFixed(2);

        const precoFormatado = Number(precoOferta).toLocaleString(
            "pt-BR",
            {
                style: "currency",
                currency: "BRL"
            }
        );

        precoElemento.innerHTML = `
            <span class="preco-antigo">
                ${precoElemento.textContent}
            </span>
            <br>
            <strong class="preco-oferta">
                ${precoFormatado}
            </strong>
        `;

    }

});
// ========================================
// TAMANHOS DE TODOS OS PRODUTOS
// ========================================

document.querySelectorAll(".produto").forEach(produto => {

    const categoria = produto.dataset.categoria;

    let tamanhos = [];

    if (categoria === "camiseta" || categoria === "moletom") {
        tamanhos = ["P", "M", "G", "GG"];
    }

    else if (categoria === "calca" || categoria === "short") {
        tamanhos = ["36", "38", "40", "42", "44", "46"];
    }

    else if (categoria === "bone") {
        tamanhos = ["Único"];
    }

    const seletor = document.createElement("select");

    seletor.className = "seletor-tamanho";

    seletor.innerHTML = `
        <option value="">Selecione o tamanho</option>
    `;

    tamanhos.forEach(tamanho => {

        const opcao = document.createElement("option");

        opcao.value = tamanho;
        opcao.textContent = tamanho;

        seletor.appendChild(opcao);

    });

    const avaliacao = produto.querySelector(".avaliacao-produto");

    produto.insertBefore(seletor, avaliacao);

    // Localiza o botão Comprar
    const botoes = Array.from(produto.querySelectorAll(":scope > button"));

    const botaoComprar = botoes.find(botao =>
        botao.getAttribute("onclick")?.includes("adicionarCarrinho")
    );

    if (!botaoComprar) return;

    const chamada = botaoComprar.getAttribute("onclick");

    const dados = chamada.match(
        /adicionarCarrinho\('([^']*)',\s*([\d.]+),\s*'([^']*)'\)/
    );

    if (!dados) return;

    const nome = dados[1];
    const imagem = dados[3];

    botaoComprar.removeAttribute("onclick");

    botaoComprar.addEventListener("click", function() {

        if (!seletor.value) {
            alert("Selecione um tamanho antes de comprar!");
            return;
        }

        const precoOferta = produto.querySelector(".preco-oferta");

        const precoElemento = produto.querySelector("p");

        const textoPreco = precoOferta
            ? precoOferta.textContent
            : precoElemento.textContent;

        const preco = parseFloat(
            textoPreco
                .replace("R$", "")
                .replace(/\./g, "")
                .replace(",", ".")
                .trim()
        );

        adicionarCarrinho(
            nome,
            preco,
            imagem,
            seletor.value
        );

    });

});