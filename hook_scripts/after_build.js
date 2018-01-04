#!/usr/bin/env node
module.export = function (ctx) {


	console.log('Executing after build hook................');

	if (ctx.platforms.indexOf('android') < 0) {
		return;
	}

	console.log(ctx.cmdLine);
	if (!/--release/.test(ctx.cmdLine)) {
		return;
	}

	var exec = ctx.requireCordovaModule('child_process').exec,
		fs = ctx.requireCordovaModule('fs'),
		path = ctx.requireCordovaModule('path'),
		sys = ctx.requireCordovaModule('sys');

	var rootPath = ctx.opts.projectRoot;
	var platformRoot = path.join(rootPath, 'platforms/android');
	var releaseOutput = path.join(platformRoot, 'build/outputs/apk/release/android-release-unsigned.apk');
	var finalOutput = path.join(rootPath, 'congoyquima.apk');


	//Delete previous build if it exists
	if (fs.existsSync(finalOutput)) {
		fs.unlinkSync(finalOutput);
	}

	var commands = {
		jarsigner: [
			'jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore ',
			path.join(rootPath, 'congoyquima.jks'),
			' -storepass \'C0ng0&Qu3m@\' ',
			releaseOutput,
			' congoyquima'
		].join(''),
		zipalign: [
			'zipalign -v 4',
			releaseOutput,
			finalOutput
		].join(''),
		apksigner: [
			'apksigner verify ',
			finalOutput
		].join('')
	};

	var execNext = function (commandList) {
		exec(commands[commandList.shift()], function(error, stdout, stderr) {
			if (error) {
				sys.puts(stderr);
			}
			else {
				sys.puts(stdout);
				if (commandList.length) {
					execNext(commandList);
				}
			}
		})
	}

	execNext(['jarsigner', 'zipalign', 'apksigner']);
}