<template>
  <q-page-container
    style="
      height: 100vh;
      background-image: url('http://159.138.135.212/qrImages/LOGIN_IMAGE.jpg');
      background-repeat: no-repeat center;
      background-size: 100% 100%;
      margin-top: -1px;
      /* width: 1349px; */
      height: 720px;
    "
  >
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

    <div
      class="q-pa-md"
      style="
        height: 100%;
        max-width: 900px;
        background-image: url('http://159.138.135.212/qrImages/LOGINboard.png');
        background-repeat: no-repeat;
        background-size: auto;
        background-size: 660px 460px;
        margin-left: 415px;
        margin-top: -40px;
      "
    >
      <q-form @submit="handleLogin" class="q-gutter-md">
        <div class="col-md-4" style="margin-top: 200px; margin-left: -110px">
          <q-input
            style="width: 30em; margin-left: 230px"
            outlined
            v-model="loginInput.email"
            label="Email"
            lazy-rules
            :rules="[(val) => (val && val.length > 0) || 'This is required']"
          />

          <q-input
            style="width: 30em; margin-left: 230px"
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
            style="margin-left: 230px"
            label="Login"
            type="submit"
            color="accent"
          />
        </div>
      </q-form>
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
      if (res === 400) {
        this.loginResponse = "INVALID CREDENTIALS";
      }
      this.loggedUsers.token
        ? this.$router.push("/dashboard")
        : this.$router.push("/");
    },
    checkIsLogged() {
      console.log("this: ", this.loggedUsers);
      this.loggedUsers.token
        ? this.$router.push("/dashboard")
        : this.$router.push("/");
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
</style>
