/// <reference types="vite/client" />

// CSS module declarations
declare module '*.css'
declare module '*.svg' {
    const content: string
    export default content
}
