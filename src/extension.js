const path = require('path');
const fs = require('fs');
const vscode = require('vscode');
const diff = require('semver/functions/diff');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	this.extensionName = 'RobbOwen.synthwave-vscode';
	this.cntx = context;
	
	const config = vscode.workspace.getConfiguration("synthwave84");

	let disableGlow = config && config.disableGlow ? !!config.disableGlow : false;
	const workbencHtmlPath = config && config.workbencHtmlPath ? config.workbencHtmlPath : "";
	if (workbencHtmlPath && !isValidPath(workbencHtmlPath)) return vscode.window.showInformationMessage(`The path provided is not valid: ${workbencHtmlPath}`);

	let brightness = parseFloat(config.brightness) > 1 ? 1 : parseFloat(config.brightness);
	brightness = brightness < 0 ? 0 : brightness;
	brightness = isNaN(brightness) ? 0.45 : brightness;

	const parsedBrightness = Math.floor(brightness * 255).toString(16).toUpperCase();

	const disposable = vscode.commands.registerCommand('synthwave84.enableNeon', function () {

		const vscodeDir = path.dirname(require?.main?.filename || process.execPath);
		const workbenchHtmlPath = workbencHtmlPath ? workbencHtmlPath : recursiveSearchPath(vscodeDir, "workbench", "html");
		const workbenchJsPath = workbenchHtmlPath.split(/[\/,\\\\]/).slice(0,-1).join("") + "neondreams.js";

		try {
			// generate production theme JS
			const chromeStyles = fs.readFileSync(__dirname +'/css/editor_chrome.css', 'utf-8');
			const jsTemplate = fs.readFileSync(__dirname +'/js/theme_template.js', 'utf-8');
			const themeWithGlow = jsTemplate.replace(/\[DISABLE_GLOW\]/g, disableGlow);
			const themeWithChrome = themeWithGlow.replace(/\[CHROME_STYLES\]/g, chromeStyles);
			const finalTheme = themeWithChrome.replace(/\[NEON_BRIGHTNESS\]/g, parsedBrightness);
			fs.writeFileSync(workbenchJsPath, finalTheme, "utf-8");

			// modify workbench html
			const html = fs.readFileSync(workbenchHtmlPath, "utf-8");

			// check if the tag is already there
			const isEnabled = html.includes("neondreams.js");

			if (!isEnabled) {
				// delete synthwave script tag if there
				let output = html.replace(/^.*(<!-- SYNTHWAVE 84 --><script src="neondreams.js"><\/script><!-- NEON DREAMS -->).*\n?/mg, '');
				// add script tag
				output = html.replace(/\<\/html\>/g, `	<!-- SYNTHWAVE 84 --><script src="neondreams.js"></script><!-- NEON DREAMS -->\n`);
				output += '</html>';

				fs.writeFileSync(workbenchHtmlPath, output, "utf-8");

				vscode.window
					.showInformationMessage("Neon Dreams enabled. VS code must reload for this change to take effect. Code may display a warning that it is corrupted, this is normal. You can dismiss this message by choosing 'Don't show this again' on the notification.", { title: "Restart editor to complete" })
					.then(function(msg) {
						vscode.commands.executeCommand("workbench.action.reloadWindow");
					});

			} else {
				vscode.window
					.showInformationMessage('Neon dreams is already enabled. Reload to refresh JS settings.', { title: "Restart editor to refresh settings" })
					.then(function(msg) {
						vscode.commands.executeCommand("workbench.action.reloadWindow");
					});
			}
		} catch (e) {
			if (/ENOENT/.test(e.code)) {
				vscode.window.showInformationMessage(`The file "workbench.html" could not be found at the specified path: ${e.path}`);
			}

			if (/EACCES|EPERM/.test(e.code)) {
				vscode.window.showInformationMessage("Neon Dreams was unable to modify the core VS code files needed to launch the extension. You may need to run VS code with admin privileges in order to enable Neon Dreams.");
				return;
			} else {
				vscode.window.showErrorMessage(`Something went wrong when starting neon dreams: ${e.message}`);
				return;
			}
		}
	});

	let disable = vscode.commands.registerCommand('synthwave84.disableNeon', uninstall);
	
	context.subscriptions.push(disposable);
	context.subscriptions.push(disable);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
	// ...
}

function uninstall() {
	try {
		const vscodeDir = path.dirname(require?.main?.filename || process.execPath);

		const workbenchHtmlPath = recursiveSearchPath(vscodeDir, "workbench", "html");

		// modify workbench html
		const html = fs.readFileSync(workbenchHtmlPath, "utf-8");

		// check if the tag is already there
		const isEnabled = html.includes("neondreams.js");

		if (isEnabled) {
			// delete synthwave script tag if there
			let output = html.replace(/^.*(<!-- SYNTHWAVE 84 --><script src="neondreams.js"><\/script><!-- NEON DREAMS -->).*\n?/mg, '');
			fs.writeFileSync(workbenchHtmlPath, output, "utf-8");

			vscode.window
				.showInformationMessage("Neon Dreams disabled. VS code must reload for this change to take effect", { title: "Restart editor to complete" })
				.then(function(msg) {
					vscode.commands.executeCommand("workbench.action.reloadWindow");
				});
		} else {
			vscode.window.showInformationMessage('Neon dreams isn\'t running.');
		}
	} catch (error) {
		if (/ENOENT/.test(e.code)) {
			vscode.window.showInformationMessage(`The file "workbench.html" could not be found at the specified path: ${e.path}`);
		}
		if (/EACCES|EPERM/.test(error.code)) {
			vscode.window.showInformationMessage("Neon Dreams was unable to modify the core VS code files needed to launch the extension. You may need to run VS code with admin privileges in order to enable Neon Dreams.");
			return;
		} else {
			vscode.window.showErrorMessage('Something went wrong when starting neon dreams');
			return;
		}
	}
}

/**
 * @function recursiveSearchPath recursive function that searches for a specific file by its name and
 * extension in a directory and its subdirectories.
 *
 * @param {string} dir - The root directory where the search will begin.
 * @param {string} fileName - The base name of the file being searched for (without the extension).
 * @param {string} extension - The extension of the file being searched for (without the leading dot).
 * @returns {string|null} - Returns the full path of the file if found; otherwise returns `null`.
 *
 * @throws {Error} - If an error occurs while reading the file system.
 *
 * @example
 * // Search for the file 'workbench.html' or 'workbench.esm.html' in a directory
 * const pathFile = recursiveSearchPath('/path/vscode/directory', 'workbench', 'html');
 * if (pathFile) {
 *   console.log(`File found: ${pathFile}`);
 * } else {
 *   console.log('File not found');
 * }
 */

function recursiveSearchPath(dir, fileName, extension) {
	// Get the list of files and directories in the current directory
	const archivos = fs.readdirSync(dir);

	for (const archivo of archivos) {
		// Get the full path of the file or directory
		const rutaCompleta = path.join(dir, archivo);

		// Check if it is a directory
		const esDirectorio = fs.statSync(rutaCompleta).isDirectory();

		if (esDirectorio) {
			// If it is a directory, perform the search recursively within it
			try {
				const resultado = recursiveSearchPath(rutaCompleta, fileName, extension);
				if (resultado) {
					return resultado; // If we find the file, we return the path
				}
			} catch (error) {
				// If any error occurs in the subfolder, we ignore it and continue searching.
			}
		} else {
			// Create a dynamic regular expression to compare file name and extension
			const regex = new RegExp(`${fileName}.*\\.${extension}$`);

			// If the file matches the pattern, we return its full path
			if (regex.test(archivo)) {
				return rutaCompleta;
			}
		}
	}

	// If nothing is found, return null.
	return null;
}

/**
 * @function isValidPath Validates if a given string is a valid file path.
 * 
 * @param {string} inputPath - The file path to validate.
 * @returns {boolean} - Returns true if the path is valid and the file exists; otherwise, false.
 */

function isValidPath(inputPath) {
    // Normalize the path, converting backslashes and double slashes to the correct format
    const normalizedPath = path.normalize(inputPath);
    
    // Check if the path has a valid file extension
    const extension = path.extname(inputPath);
    
    if (!extension) {
        return false; // No file extension, probably not a valid file path
    }
    
    // Optional: Check if the file or directory exists in the system
    try {
        fs.accessSync(normalizedPath, fs.constants.F_OK);
        return true; // The file or directory exists and is accessible
    } catch (error) {
        return false; // The file or directory does not exist
    }
}

module.exports = {
	activate,
	deactivate
}
