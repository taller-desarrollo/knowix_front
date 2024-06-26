<template>
  <div class="container mt-4">
    <div class="card shadow-sm">
      <div class="card-header bg-primary text-white">
        <h1 class="h3 mb-0">
          <i class="bi bi-wallet2"></i> Crear Nueva Forma de Pago
        </h1>
      </div>
      <div class="card-body">
        <form @submit.prevent="submitForm" enctype="multipart/form-data">
          <div class="row g-3">
            <!-- CI Person -->
            <div class="col-md-6">
              <div class="form-floating">
                <input type="text" class="form-control" id="ciPerson" v-model="formData.ciPerson"
                  placeholder="CI Person" />
                <label for="ciPerson"><i class="bi bi-person-fill"></i> Carnet de Identidad</label>
              </div>
            </div>

            <!-- Nombre del Propietario -->
            <div class="col-md-6">
              <div class="form-floating">
                <input type="text" class="form-control" id="nameOwner" v-model="formData.nameOwner"
                  placeholder="Nombre del Propietario" />
                <label for="nameOwner"><i class="bi bi-pencil-square"></i> Nombre del Propietario</label>
              </div>
            </div>

            <!-- Número de Teléfono -->
            <div class="col-md-6">
              <div class="form-floating">
                <input type="text" class="form-control" id="phoneNumber" v-model="formData.phoneNumber"
                  placeholder="Número de Teléfono" />
                <label for="phoneNumber"><i class="bi bi-telephone-fill"></i> Número de Teléfono</label>
              </div>
            </div>

            <!-- Número de Cuenta -->
            <div class="col-md-6">
              <div class="form-floating">
                <input type="text" class="form-control" id="accountNumber" v-model="formData.accountNumber"
                  placeholder="Número de Cuenta" />
                <label for="accountNumber"><i class="bi bi-bank2"></i> Número de Cuenta</label>
              </div>
            </div>

            <!-- Banco -->
            <div class="col-md-6">
              <div class="form-floating">
                <select class="form-select" id="bankBankId" v-model="formData.bankBankId">
                  <option disabled value="">Seleccione un banco</option>
                  <option v-for="bank in banks" :value="bank.bankId" :key="bank.bankId">
                    {{ bank.bankName }}
                  </option>
                </select>
                <label for="bankBankId"><i class="bi bi-building"></i> Banco</label>
              </div>
            </div>

            <!-- Tipo de Cuenta -->
            <div class="col-md-6">
              <div class="form-floating">
                <select class="form-select" id="accountTypeAccountTypeId" v-model="formData.accountTypeAccountTypeId">
                  <option disabled value="">Seleccione tipo de cuenta</option>
                  <option v-for="accountType in accountTypes" :value="accountType.accountTypeId"
                    :key="accountType.accountTypeId">
                    {{ accountType.description }}
                  </option>
                </select>
                <label for="accountTypeAccountTypeId"><i class="bi bi-sort-down"></i> Tipo de Cuenta</label>
              </div>
            </div>

            <!-- Imagen QR -->
            <div class="col-md-12">
              <div class="form-floating">
                <input type="file" class="form-control" id="qrImage" @change="handleFileUpload" placeholder="Imagen QR"
                  accept=".jpg, .jpeg, .png" :max="5242880" />
                <label for="qrImage"><i class="bi bi-qr-code"></i> Imagen QR</label>
                <div v-if="qrImage" class="mt-2">
                  <img :src="previewUrl" class="img-thumbnail" alt="QR Image Preview" style="max-width: 200px" />
                </div>
              </div>
            </div>
          </div>
          <div class="mt-4">
            <button type="submit" class="btn btn-primary btn-lg w-100">
              <i class="bi bi-box-arrow-in-down"></i> Crear
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { usePaymentFormStore } from "../../stores/PaymentFormStore";
import { useRouter } from "vue-router";
import Swal from 'sweetalert2';

export default {
  data() {
    return {
      formData: {
        ciPerson: "",
        nameOwner: "",
        phoneNumber: "",
        accountNumber: "",
        bankBankId: null,
        accountTypeAccountTypeId: null,
      },
      qrImage: null,
      previewUrl: null,
    };
  },
  computed: {
    store() {
      return usePaymentFormStore();
    },
    banks() {
      return this.store.banks;
    },
    accountTypes() {
      return this.store.accountTypes;
    },
  },
  methods: {
    handleFileUpload(event) {
      this.qrImage = event.target.files[0];
      if (this.qrImage) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.previewUrl = e.target.result;
        };
        reader.readAsDataURL(this.qrImage);
      }
    },
    async submitForm() {
      if (
        !this.formData.ciPerson ||
        !this.formData.nameOwner ||
        !this.formData.phoneNumber ||
        !this.formData.accountNumber ||
        !this.formData.bankBankId ||
        !this.formData.accountTypeAccountTypeId ||
        !this.qrImage
      ) {
        Swal.fire({
          icon: 'warning',
          title: 'Campos incompletos',
          text: 'Debe llenar todos los campos antes de enviar el formulario.',
        });
        return;
      }

      let loadingSwal;
      Swal.fire({
        title: 'Cargando',
        text: 'Creando la forma de pago...',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
          loadingSwal = Swal.getPopup();
        }
      });

      try {
        await this.store.submitPaymentMethod(this.formData, this.qrImage);
        loadingSwal && Swal.close(loadingSwal);
        Swal.fire({
          icon: 'success',
          title: 'Forma de pago creada',
          text: 'La forma de pago se ha creado exitosamente.',
        }).then(() => {
          this.router.push({ path: "/payment-administrator" });
        });
      } catch (error) {
        loadingSwal && Swal.close(loadingSwal);
        Swal.fire({
          icon: 'error',
          title: 'Error al crear la forma de pago',
          text: 'Ha ocurrido un error al intentar crear la forma de pago. Por favor, inténtalo de nuevo.',
        });
      }
    }
  },
  mounted() {
    this.store.initializeStore();
    this.router = useRouter();
  },
};
</script>

<style scoped>
.card-header {
  background-color: #0056b3;
  /* Un azul oscuro */
  color: #ffffff;
}

.card {
  border-color: #0056b3;
  /* Bordes azul oscuro */
}

.btn-primary {
  background-color: #48db74;
  /* Color crema para los botones */
  border-color: #48db74;
  /* Borde del mismo color */
}

.form-control,
.form-select {
  background-color: #f8f9fa;
  /* Un ligero crema para los campos de entrada */
  border-color: #ced4da;
  /* Borde suave */
}

.form-label {
  color: #343a40;
  /* Texto oscuro para mayor contraste */
}
</style>
