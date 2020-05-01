
module.exports = {
	publicPath: process.env.NODE_ENV === 'production'
		? '/starship-finder/' // prod
		: '/', // dev
	css: {
		loaderOptions: {
			sass: {
				prependData: `@import "./src/_main.scss";`,
			},
		},
	}
}

