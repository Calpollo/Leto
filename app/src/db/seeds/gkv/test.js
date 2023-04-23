const fs = require("fs");
const { parse } = require("csv-parse");

let entries = [];
let rowNumber = 1;

fs.createReadStream("./list.csv")
  .pipe(parse({ delimiter: "|", from_line: 1 }))
  .on("data", function (row) {
    if (rowNumber % 1000 == 0)
      console.log(Math.round((rowNumber / 86462) * 100) + "%");
    /* eslint-disable no-unused-vars */
    const [abrechnungIK, kassensitzIK, name] = row;
    /*eslint-enable no-unused-vars */
    entries.push({
      kostenträgerkennung: abrechnungIK,
      name,
    });
    rowNumber++;
  })
  .on("error", function (error) {
    console.log(error.message);
  })
  .on("end", function () {
    console.log(JSON.stringify(entries[0], null, 2));
    console.log(entries.length);
    fs.writeFile(
      "./krankenkassen.json",
      JSON.stringify(entries, null, 2),
      () => { }
    );
  });
