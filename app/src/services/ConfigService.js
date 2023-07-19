import store from "@/store";
import { ax } from "@/services/RequestService";

const defaultConfig = {
  calendarDefault: 5,
  paymentDeadlineDays: 30,
  ausfallterminPreis: 1,
  ausfallterminPreisproMinute: true,
};

class ConfigService {
  constructor() {
    this.configOverrides = { online: true };
  }
  config() {
    const me = store.state.me;
    const interimConfig = Object.assign(defaultConfig, this.configOverrides);
    if (!me) return interimConfig;
    // eslint-disable-next-line no-unused-vars
    const { username, email, ...config } = store.state.me;
    const result = Object.assign(interimConfig, config);
    // console.log({
    //   me,
    //   interimConfig,
    //   result,
    //   defaultConfig,
    // });
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

  getPaymentDeadlineDays() {
    return this.config().paymentDeadlineDays || 0;
  }

  getAusfallterminPreis() {
    return this.config().ausfallterminPreis;
  }

  getAusfallterminPreisProMinute() {
    return this.config().ausfallterminPreisproMinute;
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

  setAusfallterminPreis(ausfallterminPreis) {
    return ax.put("/auth/" + store.state.me.id, {
      ausfallterminPreis,
    });
  }
  setAusfallterminPreisProMinute(ausfallterminPreisproMinute) {
    return ax.put("/auth/" + store.state.me.id, {
      ausfallterminPreisproMinute,
    });
  }
}

export default new ConfigService();
