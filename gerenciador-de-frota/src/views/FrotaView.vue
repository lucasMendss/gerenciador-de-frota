<template>
    <main>
        <header>
            <div class="header-content">
                <div class="brand-section">
                    <router-link to="/">
                        <img src="../assets/logoConcessionaria.png" alt="Logo" id="header-logo">
                    </router-link>
                    <div class="welcome-text">
                        <h1>Gestão de Frota</h1>
                        <!--Nome do usuario baseado em cookies-->
                        <p>Bem-vindo, <b>{{ nome }}</b></p>
                    </div>
                </div>
                <!--Botão para adicionar veiculo / abre o modal-->
                <button @click="abrirAdicionar" class="btn-add">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                    Adicionar Veículo
                </button>
            </div>
        </header>

        <!--Botoôes de filtro-->
        <div class="content-wrapper">
            <div class="filtros-container">
                <button v-for="f in filtros" :key="f.valor" class="filter-pill"
                    :class="{ ativo: filtroAtivo === f.valor }" @click="filtroAtivo = f.valor">
                    {{ f.label }}
                </button>
            </div>
            <!--Grade de Carros-->
            <div class="car-grid">
                <div v-for="veiculo in veiculosFiltrados" :key="veiculo.id" class="car-card">

                    <div class="card-header">
                        <div class="model-info">
                            <img :src="veiculo.fabricante"  :alt="veiculo.modelo" class="brand-icon">
                            <h3>{{ veiculo.modelo }}</h3>
                        </div>
                        <span class="status-badge" :class="veiculo.status">
                            {{ formatarStatus(veiculo.status) }}
                        </span>
                    </div>

                    <div class="card-body">
                        <div class="detail-item">
                            <span class="label">Placa</span>
                            <span class="value">{{ veiculo.placa }}</span>
                        </div>
                        <div class="detail-item">
                            <span class="label">Cor</span>
                            <span class="value">{{ veiculo.cor }}</span>
                        </div>
                        <div class="detail-item">
                            <span class="label">Quilometragem</span>
                            <span class="value">{{ veiculo.km }} km</span>
                        </div>
                        <div class="detail-item">
                            <span class="label">Localização</span>
                            <span class="value">{{ veiculo.local }}</span>
                        </div>
                    </div>

                    <div class="card-actions">
                        <button class="btn-icon edit" @click="abrirEditar(veiculo)" title="Editar">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                            Editar
                        </button>
                        <button class="btn-icon delete" @click="remover(veiculo.id)" title="Remover">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path
                                    d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2">
                                </path>
                                <line x1="10" y1="11" x2="10" y2="17"></line>
                                <line x1="14" y1="11" x2="14" y2="17"></line>
                            </svg>
                            Excluir
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div class="modal" :class="{ show: modalAberto }" @click.self="fecharModal">
            <div class="modal-content">
                <div class="modal-header">
                    <h2>{{ tituloModal }}</h2>
                </div>

                <div class="form-grid">
                    <div class="form-group">
                        <label>Fabricante *</label>
                        <select v-model="form.fabricante" :class="{ 'error-border': erroFabricante }">
                            <option value="" disabled>Selecionar Fabricante</option>
                            <option value="BMW">BMW</option>
                            <option value="CHEVROLET">CHEVROLET</option>
                            <option value="FIAT">FIAT</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label>Modelo *</label>
                        <input v-model="form.modelo" :class="{ 'error-border': erroModelo }" v-uppercase type="text">
                    </div>

                    <div class="form-group">
                        <label>Cor *</label>
                        <select v-model="form.cor" required>
                            <option value="" disabled>Selecionar Cor</option>
                            <option value="PRETO">PRETO</option>
                            <option value="BRANCO">BRANCO</option>
                            <option value="PRATA">PRATA</option>
                            <option value="CINZA">CINZA</option>
                            <option value="VERMELHO">VERMELHO</option>
                            <option value="AZUL">AZUL</option>
                            <option value="LARANJA">LARANJA</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label>Placa *</label>
                        <input v-model="form.placa" :class="{ 'error-border': erroPlaca }" v-uppercase type="text">
                        <div v-if="erroPlaca" class="error-msg">
                            Placa deve estar no padrão XXX-1234
                        </div>
                    </div>

                    <div class="form-group">
                        <label>Km</label>
                        <input v-model="form.km" type="number" min="0">
                    </div>

                    <div class="form-group">
                        <label>Local</label>
                        <input v-model="form.local" v-uppercase type="text">
                    </div>

                    <div class="form-group full-width">
                        <label>Situação *</label>
                        <select v-model="form.status" :class="{ 'error-border': erroSituacao }" required>
                            <option value="" disabled>Selecionar Situação</option>
                            <option value="DISPONÍVEL">Disponível</option>
                            <option value="RESERVADO">Reservado</option>
                            <option value="RETIRADO">Retirado</option>
                            <option value="ATRASADO">Atrasado</option>
                        </select>
                    </div>
                </div>

                <div class="modal-footer">
                    <button class="btn ghost" @click="fecharModal">Cancelar</button>
                    <button class="btn primary" @click="enviar">
                        {{ editandoId ? "Salvar" : "Adicionar" }}
                    </button>
                </div>
            </div>
        </div>

        <div class="modal" :class="{ show: modalExcluirAberto }" @click.self="cancelarExclusao">
            <div class="modal-content">

                <div class="modal-header">
                    <h2>Confirmar Exclusão</h2>
                </div>

                <div class="modal-body">
                    <p>Tem certeza que deseja excluir este veículo?</p>
                </div>

                <div class="modal-footer">
                    <button class="btn ghost" @click="cancelarExclusao">Cancelar</button>
                    <button class="btn primary" @click="confirmarExclusao">Excluir</button>
                </div>

            </div>
        </div>

        <div class="modal" :class="{ show: modalAvisoAberto }" @click.self="cancelarExclusao">
            <div class="modal-content">

                <div class="modal-header">
                    <h2>Aviso</h2>
                </div>

                <div class="modal-body">
                    <p>---------------</p>
                </div>

                <div class="modal-footer">
                    <button class="btn ghost" @click="fecharModal">Fechar</button>
                </div>

            </div>
        </div>
    </main>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useCookies } from "@/composables/useCookies";

const router = useRouter();
const cookies = useCookies();
const nome = ref("");
const erroFabricante = ref(false);
const erroModelo = ref(false);
const erroPlaca = ref(false);
const erroSituacao = ref(false);

const veiculos = reactive([]);

onMounted(async () => {
    const admin = cookies.get("adminLogado");
    if (admin) {
        nome.value = admin;
        await carregarVeiculos();
    } else {
        router.push("/");
    }
});

const filtros = [
    { label: "Todos", valor: "TODOS" },
    { label: "Disponíveis", valor: "DISPONÍVEL" },
    { label: "Reservados", valor: "RESERVADO" },
    { label: "Retirados", valor: "RETIRADO" },
    { label: "Atrasados", valor: "ATRASADO" },
];

const filtroAtivo = ref("TODOS");

function formatarStatus(status) {
    const map = {
        'DISPONÍVEL': 'DISPONÍVEL',
        'RESERVADO': 'RESERVADO',
        'RETIRADO': 'RETIRADO',
        'ATRASADO': 'ATRASADO'
    };
    return map[status] || status;
}

const veiculosFiltrados = computed(() => {
    if (filtroAtivo.value === "TODOS") return veiculos;
    return veiculos.filter(v => v.status === filtroAtivo.value);
});

// ---- FUNÇÕES DA API ----
async function carregarVeiculos() {
    try {
        const resposta = await fetch("http://localhost:3000/veiculos", { credentials: 'include' });
        if (!resposta.ok) throw new Error('Erro ao buscar veículos');
        const dados = await resposta.json();
        veiculos.splice(0, veiculos.length);
        dados.forEach(v => {
            veiculos.push({ ...v, fabricante: fabricanteImg(v.fabricante) });
        });
    } catch (err) {
        console.error(err);
    }
}

async function cadastrarVeiculo(veiculo) {
    try {
        const resposta = await fetch("http://localhost:3000/veiculos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: 'include',
            body: JSON.stringify(veiculo)
        });

        const data = await resposta.json().catch(() => null);

        if (!resposta.ok) {
            const msg = data?.error || data?.message || resposta.statusText || "Erro ao cadastrar";
            throw new Error(msg);
        }
        await carregarVeiculos();
    }
    catch (err) {
        console.error(err);
        alert(err.message || "Erro ao cadastrar");
    }
}

async function atualizarVeiculo(id, dados) {
    try {
        const resposta = await fetch(`http://localhost:3000/veiculos/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            credentials: 'include',
            body: JSON.stringify(dados)
        });
        if (!resposta.ok) throw new Error();
        await carregarVeiculos();
    } catch (err) {
        alert("Erro ao atualizar");
    }
}

async function excluirVeiculo(id) {
    try {
        const resposta = await fetch(`http://localhost:3000/veiculos/${id}`, {
            method: "DELETE",
            credentials: 'include'
        });
        if (!resposta.ok) throw new Error();
        await carregarVeiculos();
    } catch (err) {
        alert("Erro ao excluir");
    }
}

// ---- Modais ----
const modalAberto = ref(false);
const editandoId = ref(null);
const modalExcluirAberto = ref(false);
const modalAvisoAberto = ref(false);
const excluirId = ref(null);
const form = reactive({ fabricante: "", modelo: "", cor: "", placa: "", km: "", local: "", status: "" });

const tituloModal = computed(() => editandoId.value ? "Editar Veículo" : "Novo Veículo");

function limparForm() {
    Object.keys(form).forEach(key => form[key] = "");
    erroFabricante.value = false;
    erroModelo.value = false;
    erroPlaca.value = false;
    erroSituacao.value = false;
}

function abrirAdicionar() {
    editandoId.value = null;
    limparForm();
    modalAberto.value = true;
}

function abrirEditar(v) {
    editandoId.value = v.id;
    form.fabricante = obterFabricante(v.fabricante);
    form.modelo = v.modelo;
    form.cor = v.cor;
    form.placa = v.placa;
    form.km = v.km;
    form.local = v.local;
    form.status = v.status;
    modalAberto.value = true;
}

function obterFabricante(imgSrc) {
    return imgSrc.toUpperCase().split('/').pop().split('.')[0];
}

function fabricanteImg(val) {
    return `imgsMarcasDaFrota/${val.toLowerCase()}.png`;
}

function fecharModal() {
    modalAberto.value = false;
    limparForm();
}

async function enviar() {
    if (!form.fabricante) {
        erroFabricante.value = true;
        return;
    } else {
        erroFabricante.value = false;
    }

    if (!form.modelo) {
        erroModelo.value = true;
        return;
    } else {
        erroModelo.value = false;
    }

    if (!form.placa) {
        erroPlaca.value = true;
        return;
    } else {
        erroPlaca.value = false;
    }

    if (!form.status) {
        erroSituacao.value = true;
        return;
    } else {
        erroSituacao.value = false;
    }

    const formatoPadraoPlaca = /^[A-Za-z]{3}-\d{4}$/;
    if (!formatoPadraoPlaca.test(form.placa)) {
        erroPlaca.value = true;
        return
    }

    if (form.km < 0) {
        form.km = 0;
    }
    const dados = { ...form };
    
    if (editandoId.value) await atualizarVeiculo(editandoId.value, dados);
    else await cadastrarVeiculo(dados);
    fecharModal();
}

function remover(id) {
    excluirId.value = id;
    modalExcluirAberto.value = true;
}

function confirmarExclusao() {
    if (excluirId.value !== null) {
        excluirVeiculo(excluirId.value);
    }
    modalExcluirAberto.value = false;
    excluirId.value = null;
}

function cancelarExclusao() {
    modalExcluirAberto.value = false;
    excluirId.value = null;
}
</script>

<style scoped>
main {
    min-height: 100vh;
    background-color: #0D1B2A;
    color: #E0E6ED;
    font-family: 'Segoe UI', sans-serif;
}

header {
    background: rgba(13, 27, 42, 0.95);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    padding: 15px 40px;
    position: sticky;
    top: 0;
    z-index: 10;
}

.header-content {
    max-width: 1400px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.brand-section {
    display: flex;
    align-items: center;
    gap: 20px;
}

#header-logo {
    height: 50px;
    width: auto;
}

.welcome-text h1 {
    font-size: 14px;
    color: #94a3b8;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin: 0;
}

.welcome-text p {
    font-size: 18px;
    margin: 0;
    color: #FFFFFF;
}

.btn-add {
    background: #FF8C42;
    color: #0D1B2A;
    border: none;
    padding: 10px 20px;
    border-radius: 8px;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    transition: 0.2s;
}

.btn-add:hover {
    background: #e07b3a;
    transform: translateY(-2px);
}

.content-wrapper {
    max-width: 1400px;
    margin: 0 auto;
    padding: 30px 40px;
}

.filtros-container {
    display: flex;
    gap: 10px;
    margin-bottom: 30px;
    flex-wrap: wrap;
}

.filter-pill {
    background: transparent;
    border: 1px solid rgba(255, 255, 255, 0.3);
    color: #AABACF;
    padding: 8px 20px;
    border-radius: 50px;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.2s;
}

.filter-pill:hover {
    border-color: #FF8C42;
    color: #FFFFFF;
}

.filter-pill.ativo {
    background: #FF8C42;
    border-color: #FF8C42;
    color: #0D1B2A;
    font-weight: 700;
}

.car-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
}

.car-card {
    background-color: #1b263b;
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 12px;
    overflow: hidden;
    transition: transform 0.2s, box-shadow 0.2s;
    display: flex;
    flex-direction: column;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
}

.car-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
    border-color: rgba(255, 255, 255, 0.3);
}

.card-header {
    padding: 15px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: rgba(0, 0, 0, 0.2);
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.model-info {
    display: flex;
    align-items: center;
    gap: 12px;
}

.brand-icon {
    width: 35px;
    height: 35px;
    object-fit: contain;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5));
    background: white;
    padding: 2px;
    border-radius: 50%;
}

.card-header h3 {
    margin: 0;
    font-size: 18px;
    color: #FFFFFF;
    font-weight: 600;
}

.status-badge {
    font-size: 11px;
    padding: 4px 10px;
    border-radius: 12px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.status-badge.DISPONÍVEL {
    background: rgba(74, 222, 128, 0.2);
    color: #4ade80;
    border: 1px solid #4ade80;
}

.status-badge.RESERVADO {
    background: rgba(96, 165, 250, 0.2);
    color: #60a5fa;
    border: 1px solid #60a5fa;
}

.status-badge.RETIRADO {
    background: rgba(251, 146, 60, 0.2);
    color: #fb923c;
    border: 1px solid #fb923c;
}

.status-badge.ATRASADO {
    background: rgba(248, 113, 113, 0.2);
    color: #f87171;
    border: 1px solid #f87171;
}

.card-body {
    padding: 20px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
}

.detail-item {
    display: flex;
    flex-direction: column;
}

.detail-item .label {
    font-size: 11px;
    color: #94a3b8;
    margin-bottom: 4px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.detail-item .value {
    font-size: 15px;
    font-weight: 600;
    color: #FFFFFF;
}

.card-actions {
    padding: 15px 20px;
    background: rgba(0, 0, 0, 0.2);
    display: flex;
    justify-content: flex-end;
    gap: 15px;
    border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.btn-icon {
    background: transparent;
    border: none;
    color: #AABACF;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    padding: 6px 12px;
    border-radius: 6px;
    transition: all 0.2s;
    font-weight: 500;
}

.btn-icon svg {
    stroke: currentColor;
}

.btn-icon.edit:hover {
    background: rgba(255, 140, 66, 0.15);
    color: #FF8C42;
}

.btn-icon.delete:hover {
    background: rgba(248, 113, 113, 0.15);
    color: #f87171;
}

.error-border {
    border-color: #ff4d4d !important;
    background-color: #fff0f0;
}

.error-msg {
    color: #ff4d4d;
    font-size: 12px;
    text-align: left;
    margin-top: 3px;
    margin-bottom: 15px;
    font-weight: 600;
}

.modal {
    display: none;
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.85);
    z-index: 100;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(5px);
}

.modal.show {
    display: flex;
}

.modal-content {
    background: #1B263B;
    width: 90%;
    max-width: 500px;
    max-height: 90vh;
    /* impede que ultrapasse a altura da tela */
    overflow-y: auto;
    /* ativa scroll interno se necessário */
    border-radius: 12px;
    padding: 10px;
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: var(--branco-gelo);
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
}

.modal-header h2 {
    margin: 0;
    color: var(--branco-gelo);
}

.close-modal:hover {
    color: var(--branco-gelo);
}

.form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
}

.full-width {
    grid-column: span 2;
}

.form-group label {
    display: block;
    font-size: 12px;
    color: #AABACF;
    margin-bottom: 8px;
}

.form-group input,
.form-group select {
    width: 100%;
    background: #0D1B2A;
    border: 1px solid #2c3e50;
    color: var(--branco-gelo);
    padding: 10px;
    border-radius: 6px;
}

.form-group input:focus,
.form-group select:focus {
    border-color: var(--laranja);
    outline: none;
}

.modal-footer {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
    gap: 10px;
}

.btn {
    padding: 10px 20px;
    border-radius: 6px;
    border: none;
    cursor: pointer;
    font-weight: 600;
}

.btn.primary {
    background: var(--laranja);
    ;
    color: #0D1B2A;
}

.btn.primary:hover {
    background: #e07b3a;
}

.btn.ghost {
    background: transparent;
    color: #AABACF;
    border: 1px solid rgba(255, 255, 255, 0.2);
}

.btn.ghost:hover {
    background: rgba(255, 255, 255, 0.05);
    color: #FFFFFF;
    border-color: #FFFFFF;
}

@media (max-width: 768px) {
    .header-content {
        flex-direction: column;
        gap: 15px;
    }

    .car-grid {
        grid-template-columns: 1fr;
    }

    .modal-content {
        width: 95%;
        max-width: none;
        border-radius: 10px;
        padding: 15px;
    }

    .modal-header h2 {
        font-size: 18px;
    }

    .form-grid {
        grid-template-columns: 1fr;
        gap: 15px;
    }

    .form-group label {
        font-size: 13px;
    }

    .form-group input,
    .form-group select {
        padding: 12px;
        font-size: 15px;
    }

    .full-width {
        grid-column: span 1;
    }

    .modal-footer {
        flex-direction: column;
        gap: 10px;
    }

    .btn {
        width: 100%;
        text-align: center;
    }

}
</style>
