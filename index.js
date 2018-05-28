const HMKit = require('hmkit');

/*
 * Configuration
 * 
 * DELAY - Delay in milliseconds between sending out commands. This should be high enough so that one app won't send two commands on the same time.
 * COUNT - Commands count, how many should this debugger app send before exiting.
 * APPS - Apps config to send out commands. If there are multiple apps, it will use them all one by one.
 */
const CONFIG = {
  DELAY: 2000,
  COUNT: 10,
  APPS: [
    {
      clientCertificate: ``,
      clientPrivateKey: ``,
      accessToken: ``
    }
  ]
};

function log(counter, ...args) {
  console.log('#' + (counter + 1), ...args);
}

async function sendCommand(clientCertificate, clientPrivateKey, accessToken, counter) {
  log(counter, 'Sending command');

  const hmkit = new HMKit(clientCertificate, clientPrivateKey).staging();

  try {
    const accessCertificate = await hmkit.downloadAccessCertificate(accessToken).catch(e => {
      log(counter, 'Failed to fetch access certificate');
    });

    if (!accessCertificate) return;

    const response = await hmkit.telematics.sendCommand(
      accessCertificate.getVehicleSerial(),
      hmkit.commands.RaceCommand.getState()
    );
    const parsedResponse = response.parse();

    log(counter, 'Successfully received ', parsedResponse.constructor.name);
  } catch (e) {
    if (e && e.response && e.response.status && e.response.body) {
      const status = e.response.status;

      switch (status) {
        case 408:
          log(counter, 'HTTP error - Vehicle Asleep');
          return;
        case 403:
          log(counter, 'HTTP error - Unauthorized');
          return;
      }
    }

    switch (e.message) {
      case 'Failed to send telematics command.': {
        log(counter, 'onTelematicsSendData() callback was not called.');
        break;
      }
      case 'Failed to read incoming data.': {
        log(counter, 'onTelematicsCommandIncoming() callback was not called.');
        break;
      }
      default: {
        log(counter, 'Error', e);
      }
    }
  }
}

function loopSend(counter) {
  const { APPS, COUNT, DELAY } = CONFIG;
  const nthApp = counter % APPS.length;

  const { clientCertificate, clientPrivateKey, accessToken } = APPS[nthApp];

  sendCommand(clientCertificate, clientPrivateKey, accessToken, counter);

  if (counter + 1 < COUNT) {
    setTimeout(() => {
      loopSend(counter + 1);
    }, DELAY);
  }
}

loopSend(0);
