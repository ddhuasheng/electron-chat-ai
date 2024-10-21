/**
 * 获取本地媒体设备
 */
const getMedie: () => Promise<MediaStream> = () => {
    return new Promise((resolve, reject) => {
        navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        }).then(stream => {
            resolve(stream)
        }).catch(err => {
            reject(err)
        })
    })
}

interface RtcIOInterface {
    connection: RTCPeerConnection
    stream: MediaStream | null
    makingOffer: boolean
    init: () => Promise<void>
    addTrack: (tracks: MediaStreamTrack[],stream: MediaStream) => void
    createOffer: (options: RTCOfferOptions) => Promise<RTCSessionDescriptionInit>
    createAnswer: (options?: RTCAnswerOptions) => Promise<RTCSessionDescriptionInit>
    setLocalDescription: (description?: RTCSessionDescriptionInit) => void
    setRemoteDescription: (description: RTCSessionDescriptionInit) => void
    selfVideo: (el: HTMLVideoElement) => void
}

export interface RtcIOOptions {
    selfEl: HTMLVideoElement,
    remoteEl: HTMLVideoElement,
}

const config = {
    iceServers: [
        {
            urls: 'stun:stun.l.google.com:19302'
        }
    ]
}

export default class RtcIO implements RtcIOInterface {
    /** RTCPeerConnection 实例 */
    connection: RTCPeerConnection
    /** 媒体设备流，本地流 */
    stream: MediaStream | null = null
    options: RtcIOOptions
    /** 是否正在进行邀约 */
    makingOffer: boolean = false
    constructor(options: RtcIOOptions) {
        this.options = options
        this.connection = new RTCPeerConnection(config)
        this.init()
    }

    async init() {
        try {
            this.stream = await getMedie()
            this.selfVideo(this.options.selfEl)
        } catch(err) {
            this.stream = null
        }

    }

    /** 获取所有Track */
    getTracks() {
        return this.stream?.getTracks() || []
    }

    /** 添加媒体设备流 */
    addTrack(tracks: MediaStreamTrack[], stream: MediaStream) {
        for(const track of tracks) {
            this.connection.addTrack(track, stream)
        }
    }

    /**
     * 创建提供者
     * options
     *  iceRestart: boolean 冷重启
     *  offerToReceiveAudio 是否接收音频
     *  offerToReceiveVideo 是否接收视频
     */
    createOffer(options: RTCOfferOptions) {
        return this.connection.createOffer(options)
    }

    /**
     * 创建接收者
     */
    createAnswer(options?: RTCAnswerOptions) {
        return this.connection.createAnswer(options)
    }

    /**
     * 将offer设置为本地描述
     * description 
     *    type: 'offer' | 'answer' | 'pranswer' | 'rollback'
     */
    setLocalDescription(description?: RTCSessionDescriptionInit) {
        // 如果不传递description，则自动创建和设置适当的描述
        this.connection.setLocalDescription(description)
    }

    /**
     * 接收者接收到offer设置为远程描述（也就是另一端描述）
     */
    setRemoteDescription(description: RTCSessionDescriptionInit) {
        this.connection.setRemoteDescription(description)
    }

    /** 设置本地视频 */
    selfVideo(el: HTMLVideoElement) {
        if(el.srcObject) return

        el.srcObject = this.stream
    }

    /** 设置远程视频 */
    remoteVideo(el: HTMLVideoElement, stream: MediaStream) {
        if(el.srcObject) return

        el.srcObject = stream
    }

    /** 事件绑定 ontrack*/
    ontrack() {
        /**
         * 绑定track事件
         *    track是音视频轨道
         *    streams是音视频流
         *    streams[0]是第一个音视频流
         *    将音视频流绑定到video标签上
         */
        this.connection.ontrack = ({ track, streams }: RTCTrackEvent) => {
            track.onunmute = () => {
                this.remoteVideo(this.options.remoteEl, streams[0])
            }
        }
    }

    /* 事件绑定 onnegotiationneeded */
    onnegotiationneeded() {
        this.connection.onnegotiationneeded = async () => {
            try {
                this.makingOffer = true
                await this.setLocalDescription()

                // 给远端发送offer
                // Todo

            } catch(err) {
                console.log(err)
            } finally {
                this.makingOffer = false
            }
        }
    }
}