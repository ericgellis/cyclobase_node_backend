<template>
    <input type="text" v-model="modelUsername"><br>
    <input type="text" v-model="modelPassword"><br>
    <button @click="sendCredential">Envoyer</button>
</template>

<script>
    export default {
        name: "",
        data () {
            return  {
                modelUsername: "Nom d'utilisateur",
                modelPassword: "Mot de passe",
            }
        },
        methods: {
            sendCredential : function () {

                var payload = {
                    userName: this.modelUsername,
                    password: this.modelPassword
                };

                axios
                    .post('/api/v1/users/auth', payload)
                    .then(response => (console.log(response)))
            }
        }
    }
</script>

<style scoped>

</style>
