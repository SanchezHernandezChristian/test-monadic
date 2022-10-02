<template>
  <v-container>
    <v-data-table :headers="headers" :items="usuarios" sort-by="calories" class="elevation-1">
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Tareas</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-autocomplete class="mr-6" :items="items" v-model="estatusFilter" label="Filtrar por estatus" @change="initialize()" clearable></v-autocomplete>
          <v-dialog v-model="dialog" max-width="800px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on"> Nueva Tarea </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="text-h5">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-form ref="form" v-model="valid" lazy-validation>
                    <v-row>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field v-model="editedItem.nombre" label="Nombre" required></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-menu v-model="menu2" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="auto">
                          <template v-slot:activator="{ on, attrs }">
                            <v-text-field v-model="editedItem.fecha" label="Fecha" prepend-icon="mdi-calendar" readonly v-bind="attrs" v-on="on"></v-text-field>
                          </template>
                          <v-date-picker v-model="editedItem.fecha" @input="menu2 = false"></v-date-picker>
                        </v-menu>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-select :items="items" v-model="editedItem.estatus" label="Estatus"></v-select>
                      </v-col>
                    </v-row>
                  </v-form>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close"> Cancelar </v-btn>
                <v-btn color="blue darken-1" text @click="save" :disabled="!valid"> Guardar </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-card-title class="text-h5">Estas seguro de eliminar este elemento?</v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeDelete">Cancelar</v-btn>
                <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:item.estatus="{ item }">
        <v-chip :color="getColor(item.estatus)" dark>
          {{ item.estatus }}
        </v-chip>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-btn depressed color="purple" dark class="mr-2" @click="updateStatusItem(item)">
          Cambiar Estatus <v-icon right small> mdi-compare-vertical </v-icon>
        </v-btn>
        <v-btn depressed color="primary" class="mr-2" @click="editItem(item)"> Editar <v-icon right small> mdi-pencil </v-icon> </v-btn>
        <v-btn depressed color="warning" @click="deleteItem(item)"> Eliminar <v-icon right small> mdi-delete </v-icon> </v-btn>
      </template>
      <template v-slot:no-data>
        <v-btn color="primary" @click="initialize"> Reset </v-btn>
      </template>
    </v-data-table>
  </v-container>
</template>
<script>
import axios from 'axios';
import Swal from 'sweetalert2';
export default {
  data: () => ({
    dialog: false,
    dialogDelete: false,
    headers: [
      { text: 'Nombre', value: 'nombre' },
      { text: 'Fecha', value: 'fecha' },
      { text: 'Estatus', value: 'estatus' },
      { text: 'Actions', value: 'actions', sortable: false },
    ],
    items: ['Pendiente', 'Completado'],
    valid: false,
    usuarios: [],
    editedIndex: -1,
    editedItem: {
      nombre: null,
      estatus: '',
      fecha: '',
    },
    defaultItem: {
      nombre: null,
      estatus: '',
      fecha: '',
    },
    url: 'http://127.0.0.1:3000/api',
    date: '',
    menu2: false,
    estatusFilter: null,
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'Nueva tarea' : 'Editar tarea';
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },

  created() {
    this.initialize();
  },

  methods: {
    initialize() {
      let url = this.estatusFilter == null ? this.url + '/users' : this.url + '/findUsersByStatus/' + this.estatusFilter;
      axios.get(url).then((result) => {
        result.data.forEach((element) => (element.fecha = element.fecha.split('T')[0]));
        this.usuarios = result.data;
        this.close();
      });
    },

    editItem(item) {
      this.editedIndex = this.usuarios.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.usuarios.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    updateStatusItem(item) {
      this.editedIndex = this.usuarios.indexOf(item);
      this.editedItem = Object.assign({}, item);
      const nuevoEstatus = this.editedItem.estatus === 'Pendiente' ? 'Completado' : 'Pendiente';
      axios
        .put(
          this.url + '/updateUser/' + this.editedItem._id,
          {
            nombre: this.editedItem.nombre,
            fecha: this.editedItem.fecha,
            estatus: nuevoEstatus,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
          }
        )
        .then((response) => {
          if (response) {
            Swal.fire({
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 3000,
              title: 'Guardado correctamente',
              icon: 'success',
            });
            this.initialize();
          }
        })
        .catch((error) => {
          console.error(error);
          Swal.fire({
            allowOutsideClick: false,
            title: 'Error',
            text: 'Error al guardar los datos',
            icon: 'error',
          });
        });
    },

    deleteItemConfirm() {
      axios
        .delete(this.url + '/deleteUser/' + this.editedItem._id, {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        })
        .then((response) => {
          if (response) {
            Swal.fire({
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 3000,
              title: 'Guardado correctamente',
              icon: 'success',
            });
            this.initialize();
          }
        })
        .catch((error) => {
          if (error.response.status == 403) {
            Swal.fire({
              allowOutsideClick: false,
              title: 'Error',
              text: 'Error al guardar los datos',
              icon: 'error',
            });
          } else
            Swal.fire({
              allowOutsideClick: false,
              title: 'Error',
              text: 'Error al guardar los datos',
              icon: 'error',
            });
        });
      this.closeDelete();
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    save() {
      if (this.editedIndex > -1) {
        axios
          .put(
            this.url + '/updateUser/' + this.editedItem._id,
            {
              nombre: this.editedItem.nombre,
              fecha: this.editedItem.fecha,
              estatus: this.editedItem.estatus,
            },
            {
              headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
              },
            }
          )
          .then((response) => {
            if (response) {
              Swal.fire({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                title: 'Guardado correctamente',
                icon: 'success',
              });
              this.initialize();
            }
          })
          .catch((error) => {
            console.error(error);
            Swal.fire({
              allowOutsideClick: false,
              title: 'Error',
              text: 'Error al guardar los datos',
              icon: 'error',
            });
          });
      } else {
        axios
          .post(
            this.url + '/createUser',
            {
              nombre: this.editedItem.nombre,
              fecha: this.editedItem.fecha,
              estatus: this.editedItem.estatus,
            },
            {
              headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
              },
            }
          )
          .then((response) => {
            if (response) {
              Swal.fire({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                title: 'Guardado correctamente',
                icon: 'success',
              });
              this.initialize();
            }
          })
          .catch((error) => {
            console.error(error);
            Swal.fire({
              allowOutsideClick: false,
              title: 'Error',
              text: 'Error al guardar los datos',
              icon: 'error',
            });
          });
      }
      this.close();
    },

    getColor(estatus) {
      return estatus === 'Pendiente' ? 'orange' : 'green';
    },
  },
};
</script>
