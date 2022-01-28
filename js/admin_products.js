const path = 'calon';
const api = {
  baseUrl: 'https://vue3-course-api.hexschool.io/v2',
  getProductsAll_path: `api/${path}/admin/products/all`,
  addProduct_path: `api/${path}/admin/product`,
  editProduct_path: `api/${path}/admin/product`,
  delProduct_path: `api/${path}/admin/product`
};

import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.29/vue.esm-browser.min.js';

let productModal = '';
let delProductModal = '';

const app = createApp({
  data() {
    return {
      productsData: [],
      productModalTemp: {
        imagesUrl: [],
      },
      modalStatus: '',
      tempImgUrl: '',
      isLoading: false
    }
  },
  methods: {
    getProductsData() {
      this.isLoading = true;
      axios.get(`${api.baseUrl}/${api.getProductsAll_path}`)
        .then(res => {
          const data = res.data.products;
          this.productsData = Object.keys(data).map(key => data[key]);
        }).catch(err => {
          alert(err.data.message);
          location.href = './index.html';
        }).then(() => {
          this.isLoading = false;
        });
    },
    showModal(status, product) {
      this.modalStatus = status;
      switch (status) {
        case 'add':
          this.productModalTemp = {
            imagesUrl: [],
            is_enabled: 0
          };
          productModal.show();
          break;
        case 'edit':
          this.productModalTemp = JSON.parse(JSON.stringify(product));
          productModal.show();
          break;
        case 'delete':
          this.productModalTemp = { ...product };
          delProductModal.show();
          break;
      };
    },
    addImg() {
      this.productModalTemp.imagesUrl.push(this.tempImgUrl);
      this.tempImgUrl = '';
    },
    updateProduct() {
      let url = '';
      let methods = '';
      switch (this.modalStatus) {
        case 'add':
          url = `${api.baseUrl}/${api.addProduct_path}`;
          methods = 'post';
          break;
        case 'edit':
          url = `${api.baseUrl}/${api.editProduct_path}/${this.productModalTemp.id}`;
          methods = 'put';
          break;
      };

      this.isLoading = true;
      axios[methods](url, {
        data: this.productModalTemp
      }).then(res => {
        productModal.hide();
        this.getProductsData();
      }).catch(err => {
        this.isLoading = false;
        console.dir(err);
      });
    },
    delProduct() {
      this.isLoading = true;
      axios.delete(`${api.baseUrl}/${api.delProduct_path}/${this.productModalTemp.id}`)
        .then(res => {
          this.getProductsData();
          delProductModal.hide();
        }).catch(err => {
          console.dir(err);
        }).then(() => {
          this.isLoading = false;
        });
    }
  },
  mounted() {
    productModal = new bootstrap.Modal(document.getElementById('productModal'), {
      keyboard: false
    });
    delProductModal = new bootstrap.Modal(document.getElementById('delProductModal'), {
      keyboard: false
    });

    const token = document.cookie.replace(/(?:(?:^|.*;\s*)sobaToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    axios.defaults.headers.common['Authorization'] = token;

    this.getProductsData();
  }
});
app.mount('#app');