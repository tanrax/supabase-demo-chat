
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYzNjEyNTU0OSwiZXhwIjoxOTUxNzAxNTQ5fQ.QTSQoas6btlhjMmzweSCPV3_aEd_68n0b8Nc1fDq40Q'
const SUPABASE_URL = "https://uzleizfxcqpeivafklvy.supabase.co"

const cli = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let app = new Vue({
    el: '#app',
    data: {
        author: '',
        newText: '',
        messages: []
    },
    mounted: function () {
        this.listenerNewMessages();
        this.loadHistory();
    },
    beforeUpdate: function () {
        this.$nextTick(() => {
            this.scrollBottom()
        })
    },
    methods: {
        sendNewMessage: async function () {
            const { data, error } = await cli
                .from('messages')
                .insert([
                    { name: this.author, text: this.newText }
                ])
            // Clean text
            this.newText = ''
        },
        loadHistory: async function () {
            // Get old messages
            let { data: messages, error } = await cli
                .from('messages')
                .select('id,name,text')
            this.messages = messages.map((message) => {
               return {
                   author: message.name,
                   text: message.text
               }
            })
        },
        scrollBottom: function () {
            const messageBody = document.querySelector('#app__messages');
            messageBody.scrollTop = messageBody.scrollHeight - messageBody.clientHeight;
        },
        listenerNewMessages: function () {
            cli
                .from('messages')
                .on('INSERT', payload => {
                    // New message other users
                    app.messages.push({
                        author: payload.new.name,
                        text: payload.new.text,
                    })
                })
                .subscribe()
        }
    }
})