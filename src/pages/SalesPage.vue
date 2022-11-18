<template>
  <q-page>
    <q-form @submit="submitFilterByDate" class="q-gutter-md" ref="form">
      <div class="row q-pa-md">
        <div class="md-3 sDate q-mb-md q-mr-md">
          <q-input
            type="date"
            outlined
            v-model="sSearch.dFrom"
            hint="FROM"
            dense
          />
        </div>
        <div class="md-3 sDate q-mb-md">
          <q-input type="date" outlined v-model="sSearch.dTo" hint="TO" dense />
        </div>
        <div class="md-3 sDate q-ml-md">
          <q-input outlined v-model="sSearch.filter" hint="SEARCH" dense />
        </div>
        <div class="md-3 sDate q-ml-xs">
          <q-btn label="Search" type="submit" color="primary" />
        </div>
      </div>
    </q-form>

    <div class="q-pa-md">
      <q-table
        title="SALES"
        :rows="qrSales"
        :columns="columns"
        :filter="filter"
        :loading="loading"
        row-key="title"
      >
        <template v-slot:body-cell-userId="props">
          <q-td :props="props">
            {{ props.row.user.id }}
          </q-td>
        </template>
        <template v-slot:body-cell-ticket="props">
          <q-td :props="props">
            {{
              props.row.ticket +
              "" +
              props.row.ticketNo.toString().padStart(5, "0")
            }}
          </q-td>
        </template>
        <template v-slot:body-cell-amount="props">
          <q-td :props="props"> {{ props.row.amount }}.00 </q-td>
        </template>
        <template v-slot:body-cell-origin="props">
          <q-td class="text-uppercase" :props="props">
            {{ props.row.origin.name }}
          </q-td>
        </template>
        <template v-slot:body-cell-destination="props">
          <q-td class="text-uppercase" :props="props">
            {{ props.row.destination.name }}
          </q-td>
        </template>
        <template v-slot:body-cell-status="props">
          <q-td class="text-uppercase" :props="props">
            {{ props.row.status }}
          </q-td>
        </template>
        <template v-slot:body-cell-date_on_boarded="props">
          <q-td class="text-uppercase" :props="props">
            {{ props.row.createdAt }}
          </q-td>
        </template>

        <template #loading>
          <q-inner-loading showing color="accent" size="90px" />
        </template>
        <template v-slot:top-right>
          <q-btn
            color="green"
            icon-right="archive"
            label="Export to Excel"
            no-caps
            @click="exportTable"
          />
        </template>
      </q-table>
    </div>
  </q-page>
</template>
<script>
import { defineComponent, ref } from "vue";
import { mapGetters } from "vuex";
import { exportFile, useQuasar } from "quasar";
import moment from "moment";

export default defineComponent({
  name: "SalesPage",
  setup() {
    const loading = ref(true);
    const filter = ref("");
    const $q = useQuasar();
    return {
      columns,
      loading,
      filter,
    };
  },
  data() {
    return {
      formTitle: "",
      routeDialog: false,
      originDialog: false,
      destinationDialog: false,
      stationDialog: false,
      sOrigins: [],
      sDestinations: [],
      qrSalesResults: [],
      aSales: {
        _id: "",
        from: "",
        to: "",
        direction: "",
        stations: "",
      },
      sSearch: {
        dFrom: "",
        dTo: "",
        filter: "",
      },
    };
  },
  created() {
    this.getSales();
    this.getQrSalesForExports();
  },
  computed: {
    ...mapGetters({
      users: "qrTrans/users",
      loggedUsers: "qrTrans/loggedUsers",
      searchedUsers: "qrTrans/searchedUsers",
      qrSales: "qrTrans/qrSales",
      qrSalesByDate: "qrTrans/qrSalesByDate",
      qrSalesForExports: "qrTrans/qrSalesForExports",
    }),
  },
  methods: {
    checkIsLogged() {
      this.loggedUsers.token
        ? this.$router.push("/routes")
        : this.$router.push("/");
    },
    async getSales() {
      const token = this.loggedUsers.token;
      console.log("token: ", token);
      let data = {
        headers: {
          Authorization: `Bearer: ${token}`,
        },
      };
      const routesList = await this.$store.dispatch("qrTrans/getQrSales", data);
      this.loading = false;
      console.log("app routes: ", routesList);
    },
    async getQrSalesForExports() {
      const token = this.loggedUsers.token;
      console.log("token: ", token);
      let auth = {
        headers: {
          Authorization: `Bearer: ${token}`,
        },
      };
      const routesList = await this.$store.dispatch(
        "qrTrans/getQrSalesForExports",
        auth
      );
      this.loading = false;
      console.log("sales: ", routesList);
    },
    async submitFilterByDate() {
      let data = {
        from: this.sSearch.dFrom,
        to: this.sSearch.dTo,
        filter: this.sSearch.filter,
      };
      // data.length <= 0 ? (this.qrSalesResults = this.qrSales) : null;
      const result = await this.$store.dispatch(
        "qrTrans/getQrSalesByDate",
        data
      );
      // return (this.qrSalesResults = this.qrSalesByDate);
    },
    exportTable() {
      // naive encoding to csv format
      const content = [columnsX.map((col) => wrapCsvValue(col.label))]
        .concat(
          this.qrSales.map((row) =>
            columnsX
              .map((col) =>
                wrapCsvValue(
                  typeof col.field === "function"
                    ? col.field(row)
                    : row[col.field === void 0 ? col.name : col.field],
                  col.format,
                  row
                )
              )
              .join(",")
          )
        )
        .join("\r\n");

      const status = exportFile("sales.csv", content, "text/csv");

      if (status !== true) {
        $q.notify({
          message: "Browser denied file download...",
          color: "negative",
          icon: "warning",
        });
      }
    },
  },
});

const columns = [
  {
    name: "userId",
    align: "left",
    label: "ID",
    field: "id",
    sortable: true,
  },
  {
    name: "ticket",
    align: "left",
    label: "TICKET",
    field: "ticket",
    sortable: true,
  },
  {
    name: "amount",
    align: "left",
    label: "AMOUNT",
    field: "amount",
    sortable: true,
  },
  {
    name: "status",
    align: "left",
    label: "STATUS",
    field: "status",
    sortable: true,
  },
  {
    name: "origin",
    align: "left",
    label: "ORIGIN",
    field: "origin",
    sortable: true,
  },
  {
    name: "destination",
    align: "left",
    label: "DESTINATION",
    field: "destination",
    sortable: true,
  },
  {
    name: "date_on_boarded",
    align: "left",
    label: "DATE CREATED",
    field: "dateTicketGenerated",
    sortable: true,
  },
];

const columnsX = [
  {
    name: "userId",
    align: "left",
    label: "ID",
    field: "id3",
    sortable: true,
  },
  {
    name: "ticket",
    align: "left",
    label: "TICKET",
    field: "ticket2",
    sortable: true,
  },
  {
    name: "amount",
    align: "left",
    label: "AMOUNT",
    field: "amount",
    sortable: true,
  },
  {
    name: "status",
    align: "left",
    label: "STATUS",
    field: "status",
    sortable: true,
  },
  {
    name: "origin",
    align: "left",
    label: "ORIGIN",
    field: "origin2",
    sortable: true,
  },
  {
    name: "destination",
    align: "left",
    label: "DESTINATION",
    field: "destination2",
    sortable: true,
  },
  {
    name: "date_on_boarded",
    align: "left",
    label: "DATE CREATED",
    field: "dateTicketGenerated3",
    sortable: true,
  },
];

function wrapCsvValue(val, formatFn, row) {
  let formatted = formatFn !== void 0 ? formatFn(val, row) : val;

  formatted =
    formatted === void 0 || formatted === null ? "" : String(formatted);

  formatted = formatted.split('"').join('""');
  /**
   * Excel accepts \n and \r in strings, but some other CSV parsers do not
   * Uncomment the next two lines to escape new lines
   */
  // .split('\n').join('\\n')
  // .split('\r').join('\\r')

  return `"${formatted}"`;
}
</script>
<style scoped>
.sDate {
  width: 18em;
}
</style>
