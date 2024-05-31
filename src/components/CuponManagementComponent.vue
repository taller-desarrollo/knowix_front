<template>
    <div class="coupon-form">
      <h2>Crear Cupón</h2>
      <form @submit.prevent="createCoupon">
        <div class="form-group">
          <label for="discountType">Tipo de Descuento:</label>
          <select v-model="discountType" id="discountType" required>
            <option value="Percentage">Porcentaje</option>
            <option value="FixedAmount">Cantidad Fija</option>
          </select>
        </div>
        <div class="form-group">
          <label for="discountAmount">Monto de Descuento:</label>
          <input type="number" v-model="discountAmount" id="discountAmount" step="0.01" required>
        </div>
        <div class="form-group">
          <label for="couponCode">Código de Cupón:</label>
          <input type="text" v-model="couponCode" id="couponCode" required>
        </div>
        <div class="form-group">
          <label for="startDate">Fecha de Inicio:</label>
          <input type="datetime-local" v-model="startDate" id="startDate" required>
        </div>
        <div class="form-group">
          <label for="endDate">Fecha de Fin:</label>
          <input type="datetime-local" v-model="endDate" id="endDate" required>
        </div>
        <div class="form-group">
          <label for="minAmountPurchase">Monto Mínimo de Compra:</label>
          <input type="number" v-model="minAmountPurchase" id="minAmountPurchase" step="0.01" required>
        </div>
        <div class="form-group">
          <label for="descriptionPromotion">Descripción de la Promoción:</label>
          <textarea v-model="descriptionPromotion" id="descriptionPromotion" required></textarea>
        </div>
        <button type="submit">Crear Cupón</button>
      </form>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        discountType: 'Percentage',
        discountAmount: 0,
        couponCode: '',
        startDate: '',
        endDate: '',
        minAmountPurchase: 0,
        descriptionPromotion: ''
      };
    },
    methods: {
      async createCoupon() {
        try {
          const response = await fetch('http://localhost:8081/api/cupones/crear', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              discountType: this.discountType,
              discountAmount: parseFloat(this.discountAmount),
              cuponCode: this.couponCode,
              startDate: this.startDate,
              endDate: this.endDate,
              minAmountPurchase: parseFloat(this.minAmountPurchase),
              descriptionPromotion: this.descriptionPromotion
            })
          });
          if (response.ok) {
            const data = await response.json();
            console.log(data);
            alert('Cupón creado correctamente');
          } else {
            const errorData = await response.json();
            alert('Error al crear el cupón: ' + errorData.message);
          }
        } catch (error) {
          console.error(error);
          alert('Error al enviar la solicitud');
        }
      }
    }
  };
  </script>
  <style scoped>
  .coupon-form {
    max-width: 400px;
    margin: 0 auto;
  }
  
  .form-group {
    margin-bottom: 1rem;
  }
  
  label {
    display: block;
    margin-bottom: 0.5rem;
  }
  
  input[type="text"],
  input[type="number"],
  select,
  textarea {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 0.25rem;
  }
  
  button {
    padding: 0.5rem 1rem;
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 0.25rem;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #0056b3;
  }
  
  textarea {
    resize: vertical;
  }
  </style>
  