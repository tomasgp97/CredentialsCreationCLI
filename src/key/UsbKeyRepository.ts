import * as drivelist from 'drivelist';
import * as crypto from "crypto";
import {KeyHashPair} from "../model/KeyHashPair";
import {Failure, Result, Success} from "../model/Result";
import {readdir, readFile} from "fs";

export class UsbKeyRepository {

    /**
     * will get data for one drive chosen in the command line
     * @param usb description of usb json returned by drive list
     */
    getKeyHashPair(usb: string): Promise<Result<KeyHashPair>>  {
        return new Promise<Result<KeyHashPair>>(async (resolve, reject) => {
            try {
                const drives = await drivelist.list();
                const all = await this.getDriveDataForOneUsb(usb, drives);
                const result = all.find((d: {files: string[]}) => d.files.find((e: string) => e === 'urban'));
                if (result != null) {
                    const keyResult = await this.readKey(`${result.path}/urban/key.txt`);
                    if(keyResult instanceof Success) {
                        const hash = crypto.createHmac('sha256', 'some secret')
                            .update(JSON.stringify(result))
                            .digest('hex');
                        resolve(new Success<KeyHashPair>(new KeyHashPair(keyResult.result, hash)));
                    } else resolve(keyResult);
                } else resolve(new Failure('key not found in key store'));
            } catch (e) {
                resolve(new Failure(e));
            }
        });
    }


    /**
     * @param usbDescription used as usb name
     * @param drives are all available drives connected to computer
     */

    async getDriveDataForOneUsb(usbDescription: string, drives: any) {
        return this.getDriveData(drives.filter((d: any) => d.description == usbDescription))
    }

    /**
     * This method returns metadata about the USB drive
     * @param drives a list of drives connected to the user's computer
     */

    //removed filter of mountpoints.label

     getDriveData(drives: any): Promise<any> {
        return Promise.all(drives.filter((d: any) => d.isUSB)
            .map(async (m: any) => {
                return {
                    enumerator: m.enumerator,
                    busType: m.busType,
                    busVersion: m.busVersion || '',
                    size: m.size,
                    blockSize: m.blockSize,
                    logicalBlockSize: m.logicalBlockSize,
                    isReadOnly: m.isReadOnly,
                    isSystem: m.isSystem,
                    isVirtual: m.isVirtual,
                    isRemovable: m.isRemovable,
                    isCard: m.isCard,
                    isSCSI: m.isSCSI,
                    isUSB: m.isUSB,
                    isUAS: m.isUAS,
                    path: m.mountpoints[0].path,
                    files: await this.listFiles(m.mountpoints[0].path)
                };
            })
        );
    }

    /**
     * This method lists the files found in "path"
     * @param path a string location in a user's computer
     */
    private listFiles(path: string): Promise<string[]> {
        return new Promise((resolve, reject) => {
            readdir(path, 'utf8', (err, files: string[]) => {
                if (err) reject(err);
                else resolve(files);
            });
        })
    }

    /**
     * This method reads a file from a desired path
     * @param path the path where the file is located
     */
    private async readKey(path: string): Promise<Result<string>> {
        return new Promise<Result<string>>((resolve, reject) => {
            readFile(path, 'utf8', (err, data) => {
                if (err) resolve(new Failure(err.message));
                else resolve(new Success(data));
            });
        });
    }

}