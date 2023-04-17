import { useEffect } from 'react'

let modelViewerInjected = false

const importScript = (src: string) => {
  if (document) {
    const script = document.createElement('script')
    script.async = true
    script.src = src
    script.type = 'module'
    document.body.appendChild(script)
  }
}

const useModelViewer = (enabled: boolean) => {
  useEffect(() => {
    if (enabled && !modelViewerInjected) {
      modelViewerInjected = true
      importScript(
        'https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js'
      )
    }
  }, [enabled])
}

export default useModelViewer
