import axios from "axios";
import moment from "moment";
import { SessionStorage } from "quasar";

export async function getUsers(context, payload) {
  // await new Promise((res) => setTimeout(() => res(), 3000));
  try {
    const response = await axios.get(
      `${this.state.qrTrans.apiUrl}/users/get-users?filter=`,
      payload
    );
    context.commit("setUsers", response.data.users);
    return response;
  } catch (err) {
    console.log(err);
    return err;
  }
}
export async function getQrRoutes(context, payload) {
  // await new Promise((res) => setTimeout(() => res(), 3000));
  try {
    const response = await axios.get(
      `${this.state.qrTrans.apiUrl}/routes/get-routes?filter=`,
      payload
    );
    console.log("routesx: ", response.data);
    context.commit("setQrRoutes", response.data.routes);
    return response;
  } catch (err) {
    console.log(err);
    return err;
  }
}
export async function getQrDevices(context, payload) {
  // await new Promise((res) => setTimeout(() => res(), 3000));
  try {
    const response = await axios.get(
      `${this.state.qrTrans.apiUrl}/devices/get-devices?filter=`,
      payload
    );
    for (const item of response.data.devices) {
      console.log("item: ", item.station);
      item.station = item.station ? item.station.name : "-";
    }
    console.log("devices: ", response.data.devices);
    context.commit("setQrDevices", response.data.devices);
    return response;
  } catch (err) {
    console.log(err);
    return err;
  }
}
export async function getQrVehicles(context, payload) {
  // await new Promise((res) => setTimeout(() => res(), 3000));
  try {
    const response = await axios.get(
      `${this.state.qrTrans.apiUrl}/vehicles/get-vehicles?filter=`,
      payload
    );
    console.log("dx: ", response.data);
    context.commit("setQrVehicles", response.data.vehicles);
    return response;
  } catch (err) {
    console.log(err);
    return err;
  }
}
export async function getQrSales(context, payload) {
  // await new Promise((res) => setTimeout(() => res(), 3000));
  try {
    // moment(new Date(sales.createdAt)).utcOffset("+0800").format("MMM DD, YYYY hh:mm A")
    const response = await axios.get(
      `${this.state.qrTrans.apiUrl}/sales/get-sales?filter=`,
      payload
    );
    console.log("sales: ", response.data);
    for (const item of response.data.sales) {
      // item.ticket = "'" + item.ticket + "" + item.ticketNo.padStart(5, "0");
      item.id2 = item.user.id;
      item.id3 = item.user.id;

      item.origin2 = item.origin.name;
      item.destination2 = item.destination.name;

      item.name = item.user.name;
      item.gender = item.user.gender;
      item.mobileNumber = "'" + item.user.mobile_number;

      item.user.photo_url =
        "http://qr-transit.onehealthnetwork.com.ph/" + item.user.photo_url;
      // console.log("item: ", item.user.photo_url);
      item.createdAt = moment(new Date(item.createdAt))
        .utcOffset("+0800")
        .format("MMMM DD, YYYY hh:mm A");

      item.ticket2 =
        "'" + item.ticket + "" + item.ticketNo.toString().padStart(5, "0");

      item.dateTicketGenerated3 = moment(new Date(item.createdAt))
        .utcOffset("+0800")
        .format("MMMM DD, YYYY hh:mm A");

      item.vehicle2 = item.vehicle ? item.vehicle.vehicleId : "-";
      item.dateTicketGenerated = moment(new Date(item.createdAt))
        .utcOffset("+0800")
        .format("MMMM DD, YYYY hh:mm A");

      item.embarkedDate = item.embarkedDate
        ? moment(new Date(item.embarkedDate))
            .utcOffset("+0800")
            .format("MMMM DD, YYYY hh:mm A")
        : "";
      item.updatedAt = item.updatedAt
        ? moment(new Date(item.updatedAt))
            .utcOffset("+0800")
            .format("MMMM DD, YYYY hh:mm A")
        : "";

      item.dateDisembarked = item.updatedAt
        ? moment(new Date(item.updatedAt))
            .utcOffset("+0800")
            .format("MMMM DD, YYYY hh:mm A")
        : "";
    }
    context.commit("setQrSales", response.data.sales);
    return response;
  } catch (err) {
    console.log(err);
    return err;
  }
}
export async function getQrManifest(context, payload) {
  // await new Promise((res) => setTimeout(() => res(), 3000));
  try {
    const response = await axios.get(
      `${this.state.qrTrans.apiUrl}/sales/get-sales?filter=`,
      payload
    );
    console.log("salesX: ", response.data.sales[0]);
    context.commit("setQrManifest", response.data.sales[0]);
    return response;
  } catch (err) {
    console.log(err);
    return err;
  }
}
export async function getQrManifestForExports(context, payload) {
  // await new Promise((res) => setTimeout(() => res(), 3000));
  // moment(new Date(sales.createdAt)).utcOffset("+0800").format("MMM DD, YYYY hh:mm A")

  try {
    const response = await axios.get(
      `${this.state.qrTrans.apiUrl}/sales/export-manifest`,
      payload
    );
    console.log("exports manifest: ", response.data.manifest);
    for (const item of response.data.manifest) {
      item.vehicle = item.vehicle ? item.vehicle : "";
      item.dateTicketGenerated = moment(new Date(item.dateTicketGenerated))
        .utcOffset("+0800")
        .format("MMMM DD, YYYY hh:mm A");

      item.dateDisembarked = moment(new Date(item.dateDisembarked))
        .utcOffset("+0800")
        .format("MMMM DD, YYYY hh:mm A");
    }

    context.commit("setQrManifestForExports", response.data.manifest);
    return response;
  } catch (err) {
    console.log(err);
    return err;
  }
}
export async function getQrSalesForExports(context, payload) {
  // await new Promise((res) => setTimeout(() => res(), 3000));
  try {
    // moment(new Date(sales.createdAt)).utcOffset("+0800").format("MMM DD, YYYY hh:mm A")
    const response = await axios.get(
      `${this.state.qrTrans.apiUrl}/sales/export-sales`,
      payload
    );
    for (const item of response.data.sales) {
      item.dateTicketGenerated = moment(new Date(item.dateTicketGenerated))
        .utcOffset("+0800")
        .format("MMMM DD, YYYY hh:mm A");
    }
    console.log("exports sales: ", response.data.sales);
    context.commit("setQrSalesForExports", response.data.sales);
    return response;
  } catch (err) {
    console.log(err);
    return err;
  }
}
export async function getQrSalesByDate(context, payload) {
  // await new Promise((res) => setTimeout(() => res(), 3000));
  try {
    console.log("search payload: ", payload);
    const response = await axios.get(
      `${this.state.qrTrans.apiUrl}/sales/get-sales-by-date?from=${payload.from}&to=${payload.to}&filter=${payload.filter}`,
      payload
    );
    for (const item of response.data.sales) {
      // item.ticket = item.ticket + " " + item.ticketNo.padStart(5, "0");
      item.id2 = item.user.id;
      item.id3 = item.user.id;
      item.dateTicketGenerated3 = moment(new Date(item.createdAt))
        .utcOffset("+0800")
        .format("MMMM DD, YYYY hh:mm A");
      item.ticket2 =
        "'" + item.ticket + "" + item.ticketNo.toString().padStart(5, "0");
      item.user.photo_url =
        "http://qr-transit.onehealthnetwork.com.ph/" + item.user.photo_url;

      item.createdAt = moment(new Date(item.createdAt))
        .utcOffset("+0800")
        .format("MMMM DD, YYYY hh:mm A");
      item.embarkedDate = item.embarkedDate
        ? moment(new Date(item.embarkedDate))
            .utcOffset("+0800")
            .format("MMMM DD, YYYY hh:mm A")
        : "";
      item.updatedAt = item.updatedAt
        ? moment(new Date(item.updatedAt))
            .utcOffset("+0800")
            .format("MMMM DD, YYYY hh:mm A")
        : "";

      item.name = item.user.name;
      item.gender = item.user.gender;
      item.mobileNumber = "'" + item.user.mobile_number;
      // item.origin = item.origin ? item.origin : item.origin;
      item.origin2 = item.origin.name;
      item.destination2 = item.destination.name;
      // item.destination = item.destination ? item.destination : item.destination;
      item.vehicle2 = item.vehicle ? item.vehicle.vehicleId : "-";
      item.dateTicketGenerated = moment(new Date(item.createdAt))
        .utcOffset("+0800")
        .format("MMMM DD, YYYY hh:mm A");
      item.embarkedDate = item.embarkedDate
        ? moment(new Date(item.embarkedDate))
            .utcOffset("+0800")
            .format("MMMM DD, YYYY hh:mm A")
        : "";
      item.dateDisembarked = item.updatedAt
        ? moment(new Date(item.updatedAt))
            .utcOffset("+0800")
            .format("MMMM DD, YYYY hh:mm A")
        : "";
    }
    console.log("sales by date: ", response.data.sales);
    context.commit("setQrSalesByDate", response.data.sales);
    return response;
  } catch (err) {
    console.log(err);
    return err;
  }
}
export async function getQrStations(context, payload) {
  // await new Promise((res) => setTimeout(() => res(), 3000));
  try {
    const response = await axios.get(
      `${this.state.qrTrans.apiUrl}/stations/get-stations?filter=`,
      payload
    );
    console.log("stationsTo: ", response.data);
    context.commit("setQrStations", response.data.stations);
    return response;
  } catch (err) {
    console.log(err);
    return err;
  }
}
export async function getQrStationsByRouteId(context, payload) {
  // await new Promise((res) => setTimeout(() => res(), 3000));
  try {
    const response = await axios.get(
      `${this.state.qrTrans.apiUrl}/stations/get-stations-by-route-id?routeId=${payload}`
    );
    console.log("stationsId: ", response.data);
    context.commit("setQrStationsId", response.data.stationsByRouteId);
    return response;
  } catch (err) {
    console.log(err);
    return err;
  }
}
export async function getQrDevicesByStationId(context, payload) {
  // await new Promise((res) => setTimeout(() => res(), 3000));
  try {
    const response = await axios.get(
      `${this.state.qrTrans.apiUrl}/devices/get-devices-by-station-id?stationId=${payload}`
    );
    console.log("dev by station: ", response.data);
    context.commit("setQrDevicesByStationId", response.data.deviceByStationId);
    return response;
  } catch (err) {
    console.log(err);
    return err;
  }
}
export async function getQrStationsId(context, payload) {
  // await new Promise((res) => setTimeout(() => res(), 3000));
  try {
    console.log("rId: ", payload);
    const response = await axios.get(
      `${this.state.qrTrans.apiUrl}/stations/get-stations-id?stationId=${payload}`
    );
    console.log("stationsId: ", response.data);
    context.commit("setQrStationsId", response.data);
    return response;
  } catch (err) {
    console.log(err);
    return err;
  }
}
export async function getQrRoutesByRouteId(context, payload) {
  // await new Promise((res) => setTimeout(() => res(), 3000));
  try {
    console.log("rId: ", payload);
    const response = await axios.get(
      `${this.state.qrTrans.apiUrl}/routes/get-routes-by-route-id?routeId=${payload}`
    );
    console.log("routesByRouteId: ", response.data);
    context.commit("setQrRoutesByRouteId", response.data.routesRouteById[0]);
    return response;
  } catch (err) {
    console.log(err);
    return err;
  }
}
export async function getQrFareGuideByRouteId(context, payload) {
  // await new Promise((res) => setTimeout(() => res(), 3000));
  try {
    console.log("rId: ", payload);
    const response = await axios.get(
      `${this.state.qrTrans.apiUrl}/routes/get-fare-guide-by-route-id?routeId=${payload}`
    );
    console.log("stationsByRouteId: ", response.data.fareGuides);
    context.commit("setQrStationsByRouteId", response.data.fareGuides);
    return response;
  } catch (err) {
    console.log(err);
    return err;
  }
}
export async function createUsers(context, user, payload) {
  try {
    const response = await axios.post(
      `${this.state.qrTrans.apiUrl}/users/add-user`,
      user,
      payload
    );
    context.commit("setSubmitStatus", response.status);
    return response;
  } catch (err) {
    console.log(err);
    return err;
  }
}
export async function createRoutes(context, payload, user) {
  try {
    const response = await axios.post(
      `${this.state.qrTrans.apiUrl}/routes/add-route`,
      payload,
      user
    );
    context.commit("setSubmitStatus", response.status);
    return response;
  } catch (err) {
    console.log(err);
    return err;
  }
}
export async function createVehicles(context, payload, user) {
  try {
    console.log("vehicles pay: ", payload);
    const response = await axios.post(
      `${this.state.qrTrans.apiUrl}/vehicles/add-vehicle`,
      payload,
      user
    );
    context.commit("setSubmitStatus", response.status);
    return response;
  } catch (err) {
    console.log(err);
    return err;
  }
}
export async function updateVehicles(context, payload, user) {
  try {
    console.log("put: ", payload);
    const response = await axios.put(
      `${this.state.qrTrans.apiUrl}/vehicles/update-vehicle/${payload.id}`,
      payload,
      user
    );
    return response;
  } catch (err) {
    console.log(err);
    return err;
  }
}
export async function deleteVehicles(context, payload) {
  try {
    const response = await axios.delete(
      `${this.state.qrTrans.apiUrl}/vehicles/delete-vehicle/${payload.id}`
    );
    context.commit("setSubmitStatus", response.status);
    return response;
  } catch (err) {
    console.log(err);
    return err;
  }
}
export async function createDevices(context, payload, user) {
  try {
    console.log("devices: ", payload);
    const response = await axios.post(
      `${this.state.qrTrans.apiUrl}/devices/add-device`,
      payload,
      user
    );
    context.commit("setSubmitStatus", response.status);
    return response;
  } catch (err) {
    console.log(err);
    return err;
  }
}
export async function createStations(context, payload, user) {
  try {
    console.log("git: ", payload);
    const response = await axios.post(
      `${this.state.qrTrans.apiUrl}/stations/add-station`,
      payload,
      user
    );
    context.commit("setSubmitStatus", response.status);
    return response;
  } catch (err) {
    console.log(err);
    return err;
  }
}
export async function updateUsers(context, payload, user) {
  try {
    console.log("put: ", payload);
    const response = await axios.put(
      `${this.state.qrTrans.apiUrl}/users/update-user/${payload.id}`,
      payload,
      user
    );
    return response;
  } catch (err) {
    console.log(err);
    return err;
  }
}
export async function updateRoutes(context, payload, user) {
  try {
    console.log("put: ", payload);
    const response = await axios.put(
      `${this.state.qrTrans.apiUrl}/routes/update-route/${payload._id}`,
      payload,
      user
    );
    return response;
  } catch (err) {
    console.log(err);
    return err;
  }
}
export async function updateDevices(context, payload, user) {
  try {
    console.log("put: ", payload);
    const response = await axios.put(
      `${this.state.qrTrans.apiUrl}/devices/update-device/${payload._id}`,
      payload,
      user
    );
    console.log("dev results: ", response.data);
    return response;
  } catch (err) {
    console.log(err);
    return err;
  }
}
export async function updateStations(context, payload, user) {
  try {
    console.log("put: ", payload);
    const response = await axios.put(
      `${this.state.qrTrans.apiUrl}/stations/update-station/${payload.id}`,
      payload,
      user
    );
    return response;
  } catch (err) {
    console.log(err);
    return err;
  }
}
export async function deleteRoutes(context, payload) {
  try {
    const response = await axios.delete(
      `${this.state.qrTrans.apiUrl}/routes/delete-route/${payload._id}`
    );
    context.commit("setSubmitStatus", response.status);
    return response;
  } catch (err) {
    console.log(err);
    return err;
  }
}
export async function deleteDevices(context, payload) {
  try {
    const response = await axios.delete(
      `${this.state.qrTrans.apiUrl}/devices/delete-device/${payload._id}`
    );
    context.commit("setSubmitStatus", response.status);
    return response;
  } catch (err) {
    console.log(err);
    return err;
  }
}
export async function deleteStations(context, payload) {
  try {
    const response = await axios.delete(
      `${this.state.qrTrans.apiUrl}/stations/delete-station/${payload.id}`
    );
    context.commit("setSubmitStatus", response.status);
    return response;
  } catch (err) {
    console.log(err);
    return err;
  }
}
export async function changeUserStatus(context, payload, user) {
  try {
    console.log("put: ", payload);
    const response = await axios.put(
      `${this.state.qrTrans.apiUrl}/users/change-status/${payload.id}`,
      payload,
      user
    );
    return response;
  } catch (err) {
    console.log(err);
    return err;
  }
}
export async function searchUsers(context, payload) {
  try {
    const response = await axios.get(
      `${this.state.qrTrans.apiUrl}/users/filter-users?filter=${payload.params}`
    );
    console.log("searched: ", response.data.users);
    context.commit("setUsers", response.data.users);
    return response;
  } catch (err) {
    console.log(err);
    return err;
  }
}
export async function register(context, payload) {
  try {
    const response = await axios.post(
      `${this.state.doctors.apiUrl}/register`,
      payload
    );
    context.commit("setRegisterResponse", response.data);
    return response;
  } catch (err) {
    console.log(err);
    return err;
  }
}
export async function handleLogin(context, payload) {
  try {
    const response = await axios.post(
      `${this.state.qrTrans.apiUrl}/users/login`,
      payload
    );
    console.log("status1: ", response.data);
    if (response.data.data.token) {
      SessionStorage.set("userData", response.data.data);
      context.commit("setProfileData", response.data.data);
      let userData = SessionStorage.getItem("userData");
      console.log("token: ", userData);
      if (userData.token) {
        context.commit("setLoggedUsers", userData);
        context.commit("setIsLogged", true);
      }
    } else {
      context.commit("setLoginResponse", response);
    }
    return response;
  } catch (err) {
    console.log("error status: ", 400);
    return 400;
  }
}
export async function getProfile(context, payload) {
  try {
    const response = await axios.get(
      `${this.state.doctors.apiUrl}/profile?id=${payload}`
    );
    context.commit("setProfileData", response.data[0]);
    return response.data[0];
  } catch (err) {
    console.log(err);
    return err;
  }
}
export async function editProfile(context, payload) {
  try {
    const response = await axios.post(
      `${this.state.doctors.apiUrl}/update_profile`,
      payload
    );
    context.commit("setRegisterResponse", response.data);
    return response;
  } catch (err) {
    console.log(err);
    return err;
  }
}
export async function logOut(context) {
  sessionStorage.removeItem("userData");
  context.commit("setIsLogged", false);
}

function formatDate(dateInfo) {
  const formatDate = dateInfo
    .replace(/T/, " ")
    .replace(/Z/, " ")
    .substr("0", "16");
  const date = new Date(`${formatDate}`);
  const ye = new Intl.DateTimeFormat("en", {
    year: "numeric",
    timeZone: "Asia/Tokyo",
  }).format(date);
  const mo = new Intl.DateTimeFormat("en", {
    month: "long",
    timeZone: "Asia/Tokyo",
  }).format(date);
  const da = new Intl.DateTimeFormat("en", {
    day: "2-digit",
    timeZone: "Asia/Tokyo",
  }).format(date);
  var min = date.getMinutes();
  var hr = date.getHours();

  if (min < 10) {
    min = "0" + min;
  }
  var ampm = "AM";
  if (hr > 12) {
    hr -= 12;
    ampm = "PM";
  }
  const time = `${hr}:${min} ${ampm}`;
  return {
    date: `${mo} ${da}, ${ye}`,
    time: time,
  };
}
