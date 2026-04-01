// @ts-check
import tseslint from "typescript-eslint";
import pluginJest from "eslint-plugin-jest";

export default tseslint.config(
  ...tseslint.configs.recommended,
  {
    files: ["packages/**/*.pact.*.ts", "packages/**/*.spec.ts"],
    ...pluginJest.configs["flat/recommended"],
  },
);
