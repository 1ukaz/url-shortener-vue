<template>
  <v-app>
    <v-main>
      <v-container>
        <v-row>
          <v-col cols="12">
            <div class="header">
              <h2>Shortened URLs</h2>
              <v-btn @click="goToCreatePage" color="success" icon="mdi-plus" class="ma-2" icon-only rounded="0" small></v-btn>
            </div>
          </v-col>
        </v-row>
        <v-row v-if="loadingList" justify="center">
          <v-progress-circular indeterminate color="primary" size="60"></v-progress-circular>
        </v-row>
        <v-row v-else>
          <v-row class="grid-header">
            <v-col cols="1">ID</v-col>
            <v-col cols="1">Code</v-col>
            <v-col cols="4">Original URL</v-col>
            <v-col cols="4">Shortened URL</v-col>
            <v-col cols="2">Actions</v-col>
          </v-row>
          <v-row v-for="url in urls" :key="url.id" class="grid-row">
            <v-col cols="1">{{ url.id }}</v-col>
            <v-col cols="1">{{ url.code }}</v-col>
            <v-col cols="4">{{ url.original_url.length > 40 ? url.original_url.slice(0, 40) + '...' : url.original_url }}</v-col>
            <v-col cols="4">{{ url.shortened_url }}</v-col>
            <v-col cols="2">
              <v-btn @click="confirmDelete(url.code)" color="error" class="ma-2" icon-only rounded="0" small>
                <v-progress-circular v-if="loadingDelete && confirmingUrl === url.code" indeterminate color="white" size="20"></v-progress-circular>
                <v-icon v-else>mdi-delete</v-icon>
              </v-btn>
              <v-btn @click="openUrl(url.code)" color="primary" class="ma-2" icon-only rounded="0" small>
                <v-icon>mdi-open-in-new</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-row>
      </v-container>

      <!-- Modal -->
      <v-dialog v-model="dialog" max-width="500">
        <v-card>
          <v-card-title class="headline">Confirm Delete</v-card-title>
          <v-card-text>Are you sure you want to delete the URL '{{ confirmingUrl }}'?</v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn variant="outlined" text="Cancel" @click="dialog = false"></v-btn>
            <v-btn variant="flat" color="primary" text="Confirm" @click="deleteUrl(confirmingUrl)"></v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-main>
  </v-app>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '../services/api';
import {useToast} from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';

export default {
  setup() {
    const urls = ref([]);
    const userId = ref(localStorage.getItem('user_identifier'));
    const router = useRouter();
    const dialog = ref(false);
    const confirmingUrl = ref(null);
    const loadingDelete = ref(false);
    const loadingList = ref(true);
    const toaster = useToast();

    const fetchUrls = async () => {
      try {
        const response = await api.get(`/list?user_identifier=${userId.value}`);
        urls.value = response.data.data.urls;
      } catch (err) {
        toaster.error(err, {
          position: 'bottom-left',
          duration: 5000,
          queue: true
        });
      } finally {
        loadingList.value = false;
      }
    };

    const deleteUrl = async (code) => {
      loadingDelete.value = true;
      try {
        await api.delete(`/${code}`);
        urls.value = urls.value.filter(url => url.code !== code);
        dialog.value = false;
        toaster.success("The URL has been deleted.", {
          position: 'bottom-left',
          duration: 5000,
          queue: true
        });
      } catch (err) {
        toaster.error(err, {
          position: 'bottom-left',
          duration: 5000,
          queue: true
        });
      } finally {
        loadingDelete.value = false;
      }
    };

    const confirmDelete = (id) => {
      confirmingUrl.value = id;
      dialog.value = true;
    };

    const openUrl = (id) => {
      router.push({ name: 'redirect', state: { id } });
    };

    const goToCreatePage = () => {
      router.push({ name: 'create' });
    };

    onMounted(fetchUrls);

    return {
      urls,
      dialog,
      confirmingUrl,
      loadingDelete,
      loadingList,
      deleteUrl,
      confirmDelete,
      openUrl,
      goToCreatePage,
    };
  },
};
</script>

<style>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.grid-header {
  font-weight: bold;
  background-color: #bcbebf;
  color: white;
  padding: 10px;
}

.grid-row {
  padding: 10px;
}

.grid-row:nth-child(even) {
  background-color: #f5f8fa;
}
</style>
