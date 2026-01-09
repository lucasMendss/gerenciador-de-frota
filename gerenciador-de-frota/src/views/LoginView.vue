<script setup>
import { useCookies } from '@/composables/useCookies';
import { useRouter } from "vue-router"
import { onMounted, ref } from "vue"

const cookies = useCookies();
const router = useRouter();

const campoUserAdmin = ref("");
const campoSenhaAdmin = ref("");
const mostrarSenha = ref(false); 
const erroLogin = ref(false);    
const lembrarMim = ref(false);   

onMounted(() => {
    cookies.remove('adminLogado');
    console.log("Cookie deletado ao voltar para Login.");
})

function toggleMostrarSenha() {
    mostrarSenha.value = !mostrarSenha.value;
}

async function entrar() {
    erroLogin.value = false;

    const loginInserido = campoUserAdmin.value;
    const senhaInserida = campoSenhaAdmin.value;

    try {
        const resposta = await fetch("http://localhost:3000/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                login: loginInserido,
                senha: senhaInserida
            })
        });

        if (!resposta.ok) {
            erroLogin.value = true;
            return;
        }

        const dados = await resposta.json();

        const tempoCookie = lembrarMim.value ? "7d" : "1h";
        
        cookies.set('adminLogado', dados.admin.nome, tempoCookie);

        router.push("/Frota");

    } catch (err) {
        console.error("Erro no login:", err);
        alert("Erro na comunicação com o servidor.");
    }
}
</script>

<template>
    <div id="main">
        
        <div id="cars-wallpaper"></div>
        <div id="form_div">
            <div class="top-content">
                <div id="icon_div">
                    <img src="../assets/logoConcessionaria.png" alt="Logo" id="icon">
                </div>
                
                <div class="titles">
                    <h4>Gestão De Frota</h4>
                    <h5>Logística e Controle</h5>
                    <p>Simplifique o controle da sua frota com tecnologia. Mais eficiência em cada operação.</p>
                </div>  
            </div>

            <div class="middle-content">
                <form @submit.prevent="entrar">
                    
                    <div class="mb-3 input-wrapper">
                        <input 
                            type="text" 
                            class="form-control" 
                            :class="{ 'error-border': erroLogin }"
                            placeholder="Usuário" 
                            v-model="campoUserAdmin"
                        >
                    </div>

                    <div class="mb-3 input-wrapper password-wrapper">
                        <input 
                            :type="mostrarSenha ? 'text' : 'password'" 
                            class="form-control" 
                            :class="{ 'error-border': erroLogin }"
                            placeholder="Senha" 
                            v-model="campoSenhaAdmin"
                        >
                        <span class="eye-icon" @click="toggleMostrarSenha">
                            <svg v-if="!mostrarSenha" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1B263B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                            <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1B263B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                        </span>
                    </div>

                    <div v-if="erroLogin" class="error-msg">
                        Usuário ou senha incorretos.
                    </div>

                    <div class="form-options">
                        <label class="remember-me">
                            <input type="checkbox" v-model="lembrarMim"> Lembrar de mim
                        </label>
                        <a href="#" class="forgot-password">Esqueci a senha</a>
                    </div>

                    <button type="submit" class="btn btn-primary">Entrar</button>
                </form>
            </div>

            <p id="footer-copy">© 2025 Gestão Frota DWEB2.</p>
        </div>
        <router-view />
    </div>
</template>

<style scoped>
:root {
    --azul-escuro-base: #0D1B2A;
    --laranja: #FF8C42;
    --laranja-escuro: #B35012;
    --cinza-pretroleo: #1B263B;
    --cinza-claro: #AABACF;
    --branco-gelo: #E0E6ED;
    --vermelho-erro: #ff4d4d;
}

#main {
    display: flex;
    height: 100vh;
    width: 100vw;
    overflow: hidden;
}

#cars-wallpaper {
    width: 75%;
    background-image: url("../assets/frota.jpeg");
    background-size: cover;
    background-position: center;
    filter: brightness(40%) blur(3px); 
    transform: scale(1.05); 
}

#form_div {
    width: 25%;
    min-width: 350px;
    background-color: var(--azul-escuro-base);
    display: flex;
    flex-direction: column;
    padding: 40px 40px;
    justify-content: space-between; 
    align-items: center;
    text-align: center;
    box-shadow: -10px 0 30px rgba(0,0,0,0.5);
    z-index: 10; 
    position: relative;
}

.top-content {
    margin-top: 4rem;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.middle-content {
    width: 100%;
    max-width: 320px;
}

#icon {
    width: 140px;
    margin-bottom: 5px; 
}

.titles {
    display: flex;
    flex-direction: column;
    gap: 5px; 
}

#form_div h4 {
    color: var(--branco-gelo);
    font-size: 24px;
    font-weight: 700; 
    margin: 0;
    text-transform: uppercase;
    letter-spacing: 1px;
}

#form_div h5 {
    color: var(--cinza-claro);
    font-size: 18px;
    font-weight: 300; 
    margin-top: 0;
}

#form_div p {
    color: var(--cinza-claro);
    font-size: 13px;
    margin-top: 15px;
    opacity: 0.8;
    line-height: 1.4;
}

.input-wrapper {
    width: 100%;
    margin-bottom: 15px;
}

.password-wrapper {
    position: relative; 
}

.form-control {
    width: 100%;
    padding: 12px 15px;
    background-color: var(--branco-gelo);
    color: var(--azul-escuro-base);
    border-radius: 6px;
    border: 2px solid transparent; 
    font-size: 14px;
    height: 3rem;
    transition: all 0.3s;
}

.form-control:focus {
    border-color: var(--laranja);
    outline: none;
    box-shadow: 0 0 8px rgba(255,140,66,0.3);
}

.error-border {
    border-color: #ff4d4d !important;
    background-color: #fff0f0;
}

.error-msg {
    color: #ff4d4d;
    font-size: 12px;
    text-align: left;
    margin-top: -10px;
    margin-bottom: 15px;
    font-weight: 600;
}

.eye-icon {
    position: absolute;
    right: 15px;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    opacity: 0.6;
    display: flex;
    align-items: center;
}

.eye-icon:hover {
    opacity: 1;
}

.form-options {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 12px;
    color: var(--cinza-claro);
    margin-bottom: 20px;
    width: 100%;
}

.remember-me {
    display: flex;
    align-items: center;
    gap: 5px;
    cursor: pointer;
}

.remember-me input {
    cursor: pointer;
}

.forgot-password {
    color: var(--laranja);
    text-decoration: none;
    transition: color 0.2s;
}

.forgot-password:hover {
    color: var(--branco-gelo);
    text-decoration: underline;
}

.btn-primary {
    width: 100%;
    padding: 12px;
    background-color: var(--laranja);
    color: var(--azul-escuro-base);
    border-radius: 6px;
    font-size: 16px;
    border: none;
    font-weight: 700;
    transition: all 0.3s;
    cursor: pointer;
}

.btn-primary:hover {
    background-color:#B35012;
    transform: translateY(-1px);
    color: white;
}

#footer-copy{
    font-size: 11px;
    color: var(--cinza-claro);
    opacity: 0.5;
    margin: 0;
}

@media (max-width: 950px) {
    #cars-wallpaper {
        display: none;
    }

    #form_div {
        width: 100%;
        min-width: auto;
        height: 100vh;
        box-shadow: none;
        justify-content: center;
        gap: 40px;
    }
    
    .top-content {
        margin-bottom: 20px;
    }
}
</style>