var app = new Vue({
    el: '#app',
    data: {
        username: "Nom d'utilisateur",
        password: "Mot de passe",
        return : {
            info: null
        }
    },
    methods: {
        sendCredential : function () {
            axios
                .post('http://localhost:3000/api/v1/technical/wakeup')
                .then(response => (console.log(response)))
        }
    }
});
