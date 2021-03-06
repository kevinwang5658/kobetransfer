import {beforeEach, describe} from "mocha";
import {Host} from "../../../src/server/signaling/host";
import * as TypeMoq from "typemoq"
import {Socket} from "socket.io";
import * as SocketIO from "socket.io";
import {HostModel} from "../../../src/server/models/hostModel";
import { assert } from "chai";
import {Constants} from "../../../src/shared/constants";
import REQUEST_HOST_ACCEPTED = Constants.REQUEST_HOST_ACCEPTED;
import RequestHostAcceptedModel = Constants.RequestHostAcceptedModel;

describe("Host", () => {

    const SOCKET_ID = "id";
    const HOST_MODEL = <HostModel> {
        hostId: SOCKET_ID,
        files: [
            {
                fileName: "file_name",
                fileSize: 100,
                fileType: "file_type"
            }
        ]
    };

    let socketMock: TypeMoq.IMock<Socket>;
    let ioMock: TypeMoq.IMock<SocketIO.Server>;
    let instance: Host;
    let hostMap;

    beforeEach(() => {
        socketMock = TypeMoq.Mock.ofType<Socket>();
        ioMock = TypeMoq.Mock.ofType<SocketIO.Server>();
        hostMap = new Map<string, HostModel>();
        instance = new Host(socketMock.object, ioMock.object, hostMap);

        socketMock.setup(x => x.id).returns(() => SOCKET_ID);
    });

    it("is able to create a host", () => {
        instance.createHost(HOST_MODEL);

        assert.equal(hostMap.size, 1);
        let host = hostMap.values().next().value;
        assert.equal(host.files[0].fileName, HOST_MODEL.files[0].fileName);
        assert.equal(host.files[0].fileSize, HOST_MODEL.files[0].fileSize);
        assert.equal(host.files[0].fileType, HOST_MODEL.files[0].fileType);
        assert.equal(host.hostId, HOST_MODEL.hostId);
        assert.exists(host.roomId);

        socketMock.verify(x => x.join(host.roomId), TypeMoq.Times.once());
        socketMock.verify(x => x.emit(REQUEST_HOST_ACCEPTED, TypeMoq.It.is<RequestHostAcceptedModel>(r => {
            assert.equal(r.roomId, host.roomId);
            assert.equal(r.files[0].fileName, HOST_MODEL.files[0].fileName);
            assert.equal(r.files[0].fileSize, HOST_MODEL.files[0].fileSize);
            assert.equal(r.files[0].fileType, HOST_MODEL.files[0].fileType);
            return true;
        })), TypeMoq.Times.once())
    });

    it('is able to destroy a host', () => {
        instance.createHost(HOST_MODEL);
        assert.equal(hostMap.size, 1);
        let id = hostMap.values().next().value.roomId;

        instance.destroyHost();
        assert.equal(hostMap.size, 0);
        socketMock.verify(x => x.leave(id), TypeMoq.Times.once())
    });
});
