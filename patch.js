import fs from 'fs';
import path from 'path';
import {get} from 'https';
import {execSync} from 'child_process';
import {platform} from 'os';

// Decorative CLI Packages
import ora from 'ora';

const log = ora();

const restartSimulator = () => {
	const appName = 'Fitbit OS Simulator';
	// Supporting Mac OS, will take contributions here:
	execSync(`osascript -e 'quit app "${appName}"'`);
	execSync(`osascript -e 'tell application "${appName}" to activate'`);
};

const CERT_URI = 'https://pki.goog/repo/certs/gtsr1.pem';
const SIMULATOR_CERT_PATH = path.join(
	'/Applications',
	'Fitbit OS Simulator.app',
	'Contents',
	'Resources',
	'static',
	'devicesim',
	'mac',
	'vulcan.app',
	'Contents',
	'Resources'
);

const downloadCert = () => {
	return new Promise((resolve, reject) => {
		log.start();
		log.info('Downloading new cert...');

		const certFileName = `${SIMULATOR_CERT_PATH}/fitbitcert.pem`;
		const file = fs.createWriteStream(certFileName);
		get(CERT_URI, response => {
			response.pipe(file);
		});

		file.on('finish', () => {
			log.succeed('Successfully downloaded new certificate');
			resolve(file.path);
		});

		file.on('error', () => {
			reject(new Error(`There was an issue downloading the new cert at ${CERT_URI}`));
		});
	});
};

const patch = async () => {
	const certFile = await downloadCert();

	log.info('Backing up original cert...cacert-bkup.pem');
	fs.copyFileSync(`${SIMULATOR_CERT_PATH}/cacert.pem`, `${SIMULATOR_CERT_PATH}/cacert-bkup.pem`);

	log.info('Renaming new cert to cacert.pem');
	fs.renameSync(certFile, `${SIMULATOR_CERT_PATH}/cacert.pem`);

	log.succeed('Successfully copy over new cert');
};

(async () => {
	try {
		if (platform() !== 'darwin') {
			throw new Error('Currently this only supports Mac OS, feel free to contribute and add other platforms');
		}

		await patch();
		log.succeed('Finished patching Fitbit OS Simulator');
		log.succeed('Rebooting Fitbit OS Simulator');
		restartSimulator();

		log.stop();
	} catch (error) {
		console.error(`Failed to patch simulator: ${error}`);
		log.stop();
	}
})();
