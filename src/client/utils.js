
export const nextFrame = (cb) => {
    window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
            cb()
        })
    })
}
