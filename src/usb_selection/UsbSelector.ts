import inquirer from 'inquirer';
import * as drivelist from 'drivelist';


export class UsbSelector {

     async chooseUsbFromList() {
        try {
            const usbList: any =  await drivelist.list().then(list => list.filter((d:any) => d.isUSB))
            const options = usbList.map((json:any) => json.description)

            return inquirer.prompt([{
                name:'usb',
                type:'checkbox',
                message:'Select a usb to create a user:',
                choices:options
            }]);
        } catch (e) {
            console.error(e);
        }

    }
}