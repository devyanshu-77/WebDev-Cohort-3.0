// Create a command line interface that lets the user specify a file path and the nodejs process counts the number of words inside it.
// Input - node index.js /Users/kirat/file.txt
// Output - You have 10 words in this file

import fs from "node:fs";
import { program } from "commander";

program
  .name("Counter")
  .description("CLI to count total words in a file")
  .version("1.0.0");

program
  .command("count")
  .description("Read total words in a file")
  .argument("<file path>", "File to count words")
  .action((str) => {
    fs.readFile(str, "utf8", (err, data) => {
      if (err) {
        console.log(err);
      }
      const words = data.split(" ");
      console.log(`You have ${words.length} in this file`);
    });
  });

program.parse();
