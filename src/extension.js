const path = require('path');
const fs = require('fs');
const vscode = require('vscode');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	const config = vscode.workspace.getConfiguration("synthwave84");
	
	let brightness = parseFloat(config.brightness) > 1 ? 1 : parseFloat(config.brightness);
	brightness = brightness < 0 ? 0 : brightness;
	const parsedBrightness = Math.floor(brightness * 255).toString(16).toUpperCase();
	let neonBrightness = config && parsedBrightness && !isNaN(parsedBrightness) ? parsedBrightness : "75";

	let disposable = vscode.commands.registerCommand('extension.enableNeon', function () {
		const isWin = /^win/.test(process.platform);
		const appDir = path.dirname(require.main.filename);

		const base = appDir + (isWin ? "\\vs\\code" : "/vs/code");
		console.log(base);

		const htmlFile =
			base +
			(isWin
				? "\\electron-browser\\workbench\\workbench.html"
				: "/electron-browser/workbench/workbench.html");

		const templateFile =
				base +
				(isWin
					? "\\electron-browser\\workbench\\neondreams.js"
					: "/electron-browser/workbench/neondreams.js");

		try {
			// generate production theme JS
			const chromeStyles = fs.readFileSync(__dirname +'/css/editor_chrome.css', 'utf-8');
			const jsTemplate = fs.readFileSync(__dirname +'/js/theme_template.js', 'utf-8');
			const themeWithChrome = jsTemplate.replace(/\[CHROME_STYLES\]/g, chromeStyles);
			const finalTheme = themeWithChrome.replace(/\[NEON_BRIGHTNESS\]/g, neonBrightness);
			fs.writeFileSync(templateFile, finalTheme, "utf-8");
			
			// modify workbench html
			const html = fs.readFileSync(htmlFile, "utf-8");

			// check if the tag is already there
			const isEnabled = html.includes("neondreams.js");

			if (!isEnabled) {
				// delete synthwave script tag if there
				let output = html.replace(/^.*(<!-- SYNTHWAVE 84 --><script src="neondreams.js"><\/script><!-- NEON DREAMS -->).*\n?/mg, '');
				// add script tag
				output = html.replace(/\<\/html\>/g, `	<!-- SYNTHWAVE 84 --><script src="neondreams.js"></script><!-- NEON DREAMS -->\n`);
				output += '</html>';
	
				fs.writeFileSync(htmlFile, output, "utf-8");
				vscode.commands.executeCommand("workbench.action.reloadWindow");
			} else {
				vscode.window.showInformationMessage('Neon dreams is already enabled. Refreshing JS settings.');
			}
		} catch (e) {
			vscode.window.showErrorMessage('Something went wrong when starting neon dreams');
		}
	});

	let disable = vscode.commands.registerCommand('extension.disableNeon', uninstall);

	context.subscriptions.push(disposable);
	context.subscriptions.push(disable);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
	// uninstall();
}

function uninstall() {
	var isWin = /^win/.test(process.platform);
	var appDir = path.dirname(require.main.filename);
	var base = appDir + (isWin ? "\\vs\\code" : "/vs/code");
	var htmlFile =
		base +
		(isWin
			? "\\electron-browser\\workbench\\workbench.html"
			: "/electron-browser/workbench/workbench.html");

	// modify workbench html
	const html = fs.readFileSync(htmlFile, "utf-8");

	// check if the tag is already there
	const isEnabled = html.includes("neondreams.js");

	if (isEnabled) {
		// delete synthwave script tag if there
		let output = html.replace(/^.*(<!-- SYNTHWAVE 84 --><script src="neondreams.js"><\/script><!-- NEON DREAMS -->).*\n?/mg, '');
		fs.writeFileSync(htmlFile, output, "utf-8");
		vscode.commands.executeCommand("workbench.action.reloadWindow");
	} else {
		vscode.window.showInformationMessage('Neon dreams isn\'t running.');
	}
}

module.exports = {
	activate,
	deactivate
}
