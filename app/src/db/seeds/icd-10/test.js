const fs = require("fs");
const { parse } = require("csv-parse");

let entries = [];
let rowNumber = 1;

fs.createReadStream("./icd-10-2023.csv")
  .pipe(parse({ delimiter: "|", from_line: 2 }))
  .on("data", function (row) {
    if (rowNumber % 1000 == 0)
      console.log(Math.round((rowNumber / 86462) * 100) + "%");
    /* eslint-disable no-unused-vars */
    const [
      kodierung,
      nummer,
      druckkennzeichen,
      primärschlüssel,
      sternschlüssel,
      zusatzschlüssel,
      primärschluessel2,
      text,
    ] = row;
    /*eslint-enable no-unused-vars */
    if (primärschlüssel.startsWith("M" || primärschlüssel.startsWith("N")))
      entries.push({
        kodierung,
        primärschlüssel,
        sternschlüssel,
        zusatzschlüssel,
        text,
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
      "./icd10-heilmittel.json",
      JSON.stringify(entries, null, 2),
      () => { }
    );
  });
