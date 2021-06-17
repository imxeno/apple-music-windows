const { promisify } = require("util");
const exec = promisify(require("child_process").exec);

module.exports = {
  packagerConfig: {
    icon: "./resources/app.ico",
  },
  makers: [
    {
      name: "@electron-forge/maker-zip",
    },
  ],
  plugins: [
    [
      "@electron-forge/plugin-webpack",
      {
        mainConfig: "./webpack.main.config.js",
        renderer: {
          config: "./webpack.renderer.config.js",
          entryPoints: [
            {
              html: "./src/index.html",
              js: "./src/renderer.ts",
              name: "main_window",
              preload: {
                js: "./src/preload.ts",
              },
            },
          ],
        },
      },
    ],
  ],
  hooks: {
    postPackage: async (forgeConfig, options) => {
      if (!process.env.CASTLABS_EVS_USER) {
        if (options.spinner)
          options.spinner.fail("EVS signing cancelled - user not specified!");
      } else if (!process.env.CASTLABS_EVS_PASSWORD) {
        if (options.spinner)
          options.spinner.fail(
            "EVS signing cancelled - password not specified!"
          );
      } else {
        await exec(
          `python -m castlabs_evs.account -n refresh -A ${process.env.CASTLABS_EVS_USER} -P ${process.env.CASTLABS_EVS_PASSWORD}`
        );
        await exec(
          `python -m castlabs_evs.vmp -n sign-pkg "${options.outputPaths[0]}"`
        );
      }
      if (options.spinner) {
        options.spinner.succeed("EVS signing succeeded!");
      }
    },
  },
};
