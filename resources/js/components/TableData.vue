<template>
    <div class="aca">
        <VueGoodTable :columns="columns" :rows="data" />
    </div>
</template>

<script>
import "vue-good-table/dist/vue-good-table.css";
import { VueGoodTable } from "vue-good-table";

export default {
    components: {
        VueGoodTable,
    },
    props: {
        data: {
            type: Array,
        },
    },
    data() {
        return {
            attendees: [],
            columns: [
                {
                    label: "Brazalete",
                    field: "serial",
                },
                {
                    label: "Nombre",
                    field: "name",
                },
                {
                    label: "Equipo",
                    field: "color",
                },
                {
                    label: "Conferencia",
                    field: "conference",
                },
                {
                    label: "Zona",
                    field: "zone",
                },
                {
                    label: "Bautizado",
                    field: "baptized",
                },
            ],
        };
    },
    mounted() {
        this.attendees = this.data;
    },
};
</script>

<style></style>
