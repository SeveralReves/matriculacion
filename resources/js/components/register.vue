<!-- Formulario1.vue -->
<template>
    <div class="form" :class="{ loading: loading }">
        <h1 class="form__title">Registrar Nuevo Acampante</h1>
        <Form @submit="onSubmit" class="form__group">
            <div
                v-for="{
                    as,
                    name,
                    label,
                    children,
                    ...attrs
                } in formSchema.fields"
                :key="name"
                class="form__column"
            >
                <label :for="name">{{ label }}</label>
                <Field
                    :as="as"
                    :id="name"
                    :name="name"
                    v-bind="attrs"
                    v-model="formData[name]"
                    class="form__input"
                >
                    <template v-if="children && children.length">
                        <component
                            v-for="(
                                { tag, text, ...childAttrs }, idx
                            ) in children"
                            :key="idx"
                            :is="tag"
                            v-bind="childAttrs"
                        >
                            {{ text }}
                        </component>
                    </template>
                </Field>
                <ErrorMessage :name="name" class="form__error" />
            </div>
            <button class="btn btn-primary form__button" type="submit">
                Guardar
            </button>
        </Form>
    </div>
</template>

<script>
import { Form, Field, ErrorMessage } from "vee-validate";
import * as Yup from "yup";
import axios from "axios";
import swal from "sweetalert2";

export default {
    components: {
        Form,
        Field,
        ErrorMessage,
    },
    data() {
        const formSchema = {
            fields: [
                {
                    label: "Nombre",
                    name: "name",
                    as: "input",
                    rules: Yup.string().required(),
                },
                {
                    label: "Apellido",
                    name: "lastname",
                    as: "input",
                    rules: Yup.string().required(),
                },
                {
                    label: "Sexo",
                    name: "gender",
                    as: "select",
                    children: [
                        {
                            tag: "option",
                            text: "Selecciona una opción",
                            value: "",
                        },
                        {
                            tag: "option",
                            text: "Masculino",
                            value: "M",
                        },
                        {
                            tag: "option",
                            text: "Femenino",
                            value: "F",
                        },
                    ],
                    rules: Yup.string().required(),
                },
                {
                    label: "Cédula de Identidad",
                    name: "document_id",
                    as: "input",
                    rules: Yup.string(),
                },
                {
                    label: "Fecha de Nacimiento",
                    name: "birthdate",
                    as: "input",
                    type: "date",
                },
                {
                    label: "Correo Electrónico",
                    name: "email",
                    as: "input",
                    rules: Yup.string().email().required(),
                },
                {
                    label: "Zona",
                    name: "zone",
                    as: "select",
                    children: [
                        {
                            tag: "option",
                            value: "",
                            text: "Selecciona una opción",
                        },
                        {
                            tag: "option",
                            text: "Zona I",
                            value: "1",
                        },
                        {
                            tag: "option",
                            text: "Zona II",
                            value: "2",
                        },
                        {
                            tag: "option",
                            text: "Zona III",
                            value: "3",
                        },
                        {
                            tag: "option",
                            text: "Zona IV",
                            value: "4",
                        },
                        {
                            tag: "option",
                            text: "Zona V",
                            value: "5",
                        },
                    ],
                    rules: Yup.string().required(),
                },
                {
                    label: "Iglesia",
                    name: "church",
                    as: "input",
                    rules: Yup.string().required(),
                },
                {
                    label: "Es bautizado",
                    name: "baptized",
                    as: "select",
                    children: [
                        {
                            tag: "option",
                            text: "Selecciona una opción",
                            value: "",
                        },
                        {
                            tag: "option",
                            text: "Si",
                            value: true,
                        },
                        {
                            tag: "option",
                            text: "No",
                            value: false,
                        },
                    ],
                    rules: Yup.boolean().required(),
                },
                {
                    label: "Equipo",
                    name: "color",
                    as: "select",
                    children: [
                        {
                            tag: "option",
                            text: "Selecciona una opción",
                            value: "",
                        },
                        {
                            tag: "option",
                            text: "Verde",
                            value: "green",
                        },
                        {
                            tag: "option",
                            text: "Naranja",
                            value: "orange",
                        },
                        {
                            tag: "option",
                            text: "Morado",
                            value: "purple",
                        },
                    ],
                    rules: Yup.string().required(),
                },
                {
                    label: "Número de pulsera",
                    name: "serial",
                    as: "input",
                    rules: Yup.string().required(),
                },
                {
                    label: "Conferencia",
                    name: "conference",
                    as: "select",
                    children: [
                        {
                            tag: "option",
                            text: "Selecciona una opción",
                            value: "",
                        },
                        {
                            tag: "option",
                            text: "Liceos",
                            value: "L",
                        },
                        {
                            tag: "option",
                            text: "Universidades",
                            value: "U",
                        },
                        {
                            tag: "option",
                            text: "Vocacional",
                            value: "V",
                        },
                    ],
                    rules: Yup.string(),
                },
                {
                    label: "Taller",
                    name: "workshop",
                    as: "select",
                    children: [
                        {
                            tag: "option",
                            text: "Selecciona una opción",
                            value: "",
                        },
                        {
                            tag: "option",
                            text: "Misión",
                            value: "Mision",
                        },
                        {
                            tag: "option",
                            text: "Taller de electrónica nivel básico",
                            value: "Taller de electronica nivel basico",
                        },
                        {
                            tag: "option",
                            text: "¿Como preparar sermones y clases biblicas?",
                            value: "¿Como preparar sermones y clases biblicas?",
                        },
                        {
                            tag: "option",
                            text: "Principios generales de la Dirección de alabanza",
                            value: "Principios generales de la Direccion de alabanza",
                        },
                        {
                            tag: "option",
                            text: "Primeros auxilios básicos",
                            value: "Primeros auxilios basicos",
                        },
                        {
                            tag: "option",
                            text: "¡Excelencia o nada!",
                            value: "Excelencia o nada!",
                        },
                        {
                            tag: "option",
                            text: "Finanzas personales",
                            value: "Finanzas Personales",
                        },
                        {
                            tag: "option",
                            text: "Caracter cristiano y Vida devocional",
                            value: "Caracter cristiano y Vida devocional",
                        },
                    ],
                    rules: Yup.string(),
                },
                {
                    label: "Pago",
                    name: "payment",
                    as: "select",
                    children: [
                        {
                            tag: "option",
                            text: "Selecciona una opción",
                            value: "",
                        },
                        {
                            tag: "option",
                            text: "Promocion",
                            value: "Promocion",
                        },
                        {
                            tag: "option",
                            text: "Preventa 18",
                            value: "Preventa 18",
                        },
                        {
                            tag: "option",
                            text: "Preventa 20",
                            value: "Preventa 20",
                        },
                        {
                            tag: "option",
                            text: "Preventa Niños 10",
                            value: "Preventa Niños 10",
                        },
                        {
                            tag: "option",
                            text: "Niños 13",
                            value: "Niños 13",
                        },
                        {
                            tag: "option",
                            text: "Pago normal 25 ",
                            value: "Pago normal 25",
                        },
                    ],
                    rules: Yup.string(),
                },
                {
                    label: "Referencia",
                    name: "reference",
                    as: "input",
                    rules: Yup.string().required(),
                },
            ],
        };

        return {
            loading: false,
            formSchema,
            formData: {},
        };
    },
    methods: {
        onSubmit() {
            this.loading = true;
            try {
                axios
                    .post("/api/v1/attendees", this.formData)
                    .then(function (response) {
                        const { data, status, message } = response.data;
                        if (status) {
                            swal.fire({
                                title: "Exito",
                                text: message,
                                icon: "success",
                                showCancelButton: true,
                                confirmButtonColor: "#3085d6",
                                cancelButtonColor: "#d33",
                                confirmButtonText: "Ver listado",
                                cancelButtonText: "Registrar otro",
                                showClass: {
                                    popup: `
                                      animate__animated
                                      animate__fadeInUp
                                      animate__faster
                                    `,
                                },
                                hideClass: {
                                    popup: `
                                      animate__animated
                                      animate__fadeOutDown
                                      animate__faster
                                    `,
                                },
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    window.location.href = "/listado";
                                }else{
                                    window.location.href = "/registrar";
                                }
                            });
                        }
                    })
                    .catch(function (error) {
                        console.log(error);
                    })
                    .finnaly(function () {
                        this.loading = false;
                    });
            } catch (error) {}
        },
    },
};
</script>
<style scoped>
.form {
    color: #fff;
}
.form__group {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px 10px;
    padding: 20px 0;
}
.form__column {
    display: flex;
    flex-direction: column;
    gap: 5px;
}
.form__title {
    font-size: 28px;
    font-weight: 800;
}
.form__input {
    border-radius: 5px;
    padding: 10px;
    color: #000000;
    border: 1px solid #000000;
}
.form__input:focus-visible {
    outline: none;
    border: 1px solid #be1212;
    box-shadow: 3px 4px 4px 5px rgba(237, 19, 19, 0.2);
}
.form__error {
    font-size: 14px;
    color: #be1212;
    text-transform: capitalize;
}
select.form__input {
    background-image: url("/public/img/flecha.png"); /*aquí deberás escribir la ruta de la imagen que utilizarás como flecha del desplegable*/
    background-repeat: no-repeat;
    background-position: right center;
    -webkit-appearance: none;
    -moz-appearance: none;
    -o-appearance: none;
    appearance: none;
    background-size: 12px;
    background-position-x: 96%;
}
select.form__input::-ms-expand {
    display: none; /*Evita que se muestre la flecha por defecto en versiones de IE*/
}

@media only screen and (min-width: 700px) {
    .form__button {
        grid-column: 1/4;
    }
}
@media only screen and (max-width: 700px) {
    .form__group {
        grid-template-columns: repeat(2, 1fr);
    }
}
@media only screen and (max-width: 420px) {
    .form__group {
        grid-template-columns: repeat(1, 1fr);
    }
}
.loading::before {
    content: "";
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(255, 255, 255, 0.5);
    z-index: 10;
}
.loading::after {
    content: "";
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    height: 100px;
    width: 100px;
    background-image: url("/public/img/loading.gif");
    background-size: contain;
    z-index: 20;
}
</style>
