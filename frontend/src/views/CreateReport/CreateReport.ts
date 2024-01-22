import { getReportServiceUrl } from "@/helpers/helpers";
import axios from "axios";
import { getAuth } from "firebase/auth";
import { ref } from "vue";

export default {
  name: "Create",
  data() {
    return {
      // add variables
    };
  },
  setup() {
    const user = getAuth().currentUser;
    const notConnected = ref(false);
    const listOfActivities = ref<Array<any>>();
    const length = ref(0);
    const data = ref(null);

    const loading = ref(true);
    const showAlert = ref(false);
    const alertType = ref<"error" | "success" | "info" | undefined>(undefined);
    const alertMessage = ref("Creating Report...");

    async function getActivities() {
      loading.value = true;
      alertType.value = undefined;
      alertMessage.value = "Creating Report...";
      showAlert.value = true;
      const url =
        `${getReportServiceUrl()}/report/create` +
        (startDate.value !== undefined
          ? "?after=" + new Date(startDate.value).getTime() / 1000
          : "") +
        (endDate.value !== undefined
          ? "&before=" + new Date(endDate.value).getTime() / 1000
          : "");

      axios
        .get(url, {
          headers: {
            Authorization: `Bearer ${await user?.getIdToken()}`,
          },
        })
        .then((res) => {
          console.log(res);
          data.value = res.data;
          if (res.status === 204) {
            notConnected.value = true;
            showAlert.value = false;
            loading.value = false;
          } else {
            listOfActivities.value = res.data;
            length.value = res.data.length;
            showAlert.value = false;
            loading.value = false;
          }
        })
        .catch((error) => {
          console.log(error);
          alertType.value = "error";
          alertMessage.value = error.message;
          loading.value = false;
          showAlert.value = true;
        });
    }

    async function saveReport() {
      loading.value = true;
      alertType.value = undefined;
      alertMessage.value = "saving Report...";
      showAlert.value = true;

      const api = `${getReportServiceUrl()}/report/save`;

      axios
        .post(api, data, {
          headers: {
            Authorization: `Bearer ${await user?.getIdToken()}`,
          },
        })
        .then((res) => {
          showAlert.value = false;
          alertMessage.value = "saved Report...";
          loading.value = false;
        })
        .catch((error) => {
          console.log(error);
          alertType.value = "error";
          alertMessage.value = error.message;
          loading.value = false;
          showAlert.value = true;
        });
    }
    const startDate = ref();
    const endDate = ref();

    const startDialog = ref(false);
    const endDialog = ref(false);

    return {
      notConnected,
      showAlert,
      data,
      alertType,
      alertMessage,
      loading,
      listOfActivities,
      startDialog,
      endDialog,
      startDate,
      endDate,
      getActivities,
      saveReport,
      length,
    };
  },
};