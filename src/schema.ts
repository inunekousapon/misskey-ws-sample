export type Note = {
    id: string,
    createdAt: Date,
    userId: string,
    user: {
        id: string,
        name: string,
        username: string,
        host?: string,
        avatarUrl: string,
        avatarBlurhash: string,
        isBot: boolean
        isCat: boolean
        emojis: {},
        onlineStatus: string,
    },
    text?: string,
    cw?: any,
    visibility: string,
    localOnly: boolean,
    renoteCount: number,
    repliesCount: number,
    reactions: [],
    reactionEmojis: {},
    fileIds: string[],
    files: [],
    replyId?: string
    renoteId?: string,
    renote: Note
    channelId?: string,
    channel?: {}
    poll?: {
        multiple: boolean,
        expiresAt: Date,
        choices: []
    }
}
