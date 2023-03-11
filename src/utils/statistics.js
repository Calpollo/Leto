import KundenService from "@/services/KundenService";
import RezeptService from "@/services/RezeptService";

export async function generateStatistics(numberOfStats = 3) {
  console.log(numberOfStats);
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
      value:
        Math.round((mvpStat.count / kundenList.length) * 10000) / 100 + "%",
      afterText: `der Patienten sind über ${mvpStat.status} versichert`,
    };
  });
}

function rezeptAustellerStatistics() {
  return RezeptService.getAll().then((rezeptList) => {
    const ausstellerMap = [];
    rezeptList.forEach((r) => {
      const found = ausstellerMap.find((a) => a.aussteller == r.aussteller);
      if (found) found.count++;
      else ausstellerMap.push({ aussteller: r.aussteller, count: 1 });
    });
    const mvpStat = ausstellerMap.sort((a, b) => b.count - a.count)[0];
    return {
      beforeText: "",
      value:
        Math.round((mvpStat.count / rezeptList.length) * 10000) / 100 + "%",
      afterText: `der Rezepte wurden von ${mvpStat.aussteller} ausgestellt`,
    };
  });
}

function rezeptHeilmittelStatistics() {
  return RezeptService.getAll({ include: "Heilmittel" }).then((rezeptList) => {
    const heilmittelMap = [];
    rezeptList.forEach((r) => {
      const found = heilmittelMap.find((a) => a.heilmittel == r.Heilmittel.abk);
      if (found) found.count++;
      else heilmittelMap.push({ heilmittel: r.Heilmittel.abk, count: 1 });
    });
    const mvpStat = heilmittelMap.sort((a, b) => b.count - a.count)[0];
    return {
      beforeText: "",
      value:
        Math.round((mvpStat.count / rezeptList.length) * 10000) / 100 + "%",
      afterText: `der Rezepte sind ${mvpStat.heilmittel}-Rezepte`,
    };
  });
}
