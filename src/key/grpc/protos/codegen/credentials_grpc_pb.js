// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('grpc');
var credentials_pb = require('./credentials_pb.js');

function serialize_CreateCredentialsRequest(arg) {
  if (!(arg instanceof credentials_pb.CreateCredentialsRequest)) {
    throw new Error('Expected argument of type CreateCredentialsRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_CreateCredentialsRequest(buffer_arg) {
  return credentials_pb.CreateCredentialsRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_CreateCredentialsResponse(arg) {
  if (!(arg instanceof credentials_pb.CreateCredentialsResponse)) {
    throw new Error('Expected argument of type CreateCredentialsResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_CreateCredentialsResponse(buffer_arg) {
  return credentials_pb.CreateCredentialsResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


var CredentialsServiceService = exports.CredentialsServiceService = {
  createUserCredentials: {
    path: '/CredentialsService/CreateUserCredentials',
    requestStream: false,
    responseStream: false,
    requestType: credentials_pb.CreateCredentialsRequest,
    responseType: credentials_pb.CreateCredentialsResponse,
    requestSerialize: serialize_CreateCredentialsRequest,
    requestDeserialize: deserialize_CreateCredentialsRequest,
    responseSerialize: serialize_CreateCredentialsResponse,
    responseDeserialize: deserialize_CreateCredentialsResponse,
  },
};

exports.CredentialsServiceClient = grpc.makeGenericClientConstructor(CredentialsServiceService);
