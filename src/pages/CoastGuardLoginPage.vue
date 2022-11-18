<template>
  <q-page-container>
    <div class="row">
      <div class="col-md-6 coast"></div>
      <div class="col-md-4" style="margin-left: -160px; margin-top: 45px">
        <div class="q-pa-md q-gutter-sm">
          <q-banner
            inline-actions
            rounded
            v-if="loginResponse"
            class="bg-red text-white"
          >
            <q-spinner-hourglass color="primary" size="2em" />
            {{ loginResponse }}
          </q-banner>
        </div>
        <img
          src="http://159.138.135.212/qrImages/qr_icon.png"
          style="width: 190px; height: 170px; margin-left: 393px"
        />
        <q-form @submit="handleLogin" class="q-gutter-md">
          <q-input
            style="width: 30em; margin-left: 303px"
            outlined
            v-model="loginInput.email"
            label="Email"
            lazy-rules
            :rules="[(val) => (val && val.length > 0) || 'This is required']"
          />

          <q-input
            style="width: 30em; margin-left: 303px"
            v-model="loginInput.password"
            outlined
            :type="isPwd ? 'password' : 'text'"
            label="Password"
            lazy-rules
            :rules="[(val) => (val && val.length > 0) || 'This is required']"
          >
            <template v-slot:append>
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
              />
            </template>
          </q-input>
          <!-- <q-toggle v-model="accept" label="I accept the license and terms" /> -->
          <q-btn
            style="margin-left: 303px"
            label="Login"
            type="submit"
            color="accent"
          />
        </q-form>
      </div>
    </div>
  </q-page-container>
</template>
<script>
import { defineComponent, ref } from "vue";
import { mapGetters } from "vuex";
import { useQuasar } from "quasar";

export default defineComponent({
  name: "LoginPage",
  setup() {
    const $q = useQuasar();
    return {
      isPwd: ref(true),
    };
  },
  data() {
    return {
      loginResponse: null,
      loginInput: {
        email: "",
        password: "",
      },
    };
  },
  created() {
    this.checkIsLogged();
  },
  computed: {
    ...mapGetters({
      loggedUsers: "qrTrans/loggedUsers",
    }),
  },
  methods: {
    async handleLogin() {
      let data = {
        email: this.loginInput.email,
        password: this.loginInput.password,
      };
      const res = await this.$store.dispatch("qrTrans/handleLogin", data);
      console.log("res: ", res.data.data.user.role);
      if (res === 400) {
        this.loginResponse = "INVALID CREDENTIALS";
      }
      if (res.data.data.user.role !== "COASTGUARD") {
        this.loginResponse = "NOT A COASTGUARD PERSONNEL";
      }
      this.loggedUsers.user.role === "COASTGUARD"
        ? this.$router.push("/dashboard")
        : this.$router.push("/coastguard_login");
    },
    checkIsLogged() {
      console.log("this: ", this.loggedUsers);
      this.loggedUsers.token
        ? this.$router.push("/dashboard")
        : this.$router.push("/coastguard_login");
    },
  },
});
</script>
<style scoped>
.container-pos {
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 80%;
}
.coast {
  margin-top: -45px;
  background-image: url("http://159.138.135.212/qrImages/COASTGUARD.png");
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
  height: 708px;
  margin-bottom: -190px;
}
</style>
