import WebSocket from 'ws';
import ReconnectingWebSocket from "reconnecting-websocket"
import { v4 as uuid4 } from 'uuid'
import { Note } from "./schema"

let websocket: ReconnectingWebSocket
let _onmessage: (note: Note) => void

type Functions = {
    open: (hostname: string, token: string) => void
    close: () => void
    onmessage: (func: (note: Note) => void) => void
}

export async function listen(hostname: string, token: string): Promise<void> {
    return new Promise((resolve) => {
        // 再接続意味ない実装になってるけど今後を考えておく
        const socket = new ReconnectingWebSocket(`wss://${hostname}/streaming?i=${token}`, [], { WebSocket: WebSocket })
        websocket = socket

        // 本来connectするチャンネル分保持すべき
        // そうでないとどのチャンネルからメッセージが来たかわからなくなる
        const channelID = uuid4()

        socket.onopen = () => {
            // ローカルタイムラインのみ
            // see) https://misskey-hub.net/docs/api/streaming/channel/
            socket.send(JSON.stringify({
                type: 'connect',
                body: {
                    channel: 'localTimeline',
                    id: channelID
                }
            }))
        }

        // メッセージが来たらコールバックする
        // マニュアルさんが機能していないので実際に受信して確認するしか無い
        socket.onmessage = (event) => {
            const data = JSON.parse(event.data)
            if (data.body.type == "note") {
                _onmessage(data.body.body)
            }
        }

        // 再接続処理でもresolveしちゃうので再接続は無効化されている
        socket.onclose = () => {
            resolve()
        }

        socket.onerror = () => {
            resolve()
        }
    })
}

export function functions(): Functions {
    return {
        onmessage: onmessage,
        open: open,
        close: close,
    }
}

function onmessage(func: (note: Note) => void) {
    _onmessage = func
}

async function open(hostname: string, token: string) {
    await listen(hostname, token)
}

export function close() {
    if (websocket) {
        websocket.close()
    }
}