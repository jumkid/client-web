type Callback = (target:EventTarget) => void

export default interface UserSetting {
    title: string
    callback?: Callback
}
