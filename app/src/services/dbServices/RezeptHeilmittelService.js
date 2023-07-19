import DatabaseService from "../DatabaseService";

class HeilmittelService {
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
