import axios from 'axios';
import { ref, onMounted, defineComponent,computed } from 'vue';
import WarningModal from '../Utils/WarningModal.vue'; // Asegúrate de que la ruta sea correcta

export default defineComponent({
    name: 'HomeView',
    components: {
        WarningModal // Registrar el componente de modal
    },
    setup() {
        const events = ref([]);
        const error = ref(null);
        const showAttendeeListModal = ref(false);
        const showAddAttendeeModal = ref(false);
        const showAddEventModal = ref(false);
        const showAddUserModal = ref(false); // Modal para agregar usuario
        const showEditEventModal = ref(false); // Modal para editar evento
        const showAddSpeakerModal = ref(false); 
        const attendees = ref([]);
        const newAttendee = ref({ name: '', email: '' });
        const newEvent = ref({ title: '', capacity: 0, eventDate: '', address: '' });
        const newUser    = ref({ email: '', UserName: '',password: '', rol: 'Organizador' }); // Objeto para el usuario
        const editEvent = ref({ id: null, title: '', capacity: 0, event_date: '', address: '' }); // Objeto para editar evento
        const currentEventId = ref(null);
        const token = localStorage.getItem('access_token');
        const Rol = localStorage.getItem('rol');
        const newSpeaker = ref({ name: '', description: '' }); 
        const showWarningModal = ref(false);
        const warningTitle = ref('');
        const warningMessage = ref('');
        const showSpeakersModal = ref(false); // Controlar la visibilidad del modal
        const speakers = ref([]); // Lista de ponentes
        const searchTerm = ref('');
        const currentPage = ref(1); // Página actual
        const eventsPerPage = 5; // Cantidad de eventos por página


        const fetchEvents = async () => {
            try {
                
            
                const response = await axios.get('http://127.0.0.1:8000/eventsByUser/', {
                    params: {
                        token: token,
                        search: searchTerm.value
                    },
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
                events.value = response.data;
            } catch (err) {
                console.error('Error fetching events:', err);
                showWarning('Inicia sesión para poder ver los eventos.');
                window.location.href = '/login';
            }
        };
        const loadAll = () => {
            fetchEvents();
        };
        const fetchMyEvents = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/eventsMyRegister/', {
                    params: {
                        token: token
                    },
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
                events.value = response.data;
            } catch (err) {
                console.error('Error fetching events:', err);
                showWarning('Inicia sesión para poder ver los eventos.');
            }
        };
        const openAttendeeListModal = async (eventId) => {
            currentEventId.value = eventId;
            try {
                const response = await axios.get(`http://127.0.0.1:8000/events/${eventId}/attendeesByEvent`, {
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
                attendees.value = response.data;
                showAttendeeListModal.value = true;
            } catch (err) {
                console.error('Error fetching attendees:', err);
                showWarning('No se pudieron cargar los asistentes. Intenta de nuevo más tarde.');
            }
        };

        const closeAttendeeListModal = () => {
            showAttendeeListModal.value = false;
        };

        const openAddAttendeeModal = (eventId, capacity, countAsist) => {
            if (countAsist >= capacity) {
                showWarning('Capacidad máxima alcanzada', 'No se puede agregar más asistentes. La capacidad máxima ha sido alcanzada.');
                return;
            } else {
                currentEventId.value = eventId;
                showAddAttendeeModal.value = true;
                newAttendee.value.name ='';
                newAttendee.value.email ='';
            }
        };

        const closeAddAttendeeModal = () => {
            showAddAttendeeModal.value = false;
        };

        const AsistirEvento = async (eventId, capacity, countAsist) => {
            if (countAsist >= capacity) {
                showWarning('Capacidad máxima alcanzada', 'No se puede agregar más asistentes. La capacidad máxima ha sido alcanzada.');
                return;
            } else {
                try {
                    newAttendee.value.name =localStorage.getItem('Nombre');
                    newAttendee.value.email =localStorage.getItem('Email');
                    currentEventId.value = eventId;
                    
                    
                    await axios.post(`http://127.0.0.1:8000/events/${currentEventId.value}/attendees`, {
                        name: newAttendee.value.name,
                        email: newAttendee.value.email
                    }, {
                        headers: {
                            "Content-Type": "application/json"
                        }
                    });
                    newAttendee.value = { name: '', email: '' };
                    
                    showWarning('Asistente agregado exitosamente.', 'success');
                    fetchEvents();
                } catch (err) {
                    if (err.response && err.response.data && err.response.data.detail) {
                        
                        showWarning(err.response.data.detail);

                    } else {
                        showWarning('No se pudo agregar el asistente. Intenta de nuevo más tarde.');

                    }
                }
            }
            
        };

        const addAttendee = async () => {
            try {
                await axios.post(`http://127.0.0.1:8000/events/${currentEventId.value}/attendees`, {
                    name: newAttendee.value.name,
                    email: newAttendee.value.email
                }, {
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
                newAttendee.value = { name: '', email: '' };
                closeAddAttendeeModal();
                fetchEvents();
                showWarning('Asistente agregado exitosamente.', 'success');
                openAttendeeListModal(currentEventId.value);
            } catch (err) {
                console.error('Error adding attendee:', err);
                showWarning('No se pudo agregar el asistente. Intenta de nuevo más tarde.');
            }
        };

        const openAddEventModal = () => {
            showAddEventModal.value = true;
        };

        const closeAddEventModal = () => {
            showAddEventModal.value = false;
        };

        const addEvent = async () => {
            try {
                await axios.post('http://127.0.0.1:8000/events/', 
                {
                    name: newEvent.value.title,
                    capacity: newEvent.value.capacity,
                    event_date: newEvent.value.eventDate,
                    address: newEvent.value.address,
                    status: "Pendiente" 
                }, 
                {
                    headers: {
                        "Content-Type": "application/json"
                    },
                    params: {
                        token: token
                    }
                });
                newEvent.value = { title: '', capacity: 0, eventDate: '', address: '' };
                closeAddEventModal();
                fetchEvents();
                showWarning('Evento agregado exitosamente.', 'success');
            } catch (err) {
                console.error('Error adding event:', err);
                showWarning('No se pudo agregar el evento. Intenta de nuevo más tarde.');
            }
        };

        // Funciones para agregar usuario
        const openAddUserModal = () => {
            showAddUserModal.value = true;
        };

        const closeAddUserModal = () => {
            showAddUserModal.value = false;
            newUser .value = { email: '', password: '', rol: 'Organizador' }; // Resetear el formulario
        };

        const addUser   = async () => {
            try {
                await axios.post('http://127.0.0.1:8000/userCreate/', {
                    email: newUser .value.email,
                    name: newUser .value.UserName,
                    password: newUser .value.password,
                    rol: newUser .value.rol
                }, {
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
                closeAddUserModal();
                fetchEvents(); // Opcional: Recargar eventos si es necesario
                showWarning('Usuario agregado exitosamente.', 'success');
            } catch (err) {
                console.error('Error adding user:', err);
                showWarning('No se pudo agregar el usuario. Intenta de nuevo más tarde.');
            }
        };

        // Funciones para editar evento
        const openEditEventModal = (event) => {
            editEvent.value = { ...event }; // Cargar la información del evento en el modal
            showEditEventModal.value = true; // Mostrar el modal
        };

        const closeEditEventModal = () => {
            showEditEventModal.value = false; // Cerrar el modal
        };

        const updateEvent = async () => {
            try {
                const payload = {
                    name: editEvent.value.title,
                    capacity: editEvent.value.capacity,
                    event_date: editEvent.value.event_date, // Asegúrate de que esto sea un string en formato ISO
                    address: editEvent.value.address,
                    status: "pending" // O el estado que desees
                };

                await axios.put(`http://127.0.0.1:8000/events/${editEvent.value.id}/`, 
                payload,  
                {
                    headers: {
                        "Content-Type": "application/json"
                    },
                    params: {
                        token: token
                    }
                });
                closeEditEventModal(); // Cerrar el modal
                fetchEvents(); // Recargar la lista de eventos
                showWarning('Evento actualizado exitosamente.', 'success');
            } catch (err) {
                console.error('Error updating event:', err);
                showWarning('No se pudo actualizar el evento. Intenta de nuevo más tarde.');
            }
        };

        const UpdateStatusEvent = async (event) => {
            try {

                editEvent.value.id = event.id;
                let payload;
                if (event.status === "Iniciado") {
                    payload = {
                        name: event.name,
                        capacity: event.capacity,
                        event_date: event.event_date, // Asegúrate de que esto sea un string en formato ISO
                        address: event.address,
                        status: "Finalizado" // O el estado que desees
                    };
                }
                else{
                    payload = {
                        name: event.name,
                        capacity: event.capacity,
                        event_date: event.event_date, // Asegúrate de que esto sea un string en formato ISO
                        address: event.address,
                        status: "Iniciado" // O el estado que desees
                    };
                }
                

                await axios.put(`http://127.0.0.1:8000/events/${editEvent.value.id}/`, 
                payload,  
                {
                    headers: {
                        "Content-Type": "application/json"
                    },
                    params: {
                        token: token
                    }
                });
                closeEditEventModal(); // Cerrar el modal
                fetchEvents(); // Recargar la lista de eventos
                showWarning('Evento actualizado exitosamente.', 'success');
            } catch (err) {
                console.error('Error updating event:', err);
                showWarning('No se pudo actualizar el evento. Intenta de nuevo más tarde.');
            }
        };

        const logout = () => {
            localStorage.removeItem('access_token'); // Eliminar el token
            localStorage.removeItem('rol'); // Eliminar el rol si es necesario
            window.location.href = '/login'; // Cambia esto a la ruta de tu página de login
        };

        const showWarning = (message, title = 'Advertencia') => {
            warningMessage.value = message;
            warningTitle.value = title;
            showWarningModal.value = true; // Mostrar el modal de advertencia
        };

        const openAddSpeakerModal = (eventId) => {
            currentEventId.value = eventId; // Guardar el ID del evento actual
            showAddSpeakerModal.value = true; // Mostrar el modal para agregar un speaker
        };

        const closeAddSpeakerModal = () => {
            showAddSpeakerModal.value = false; // Cerrar el modal
        };

        const addSpeaker = async () => {
            try {
                await axios.post(`http://127.0.0.1:8000/speakers/`, {
                    name: newSpeaker.value.name,
                    description: newSpeaker.value.description,
                    event_id: currentEventId.value
                }, {
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
                newSpeaker.value = { name: '', description: '' }; // Resetear el formulario
                closeAddSpeakerModal(); // Cerrar el modal
                fetchEvents(); // Recargar eventos si es necesario
                showWarning('Speaker agregado exitosamente.', 'success');
            } catch (err) {
                console.error('Error adding speaker:', err);
                showWarning('No se pudo agregar el speaker. Intenta de nuevo más tarde.');
            }
        };

        const fetchSpeakers = async (eventId) => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/speakers/${eventId}`, {
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
                speakers.value = response.data; // Guardar la lista de ponentes
                showSpeakersModal.value = true; // Mostrar el modal
            } catch (err) {
                console.error('Error fetching speakers:', err);
                showWarning('El evento no tiene ponentes registrados.');
            }
        };

        const closeSpeakersModal = () => {
            showSpeakersModal.value = false; // Cerrar el modal
        };

        // Funciones para cambiar de página
        const nextPage = () => {
            if (currentPage.value * eventsPerPage < events.value.length) {
                currentPage.value++;
            }
        };

        const prevPage = () => {
            if (currentPage.value > 1) {
                currentPage.value--;
            }
        };

        // Total de páginas
        const totalPages = computed(() => {
            return Math.ceil(events.value.length / eventsPerPage);
        });

        // Computed property para calcular los eventos a mostrar
        const paginatedEvents = computed(() => {
            const start = (currentPage.value - 1) * eventsPerPage;
            return events.value.slice(start, start + eventsPerPage);
        });

        onMounted(() => {
            fetchEvents();
        });

        return {
            events,
            error,
            showAttendeeListModal,
            showAddAttendeeModal,
            showAddEventModal,
            showAddUserModal, // Agregar al retorno
            showEditEventModal, // Agregar al retorno
            attendees,
            newAttendee,
            newEvent,
            newUser  , // Agregar al retorno
            editEvent, // Agregar al retorno
            openAttendeeListModal,
            closeAttendeeListModal,
            openAddAttendeeModal,
            closeAddAttendeeModal,
            addAttendee,
            openAddEventModal,
            closeAddEventModal,
            addEvent,
            openAddUserModal,
            closeAddUserModal,
            addUser  ,
            openEditEventModal, // Agregar al retorno
            closeEditEventModal, // Agregar al retorno
            updateEvent, // Agregar al retorno
            Rol,
            logout,
            showWarningModal, // Agregar al retorno
            warningTitle, // Agregar al retorno
            warningMessage, 
            fetchMyEvents,
            loadAll,
            openAddSpeakerModal,
            closeAddSpeakerModal,
            addSpeaker,
            showAddSpeakerModal,
            newSpeaker,
            fetchSpeakers,
            closeSpeakersModal,
            speakers,
            showSpeakersModal,
            AsistirEvento,
            searchTerm,
            UpdateStatusEvent,
            eventsPerPage,
            currentPage,
            paginatedEvents,
            totalPages,
            prevPage,
            nextPage
        };
    }
});