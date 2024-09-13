<template>
  <v-app>
    <v-main>
      <v-container>
        <v-row justify="center">
          <v-col cols="12" class="text-center">
            <h3>Wait a moment...</h3>
            <v-progress-circular indeterminate color="primary" size="60"></v-progress-circular>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { onMounted } from 'vue';
import api from '../services/api';

export default {
  setup() {
    const redirect = async () => {
      const id = history.state.id;
      const response = await api.get(`/${id}`);
      window.location.href = response.data.data.original_url;
    };

    onMounted(redirect);
  },
};
</script>
