
let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];


// =====================================================
// FUNÇÕES AUXILIARES
// =====================================================

function escaparHTML(valor) {
    return String(valor ?? "").replace(/[&<>"']/g, caractere => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[caractere]);
}

function formatarDinheiro(valor) {
    return Number(valor || 0).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

function obterArrayLocalStorage(chave) {
    try {
        const dados = JSON.parse(localStorage.getItem(chave));
        return Array.isArray(dados) ? dados : [];
    } catch {
        return [];
    }
}

function obterPrecoProdutoElemento(produto) {
    const promocional = produto.querySelector(".preco-oferta");

    if (promocional) {
        return parseFloat(
            promocional.textContent
                .replace("R$", "")
                .replace(/\./g, "")
                .replace(",", ".")
                .trim()
        ) || 0;
    }

    const preco = produto.querySelector("p");

    if (!preco) return 0;

    return parseFloat(
        preco.textContent
            .replace("R$", "")
            .replace(/\./g, "")
            .replace(",", ".")
            .trim()
    ) || 0;
}


// =====================================================
// CARRINHO
// =====================================================

function adicionarCarrinho(nome, preco, imagem, tamanho = "") {

    let produto = carrinho.find(item =>
        item.nome === nome && item.tamanho === tamanho
    );

    if (produto) {
        produto.quantidade++;
    } else {
        carrinho.push({
            nome,
            preco: Number(preco),
            imagem,
            tamanho,
            quantidade: 1
        });
    }

    salvarCarrinho();
    alert("Produto adicionado ao carrinho!");
}

function salvarCarrinho() {
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
}

function mostrarCarrinho() {

    const lista = document.getElementById("listaCarrinho");
    const totalElemento = document.getElementById("totalCarrinho");

    if (!lista) return;

    lista.innerHTML = "";

    let subtotal = 0;

    if (carrinho.length === 0) {

        lista.innerHTML = `
            <p class="carrinho-vazio">
                Seu carrinho está vazio.
            </p>
        `;

        if (totalElemento) totalElemento.textContent = "0,00";

        const subtotalElemento = document.getElementById("subtotalCarrinho");
        const descontoElemento = document.getElementById("descontoCarrinho");

        if (subtotalElemento) subtotalElemento.textContent = "0,00";
        if (descontoElemento) descontoElemento.textContent = "0,00";

        return;
    }

    carrinho.forEach((produto, index) => {

        const subtotalProduto =
            Number(produto.preco) * Number(produto.quantidade);

        subtotal += subtotalProduto;

        lista.innerHTML += `
            <div class="item-carrinho">

                <img
                    src="${escaparHTML(produto.imagem)}"
                    alt="${escaparHTML(produto.nome)}"
                >

                <div class="info-carrinho">

                    <h3>${escaparHTML(produto.nome)}</h3>

                    <p>
                        Tamanho:
                        <strong>
                            ${escaparHTML(produto.tamanho || "Não informado")}
                        </strong>
                    </p>

                    <p>${formatarDinheiro(produto.preco)}</p>

                    <div class="quantidade">

                        <button onclick="diminuirQuantidade(${index})">-</button>

                        <span>${Number(produto.quantidade)}</span>

                        <button onclick="aumentarQuantidade(${index})">+</button>

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

    const desconto = parseFloat(localStorage.getItem("descontoCupom")) || 0;
    const valorDesconto = subtotal * (desconto / 100);
    const totalFinal = subtotal - valorDesconto;

    const subtotalElemento = document.getElementById("subtotalCarrinho");
    const descontoElemento = document.getElementById("descontoCarrinho");

    if (subtotalElemento) {
        subtotalElemento.textContent =
            subtotal.toFixed(2).replace(".", ",");
    }

    if (descontoElemento) {
        descontoElemento.textContent =
            valorDesconto.toFixed(2).replace(".", ",");
    }

    if (totalElemento) {
        totalElemento.textContent =
            totalFinal.toFixed(2).replace(".", ",");
    }
}

function removerProduto(index) {
    carrinho.splice(index, 1);
    salvarCarrinho();
    mostrarCarrinho();
}

function aumentarQuantidade(index) {

    if (!carrinho[index]) return;

    carrinho[index].quantidade =
        Number(carrinho[index].quantidade || 1) + 1;

    salvarCarrinho();
    mostrarCarrinho();
}

function diminuirQuantidade(index) {

    if (!carrinho[index]) return;

    if (Number(carrinho[index].quantidade || 1) <= 1) {
        removerProduto(index);
        return;
    }

    carrinho[index].quantidade =
        Number(carrinho[index].quantidade) - 1;

    salvarCarrinho();
    mostrarCarrinho();
}

function finalizarCompra() {

    if (carrinho.length === 0) {
        alert("Seu carrinho está vazio!");
        return;
    }

    window.location.href = "pagamento.html";
}

mostrarCarrinho();


// =====================================================
// PAGAMENTO - RESUMO DA COMPRA
// =====================================================

const formPagamento = document.getElementById("formPagamento");

function atualizarResumoPagamento() {

    const subtotalElemento = document.getElementById("subtotalPagamento");
    const descontoElemento = document.getElementById("descontoPagamento");
    const freteElemento = document.getElementById("fretePagamento");
    const totalElemento = document.getElementById("totalPagamento");

    if (
        !subtotalElemento ||
        !descontoElemento ||
        !freteElemento ||
        !totalElemento
    ) return;

    let subtotal = 0;

    carrinho.forEach(produto => {
        subtotal += Number(produto.preco) * Number(produto.quantidade);
    });

    const percentualDesconto =
        parseFloat(localStorage.getItem("descontoCupom")) || 0;

    const valorDesconto = subtotal * (percentualDesconto / 100);

    const freteGratis = localStorage.getItem("freteGratis") === "true";

    let frete = parseFloat(localStorage.getItem("freteAtual")) || 0;

    if (freteGratis) frete = 0;

    const total = subtotal - valorDesconto + frete;

    subtotalElemento.textContent =
        subtotal.toFixed(2).replace(".", ",");

    descontoElemento.textContent =
        valorDesconto.toFixed(2).replace(".", ",");

    freteElemento.textContent = freteGratis
        ? "GRÁTIS"
        : frete.toFixed(2).replace(".", ",");

    totalElemento.textContent =
        total.toFixed(2).replace(".", ",");
}

atualizarResumoPagamento();


// =====================================================
// FRETE POR ESTADO
// =====================================================

const estadoPagamento = document.getElementById("estado");

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

const prazosPorEstado = {
    SP: { minimo: 3, maximo: 5 },
    RJ: { minimo: 4, maximo: 6 },
    MG: { minimo: 4, maximo: 6 },
    PR: { minimo: 4, maximo: 6 },
    ES: { minimo: 4, maximo: 6 },
    SC: { minimo: 5, maximo: 7 },
    RS: { minimo: 5, maximo: 7 },
    GO: { minimo: 6, maximo: 9 },
    MS: { minimo: 6, maximo: 9 },
    MT: { minimo: 6, maximo: 9 },
    DF: { minimo: 6, maximo: 9 },
    BA: { minimo: 7, maximo: 10 },
    PE: { minimo: 7, maximo: 10 },
    CE: { minimo: 7, maximo: 10 }
};

function adicionarDiasUteis(data, quantidade) {

    let novaData = new Date(data);
    let diasAdicionados = 0;

    while (diasAdicionados < quantidade) {

        novaData.setDate(novaData.getDate() + 1);

        const diaSemana = novaData.getDay();

        if (diaSemana !== 0 && diaSemana !== 6) {
            diasAdicionados++;
        }
    }

    return novaData;
}

function formatarData(data) {

    const dia = String(data.getDate()).padStart(2, "0");
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const ano = data.getFullYear();

    return `${dia}/${mes}/${ano}`;
}

function calcularFrete() {

    if (!estadoPagamento) return;

    const estado = estadoPagamento.value;

    const valorFreteElemento = document.getElementById("valorFrete");
    const fretePagamentoElemento = document.getElementById("fretePagamento");
    const prazoElemento = document.getElementById("prazoEntrega");

    if (!estado) {

        if (valorFreteElemento) valorFreteElemento.textContent = "0,00";
        if (fretePagamentoElemento) fretePagamentoElemento.textContent = "0,00";

        localStorage.setItem("freteAtual", "0");

        if (prazoElemento) {
            prazoElemento.textContent =
                "Selecione seu estado para calcular o frete.";
        }

        atualizarResumoPagamento();
        return;
    }

    const frete = fretesPorEstado[estado] || 39.90;

    localStorage.setItem("freteAtual", frete);

    const freteGratis = localStorage.getItem("freteGratis") === "true";

    if (valorFreteElemento) {
        valorFreteElemento.textContent = freteGratis
            ? "GRÁTIS"
            : frete.toFixed(2).replace(".", ",");
    }

    if (fretePagamentoElemento) {
        fretePagamentoElemento.textContent = freteGratis
            ? "GRÁTIS"
            : frete.toFixed(2).replace(".", ",");
    }

    const prazo = prazosPorEstado[estado] || {
        minimo: 7,
        maximo: 12
    };

    const hoje = new Date();

    const dataMinima = adicionarDiasUteis(hoje, prazo.minimo);
    const dataMaxima = adicionarDiasUteis(hoje, prazo.maximo);

    if (prazoElemento) {
        prazoElemento.innerHTML = `
            Entrega estimada entre
            <strong>${formatarData(dataMinima)}</strong>
            e
            <strong>${formatarData(dataMaxima)}</strong>.
        `;
    }

    atualizarResumoPagamento();
}

if (estadoPagamento) {
    estadoPagamento.addEventListener("change", calcularFrete);
    calcularFrete();
}


// =====================================================
// FILTRO DE CATEGORIAS
// =====================================================

function filtrarCategoria(categoria, event) {

    if (event) event.preventDefault();

    const produtos = document.querySelectorAll(".produto");
    const titulo = document.getElementById("tituloProdutos");

    produtos.forEach(produto => {
        produto.style.display =
            produto.dataset.categoria === categoria ? "block" : "none";
    });

    const nomesCategorias = {
        camiseta: "Camisetas",
        calca: "Calças",
        moletom: "Moletons",
        short: "Shorts",
        bone: "Bonés"
    };

    if (titulo) {
        titulo.textContent = nomesCategorias[categoria] || "Produtos";
    }

    const destaques = document.querySelector(".destaques");

    if (destaques) {
        destaques.scrollIntoView({ behavior: "smooth" });
    }
}

function mostrarTodos(event) {

    if (event) event.preventDefault();

    document.querySelectorAll(".produto").forEach(produto => {
        produto.style.display = "block";
    });

    const titulo = document.getElementById("tituloProdutos");

    if (titulo) titulo.textContent = "Produtos em destaque";

    const destaques = document.querySelector(".destaques");

    if (destaques) {
        destaques.scrollIntoView({ behavior: "smooth" });
    }
}


// =====================================================
// FORMULÁRIO DE CONTATO
// =====================================================

const formContato = document.getElementById("formContato");

if (formContato) {

    formContato.addEventListener("submit", function(event) {

        event.preventDefault();

        const nome = document.getElementById("nomeContato").value;
        const mensagemEnviada =
            document.getElementById("mensagemContatoEnviada");

        formContato.style.display = "none";

        if (mensagemEnviada) {
            mensagemEnviada.innerHTML = `
                <h3>Mensagem enviada!</h3>
                <p>Obrigado, ${escaparHTML(nome)}!</p>
                <p>Recebemos sua mensagem. Em breve entraremos em contato.</p>
            `;
        }
    });
}


// =====================================================
// LOGIN
// =====================================================

const formLogin = document.getElementById("formLogin");

if (formLogin) {

    formLogin.addEventListener("submit", function(event) {

        event.preventDefault();

        const usuario = document.getElementById("usuario").value.trim();
        const senha = document.getElementById("senha").value;
        const mensagem = document.getElementById("mensagemLogin");

        if (senha === "123") {

            sessionStorage.setItem("usuarioLogado", usuario);
            window.location.href = "index.html";

        } else if (mensagem) {

            mensagem.textContent = "Senha incorreta. Tente novamente.";
            mensagem.style.color = "red";
        }
    });
}


// =====================================================
// MOSTRAR USUÁRIO LOGADO
// =====================================================

const usuarioElemento = document.getElementById("usuarioLogado");

if (usuarioElemento) {

    const usuario = sessionStorage.getItem("usuarioLogado");

    if (usuario) {
        usuarioElemento.textContent = "Olá, " + usuario + "!";
    }
}

function sairDaConta() {
    sessionStorage.removeItem("usuarioLogado");
    window.location.href = "login.html";
}


// =====================================================
// CUPONS DE DESCONTO
// =====================================================

function aplicarCupom() {

    const campo = document.getElementById("codigoCupom");
    const mensagem = document.getElementById("mensagemCupom");

    if (!campo || !mensagem) return;

    const codigo = campo.value.trim().toUpperCase();

    let desconto = 0;

    if (codigo === "RS10") {

        desconto = 10;
        localStorage.removeItem("freteGratis");

        mensagem.textContent =
            "Cupom RS10 aplicado! Você ganhou 10% de desconto.";

        mensagem.style.color = "green";

    } else if (codigo === "RS20") {

        desconto = 20;
        localStorage.removeItem("freteGratis");

        mensagem.textContent =
            "Cupom RS20 aplicado! Você ganhou 20% de desconto.";

        mensagem.style.color = "green";

    } else if (codigo === "FRETEGRATIS") {

        desconto = 0;

        localStorage.setItem("freteGratis", "true");

        mensagem.textContent =
            "Cupom FRETEGRATIS aplicado! Você ganhou frete grátis.";

        mensagem.style.color = "green";

    } else {

        localStorage.removeItem("descontoCupom");
        localStorage.removeItem("freteGratis");

        mensagem.textContent = "Cupom inválido.";
        mensagem.style.color = "red";

        mostrarCarrinho();
        return;
    }

    localStorage.setItem("descontoCupom", desconto);

    mostrarCarrinho();
    atualizarResumoPagamento();
    calcularFrete();
}


// =====================================================
// PAGAMENTO INTERATIVO
// =====================================================

document.addEventListener("DOMContentLoaded", function() {

    const formaPagamento = document.getElementById("formaPagamento");

    if (!formaPagamento) return;

    const pagamentoPix = document.getElementById("pagamentoPix");
    const pagamentoCartao = document.getElementById("pagamentoCartao");
    const pagamentoBoleto = document.getElementById("pagamentoBoleto");

    function atualizarValorBoleto() {

        const totalPagamento = document.getElementById("totalPagamento");
        const valorBoleto = document.getElementById("valorBoleto");

        if (totalPagamento && valorBoleto) {
            valorBoleto.textContent = totalPagamento.textContent;
        }
    }

    function mostrarPagamento() {

        if (pagamentoPix) pagamentoPix.style.display = "none";
        if (pagamentoCartao) pagamentoCartao.style.display = "none";
        if (pagamentoBoleto) pagamentoBoleto.style.display = "none";

        if (formaPagamento.value === "pix" && pagamentoPix) {
            pagamentoPix.style.display = "block";
        } else if (formaPagamento.value === "cartao" && pagamentoCartao) {
            pagamentoCartao.style.display = "block";
        } else if (formaPagamento.value === "boleto" && pagamentoBoleto) {
            pagamentoBoleto.style.display = "block";
            atualizarValorBoleto();
        }
    }

    formaPagamento.addEventListener("change", mostrarPagamento);
    mostrarPagamento();

    const numeroCartao = document.getElementById("numeroCartao");
    const numeroCartaoVisual = document.getElementById("numeroCartaoVisual");

    if (numeroCartao && numeroCartaoVisual) {

        numeroCartao.addEventListener("input", function() {

            let valor = this.value.replace(/\D/g, "").substring(0, 16);
            const grupos = valor.match(/.{1,4}/g);

            this.value = grupos ? grupos.join(" ") : "";

            let visual = this.value;

            while (visual.length < 19) visual += "•";

            numeroCartaoVisual.textContent = visual;
        });
    }

    const nomeCartao = document.getElementById("nomeCartao");
    const nomeCartaoVisual = document.getElementById("nomeCartaoVisual");

    if (nomeCartao && nomeCartaoVisual) {
        nomeCartao.addEventListener("input", function() {
            nomeCartaoVisual.textContent =
                this.value.toUpperCase() || "SEU NOME";
        });
    }

    const validadeCartao = document.getElementById("validadeCartao");
    const validadeCartaoVisual = document.getElementById("validadeCartaoVisual");

    if (validadeCartao && validadeCartaoVisual) {

        validadeCartao.addEventListener("input", function() {

            let valor = this.value.replace(/\D/g, "").substring(0, 4);

            if (valor.length >= 3) {
                valor = valor.substring(0, 2) + "/" + valor.substring(2);
            }

            this.value = valor;
            validadeCartaoVisual.textContent = valor || "MM/AA";
        });
    }

    const cvvCartao = document.getElementById("cvvCartao");
    const cvvCartaoVisual = document.getElementById("cvvCartaoVisual");
    const cartaoVisual = document.getElementById("cartaoVisual");

    if (cvvCartao && cvvCartaoVisual && cartaoVisual) {

        cvvCartao.addEventListener("focus", function() {
            cartaoVisual.classList.add("virado");
        });

        cvvCartao.addEventListener("blur", function() {
            cartaoVisual.classList.remove("virado");
        });

        cvvCartao.addEventListener("input", function() {

            const valor = this.value.replace(/\D/g, "").substring(0, 3);

            this.value = valor;
            cvvCartaoVisual.textContent = valor || "•••";
        });
    }
});


// =====================================================
// COPIAR CHAVE PIX
// =====================================================

function copiarPix() {

    const chavePix = document.getElementById("chavePix");
    const mensagemPix = document.getElementById("mensagemPix");

    if (!chavePix || !mensagemPix) return;

    chavePix.select();
    chavePix.setSelectionRange(0, 99999);

    if (navigator.clipboard && navigator.clipboard.writeText) {

        navigator.clipboard.writeText(chavePix.value)
            .then(function() {
                mensagemPix.textContent = "Chave PIX copiada!";
                mensagemPix.style.color = "green";
            })
            .catch(function() {
                mensagemPix.textContent =
                    "Copie a chave PIX manualmente.";
                mensagemPix.style.color = "red";
            });

    } else {

        document.execCommand("copy");

        mensagemPix.textContent = "Chave PIX copiada!";
        mensagemPix.style.color = "green";
    }
}


// =====================================================
// CONFIRMAÇÃO DE PAGAMENTO
// =====================================================

function irParaConfirmacao(event) {

    event.preventDefault();

    const campoForma = document.getElementById("formaPagamento");

    if (!campoForma || !campoForma.value) {
        alert("Selecione uma forma de pagamento.");
        return;
    }

    const formaPagamento = campoForma.value;

    localStorage.setItem("formaPagamento", formaPagamento);

    const nome = document.getElementById("nome")?.value || "";
    const email = document.getElementById("email")?.value || "";
    const endereco = document.getElementById("endereco")?.value || "";
    const numero = document.getElementById("numero")?.value || "";
    const cidade = document.getElementById("cidade")?.value || "";
    const estado = document.getElementById("estado")?.value || "";

    localStorage.setItem("dadosCliente", JSON.stringify({
        nome,
        email,
        endereco,
        numero,
        cidade,
        estado
    }));

    window.location.href = "confirmacao.html";
}


// =====================================================
// CARREGAR CONFIRMAÇÃO
// =====================================================

function carregarConfirmacao() {

    const forma = localStorage.getItem("formaPagamento");

    if (!forma) {
        window.location.href = "pagamento.html";
        return;
    }

    const pix = document.getElementById("confirmacaoPix");
    const cartao = document.getElementById("confirmacaoCartao");
    const boleto = document.getElementById("confirmacaoBoleto");

    if (pix) pix.style.display = "none";
    if (cartao) cartao.style.display = "none";
    if (boleto) boleto.style.display = "none";

    if (forma === "pix" && pix) pix.style.display = "block";
    if (forma === "cartao" && cartao) cartao.style.display = "block";
    if (forma === "boleto" && boleto) boleto.style.display = "block";

    let subtotal = 0;

    const carrinhoAtual = obterArrayLocalStorage("carrinho");

    carrinhoAtual.forEach(item => {
        subtotal += Number(item.preco) * Number(item.quantidade || 1);
    });

    const desconto = Number(localStorage.getItem("descontoCupom")) || 0;
    const valorDesconto = subtotal * (desconto / 100);

    let frete = Number(localStorage.getItem("freteAtual")) || 0;

    if (localStorage.getItem("freteGratis") === "true") {
        frete = 0;
    }

    const total = subtotal - valorDesconto + frete;

    const totalConfirmacao = document.getElementById("totalConfirmacao");

    if (totalConfirmacao) {
        totalConfirmacao.textContent =
            "R$ " + total.toFixed(2).replace(".", ",");
    }

    const valorBoleto = document.getElementById("valorBoletoConfirmacao");

    if (valorBoleto) {
        valorBoleto.textContent = total.toFixed(2).replace(".", ",");
    }
}


// =====================================================
// PIX DA CONFIRMAÇÃO
// =====================================================

function copiarPixConfirmacao() {

    const chave = document.getElementById("chavePixConfirmacao");

    if (!chave) return;

    const mensagem = document.getElementById("mensagemPixConfirmacao");

    navigator.clipboard.writeText(chave.value)
        .then(function() {

            if (mensagem) {
                mensagem.textContent = "Chave PIX copiada!";
                mensagem.style.color = "#00aaff";
            }
        })
        .catch(function() {

            if (mensagem) {
                mensagem.textContent =
                    "Não foi possível copiar a chave.";
            }
        });
}


// =====================================================
// CARTÃO DA CONFIRMAÇÃO
// =====================================================

function formatarNumeroCartaoConfirmacao() {

    const input = document.getElementById("numeroCartaoConfirmacao");
    const visual = document.getElementById("numeroCartaoVisualConfirmacao");

    if (!input || !visual) return;

    let valor = input.value.replace(/\D/g, "").substring(0, 16);

    const formatado = valor.match(/.{1,4}/g);

    input.value = formatado ? formatado.join(" ") : "";

    visual.textContent = input.value || "0000 0000 0000 0000";
}

function atualizarNomeCartaoConfirmacao() {

    const input = document.getElementById("nomeCartaoConfirmacao");
    const visual = document.getElementById("nomeCartaoVisualConfirmacao");

    if (!input || !visual) return;

    visual.textContent = input.value.trim().toUpperCase() || "SEU NOME";
}

function formatarValidadeCartaoConfirmacao() {

    const input = document.getElementById("validadeCartaoConfirmacao");
    const visual = document.getElementById("validadeCartaoVisualConfirmacao");

    if (!input || !visual) return;

    let valor = input.value.replace(/\D/g, "").substring(0, 4);

    if (valor.length >= 3) {
        valor = valor.substring(0, 2) + "/" + valor.substring(2);
    }

    input.value = valor;
    visual.textContent = valor || "00/00";
}

function atualizarCvvCartaoConfirmacao() {

    const input = document.getElementById("cvvCartaoConfirmacao");
    const visual = document.getElementById("cvvCartaoVisualConfirmacao");

    if (!input || !visual) return;

    let valor = input.value.replace(/\D/g, "").substring(0, 3);

    input.value = valor;
    visual.textContent = valor || "000";
}

function virarCartaoConfirmacao(virar) {

    const cartao = document.getElementById("cartaoConfirmacao");

    if (!cartao) return;

    if (virar) {
        cartao.classList.add("virado-confirmacao");
    } else {
        cartao.classList.remove("virado-confirmacao");
    }
}


// =====================================================
// CONFIRMAR COMPRA E REGISTRAR PEDIDO PARA O ADMIN
// =====================================================

function confirmarCompraFinal() {

    const mensagem =
        document.getElementById("mensagemCompraConfirmacao");

    const produtos = obterArrayLocalStorage("carrinho");

    if (produtos.length === 0) {
        alert("Não foi possível encontrar os produtos da compra.");
        return;
    }

    const cliente =
        JSON.parse(localStorage.getItem("dadosCliente")) || {};

    const formaPagamento =
        localStorage.getItem("formaPagamento") || "";

    let subtotal = 0;

    produtos.forEach(produto => {
        subtotal +=
            Number(produto.preco) *
            Number(produto.quantidade || 1);
    });

    const percentualDesconto =
        Number(localStorage.getItem("descontoCupom")) || 0;

    const valorDesconto =
        subtotal * (percentualDesconto / 100);

    let frete =
        Number(localStorage.getItem("freteAtual")) || 0;

    if (localStorage.getItem("freteGratis") === "true") {
        frete = 0;
    }

    const total = subtotal - valorDesconto + frete;

    const numeroPedido =
        "RS" + Date.now().toString().slice(-8);

    const comprovante = {
        numero: numeroPedido,
        data: new Date().toLocaleDateString("pt-BR"),
        produtos,
        cliente,
        pagamento: formaPagamento,
        subtotal,
        desconto: valorDesconto,
        frete,
        total,
        status: "Preparando"
    };

    // Salva o comprovante individual.
    localStorage.setItem(
        "comprovanteCompra",
        JSON.stringify(comprovante)
    );

    // Registra o pedido no histórico usado pelo administrador.
    const pedidos = obterArrayLocalStorage("pedidosRSStore");

    const pedidoJaExiste = pedidos.some(
        pedido => pedido.numero === numeroPedido
    );

    if (!pedidoJaExiste) {
        pedidos.push(comprovante);
    }

    localStorage.setItem(
        "pedidosRSStore",
        JSON.stringify(pedidos)
    );

    // Limpa os dados da compra atual.
    localStorage.removeItem("carrinho");
    localStorage.removeItem("descontoCupom");
    localStorage.removeItem("freteAtual");
    localStorage.removeItem("freteGratis");
    localStorage.removeItem("formaPagamento");
    localStorage.removeItem("dadosCliente");

    carrinho = [];

    if (mensagem) {

        mensagem.innerHTML = `
            <div class="compra-sucesso">

                <div class="icone-sucesso">✓</div>

                <h2>Compra finalizada!</h2>

                <p>Seu pedido foi registrado com sucesso.</p>

                <p>
                    Número do pedido:
                    <strong>${escaparHTML(numeroPedido)}</strong>
                </p>

                <p>Obrigado por comprar na RS Store!</p>

                <a href="comprovante.html">
                    Ver comprovante e acompanhar pedido
                </a>

            </div>
        `;
    }

    const botao = document.querySelector(".btn-confirmar-compra");

    if (botao) {
        botao.disabled = true;
        botao.style.display = "none";
    }
}


// =====================================================
// INICIALIZAÇÃO DA CONFIRMAÇÃO
// =====================================================

document.addEventListener("DOMContentLoaded", function() {

    if (window.location.pathname.endsWith("confirmacao.html")) {
        carregarConfirmacao();
    }
});

function copiarBoletoConfirmacao() {

    const codigo = document.getElementById("codigoBoletoConfirmacao");
    const mensagem = document.getElementById("mensagemBoletoConfirmacao");

    if (!codigo) return;

    navigator.clipboard.writeText(codigo.value)
        .then(function() {
            if (mensagem) mensagem.textContent = "Código copiado!";
        })
        .catch(function() {
            if (mensagem) {
                mensagem.textContent = "Não foi possível copiar o código.";
            }
        });
}


// =====================================================
// SISTEMA DE AVALIAÇÕES
// =====================================================

function avaliarProduto(nomeProduto) {

    const produto = [...document.querySelectorAll(".produto")]
        .find(item =>
            item.querySelector("h3")?.textContent.trim() === nomeProduto
        );

    if (!produto) return;

    salvarAvaliacaoNoCard(nomeProduto, produto);
}

function salvarAvaliacaoNoCard(nomeProduto, produto) {

    const campoComentario = produto.querySelector("textarea");

    if (!campoComentario) return;

    const comentario = campoComentario.value.trim();

    if (comentario === "") {
        alert("Escreva um comentário antes de enviar!");
        return;
    }

    const campoNota = produto.querySelector(".nota-avaliacao");
    const nota = campoNota ? Number(campoNota.value) : 5;

    let avaliacoes = obterArrayLocalStorage("avaliacoesRS");

    // A estrutura original usa um objeto por nome do produto.
    let dadosAvaliacoes = {};

    try {
        dadosAvaliacoes =
            JSON.parse(localStorage.getItem("avaliacoesRS")) || {};
    } catch {
        dadosAvaliacoes = {};
    }

    if (!Array.isArray(dadosAvaliacoes[nomeProduto])) {
        dadosAvaliacoes[nomeProduto] = [];
    }

    dadosAvaliacoes[nomeProduto].push({
        comentario,
        nota,
        data: new Date().toLocaleDateString("pt-BR")
    });

    localStorage.setItem(
        "avaliacoesRS",
        JSON.stringify(dadosAvaliacoes)
    );

    campoComentario.value = "";

    mostrarAvaliacoes(nomeProduto, produto);
}

function mostrarAvaliacoes(nomeProduto, produtoEspecifico = null) {

    let avaliacoes = {};

    try {
        avaliacoes = JSON.parse(localStorage.getItem("avaliacoesRS")) || {};
    } catch {
        avaliacoes = {};
    }

    const produto = produtoEspecifico ||
        [...document.querySelectorAll(".produto")].find(item =>
            item.querySelector("h3")?.textContent.trim() === nomeProduto
        );

    if (!produto) return;

    const lista = produto.querySelector(".lista-avaliacoes");

    if (!lista) return;

    lista.innerHTML = "";

    (avaliacoes[nomeProduto] || []).forEach(avaliacao => {

        lista.innerHTML += `
            <div class="avaliacao-item">
                <p>${"⭐".repeat(Math.min(5, Math.max(1, Number(avaliacao.nota || 5))))}</p>
                <p>${escaparHTML(avaliacao.comentario)}</p>
                <small>${escaparHTML(avaliacao.data)}</small>
            </div>
        `;
    });
}


// =====================================================
// FILTROS DE PRODUTOS
// =====================================================

let categoriaSelecionada = "";

function aplicarFiltros() {

    const campoBusca = document.getElementById("buscaProduto");
    const campoMarca = document.getElementById("filtroMarca");
    const campoMinimo = document.getElementById("precoMinimo");
    const campoMaximo = document.getElementById("precoMaximo");

    const busca = campoBusca ? campoBusca.value.toLowerCase() : "";
    const marca = campoMarca ? campoMarca.value : "";

    const precoMinimo = campoMinimo
        ? parseFloat(campoMinimo.value) || 0
        : 0;

    const valorMaximo = campoMaximo ? campoMaximo.value : "";

    const precoMaximo = valorMaximo === ""
        ? Infinity
        : parseFloat(valorMaximo);

    document.querySelectorAll(".produto").forEach(produto => {

        const titulo = produto.querySelector("h3");
        const nome = titulo ? titulo.textContent.trim() : "";
        const nomeMinusculo = nome.toLowerCase();

        const preco = obterPrecoProdutoElemento(produto);

        let marcaProduto = produto.dataset.marca || "Sem marca";

        // Mantém a identificação automática dos produtos antigos.
        if (!produto.dataset.marca) {

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
        }

        const correspondeNome = nomeMinusculo.includes(busca);

        const correspondeMarca =
            marca === "" || marcaProduto === marca;

        const correspondePreco =
            preco >= precoMinimo && preco <= precoMaximo;

        const correspondeCategoria =
            categoriaSelecionada === "" ||
            produto.dataset.categoria === categoriaSelecionada;

        produto.style.display =
            correspondeNome &&
            correspondeMarca &&
            correspondePreco &&
            correspondeCategoria
                ? ""
                : "none";
    });
}


// =====================================================
// ORDENAR POR MENOR PREÇO
// =====================================================

function ordenarMenorPreco() {

    const container = document.querySelector(".produtos");

    if (!container) return;

    const produtos = Array.from(
        container.querySelectorAll(".produto")
    );

    produtos.sort((a, b) => {
        return obterPrecoProdutoElemento(a) -
            obterPrecoProdutoElemento(b);
    });

    produtos.forEach(produto => container.appendChild(produto));

    aplicarFiltros();
}


// =====================================================
// LIMPAR FILTROS
// =====================================================

function limparFiltros() {

    const busca = document.getElementById("buscaProduto");
    const marca = document.getElementById("filtroMarca");
    const minimo = document.getElementById("precoMinimo");
    const maximo = document.getElementById("precoMaximo");

    if (busca) busca.value = "";
    if (marca) marca.value = "";
    if (minimo) minimo.value = "";
    if (maximo) maximo.value = "";

    categoriaSelecionada = "";

    aplicarFiltros();
}


// =====================================================
// MOSTRAR PRODUTOS EM OFERTA
// =====================================================

function mostrarOfertas(event) {

    if (event) event.preventDefault();

    const busca = document.getElementById("buscaProduto");
    const marca = document.getElementById("filtroMarca");
    const minimo = document.getElementById("precoMinimo");
    const maximo = document.getElementById("precoMaximo");

    if (busca) busca.value = "";
    if (marca) marca.value = "";
    if (minimo) minimo.value = "";
    if (maximo) maximo.value = "";

    categoriaSelecionada = "";

    document.querySelectorAll(".produto").forEach(produto => {
        produto.style.display =
            produto.dataset.oferta === "sim" ? "" : "none";
    });

    const titulo = document.getElementById("tituloProdutos");

    if (titulo) titulo.textContent = "Ofertas";

    const contador = document.getElementById("contadorOfertas");

    if (contador) {

        const totalOfertas = document.querySelectorAll(
            '.produto[data-oferta="sim"]'
        ).length;

        contador.textContent = totalOfertas + " produtos em oferta";
        contador.style.display = "block";
    }

    const produtos = document.getElementById("produtos");

    if (produtos) {
        produtos.scrollIntoView({ behavior: "smooth" });
    }
}


// =====================================================
// OFERTAS DOS PRODUTOS ESTÁTICOS
// =====================================================

function aplicarDescontoOferta(produto) {

    if (produto.dataset.oferta !== "sim") return;

    if (produto.dataset.descontoAplicado === "sim") return;

    const precoElemento = produto.querySelector("p");

    if (!precoElemento) return;

    const precoOriginal = parseFloat(
        precoElemento.textContent
            .replace("R$", "")
            .replace(/\./g, "")
            .replace(",", ".")
            .trim()
    );

    if (!Number.isFinite(precoOriginal)) return;

    const precoOferta = precoOriginal * 0.85;

    precoElemento.innerHTML = `
        <span class="preco-antigo">
            ${formatarDinheiro(precoOriginal)}
        </span>
        <br>
        <strong class="preco-oferta">
            ${formatarDinheiro(precoOferta)}
        </strong>
    `;

    produto.dataset.descontoAplicado = "sim";
}


// =====================================================
// TAMANHOS DOS PRODUTOS
// =====================================================

function obterTamanhosCategoria(categoria) {

    if (categoria === "camiseta" || categoria === "moletom") {
        return ["P", "M", "G", "GG"];
    }

    if (categoria === "calca" || categoria === "short") {
        return ["36", "38", "40", "42", "44", "46"];
    }

    if (categoria === "bone") {
        return ["Único"];
    }

    return [];
}

function configurarTamanhoProduto(produto) {

    if (produto.dataset.tamanhoConfigurado === "sim") return;

    const categoria = produto.dataset.categoria;
    const tamanhos = obterTamanhosCategoria(categoria);

    if (tamanhos.length === 0) return;

    const seletor = document.createElement("select");

    seletor.className = "seletor-tamanho";

    seletor.innerHTML =
        `<option value="">Selecione o tamanho</option>`;

    tamanhos.forEach(tamanho => {

        const opcao = document.createElement("option");

        opcao.value = tamanho;
        opcao.textContent = tamanho;

        seletor.appendChild(opcao);
    });

    const avaliacao = produto.querySelector(".avaliacao-produto");

    if (avaliacao) {
        produto.insertBefore(seletor, avaliacao);
    } else {
        produto.appendChild(seletor);
    }

    produto.dataset.tamanhoConfigurado = "sim";
}


// =====================================================
// CONFIGURAR BOTÃO DE COMPRA DOS PRODUTOS ESTÁTICOS
// =====================================================

function configurarCompraProdutoEstatico(produto) {

    if (produto.dataset.compraConfigurada === "sim") return;

    const botoes = Array.from(
        produto.querySelectorAll(":scope > button")
    );

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

        const seletor = produto.querySelector(".seletor-tamanho");

        if (seletor && !seletor.value) {
            alert("Selecione um tamanho antes de comprar!");
            return;
        }

        const preco = obterPrecoProdutoElemento(produto);

        adicionarCarrinho(
            nome,
            preco,
            imagem,
            seletor ? seletor.value : ""
        );
    });

    produto.dataset.compraConfigurada = "sim";
}


// =====================================================
// GERENCIADOR DE PRODUTOS - ADMINISTRADOR
// =====================================================

function obterProdutosAdmin() {
    return obterArrayLocalStorage("produtosRSStore");
}

function salvarProdutosAdmin(produtos) {
    localStorage.setItem("produtosRSStore", JSON.stringify(produtos));
}

function limparFormularioProdutoAdmin() {

    const form = document.getElementById("formProdutoAdmin");

    if (form) form.reset();

    const id = document.getElementById("produtoIdAdmin");

    if (id) id.value = "";

    const mensagem = document.getElementById("mensagemProdutoAdmin");

    if (mensagem) mensagem.textContent = "";

    const botao = document.querySelector(
        '#formProdutoAdmin button[type="submit"]'
    );

    if (botao) botao.textContent = "Cadastrar produto";
}

function cancelarEdicaoProdutoAdmin() {
    limparFormularioProdutoAdmin();
}

function salvarProdutoAdmin(event) {

    if (event) event.preventDefault();

    const campoId = document.getElementById("produtoIdAdmin");
    const campoNome = document.getElementById("nomeProdutoAdmin");
    const campoPreco = document.getElementById("precoProdutoAdmin");
    const campoCategoria = document.getElementById("categoriaProdutoAdmin");
    const campoMarca = document.getElementById("marcaProdutoAdmin");
    const campoImagem = document.getElementById("imagemProdutoAdmin");
    const campoOferta = document.getElementById("ofertaProdutoAdmin");
    const campoPromocional = document.getElementById("precoPromocionalAdmin");

    if (
        !campoNome ||
        !campoPreco ||
        !campoCategoria ||
        !campoImagem
    ) return;

    const nome = campoNome.value.trim();
    const preco = Number(campoPreco.value);
    const categoria = campoCategoria.value;
    const marca = campoMarca ? campoMarca.value : "Sem marca";
    const imagem = campoImagem.value.trim();

    const oferta = campoOferta
        ? campoOferta.checked
        : false;

    const precoPromocional = campoPromocional &&
        campoPromocional.value !== ""
            ? Number(campoPromocional.value)
            : null;

    const mensagem = document.getElementById("mensagemProdutoAdmin");

    if (!nome || !imagem || !categoria || !Number.isFinite(preco) || preco <= 0) {

        if (mensagem) {
            mensagem.textContent =
                "Preencha nome, preço, categoria e imagem corretamente.";
            mensagem.style.color = "red";
        }

        return;
    }

    if (
        oferta &&
        precoPromocional !== null &&
        (
            !Number.isFinite(precoPromocional) ||
            precoPromocional <= 0 ||
            precoPromocional >= preco
        )
    ) {

        if (mensagem) {
            mensagem.textContent =
                "O preço promocional deve ser menor que o preço normal.";
            mensagem.style.color = "red";
        }

        return;
    }

    const produtos = obterProdutosAdmin();
    const idAtual = campoId ? campoId.value : "";

    if (idAtual) {

        const indice = produtos.findIndex(
            produto => produto.id === idAtual
        );

        if (indice === -1) return;

        produtos[indice] = {
            ...produtos[indice],
            nome,
            preco,
            categoria,
            marca,
            imagem,
            oferta,
            precoPromocional: oferta ? precoPromocional : null
        };

    } else {

        produtos.push({
            id: "RS" + Date.now() + Math.random().toString(16).slice(2, 6),
            nome,
            preco,
            categoria,
            marca,
            imagem,
            oferta,
            precoPromocional: oferta ? precoPromocional : null,
            ativo: true,
            tamanhos: obterTamanhosCategoria(categoria)
        });
    }

    salvarProdutosAdmin(produtos);

    carregarProdutosAdmin();
    renderizarProdutosAdminLoja();

    if (mensagem) {
        mensagem.textContent = "Produto salvo com sucesso!";
        mensagem.style.color = "#00c853";
    }

    limparFormularioProdutoAdmin();
}

function editarProdutoAdmin(id) {

    const produto = obterProdutosAdmin().find(
        item => item.id === id
    );

    if (!produto) return;

    const campoId = document.getElementById("produtoIdAdmin");
    const campoNome = document.getElementById("nomeProdutoAdmin");
    const campoPreco = document.getElementById("precoProdutoAdmin");
    const campoCategoria = document.getElementById("categoriaProdutoAdmin");
    const campoMarca = document.getElementById("marcaProdutoAdmin");
    const campoImagem = document.getElementById("imagemProdutoAdmin");
    const campoOferta = document.getElementById("ofertaProdutoAdmin");
    const campoPromocional = document.getElementById("precoPromocionalAdmin");

    if (!campoNome || !campoPreco || !campoCategoria || !campoImagem) return;

    if (campoId) campoId.value = produto.id;
    campoNome.value = produto.nome;
    campoPreco.value = produto.preco;
    campoCategoria.value = produto.categoria;

    if (campoMarca) campoMarca.value = produto.marca || "Sem marca";
    campoImagem.value = produto.imagem;

    if (campoOferta) campoOferta.checked = Boolean(produto.oferta);

    if (campoPromocional) {
        campoPromocional.value = produto.precoPromocional ?? "";
    }

    const botao = document.querySelector(
        '#formProdutoAdmin button[type="submit"]'
    );

    if (botao) botao.textContent = "Salvar alterações";

    const form = document.getElementById("formProdutoAdmin");

    if (form) {
        form.scrollIntoView({ behavior: "smooth" });
    }
}

function excluirProdutoAdmin(id) {

    if (!confirm("Tem certeza que deseja excluir este produto?")) return;

    const produtos = obterProdutosAdmin().filter(
        produto => produto.id !== id
    );

    salvarProdutosAdmin(produtos);

    carregarProdutosAdmin();
    renderizarProdutosAdminLoja();
}

function alternarStatusProdutoAdmin(id) {

    const produtos = obterProdutosAdmin();

    const produto = produtos.find(item => item.id === id);

    if (!produto) return;

    produto.ativo = produto.ativo === false;

    salvarProdutosAdmin(produtos);

    carregarProdutosAdmin();
    renderizarProdutosAdminLoja();
}

function carregarProdutosAdmin() {

    const lista = document.getElementById("listaProdutosAdmin");
    const contador = document.getElementById("contadorProdutosAdmin");

    const produtos = obterProdutosAdmin();

    if (contador) {
        contador.textContent = produtos.length + " produtos cadastrados";
    }

    if (!lista) return;

    if (produtos.length === 0) {
        lista.innerHTML = "<p>Nenhum produto cadastrado ainda.</p>";
        return;
    }

    lista.innerHTML = produtos.map(produto => {

        const ativo = produto.ativo !== false;

        return `
            <div class="produto-admin-card">

                <img
                    src="${escaparHTML(produto.imagem)}"
                    alt="${escaparHTML(produto.nome)}"
                    onerror="this.style.display='none'"
                >

                <div class="produto-admin-info">

                    <h3>${escaparHTML(produto.nome)}</h3>

                    <p>Categoria: ${escaparHTML(produto.categoria)}</p>

                    <p>Marca: ${escaparHTML(produto.marca || "Sem marca")}</p>

                    <p>Preço: ${formatarDinheiro(produto.preco)}</p>

                    <p>
                        Situação:
                        <strong>${ativo ? "Ativo" : "Inativo"}</strong>
                    </p>

                    ${produto.oferta ? "<p>Produto em oferta</p>" : ""}

                    <button
                        type="button"
                        data-acao="editar"
                        data-id="${escaparHTML(produto.id)}"
                    >
                        Editar
                    </button>

                    <button
                        type="button"
                        data-acao="status"
                        data-id="${escaparHTML(produto.id)}"
                    >
                        ${ativo ? "Desativar" : "Ativar"}
                    </button>

                    <button
                        type="button"
                        data-acao="excluir"
                        data-id="${escaparHTML(produto.id)}"
                    >
                        Excluir
                    </button>

                </div>
            </div>
        `;
    }).join("");

    lista.querySelectorAll("button[data-acao]").forEach(botao => {

        const id = botao.dataset.id;
        const acao = botao.dataset.acao;

        botao.addEventListener("click", function() {

            if (acao === "editar") editarProdutoAdmin(id);
            if (acao === "status") alternarStatusProdutoAdmin(id);
            if (acao === "excluir") excluirProdutoAdmin(id);
        });
    });
}


// =====================================================
// MOSTRAR PRODUTOS DO ADMINISTRADOR NA LOJA
// =====================================================

function renderizarProdutosAdminLoja() {

    const container = document.querySelector(".produtos");

    if (!container) return;

    // Remove somente os cards que vieram do administrador.
    container.querySelectorAll('[data-origem-admin="sim"]').forEach(card => {
        card.remove();
    });

    const produtos = obterProdutosAdmin().filter(
        produto => produto.ativo !== false
    );

    produtos.forEach(produto => {

        const card = document.createElement("div");

        card.className = "produto";

        card.dataset.origemAdmin = "sim";
        card.dataset.idProduto = produto.id;
        card.dataset.categoria = produto.categoria;
        card.dataset.marca = produto.marca || "Sem marca";
        card.dataset.oferta = produto.oferta ? "sim" : "nao";

        let precoExibido = Number(produto.preco);

        if (produto.oferta) {

            if (
                produto.precoPromocional !== null &&
                Number(produto.precoPromocional) > 0
            ) {
                precoExibido = Number(produto.precoPromocional);
            } else {
                precoExibido = Number(produto.preco) * 0.85;
            }
        }

        card.innerHTML = `
            <div class="produto-imagem">
                <img
                    src="${escaparHTML(produto.imagem)}"
                    alt="${escaparHTML(produto.nome)}"
                    onerror="this.style.display='none'"
                >
            </div>

            <h3>${escaparHTML(produto.nome)}</h3>

            <p>
                ${
                    produto.oferta
                        ? `
                            <span class="preco-antigo">
                                ${formatarDinheiro(produto.preco)}
                            </span>
                            <br>
                            <strong class="preco-oferta">
                                ${formatarDinheiro(precoExibido)}
                            </strong>
                        `
                        : formatarDinheiro(produto.preco)
                }
            </p>

            <div class="avaliacao-produto">

                <select class="nota-avaliacao">
                    <option value="5">⭐⭐⭐⭐⭐</option>
                    <option value="4">⭐⭐⭐⭐</option>
                    <option value="3">⭐⭐⭐</option>
                    <option value="2">⭐⭐</option>
                    <option value="1">⭐</option>
                </select>

                <textarea placeholder="Deixe sua avaliação"></textarea>

                <button type="button" class="btn-avaliar">
                    Enviar avaliação
                </button>

                <div class="lista-avaliacoes"></div>

            </div>

            <button type="button" class="btn-comprar-admin">
                Comprar
            </button>
        `;

        const botaoComprar = card.querySelector(".btn-comprar-admin");

        botaoComprar.addEventListener("click", function() {

            const seletor = card.querySelector(".seletor-tamanho");

            if (seletor && !seletor.value) {
                alert("Selecione um tamanho antes de comprar!");
                return;
            }

            const preco = produto.oferta
                ? precoExibido
                : Number(produto.preco);

            adicionarCarrinho(
                produto.nome,
                preco,
                produto.imagem,
                seletor ? seletor.value : ""
            );
        });

        const botaoAvaliar = card.querySelector(".btn-avaliar");

        botaoAvaliar.addEventListener("click", function() {
            salvarAvaliacaoNoCard(produto.nome, card);
        });

        configurarTamanhoProduto(card);

        mostrarAvaliacoes(produto.nome, card);

        container.appendChild(card);
    });
}


// =====================================================
// RELATÓRIOS DO ADMINISTRADOR
// =====================================================

function obterTodosPedidosRelatorio() {

    const pedidosAtivos = obterArrayLocalStorage("pedidosRSStore");
    const pedidosArquivados = obterArrayLocalStorage("pedidosArquivadosRSStore");

    const comprovante = localStorage.getItem("comprovanteCompra");

    let lista = [
        ...pedidosAtivos,
        ...pedidosArquivados
    ];

    // Inclui o último comprovante se ele ainda não estiver no histórico.
    if (comprovante) {

        try {

            const ultimo = JSON.parse(comprovante);

            if (
                ultimo &&
                ultimo.numero &&
                !lista.some(pedido => pedido.numero === ultimo.numero)
            ) {
                lista.push(ultimo);
            }

        } catch {
            // Ignora comprovante inválido.
        }
    }

    // Remove pedidos duplicados pelo número.
    const pedidosUnicos = [];

    lista.forEach(pedido => {

        if (!pedido || !pedido.numero) return;

        const jaExiste = pedidosUnicos.some(
            item => item.numero === pedido.numero
        );

        if (!jaExiste) {
            pedidosUnicos.push(pedido);
        }
    });

    return pedidosUnicos;
}

function carregarRelatoriosAdmin() {

    const pedidos = obterTodosPedidosRelatorio();

    let faturamento = 0;
    let quantidadeItens = 0;

    const vendasProdutos = {};
    const vendasPagamento = {};

    pedidos.forEach(pedido => {

        faturamento += Number(pedido.total || 0);

        const pagamento = pedido.pagamento || "Não informado";

        vendasPagamento[pagamento] =
            (vendasPagamento[pagamento] || 0) + 1;

        (pedido.produtos || []).forEach(produto => {

            const quantidade = Number(produto.quantidade || 1);

            quantidadeItens += quantidade;

            if (!vendasProdutos[produto.nome]) {
                vendasProdutos[produto.nome] = 0;
            }

            vendasProdutos[produto.nome] += quantidade;
        });
    });

    const quantidadePedidos = pedidos.length;

    const ticketMedio = quantidadePedidos > 0
        ? faturamento / quantidadePedidos
        : 0;

    const elementoFaturamento =
        document.getElementById("relatorioFaturamento");

    const elementoPedidos =
        document.getElementById("relatorioPedidos");

    const elementoItens =
        document.getElementById("relatorioItens");

    const elementoTicket =
        document.getElementById("relatorioTicket");

    if (elementoFaturamento) {
        elementoFaturamento.textContent = formatarDinheiro(faturamento);
    }

    if (elementoPedidos) {
        elementoPedidos.textContent = quantidadePedidos;
    }

    if (elementoItens) {
        elementoItens.textContent = quantidadeItens;
    }

    if (elementoTicket) {
        elementoTicket.textContent = formatarDinheiro(ticketMedio);
    }

    const elementoMaisVendidos =
        document.getElementById("relatorioProdutosMaisVendidos");

    if (elementoMaisVendidos) {

        const maisVendidos = Object.entries(vendasProdutos)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10);

        if (maisVendidos.length === 0) {

            elementoMaisVendidos.innerHTML =
                "<p>Nenhuma venda registrada ainda.</p>";

        } else {

            elementoMaisVendidos.innerHTML = maisVendidos.map(
                ([nome, quantidade], indice) => `
                    <div class="relatorio-item">
                        <strong>${indice + 1}. ${escaparHTML(nome)}</strong>
                        <span>${quantidade} vendidos</span>
                    </div>
                `
            ).join("");
        }
    }

    const elementoPagamentos =
        document.getElementById("relatorioVendasPorPagamento");

    if (elementoPagamentos) {

        const pagamentos = Object.entries(vendasPagamento);

        if (pagamentos.length === 0) {

            elementoPagamentos.innerHTML =
                "<p>Nenhum pagamento registrado ainda.</p>";

        } else {

            elementoPagamentos.innerHTML = pagamentos.map(
                ([forma, quantidade]) => `
                    <div class="relatorio-item">
                        <strong>${escaparHTML(forma.toUpperCase())}</strong>
                        <span>${quantidade} pedidos</span>
                    </div>
                `
            ).join("");
        }
    }
}


// =====================================================
// INICIALIZAÇÃO GERAL
// =====================================================

document.addEventListener("DOMContentLoaded", function() {

    // Ofertas dos produtos que já estavam no HTML.
    document.querySelectorAll(".produto").forEach(produto => {

        if (produto.dataset.origemAdmin !== "sim") {
            aplicarDescontoOferta(produto);
        }
    });

    // Configura os tamanhos e os botões dos produtos antigos.
    document.querySelectorAll(".produto").forEach(produto => {

        if (produto.dataset.origemAdmin !== "sim") {
            configurarTamanhoProduto(produto);
            configurarCompraProdutoEstatico(produto);
        }
    });

    // Carrega os produtos cadastrados no administrador.
    renderizarProdutosAdminLoja();

    // Carrega as avaliações dos produtos existentes.
    document.querySelectorAll(".produto").forEach(produto => {

        const titulo = produto.querySelector("h3");

        if (titulo) {
            mostrarAvaliacoes(titulo.textContent.trim(), produto);
        }
    });

    // Inicializa as áreas do administrador quando existirem.
    carregarProdutosAdmin();
    carregarRelatoriosAdmin();
});
