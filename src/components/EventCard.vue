<template>
    <div class="event-card">
      <h2 class="event-title">{{ event.name }}</h2>
      <p class="event-capacity">Capacidad: {{ event.capacity }} asistentes</p>
      <p class="event-date">Fecha: {{ formatDate(event.date) }}</p>
      <p class="event-description">{{ event.description }}</p>
      <button @click="registerEvent" class="register-button" :disabled="isRegistered">
        {{ isRegistered ? 'Registrado' : 'Registrarse' }}
      </button>
    </div>
  </template>
  
  <script>
  export default {
    name: 'EventCard',
    props: {
      event: {
        type: Object,
        required: true,
      },
      userRegisteredEvents: {
        type: Array,
        required: true,
      },
    },
    data() {
      return {
        isRegistered: false,
      };
    },
    methods: {
      formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
      },
      registerEvent() {
        // Lógica para registrar al usuario en el evento
        // Aquí puedes hacer una llamada a la API para registrar al usuario
        // Por ejemplo:
        this.$emit('register', this.event.id);
        this.isRegistered = true; // Cambia el estado a registrado
      },
    },
    watch: {
      userRegisteredEvents: {
        immediate: true,
        handler(newVal) {
          this.isRegistered = newVal.includes(this.event.id);
        },
      },
    },
  };
  </script>
  
  <style scoped>
  .event-card {
    border: 1px solid #ccc;
    border-radius: 8px;
    padding: 16px;
    margin: 16px 0;
    background-color: #f9f9f9;
    transition: box-shadow 0.3s;
  }
  
  .event-card:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
  
  .event-title {
    font-size: 1.5em;
    margin: 0;
  }
  
  .event-capacity,
  .event-date,
  .event-description {
    margin: 8px 0;
  }
  
  .register-button {
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 10px 15px;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  .register-button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
  
  .register-button:hover:not(:disabled) {
    background-color: #0056b3;
  }
  </style>