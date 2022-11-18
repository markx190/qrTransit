import { SessionStorage } from "quasar";
export default function () {
  const sessionUser = SessionStorage.getItem("userData");
  return {
    //
    apiUrl: "https://qr-transit-api.onrender.com/api",
    // apiUrl: "http://localhost:3000/api",
    users: [],
    qrSalesBydate: [],
    qrRoutes: [],
    qrDevices: [],
    qrVehicles: [],
    qrSales: [],
    qrSalesForExports: [],
    qrManifest: [],
    qrManifestForExports: [],
    qrStations: [],
    qrStationsId: [],
    qrStationsByRouteId: [],
    qrRoutesByRouteId: [],
    qrDevicesByStationId: [],
    searchedUsers: [],
    isLogged: false,
    profileData: {},
    loggedUsers: !sessionUser ? {} : sessionUser,
    registerResponse: "",
    loginResponse: "",
    connectionStatus: "",
    submitStatus: "",
  };
}
