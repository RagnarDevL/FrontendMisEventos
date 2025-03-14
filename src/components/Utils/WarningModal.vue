<template>
  <div v-if="visible" class="modal-overlay">
    <div class="modal-content">
      <span class="close" @click="closeModal">&times;</span>
      <h2>{{ title }}</h2>
      <p>{{ message }}</p>
      <button class="modal-button" @click="closeModal">Cerrar</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WarningModal',
  props: {
    title: {
      type: String,
      default: 'Advertencia'
    },
    message: {
      type: String,
      required: true
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    closeModal() {
      this.$emit('close'); // Emitir un evento para cerrar el modal
    }
  }
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6); /* Fondo más oscuro para mayor contraste */
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background-color 0.3s ease; /* Transición suave para el fondo */
}

.modal-content {
  background: white;
  padding: 30px; /* Mayor padding para un mejor espaciado */
  border-radius: 8px; /* Bordes redondeados */
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2); /* Sombra para dar profundidad */
  width: 90%; /* Ancho más responsivo */
  max-width: 500px; /* Ancho máximo para pantallas grandes */
  position: relative; /* Para posicionar el botón de cerrar */
}

.close {
  color: #aaa;
  position: absolute;
  top: 10px;
  right: 15px;
  font-size: 28px;
  font-weight: bold;
  cursor: pointer;
  transition: color 0.3s ease; /* Transición suave para el color */
}

.close:hover {
  color: #ff4d4d; /* Color más atractivo al pasar el mouse */
}

.modal-button {
  padding: 12px 20px; /* Espaciado interno */
  background-color: #007bff; /* Color de fondo */
  color: white; /* Color del texto */
  border: none; /* Sin borde */
  border-radius: 4px; /* Bordes redondeados */
  cursor: pointer; /* Cambiar el cursor al pasar el mouse */
  transition: background-color 0.3s ease; /* Transición suave para el fondo */
}

.modal-button:hover {
  background-color: #0056b3; /* Color más oscuro al pasar el mouse */
}
</style>