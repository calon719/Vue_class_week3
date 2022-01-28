import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.29/vue.esm-browser.min.js';

const app = createApp({
  data() {
    return {
      api: {
        baseUrl: 'https://vue3-course-api.hexschool.io/v2',
        login_path: 'admin/signin'
      },
      loginData: {
        username: '',
        password: ''
      },
      isLoading: false,
      isErr: false
    }
  },
  methods: {
    login() {
      this.isLoading = true;
      axios.post(`${this.api.baseUrl}/${this.api.login_path}`, this.loginData)
        .then(res => {
          this.isErr = false;
          const { token, expired } = res.data;
          document.cookie = `sobaToken=${token}; expires=${new Date(expired)};`;
          location.href = './admin_products.html';
        }).catch(err => {
          console.dir(err);
          if (!err.data.success) {
            this.isErr = true;
          };
        }).then(() => {
          this.isLoading = false;
        });
    }
  }
});
app.mount('#app');