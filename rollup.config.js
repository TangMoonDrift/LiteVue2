import { babel } from '@rollup/plugin-babel'

export default {
	input: './src/main.js',
	output: {
		file: './dist/vue.js',
		name: 'Vue', // global.Vue
		format: 'umd',
		sourcemap: true // 调试源码
	},
	plugins: [
		babel({
			exclude: 'node_modules/**'
		})
	]
}
