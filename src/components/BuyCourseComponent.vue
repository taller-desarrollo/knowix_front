<template>
  <div class="content">
    <h1>Comprobante de compra de curso</h1>
    <h4>Por favor, verifique que los datos sean correctos, realice el pago y envíe el comprobante de compra.</h4>
    <form @submit.prevent="submitForm" class="buycourse">
      <div class="detailsofcourse">
        <div class="form-group-qr">
          <label for="qrImage">Código QR:</label>
          <img v-if="paymentMethod && paymentMethod.qrImage" :src="`${backUrl}/${paymentMethod.qrImage}`" alt="QR Code" class="qr-image" />
        </div>
        <div class="datacourse">
          <div class="form-group">
            <h5>Detalles para pagar curso</h5><br>
            <label for="amount">Costo del curso (Bs):</label>
            <input type="number" step="0.01" class="form-control" id="amount" v-model.number="purchase.amount" required readonly>
          </div>
          <input type="hidden" class="form-control" id="courseId" v-model="purchase.courseId" required readonly>
          <div class="form-group">
            <label for="courseId">Nombre del curso:</label>
            <input type="text" class="form-control" id="courseId" v-model="purchase.courseName" required readonly>
          </div>
          <input type="hidden" class="form-control" id="paymentMethodId" v-model="purchase.paymentMethodId" required readonly>
          <div class="form-group">
            <label for="paymentMethodId">Número de cuenta del depositado:</label>
            <input type="text" class="form-control" id="paymentMethodId" v-model="purchase.accountNumber" required readonly>
          </div>
          <input type="hidden" class="form-control" id="kcUserKcUuid" v-model="purchase.kcUserKcUuid" required readonly>
        </div>
      </div>
      <div class="form-group">
        <label for="cuponCode">Código de Cupón:</label>
        <input type="text" class="form-control" id="cuponCode" v-model="cuponCode">
        <button type="button" @click="applyCupon">Agregar</button>
      </div>
      <div v-if="cuponApplied" class="alert alert-success">
        ¡Cupón aplicado!
        <div class="detallescompra">
          <strong><u>DETALLES DE LA COMPRA</u></strong><br>
          <p><b>Monto original:</b> {{ originalAmount }} Bs<br>
          <b>Descuento:</b> {{ originalAmount - purchase.amount }} Bs <br>
          <b>Descuento aplicado:</b> {{ discountTypeMessage }}<br><br>
          <b>TOTAL:</b> {{ purchase.amount }} Bs</p>
        </div>
      </div>
      <div class="form-group">
        <label for="image">Comprobante:</label>
        <input type="file" class="form-control" id="image" @change="onFileChange" required>
      </div>
      <button type="submit">ENVIAR</button>
    </form>
  </div>
</template>

<script>
import buyCourse from '@/scripts/buyCourse.js';

export default {
  mixins: [buyCourse],
  data() {
    return {
      cuponCode: '',
      discountTypeMessage: ''
    };
  },
  methods: {
    applyCupon() {
      this.$options.mixins[0].methods.applyCupon.call(this);
    },
    onFileChange(e) {
      this.$options.mixins[0].methods.onFileChange.call(this, e);
    },
    submitForm() {
      this.$options.mixins[0].methods.submitForm.call(this);
    }
  }
};
</script>

<style scoped>
@import '@/styles/BuyCourseStyle.css';
</style>
