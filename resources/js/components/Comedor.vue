<template>
    <div class="form" :classes="{ loading: loading }">
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
                Buscar
            </button>
        </Form>
    </div>
    <div class="info" v-if="dataAttendee?.name">
        <div class="info__column">
            Nombre: {{ dataAttendee.name }} {{ dataAttendee.lastname }}
        </div>
        <div class="info__column">Iglesia: {{ dataAttendee.church }}</div>
        <div class="info__column">
            Color: {{ getColor(dataAttendee.color) }}
        </div>
    </div>
    <div class="eat" v-if="dataAttendee?.name">
        <div class="eat__column">
            <label for="selectDinner" class="eat__label"
                >Selecciona la comida</label
            >
            <select
                name="selectDinner"
                id="selectDinner"
                class="form__input"
                v-model="selectDinner"
            >
                <option
                    v-for="(option, index) in optionsFiltered"
                    :key="index"
                    :value="option"
                >
                    {{ `${option.day} - ${option.type}` }}
                </option>
            </select>
            <button
                class="btn btn-primary"
                @click="changeEat"
                :disabled="selectDinner === null"
            >
                Marcar comida
            </button>
        </div>
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
                    label: "Código de Brazalete",
                    name: "serial",
                    as: "input",
                    rules: Yup.string().required(),
                },
            ],
        };
        return {
            formSchema,
            formData: {},
            loading: false,
            dataAttendee: {},
            selectDinner: null,
            meals: [],
            optionsFiltered: [],
            options: [
                {
                    day: "Miercoles",
                    date: "2024-03-27",
                    type: "cena",
                    eaten: false,
                },
                {
                    day: "Jueves",
                    date: "2024-03-28",
                    type: "desayuno",
                    eaten: false,
                },
                {
                    day: "Jueves",
                    date: "2024-03-28",
                    type: "almuerzo",
                    eaten: false,
                },
                {
                    day: "Jueves",
                    date: "2024-03-28",
                    type: "cena",
                    eaten: false,
                },
                {
                    day: "Viernes",
                    date: "2024-03-29",
                    type: "desayuno",
                    eaten: false,
                },
                {
                    day: "Viernes",
                    date: "2024-03-29",
                    type: "almuerzo",
                    eaten: false,
                },
                {
                    day: "Viernes",
                    date: "2024-03-29",
                    type: "cena",
                    eaten: false,
                },
                {
                    day: "Sábado",
                    date: "2024-03-30",
                    type: "desayuno",
                    eaten: false,
                },
                {
                    day: "Sábado",
                    date: "2024-03-30",
                    type: "almuerzo",
                    eaten: false,
                },
                {
                    day: "Sábado",
                    date: "2024-03-30",
                    type: "cena",
                    eaten: false,
                },
            ],
        };
    },
    methods: {
        onSubmit() {
            this.loading = true;
            try {
                axios
                    .get(`/api/v1/attendees?serial=${this.formData.serial}`)
                    .then((response) => {
                        const { data, status, message } = response.data;
                        if (status) {
                            this.dataAttendee = data;
                            swal.fire({
                                position: "top-end",
                                icon: "success",
                                title: "Acampante encontrado",
                                showConfirmButton: false,
                                timer: 1500,
                            });
                            this.getMeals();
                        } else {
                            swal.fire({
                                title: "Error",
                                text: message,
                                icon: "error",
                                confirmButtonColor: "#d33",
                                confirmButtonText: "Intentar otra vez",
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
                            }).then((result) => {});
                        }
                    })
                    .catch((error) => {
                        const { message } = error.response.data;
                        swal.fire({
                            title: "Error",
                            text: message,
                            icon: "error",
                            confirmButtonColor: "#d33",
                            confirmButtonText: "Intentar otra vez",
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
                        }).then((result) => {});
                    })
                    .finnaly(() => {
                        this.loading = false;
                    });
            } catch (error) {}
        },
        getColor(color) {
            var c = "";
            switch (color) {
                case "green":
                    c = "Verde";
                    break;

                case "orange":
                    c = "Naranja";
                    break;

                case "purple":
                    c = "Morado";
                    break;

                default:
                    break;
            }
            return c;
        },
        getMeals() {
            this.loading = true;
            try {
                axios
                    .get(`/api/v1/meals?attendee=${this.dataAttendee.id}`)
                    .then((response) => {
                        const { data, status, message } = response.data;
                        if (status) {
                            this.meals = data;
                            // Filtrar las opciones basadas en las fechas de las comidas
                            this.optionsFiltered = this.options.filter(
                                (option) => {
                                    return !this.meals.some(
                                        (meal) =>
                                            meal.date === option.date &&
                                            meal.type === option.type
                                    );
                                }
                            );
                        } else {
                            swal.fire({
                                title: "Error",
                                text: message,
                                icon: "error",
                                confirmButtonColor: "#d33",
                                confirmButtonText: "Intentar otra vez",
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
                            }).then((result) => {});
                        }
                    })
                    .catch((error) => {
                        const { message } = error.response.data;
                        swal.fire({
                            title: "Error",
                            text: message,
                            icon: "error",
                            confirmButtonColor: "#d33",
                            confirmButtonText: "Intentar otra vez",
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
                        }).then((result) => {});
                    })
                    .finnaly(() => {
                        this.loading = false;
                    });
            } catch (error) {}
        },
        changeEat() {
            this.loading = true;
            const data = {
                attendees_id: this.dataAttendee.id,
                day: this.selectDinner.day,
                date: this.selectDinner.date,
                type: this.selectDinner.type,
                eaten: true,
            };
            try {
                axios
                    .post(`/api/v1/meals`, data)
                    .then((response) => {
                        const { data, status, message } = response.data;
                        if (status) {
                            swal.fire({
                                position: "top-end",
                                icon: "success",
                                title: message,
                                showConfirmButton: false,
                                timer: 1500,
                            });
                            this.getMeals();
                        } else {
                            swal.fire({
                                title: "Error",
                                text: message,
                                icon: "error",
                                confirmButtonColor: "#d33",
                                confirmButtonText: "Intentar otra vez",
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
                            }).then((result) => {});
                        }
                    })
                    .catch((error) => {
                        const { message } = error.response.data;
                        swal.fire({
                            title: "Error",
                            text: message,
                            icon: "error",
                            confirmButtonColor: "#d33",
                            confirmButtonText: "Intentar otra vez",
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
                        }).then((result) => {});
                    })
                    .finnaly(() => {
                        this.loading = false;
                    });
            } catch (error) {}
        },
    },
};
</script>

<style scoped>
.eat {
    color: #fff;
    padding: 20px 0;
}
.eat__column {
    display: flex;
    gap: 10px;
    align-items: center;
}
.form {
    color: #fff;
}
.form__group {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px 10px;
    align-items: flex-start;
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

@media only screen and (max-width: 700px) {
    .form__group {
        grid-template-columns: repeat(2, 1fr);
    }
    .eat__column {
        flex-direction: column;
    }
}
@media only screen and (max-width: 420px) {
    .form__group {
        grid-template-columns: repeat(1, 1fr);
    }
}
.form__button {
    margin-top: 30px;
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
.info {
    background-color: #d2d2d2;
    color: #000000;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    border-radius: 10px;
}
</style>
