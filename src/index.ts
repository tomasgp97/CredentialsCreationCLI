#!/usr/bin/env node
import * as drivelist from 'drivelist';
import {UsbSelector} from "./usb_selection/UsbSelector";
import {UsbKeyRepository} from "./key/UsbKeyRepository";
import {KeyHashPair} from "./model/KeyHashPair";
import {Failure, Result, Success} from "./model/Result";
import {KeyService} from "./key/grpc/KeyService";

const yargs = require('yargs');

export async function index() {
    const usbSelector = new UsbSelector();
    const keyRepository = new UsbKeyRepository();
    const keyService = await KeyService.getInstance();

    const options = yargs.usage('Usage: -c <credentials').option("c", {
        alias: "credentials",
        describe: "Path for credentials.json",
        type: "string",
        demandOption: true
    }).argv;

    //not being used
    const credentialsPath = options.credentials
    const usbList: [string] = await usbSelector.chooseUsbFromList().then(json => json.usb);

    const keyHashPairList: any = await Promise.all(usbList.map(usbName => keyRepository.getKeyHashPair(usbName)));

    const result = await keyService.createCredentials(keyHashPairList);


}

index();