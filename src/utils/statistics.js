import KundenService from "@/services/KundenService";
import RezeptService from "@/services/RezeptService";

// eslint-disable-next-line no-unused-vars
export async function generateStatistics(numberOfStats = 3) {
  // console.log(numberOfStats);
  return await Promise.all([
    kundenStatistics(),
    rezeptAustellerStatistics(),
    rezeptHeilmittelStatistics(),
  ]);
}

function kundenStatistics() {
  return KundenService.getAll().then((kundenList) => {
    const versichertenstatusMap = [];
    kundenList.forEach((k) => {
      const found = versichertenstatusMap.find(
        (v) => v.status == k.versichertenstatus
      );
      if (found) found.count++;
      else
        versichertenstatusMap.push({ status: k.versichertenstatus, count: 1 });
    });
    const mvpStat = versichertenstatusMap.sort((a, b) => b.count - a.count)[0];
    return {
      beforeText: "",
      value: Math.round((mvpStat.count / kundenList.length) * 1000) / 10 + "%",
      afterText: `der Patienten sind über ${mvpStat.status} versichert`,
    };
  });
}

function rezeptAustellerStatistics() {
  return RezeptService.getAll({ include: "Arzt" }).then((rezeptList) => {
    const ausstellerMap = [];
    rezeptList.forEach((r) => {
      const found = ausstellerMap.find((a) => a.aussteller == r.Arzt.name);
      if (found) found.count++;
      else ausstellerMap.push({ aussteller: r.Arzt.name, count: 1 });
    });
    const mvpStat = ausstellerMap.sort((a, b) => b.count - a.count)[0];
    return {
      beforeText: "",
      value: Math.round((mvpStat.count / rezeptList.length) * 1000) / 10 + "%",
      afterText: `der Rezepte wurden von ${mvpStat.aussteller} ausgestellt`,
    };
  });
}

function rezeptHeilmittelStatistics() {
  return RezeptService.getAll({ include: "Heilmittels" }).then((rezeptList) => {
    const heilmittelMap = [];
    rezeptList.forEach((r) => {
      for (const hmAbk of r.Heilmittels.map((h) => h.abk)) {
        const found = heilmittelMap.find((a) => a.heilmittel == hmAbk);
        if (found) found.count++;
        else heilmittelMap.push({ heilmittel: hmAbk, count: 1 });
      }
    });
    const mvpStat = heilmittelMap.sort((a, b) => b.count - a.count)[0];
    return {
      beforeText: "",
      value: Math.round((mvpStat.count / rezeptList.length) * 1000) / 10 + "%",
      afterText: `der Rezepte sind ${mvpStat.heilmittel}-Rezepte`,
    };
  });
}
