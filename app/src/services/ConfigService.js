import store from "@/store";
import { ax } from "@/services/RequestService";

const defaultConfig = {
  calendarDefault: 3,
  paymentDeadlineDays: 30,
};

class ConfigService {
  constructor() {
    this.configOverrides = { online: Boolean(window.ipc) };
  }
  config() {
    const me = store.state.me;
    const interimConfig = Object.assign(defaultConfig, this.configOverrides);
    if (!me) return interimConfig;
    // eslint-disable-next-line no-unused-vars
    const { username, email, ...config } = store.state.me;
    const result = Object.assign(interimConfig, config);
    return result;
  }

  save() {
    window.fileWriter.saveConfig(this.config());
  }

  getOnline() {
    return Boolean(window.ipc) && this.config().online;
  }

  getCalendarDefault() {
    return this.config().calendarDefault;
  }

  getPraxis() {
    return this.config().praxis;
  }

  getDefaultPause() {
    return this.config().defaultPause;
  }

  getPaymentDeadlineDays() {
    return this.config().paymentDeadlineDays || 0;
  }

  setCalendarDefault(calendarDefault) {
    return ax.put("/auth/" + store.state.me.id, {
      calendarDefault,
    });
  }

  setOnline(online) {
    this.configOverrides.online = online;
  }

  setPaymentDeadlineDays(paymentDeadlineDays) {
    return ax.put("/auth/" + store.state.me.id, {
      paymentDeadlineDays,
    });
  }

  setPraxis(id) {
    this.configOverrides.praxis = id;
  }
}

export default new ConfigService();
