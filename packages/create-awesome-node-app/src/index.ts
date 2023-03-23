#!/usr/bin/env node

import program from "commander";
import chalk from "chalk";
import semver from "semver";
import { createNodeApp, checkForLatestVersion } from "@create-node-app/core";
import { getCnaOptions } from "./options";
import packageJson from "../package.json";

const main = async () => {
  let projectName = "my-project";

  program
    .version(packageJson.version)
    .arguments("[project-directory]")
    .usage(`${chalk.green("[project-directory]")} [options]`)
    .action((name) => {
      projectName = name || projectName;
    })
    .option("--verbose", "print additional logs")
    .option("--info", "print environment debug info")
    .option("--use-npm", "use npm mandatorily")
    .option(
      "--template <template>",
      "specify template to use for initial setup"
    )
    .option(
      "--extend <repos...>",
      "git repositories to extend your boilerplate"
    )
    .option("-a, --alias <alias>", "Import alias to use for the project", "@")
    .option(
      "--src-dir <src-dir>",
      "dir name to put content under [src]/",
      "src"
    )
    .option(
      "--nodeps",
      "generate package.json file without installing dependencies"
    )
    .option("--inplace", "apply setup to an existing project")
    .parse(process.argv);

  const latest = await checkForLatestVersion("create-awesome-node-app");

  if (latest && semver.lt(packageJson.version, latest)) {
    console.log();
    console.error(
      chalk.yellow(
        `You are running \`create-awesome-node-app\` ${packageJson.version}, which is behind the latest release (${latest}).\n\n` +
          "We recommend always using the latest version of create-awesome-node-app if possible."
      )
    );
    //return;
  }

  return createNodeApp(
    projectName,
    { ...program.opts(), projectName },
    getCnaOptions
  );
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
