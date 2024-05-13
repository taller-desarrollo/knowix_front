<template>
    <div class="reports-container">
        <div class="tabs">
            <div class="tab" @click="tab = 'contentReports'">Reportes de contenido</div>
            <div class="tab" @click="tab = 'commentReports'">Reportes de comentarios</div>
        </div>

        <div v-if="tab === 'contentReports'" class="report-card" v-for="report in contentReports" :key="report.contentReportId">
            <h2>{{ report.content.contentTitle }}</h2>
            <p>{{ report.status }}</p>
            <p>{{ report.contentReportReason }}</p>
            <p>Publicado por: {{ report.content.kcUuid}}</p>
            <button @click="updateContentReport(report.contentReportId, 'ACTION_REQUIRED')">Aprobar</button>
            <button @click="updateContentReport(report.contentReportId, 'REJECTED')">Rechazar</button>
            <button @click="blockUser(report.content.kcUuid)">Bloquear usuario</button>
        </div>


        <div v-if="tab === 'commentReports'" class="report-card" v-for="report in commentReports" :key="report.commentReportId">
            <h2>{{ report.comment.content }}</h2>
            <p>{{ report.status }}</p>
            <p>{{ report.commentReportReason }}</p>
            <p>Publicado por: {{ report.comment.kcUserKcUuid }}</p>
            <button @click="updateCommentReport(report.commentReportId, 'ACTION_REQUIRED')">Aprobar</button>
            <button @click="updateCommentReport(report.commentReportId, 'REJECTED')">Rechazar</button>
            <button @click="blockUser(report.comment.kcUserKcUuid)">Bloquear usuario</button>
            <button @click="updateCommentReport(report.commentReportId, 'RESOLVED')">Eliminar comentario</button>
        </div>    
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import Swal from 'sweetalert2';
  import ENDPOINTS from '@/shared/endpoints';
  
  export default {
    data() {
      return {
        contentReports: [],
        commentReports: [],
        tab: 'contentReports',
      };
    },
    async created() {
      try {
        const contentResponse = await axios.get(ENDPOINTS.contentReport, {
          headers: {
            Authorization: `Bearer ${this.$keycloak.token}`,
          },
        });
        this.contentReports = contentResponse.data;
  
        const commentResponse = await axios.get(ENDPOINTS.commentReport, {
          headers: {
            Authorization: `Bearer ${this.$keycloak.token}`,
          },
        });
        this.commentReports = commentResponse.data;
      } catch (error) {
        console.error(error);
      }
    },
    methods: {
      async updateContentReport(contentReportId, status) {
        try {
          await axios.put(`${ENDPOINTS.contentReport}/${contentReportId}`, { status }, {
            headers: {
              Authorization: `Bearer ${this.$keycloak.token}`,
            },
          });

          Swal.fire({
                icon: 'success',
                title: '¡Éxito!',
                text: 'El informe de contenido ha sido actualizado correctamente.',
            });
        } catch (error) {
          console.error(error);
        }
      },
      async updateCommentReport(commentReportId, status) {
        try {
          await axios.put(`${ENDPOINTS.commentReport}/${commentReportId}`, { status }, {
            headers: {
              Authorization: `Bearer ${this.$keycloak.token}`,
            },
          });

          Swal.fire({
                icon: 'success',
                title: '¡Éxito!',
                text: 'El informe de comentarios ha sido actualizado correctamente.',
            });
        } catch (error) {
          console.error(error);
        }
      },
      async blockUser(userId) {
        try {
          await axios.put(`${ENDPOINTS.user}/block/${userId}`);
          Swal.fire({
                icon: 'success',
                title: '¡Éxito!',
                text: 'El usuario ha sido bloqueado correctamente.',
            });
        } catch (error) {
          console.error(error);
        }
      },
      async deleteComment(commentReportId, status) {
        try {
          await axios.put(`${ENDPOINTS.commentReport}/${commentReportId}`,{status}, {
            headers: {
              Authorization: `Bearer ${this.$keycloak.token}`,
            },
          });
        } catch (error) {
          console.error(error);
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .tabs {
    display: flex;
    justify-content: center;
    margin-bottom: 2rem;
}

.tab {
    background-color: #16213e;
    color: white;
    padding: 1rem;
    margin: 0 1rem;
    cursor: pointer;
}

.tab:hover {
    background-color: #007BFF;
    color: white;
}
  .reports-container {
    display: grid;
    gap: 1rem;
    width: 100%;
    padding: 2rem;
    background-color: #f7f7f71c;
    color: white;
}

.report-card {
    background-color: #16213e;
    border-radius: 0.5rem;
    padding: 1rem;
    margin-bottom: 20px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: box-shadow 0.3s ease-in-out;
}

.report-card:hover {
    box-shadow: 0 6px 10px rgba(0, 0, 0, 0.15);
}

.report-card h2,
.report-card h3,
.report-card h4 {
    color: white;
}

.report-card p {
    color: #ccc;
}
  </style>