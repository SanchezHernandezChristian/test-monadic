<template>
  <v-container>
    <v-card>
      <v-card-title>
        <v-card-title class="text-h3"> Usuario SPA</v-card-title>
      </v-card-title>
      <tarea />
    </v-card>
  </v-container>
</template>
<script>
import Tarea from '../components/Tarea';

export default {
  name: 'Inicio',

  components: {
    Tarea,
  },
  data() {
    return {};
  },
  methods: {},
};
</script>
