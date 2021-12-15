/**
 * Register css modules in UVU test runner
 */
import hook from "css-modules-require-hook";
// const hook = require('css-modules-require-hook');

hook({
  extensions: [".css", ".scss"],
});
