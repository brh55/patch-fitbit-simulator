# patch-fitbit-simulator
> Only for Mac OS currently

A simple CLI to patch the Fitbit OS Simulator certificate with the new SSL certificate for the Device Bridge to work properly in relation to this [issue](https://community.fitbit.com/t5/SDK-Development/Simulator-SSL-Problem/td-p/5002720/page/2.) - March 2022.


This CLI will download the new SSL certificate into the correct directory, and back up the pre-existing SSL certificate. In addition, it will reboot the Fitbit OS Simulator once the patch is complete.


## Usage

```
$ npm install --global patch-fitbit-simulator
```

```
$ patch-fitbit-simulator
```

## License
MIT
