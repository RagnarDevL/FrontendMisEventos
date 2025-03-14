<template>
    <div class="home-view">
        <!-- Modal de Advertencia -->
        <WarningModal 
        v-if="showWarningModal" 
        :title="warningTitle" 
        :message="warningMessage" 
        :visible="showWarningModal" 
        @close="showWarningModal = false" 
        />
        <div class="button-container">
            <div class="left-buttons">
                <button v-if="Rol != 'Asistente'" class="add-event-button" @click="openAddEventModal">Agregar Evento</button>
                <button v-if="Rol == 'Admin'" class="add-event-button" @click="openAddUserModal">Agregar Usuario</button>
                <button class="add-event-button" @click="fetchMyEvents">Eventos Registado</button>
                <button class="add-event-button" @click="loadAll">Mis Eventos</button>
                <div>
                    <input 
                        type="text" 
                        v-model="searchTerm" 
                        placeholder="Buscar eventos..." 
                        style="width: 265px;height: 26px;"
                        @input="loadAll" 
                    />
                
    </div>
        </div>
        <div style="display: flex; justify-content: flex-end;">
            <button class="add-event-button" @click="logout">Cerrar Sesión</button>
        </div>
            
        </div>
        
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Título</th>
                    <th>Capacidad</th>
                    <th>Fecha de Creación</th>
                    <th>Fecha de Evento</th>
                    <th>Ubicación</th>
                    <th>Estado del evento</th>
                    <th>Cantidad de Asistentes</th>
                    <th>Acciones Asistentes</th>
                    <th v-if="Rol != 'Asistente'">Acciones Ponentes</th>
                    <th v-if="Rol == 'Organizador'">Acciones Evento</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="event in paginatedEvents" :key="event.id" :data-status="event.status">
                    <td @click="openEditEventModal(event)">{{ event.id }}</td>
                    <td @click="openEditEventModal(event)">{{ event.name }}</td>
                    <td @click="openEditEventModal(event)">{{ event.capacity }}</td>
                    <td @click="openEditEventModal(event)">{{ event.created_at }}</td>
                    <td @click="openEditEventModal(event)">{{ event.event_date }}</td>
                    <td @click="openEditEventModal(event)">{{ event.address }}</td>
                    <td @click="openEditEventModal(event)">{{ event.status }}</td>
                    <td @click="openEditEventModal(event)">{{ event.attendees }}</td>
                    <td v-if="Rol != 'Asistente'">
                        <button class="add-event-button" @click.stop="openAttendeeListModal(event.id)">Ver Asistentes</button>
                        <button v-if="event.status != 'Finalizado' && event.status != 'Cancelado' && event.status != 'Vencido'" class="add-event-button" @click.stop="openAddAttendeeModal(event.id, event.capacity, event.attendees)">Agregar Asistente</button>
                        <button v-if="event.status == 'Pendiente' || event.status == 'Iniciado'" class="add-event-button" @click.stop="AsistirEvento(event.id, event.capacity, event.attendees)">Asistir</button>
                    </td>
                    <td v-if="Rol != 'Asistente'">
                        <button v-if="event.status == 'Pendiente'" class="add-event-button" @click.stop="openAddSpeakerModal(event.id)">Registrar Ponente</button>
                        <button class="add-event-button" @click.stop="fetchSpeakers(event.id)">Ver Ponentes</button>
                    </td>
                    <td v-if="Rol == 'Organizador'">
                        <button v-if="event.status == 'Iniciado'" class="add-event-button" @click.stop="UpdateStatusEvent(event)">Finalizar Evento</button>
                        <button v-if="event.status == 'Pendiente'" class="add-event-button" @click.stop="UpdateStatusEvent(event)">Iniciar Evento</button>
                    </td>
                    <td v-if="Rol == 'Asistente'">
                        <button v-if="event.status == 'Pendiente' || event.status == 'Iniciado'" class="add-event-button" @click.stop="AsistirEvento(event.id, event.capacity, event.attendees)">Asistir</button>
                        <button class="add-event-button" @click.stop="fetchSpeakers(event.id)">Ver Ponentes</button>
                    </td>
                </tr>
            </tbody>
        </table>

        <!-- Controles de paginación -->
        <div class="pagination">
            <button @click="prevPage" :disabled="currentPage === 1">Anterior</button>
            <span>Página {{ currentPage }} de {{ totalPages }}</span>
            <button @click="nextPage" :disabled="currentPage === totalPages">Siguiente</button>
        </div>
                
        <!-- Modal para ver la lista de asistentes -->
        <div v-if="showAttendeeListModal" class="modal">
            <div class="modal-content">
                <span class="close" @click="closeAttendeeListModal">&times;</span>
                <h2>Lista de Asistentes</h2>
                <ul>
                    <li v-for="attendee in attendees" :key="attendee.id">
                        {{ attendee.name }} ({{ attendee.email }})
                    </li>
                </ul>
            </div>
        </div>

        <!-- Modal para editar un evento -->
        <div v-if="showEditEventModal" class="modal">
            <div class="modal-content">
                <span class="close" @click="closeEditEventModal">&times;</span>
                <h2>Editar Evento</h2>
                <form @submit.prevent="updateEvent">
                    <label for="editTitle">Título:</label>
                    <input type="text" id="editTitle" v-model="editEvent.name" required>
                    
                    <label for="editCapacity">Capacidad:</label>
                    <input type="number" id="editCapacity" v-model="editEvent.capacity" required>
                    
                    <label for="editEventDate">Fecha y Hora del Evento:</label>
                    <input type="datetime-local" id="editEventDate" v-model="editEvent.event_date" required>
                    
                    <label for="editAddress">Ubicación:</label>
                    <input type="text" id="editAddress" v-model="editEvent.address" required>
                    
                    <button v-if="Rol != 'Asistente'" type="submit">Guardar Cambios</button>
                </form>
            </div>
        </div>

        <!-- Modal para agregar un asistente -->
        <div v-if="showAddAttendeeModal" class="modal">
            <div class="modal-content">
                <span class="close" @click="closeAddAttendeeModal">&times;</span>
                <h2>Agregar Asistente</h2>
                <form @submit.prevent="addAttendee">
                    <label for="name">Nombre:</label>
                    <input type="text" id="name" v-model="newAttendee.name" required>
                    
                    <label for="email">Email:</label>
                    <input type="email" id="email" v-model="newAttendee.email" required>
                    
                    <button type="submit">Agregar</button>
                </form>
            </div>
        </div>

        <!-- Modal para agregar un evento -->
        <div v-if="showAddEventModal" class="modal">
            <div class="modal-content">
                <span class="close" @click="closeAddEventModal">&times;</span>
                <h2>Agregar Evento</h2>
                <form @submit.prevent="addEvent">
                    <label for="title">Título:</label>
                    <input type="text" id="title" v-model="newEvent.title" required>
                    
                    <label for="capacity">Capacidad:</label>
                    <input type="number" id="capacity" v-model="newEvent.capacity" required>
                    
                    <label for="eventDate">Fecha y Hora del Evento:</label>
                    <input type="datetime-local" id="eventDate" v-model="newEvent.eventDate" required>
                    
                    <label for="address">Ubicación:</label>
                    <input type="text" id="address" v-model="newEvent.address" required>
                    
                    <button type="submit">Agregar</button>
                </form>
            </div>
        </div>

        <!-- Modal para agregar un usuario -->
        <div v-if="showAddUserModal" class="modal">
            <div class="modal-content">
                <span class="close" @click="closeAddUserModal">&times;</span>
                <h2>Agregar Usuario</h2>
                <form @submit.prevent="addUser ">
                    <label for="userEmail">Email:</label>
                    <input type="email" id="userEmail" v-model="newUser .email" required>
                    <label for="userEmail">Nombre:</label>

                    <input type="text" id="UserName" v-model="newUser.UserName" required>
                    
                    <label for="userPassword">Contraseña:</label>
                    <input type="password" id="userPassword" v-model="newUser .password" required>
                    
                    <label for="userRole">Rol:</label>
                    <select id="userRole" v-model="newUser .rol" required class="custom-select">
                        <option value="Admin">Administrador</option>
                        <option value="Organizador">Organizador</option>
                        <option value="Asistente">Asistente</option>
                        <!-- Agrega más roles si es necesario -->
                    </select>
                    <br>
                    
                    <button type="submit">Agregar</button>
                </form>
            </div>
        </div>

        <!-- Modal para agregar un speaker -->
        <div v-if="showAddSpeakerModal" class="modal">
            <div class="modal-content">
                <span class="close" @click="closeAddSpeakerModal">&times;</span>
                <h2>Agregar Speaker</h2>
                <form @submit.prevent="addSpeaker">
                    <label for="speakerName">Nombre:</label>
                    <input type="text" id="speakerName" v-model="newSpeaker.name" required>
                    
                    <label for="speakerDescription">Descripción:</label>
                    <textarea id="speakerDescription" v-model="newSpeaker.description" required></textarea>
                    <br>
                    <button type="submit">Agregar</button>
                </form>
            </div>
        </div>

        <!-- Modal para ver la lista de ponentes -->
        <div v-if="showSpeakersModal" class="modal">
            <div class="modal-content">
                <span class="close" @click="closeSpeakersModal">&times;</span>
                <h2>Lista de Ponentes</h2>
                <ul>
                    <li v-for="speaker in speakers" :key="speaker.id">
                        {{ speaker.name }} ({{ speaker.description }})
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script src="./HomeView.js"></script>

<style lang="scss" scoped>
@import "./HomeView.css";
</style>
