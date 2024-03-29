import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { action, makeAutoObservable, reaction } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import { useForm } from "react-hook-form";
import { AppContext, ModalCapability, ModalDialogInnerProps, SetDirtyCapability } from "../App";
import { Fanfic } from "../fanfic/fanfiction";
import { FicTemplate } from "../fanfic/template";

interface ConnectParams {
    url: string;
    username: string;
    password: string;
}

interface ContentlessOutgoingPacket {
    username: string;
    authenticationCode: string;
}

interface ReadOutgoingPacket extends ContentlessOutgoingPacket{
    ficName: string;
    revision: string;
}

interface WriteOutgoingPacket extends ContentlessOutgoingPacket{
    prevName: string;
    fanfic: Fanfic;
}

class ReqError {
    error: any;

    constructor(error: any) {
        this.error = error;
    }
}

export enum ConnectionStatus {
    CONNECTED_TO_SERVER,
    LOST_CONNECTION,
    NO_SERVER
}

export class ServerContext {

    status: ConnectionStatus = ConnectionStatus.NO_SERVER;

    username: string = "";
    password: string = "";
    url: string = "";

    fics: string[] = [];

    setModal: ModalCapability;
    setDirty: SetDirtyCapability;

    constructor(setModal: ModalCapability, setDirty: SetDirtyCapability) {
        makeAutoObservable(this);
        this.setModal = setModal;
        this.setDirty = setDirty;
    }

    connect(params: ConnectParams): void {
        this.username = params.username;
        //TODO: SHA it up
        this.password = params.password; 

        axios.post("http://" + params.url + "/listfics", this.newMAC()).then(action(resp=>{
            this.status = ConnectionStatus.CONNECTED_TO_SERVER;
            this.fics = resp.data as string[];
            this.url = params.url;
            this.setModal.setModal(undefined);
        })).catch(e=>{
            this.username = "";
            this.password = "";
            alert("Error connecting to server");
        })
    }

    async newFic(): Promise<Fanfic | undefined> {
        let mac: ContentlessOutgoingPacket = this.newMAC();
        let resp = await this.tryReq("newfic", {
            username: mac.username,
            authenticationCode: mac.authenticationCode,
        });
        if(resp instanceof ReqError) {
            this.onNotConnected();
            return undefined;
        } else {
            let data: any = resp.data;
            let ret: Fanfic = new Fanfic(data.title, ()=>{
                this.setDirty.setDirty();
            });
            ret.fromSerialized(data);
            this.fics.push(ret.meta.title);
            return ret;
        } 
    }

    async readFic(name: string, revision: string = "latest"): Promise<Fanfic | undefined> {
        let mac: ContentlessOutgoingPacket = this.newMAC();
        let resp = await this.tryReq("read", {
            username: mac.username,
            authenticationCode: mac.authenticationCode,
            ficName: name,
            revision: revision
        });
        if(resp instanceof ReqError) {
            this.onNotConnected();
            return undefined;
        } else {
            let data: any = resp.data;
            let ret: Fanfic = new Fanfic(data.title, ()=>{
                this.setDirty.setDirty();
            });
            ret.fromSerialized(data);
            return ret;
        } 
    }

    async writeFic(prevName: string, fic: Fanfic): Promise<boolean> {
        let mac: ContentlessOutgoingPacket = this.newMAC();
        let resp = await this.tryReq("write", {
            username: mac.username,
            authenticationCode: mac.authenticationCode,
            prevName: prevName,
            fanfic: fic
        });
        if(resp instanceof ReqError) {
            this.onNotConnected();
            return false;
        } else {
            return true;
        }
    }

    async updateFicList(alerts: boolean = true): Promise<boolean> {
        let resp = await this.tryReq("listfics", this.newMAC());
        if(resp instanceof ReqError) {
            this.onNotConnected();
            return false;
        } else {
            this.fics = resp.data as string[];
            return true;
        }
    }

    async reconnect(): Promise<boolean> {
        let resp: boolean = await this.updateFicList(false);
        if(resp) this.status = ConnectionStatus.CONNECTED_TO_SERVER;
        return resp;
    }

    async tryReq(page: string, args: any, options?: AxiosRequestConfig<any>): Promise<AxiosResponse<any, any>|ReqError> {
        let retries: number = 5;
        let error: any|undefined = undefined;
        while(retries-->0) {
            try {
                return await axios.post("http://" + this.url + "/" + page, args, options);
            } catch(e) {
                error = e;
            }
        }
        return new ReqError(error!);
    }

    onNotConnected() {
        this.status = ConnectionStatus.LOST_CONNECTION;
    }

    newMAC(): ContentlessOutgoingPacket {
        //TODO: SHA it up
        return {
            username: this.username,
            authenticationCode: "girls"
        };
    }

}

export interface ServerConnectProps extends React.HTMLProps<HTMLDivElement> {
    ctx: AppContext;
}

export const ServerConnect = observer((props: ServerConnectProps)=>{
    if(props.ctx.server.status === ConnectionStatus.NO_SERVER) {
        return (
            <React.Fragment>
                Not Connected&nbsp;
                <button onClick={()=>{props.ctx.setModal(ServerConnectDialog)}}>
                    Connect
                </button>
            </React.Fragment>
        )
    } else if(props.ctx.server.status === ConnectionStatus.LOST_CONNECTION) {
        return (
            <React.Fragment>
                Lost Connection
            </React.Fragment>
        )
    } else {
        return (
            <React.Fragment>
                Connected to {props.ctx.server.url}
            </React.Fragment>
        )
    }
});

function ServerConnectDialog(props: ModalDialogInnerProps): JSX.Element {
    const { register, handleSubmit } = useForm<ConnectParams>();

    return (
        <React.Fragment>
            <span className="server-connect-form__anchor"></span>
            <form className="server-connect-form" onSubmit={handleSubmit(props.ctx.server.connect.bind(props.ctx.server))}>
                <table>
                    <tbody>
                        <tr>
                            <td>
                                Server URL/IP
                            </td>
                            <td>
                                <input type="text" {...register("url")}/>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                Username
                            </td>
                            <td>
                                <input type="text" {...register("username")} ></input>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                Password
                            </td>
                            <td>
                                <input type="password" {...register("password")} ></input>
                            </td>
                        </tr>
                        <tr>
                            <td className="server-connect-form__buttons" colSpan={2}>
                                <button type="button" onClick={()=>{props.ctx.dialog = undefined;}}>Cancel</button>
                                <button type="submit">Connect</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </form>
        </React.Fragment>
    )
}