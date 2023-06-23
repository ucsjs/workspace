module.exports = {
	root: true,
	env: { 
		browser: true,
		node: true,
		es2021: true 
	},
	plugins: ['@typescript-eslint/eslint-plugin'],
	extends: [
		'plugin:@typescript-eslint/recommended',
		'prettier',
	],
	parserOptions: {
		ecmaVersion: 2021
	},
	overrides: [
		{
			files: ['**/*.ts'],
			parser: '@typescript-eslint/parser',
			parserOptions: {
				project: 'tsconfig.json',
				sourceType: 'module',
			},
			rules: {
				'@typescript-eslint/interface-name-prefix': 'off',
				'@typescript-eslint/explicit-function-return-type': 'off',
				'@typescript-eslint/no-explicit-any': 'off',
				'@typescript-eslint/explicit-module-boundary-types': 'off',
				'@typescript-eslint/no-unused-vars': 'off',
				'@typescript-eslint/ban-types': 'off',
			},
		},
		{
			files: ['**/*.spec.ts', 'integration/**/*.ts'],
			parser: '@typescript-eslint/parser',
			parserOptions: {
			project: 'tsconfig.spec.json',
			sourceType: 'module',
			},
			rules: {
			'@typescript-eslint/interface-name-prefix': 'off',
			'@typescript-eslint/explicit-function-return-type': 'off',
			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/explicit-module-boundary-types': 'off',
			'@typescript-eslint/no-unused-vars': 'off',
			'@typescript-eslint/ban-types': 'off',
			'@typescript-eslint/no-empty-function': 'off',
			},
		}
	]
};