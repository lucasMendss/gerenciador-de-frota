import { createApp } from 'vue'
import App from './App.vue'
import router from './router/router.js'
import VueCookies from 'vue-cookies'

const uppercase = {
  mounted(el) {
    // flag para composição (IME)
    el._composing = false;

    el._ucHandler = () => {
      if (el._composing) return; // não interferir durante composição
      const start = typeof el.selectionStart === 'number' ? el.selectionStart : null;
      const current = el.value;
      const upper = current.toUpperCase();

      // evita loop: só atualiza e dispara evento se houver mudança
      if (current === upper) return;

      el.value = upper;
      el.dispatchEvent(new Event('input')); // atualiza v-model

      if (start !== null) {
        const pos = Math.min(start, el.value.length);
        el.setSelectionRange(pos, pos);
      }
    };

    el._onCompStart = () => (el._composing = true);
    el._onCompEnd = () => { el._composing = false; el._ucHandler(); };

    el.addEventListener('input', el._ucHandler);
    el.addEventListener('compositionstart', el._onCompStart);
    el.addEventListener('compositionend', el._onCompEnd);
  },
  unmounted(el) {
    el.removeEventListener('input', el._ucHandler);
    el.removeEventListener('compositionstart', el._onCompStart);
    el.removeEventListener('compositionend', el._onCompEnd);
  }
};

const app = createApp(App);

app.directive('uppercase', uppercase);

app.use(router)
   .use(VueCookies, { expires: '30min', path: '/' })
   .mount('#app');