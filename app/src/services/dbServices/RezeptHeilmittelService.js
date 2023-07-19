import DatabaseService from "../DatabaseService";

class HeilmittelService {
  // getAll({ include = [] } = {}) {
  //   return DatabaseService.getRezeptHeilmittel({ include }).catch((err) => {
  //     console.warn(err);
  //     return [];
  //   });
  // }

  // getOne(id, { include = [] } = {}) {
  //   return DatabaseService.getRezeptHeilmittel({ id, include }).catch((err) => {
  //     console.warn(err);
  //     return null;
  //   });
  // }

  create(terminNumber, HeilmittelId, RezeptId) {
    return DatabaseService.createRezeptHeilmittel({
      where: {
        terminNumber,
        HeilmittelId,
        RezeptId,
      },
    });
  }

  // each item in the list is an object with keys:
  // - terminNumber
  // - HeilmittelId
  // - RezeptId
  bulkCreate(dataList) {
    // console.log("Creating RezeptHeilmittel in bulk:", dataList);
    return DatabaseService.createRezeptHeilmittel({
      where: dataList,
      bulkCreate: true,
    });
  }
}

export default new HeilmittelService();
