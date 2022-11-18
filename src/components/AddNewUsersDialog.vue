<template>
  <q-dialog v-if="fModal" :model-value="true">
    <q-card style="width: 1350px; max-width: 80vw">
      <q-card-section>
        <div class="text-subtitle2 text-uppercase">
          <q-banner
            inline-actions
            class="bg-grey-2 text-black text-weight-bold"
          >
            <q-icon size="md" name="add_circle_outline" />
            {{ title }}
          </q-banner>
          <q-banner
            v-if="submitAlert"
            inline-actions
            rounded
            class="bg-green-3 text-white q-mt-sm"
          >
            <q-spinner-hourglass color="primary" size="2em" />
            {{ updateUserMsg }}
          </q-banner>
        </div>
      </q-card-section>
      <div class="q-pa-md" style="max-width: 1350px">
        <q-form @submit="submitForm" class="q-gutter-md" ref="form">
          <div class="container">
            <div
              class="row bg-grey-2 q-pa-sm rounded-borders"
              v-if="title !== 'Delete User'"
            >
              <div class="col-md-3 q-mr-sm">
                <label>NAME</label>
                <q-input
                  outlined
                  v-model="aUsers.name"
                  hint="NAME"
                  lazy-rules
                  :rules="[
                    (val) => (val && val.length > 0) || 'This is required',
                  ]"
                />
              </div>
              <div class="col-md-3 q-mr-sm">
                <label>EMAIL</label>
                <q-input
                  outlined
                  v-model="aUsers.email"
                  hint="EMAIL"
                  lazy-rules
                  :rules="[(val) => !!val || 'Email is required', isValidEmail]"
                />
              </div>
              <div v-if="title === 'Add User'" class="col-md-3 q-mr-sm">
                <label>PASSWORD</label>
                <q-input
                  outlined
                  v-model="aUsers.password"
                  hint="PASSWORD"
                  :type="isPwd ? 'password' : 'text'"
                  lazy-rules
                  :rules="[
                    (val) => (val && val.length > 0) || 'This is required',
                  ]"
                >
                  <template v-slot:append>
                    <q-icon
                      :name="isPwd ? 'visibility_off' : 'visibility'"
                      class="cursor-pointer"
                      @click="isPwd = !isPwd"
                    />
                  </template>
                </q-input>
              </div>

              <div class="col-md-3 q-mr-sm">
                <label>ROLE</label>
                <q-select
                  outlined
                  v-model="aUsers.role"
                  :options="roles"
                  label="Role"
                  hint="ROLE"
                  lazy-rules
                  :rules="[
                    (val) => (val && val.length > 0) || 'This is required',
                  ]"
                />
              </div>
              <div v-if="title === 'Edit User'" class="col-md-3 q-mr-sm">
                <label>STATUS</label>
                <q-select
                  outlined
                  v-model="aUsers.status"
                  :options="status"
                  label="Status"
                />
              </div>
            </div>
            <q-card-section v-else class="q-pt-none text-weight-bold">
              Are you sure you want to delete this User?
            </q-card-section>
          </div>

          <div>
            <q-btn
              v-if="title === 'Delete User'"
              label="Delete"
              type="submit"
              color="red"
            />
            <q-btn v-else label="Submit" type="submit" color="primary" />
          </div>
        </q-form>
      </div>
      <q-card-actions align="right" class="bg-white text-teal">
        <q-btn flat label="Close" @click="close" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script>
import { defineComponent, ref } from "vue";
import { mapGetters } from "vuex";
import { useQuasar } from "quasar";

export default defineComponent({
  name: "AddNewUserDialog",
  props: ["qrData", "fModal", "title"],
  setup() {
    const $q = useQuasar();
    return {
      isPwd: ref(true),
      triggerPositive() {
        $q.notify({
          type: "positive",
          message: "User was submitted",
        });
      },
      triggerInfo() {
        $q.notify({
          type: "info",
          message: "User was updated",
        });
      },
      triggerNegative() {
        $q.notify({
          type: "negative",
          message: "User was deleted",
        });
      },
    };
  },
  data() {
    return {
      submitAlert: false,
      updateUserMsg: "",
      status: ["Activated", "Deactivated"],
      roles: ["ADMIN", "COASTGUARD"],
      aUsers: {
        id: "",
        name: "",
        email: "",
        role: "",
        status: "",
      },
    };
  },
  mounted() {
    this.getAppUsers();
  },
  computed: {
    ...mapGetters({
      users: "qrTrans/users",
      loggedUsers: "qrTrans/loggedUsers",
    }),
  },
  watch: {
    qrData: {
      handler(val) {
        if (val) {
          this.aUsers.id = val.id;
          this.aUsers.name = val.name;
          this.aUsers.email = val.email;
          this.aUsers.role = val.role;
          this.aUsers.status = val.status;
        } else {
          this.aUsers.id = "";
          this.aUsers.name = "";
          this.aUsers.email = "";
          this.aUsers.role = "";
          this.aUsers.status = "";
        }
      },
      immediate: true,
    },
  },
  methods: {
    close() {
      this.$emit("close");
    },
    async getAppUsers() {
      const token = this.loggedUsers.token;
      console.log("token: ", token);
      let data = {
        headers: {
          Authorization: `Bearer: ${token}`,
        },
      };
      return await this.$store.dispatch("qrTrans/getUsers", data);
    },
    async saveUser() {
      const token = this.loggedUsers.token;
      const uEmail = this.loggedUsers.user.email;
      let data = {
        name: this.aUsers.name,
        email: this.aUsers.email,
        password: this.aUsers.password,
        role: this.aUsers.role,
        status: this.aUsers.status,
      };
      let auth = {
        headers: {
          Authorization: `Bearer: ${token}`,
        },
        email: uEmail,
      };
      const result = await this.$store.dispatch(
        "qrTrans/createUsers",
        data,
        auth
      );
      this.updateUserMsg = "USER WAS ADDED SUCCESSFULLY";
      (this.submitAlert = true),
        setTimeout(() => {
          this.submitAlert = false;
          this.close();
        }, 3000);
    },
    async saveUpdatedUser() {
      const token = this.loggedUsers.token;
      const uEmail = this.loggedUsers.user.email;
      let data = {
        id: this.aUsers.id,
        name: this.aUsers.name,
        email: this.aUsers.email,
        role: this.aUsers.role,
        status: this.aUsers.status,
      };
      let auth = {
        headers: {
          Authorization: `Bearer: ${token}`,
        },
        email: uEmail,
      };
      const result = await this.$store.dispatch(
        "qrTrans/updateUsers",
        data,
        auth
      );
      this.updateUserMsg = "USER INFORMATION WAS UPDATED";
      (this.submitAlert = true),
        setTimeout(() => {
          this.submitAlert = false;
          this.close();
          this.getAppUsers();
        }, 3000);
    },
    submitForm() {
      this.title === "Add User"
        ? this.saveUser()
        : this.title === "Edit User"
        ? this.saveUpdatedUser()
        : this.deleteUser();
    },
    isValidEmail(val) {
      const emailPattern =
        /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;
      return emailPattern.test(val) || "Invalid email";
    },
  },
});
</script>
