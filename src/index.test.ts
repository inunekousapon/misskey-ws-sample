import { functions } from './index'

test('ws test', async function () {

    // typescriptで非同期処理にどうやって干渉できるかわからない
    // とりあえずコールバック方式にした
    const fn = functions()

    // 環境変数から読み込んだホスト名とトークンを渡す
    // トークンの権限の範囲は検証していない、とりま全部
    const cb = fn.open(
        process.env.MISSKEY_HOST as string,
        process.env.MISSKEY_TOKEN as string
    )

    // onmessageの中身を実装するとTLのデータが流れてくる
    // 今はローカル限定
    fn.onmessage((data) => {
        if (data.renoteId) {
            console.info("RENOTE: " + data.renote.text)
        } else {
            console.info(data.text)
        }
    })

    // 30秒経ったらSocket閉じるように
    setTimeout(() => { fn.close() }, 30000)

    // テストもちゃんと30秒待つ
    await new Promise((r) => setTimeout(r, 30000))
}, 35000)
