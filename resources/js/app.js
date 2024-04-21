import './bootstrap';
import { createApp } from 'vue';
import Register from './components/register.vue'; // Importa el componente
import Comedor from './components/Comedor.vue'; // Importa el componente
import TableData from './components/TableData.vue'; // Importa el componente

const app = createApp();

app.component('register-form', Register); 
app.component('comedor-form', Comedor); 
app.component('table-data', TableData); 

app.mount('#app');
