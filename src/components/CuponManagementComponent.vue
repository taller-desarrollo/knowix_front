<template>
    <div class="container">
      <div class="coupon-form">
        <h1>Crear Nuevo Cupón</h1>
        <form @submit.prevent="createCoupon" class="form-grid">
          <div class="form-group">
            <label for="discountType">Tipo de Descuento</label>
            <select v-model="coupon.discountType" @change="updateDiscountLabel" required>
              <option value="Percentage">Porcentaje</option>
              <option value="Fixed Amount">Cantidad Fija</option>
            </select>
          </div>
          <div class="form-group">
            <label for="discountAmount">Cantidad de Descuento ({{ discountLabel }})</label>
            <div class="input-with-label">
              <input type="number" v-model="coupon.discountAmount" step="0.01" required />
              <span class="input-label">{{ discountLabel }}</span>
            </div>
          </div>
          <div class="form-group">
            <label for="cuponCode">Código del Cupón</label>
            <input type="text" v-model="coupon.cuponCode" required />
          </div>
          <div class="form-group">
            <label for="startDate">Fecha de Inicio</label>
            <input type="datetime-local" v-model="coupon.startDate" required />
          </div>
          <div class="form-group">
            <label for="endDate">Fecha de Finalización</label>
            <input type="datetime-local" v-model="coupon.endDate" required />
          </div>
          <div class="form-group">
            <label for="minAmountPurchase">Monto Mínimo de Compra (Bs)</label>
            <div class="input-with-label">
              <input type="number" v-model="coupon.minAmountPurchase" step="0.01" required />
              <span class="input-label">Bs</span>
            </div>
          </div>
          <div class="form-group">
            <label for="descriptionPromotion">Descripción de la Promoción</label>
            <textarea v-model="coupon.descriptionPromotion" placeholder="Ej: por el día de las madres" required></textarea>
          </div>
          <button type="submit" class="submit-btn">Crear Cupón</button>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import Swal from 'sweetalert2';
  
  export default {
    data() {
      return {
        coupon: {
          discountType: 'Percentage',
          discountAmount: 0,
          cuponCode: '',
          startDate: '',
          endDate: '',
          minAmountPurchase: 0,
          descriptionPromotion: '',
        },
        discountLabel: '%'
      };
    },
    methods: {
      updateDiscountLabel() {
        this.discountLabel = this.coupon.discountType === 'Percentage' ? '%' : 'Bs';
      },
      async createCoupon() {
        try {
          const response = await axios.post('http://localhost:8081/api/cupones/crear', this.coupon);
          Swal.fire('¡Cupón creado!', 'El cupón se ha creado exitosamente.', 'success');
          console.log(response.data);
        } catch (error) {
          Swal.fire('Error', 'Hubo un error al crear el cupón.', 'error');
          console.error(error);
        }
      },
    },
  };
  </script>
  
  <style scoped>
  body, html {
    margin: 0;
    padding: 0;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background: linear-gradient(120deg, #f0f0f0, #ffffff);
    font-family: Arial, sans-serif;
  }
  
  .container {
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }
  
  .coupon-form {
    width: 100%;
    background-color: #fff;
    padding: 2rem;
    border-radius: 15px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease-in-out;
  }
  
  .coupon-form:hover {
    transform: translateY(-10px);
  }
  
  h1 {
    text-align: center;
    color: #333;
    margin-bottom: 2rem;
  }
  
  .form-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }
  
  .form-group {
    display: flex;
    flex-direction: column;
  }
  
  .form-group label {
    font-weight: bold;
    margin-bottom: 0.5rem;
    color: #555;
  }
  
  .form-group input,
  .form-group select,
  .form-group textarea {
    padding: 0.75rem;
    border: 1px solid #ccc;
    border-radius: 10px;
    font-size: 1rem;
    background-color: #fff;
    transition: border-color 0.3s ease-in-out;
  }
  
  .input-with-label {
    display: flex;
    align-items: center;
  }
  
  .input-with-label input {
    flex: 1;
  }
  
  .input-label {
    margin-left: 0.5rem;
    font-weight: bold;
    color: #555;
  }
  
  .form-group input:focus,
  .form-group select:focus,
  .form-group textarea:focus {
    border-color: #007bff;
  }
  
  textarea {
    resize: vertical;
    min-height: 100px;
  }
  
  .submit-btn {
    grid-column: span 2;
    padding: 1rem;
    background-color: #007bff;
    border: none;
    border-radius: 10px;
    color: white;
    font-size: 1.25rem;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  
  .submit-btn:hover {
    background-color: #0056b3;
  }
  </style>
  