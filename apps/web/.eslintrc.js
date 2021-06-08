module.exports = {
  "extends": ["../../.eslintrc.js"],
  "ignorePatterns": ["!**/*"],
  "overrides": [
    {
      "extends": [
        "plugin:@nrwl/nx/angular",
        "plugin:@angular-eslint/template/process-inline-templates"
      ],
      "files": ["*.ts"],
      "parserOptions": {
        "project": ["apps/web/tsconfig.*?.json"]
      },
      "rules": {
        "@angular-eslint/component-selector": [
          "error",
          {
            "prefix": "bc",
            "style": "kebab-case",
            "type": "element"
          }
        ],
        "@angular-eslint/directive-selector": [
          "error",
          {
            "prefix": "bc",
            "style": "camelCase",
            "type": "attribute"
          }
        ]
      }
    },
    {
      "extends": ["plugin:@nrwl/nx/angular-template"],
      "files": ["*.html"],
      "rules": {}
    }
  ]
}
