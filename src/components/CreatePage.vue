<template>
  <v-app>
    <v-main>
      <v-container>
        <h2>Create URL</h2>
        <v-form @submit.prevent="createUrl">
          <v-text-field
            v-model="originalUrl"
            label="Original URL"
            prepend-icon="mdi-link"
            :error-messages="error"
            @keypress="error = ''"
            required
          ></v-text-field>
          <v-btn type="submit" color="primary" :disabled="loading">
            <v-progress-circular
              v-if="loading"
              indeterminate
              color="white"
              size="20"
            ></v-progress-circular>
            <span v-else>CREATE</span>
          </v-btn>
        </v-form>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { ref } from 'vue';
import { v4 as uuidv4 } from 'uuid';
import api from '../services/api';
import { useRouter } from 'vue-router';
import {useToast} from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';

export default {
  setup() {
    const originalUrl = ref('');
    const error = ref('');
    const loading = ref(false);
    const userId = ref(localStorage.getItem('user_identifier') || uuidv4());
    const router = useRouter();
    const toaster = useToast();

    if (!localStorage.getItem('user_identifier')) {
      localStorage.setItem('user_identifier', userId.value);
    }

    const createUrl = async () => {
      loading.value = true;
      try {
        const response = await api.post('/shorten', {
          original_url: originalUrl.value,
          user_identifier: userId.value,
        });
        if (response.status === 201) {
          toaster.success(response.data.message, {
            position: 'bottom-left',
            duration: 5000,
            queue: true
          });
          router.push('/list');
        } else {
          toaster.error('Error creating URL', {
            position: 'bottom-left',
            duration: 5000,
            queue: true
          });
        }
      } catch (err) {
        error.value = err.response.data.message;
        toaster.error(err.response.data.message, {
          position: 'bottom-left',
          duration: 5000,
          queue: true
        });
      } finally {
        loading.value = false;
      }
    };

    return {
      originalUrl,
      createUrl,
      error,
      loading,
    };
  },
};
</script>

<style>
@import '~vuetify/styles';
</style>
