var app = new Vue({
    el: '#app',
    data: {
        modelUsername: "Nom d'utilisateur",
        modelPassword: "Mot de passe",
        return : {
            info: null
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
});
