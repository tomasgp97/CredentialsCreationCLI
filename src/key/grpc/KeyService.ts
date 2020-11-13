import grpc from "grpc";
import {ChannelCredentials} from "grpc";
import './protos/codegen/credentials_pb';
import {KeyHashPair} from "../../model/KeyHashPair";

const services = require('./protos/codegen/credentials_grpc_pb.js');
const messages = require('./protos/codegen/credentials_pb.js');
type CreateCredentialsResponse = typeof messages.CreateCredentialsResponse;


export class KeyService {

    private static instance: KeyService | undefined;

    private constructor(private client: any) {
    }


    static async getInstance(): Promise<KeyService> {
        if (this.instance == null) this.instance = new KeyService(await this.initClient());
        return this.instance;
    }

    private static async initClient() {
        let credentials: ChannelCredentials;
        credentials = grpc.credentials.createInsecure();
        return new services.CredentialsServiceClient('0.0.0.0:50000', credentials);
    }

    createCredentials(keyHashPairList:KeyHashPair[]): Promise<CreateCredentialsResponse> {
        return new Promise<CreateCredentialsResponse>(async (resolve, reject) => {
            const createCredentialsRequest = new messages.CreateCredentialsRequest();
            const protoKeyHashPairList = keyHashPairList.map(pair => new messages.KeyHashPair().setKey(pair.key).setHardwarehash(pair.hardwareHash))

            createCredentialsRequest.setKeyhashpairList(protoKeyHashPairList);
            await this.client.createUserCredentials(createCredentialsRequest, (err: string, data:any) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(data);
                }
            });
        });
    }

}