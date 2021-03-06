import {h, render} from "preact";
import {DownloadPanelBase} from "./downloadPanelBase";
import {Constants} from "../../../../shared/constants";
import FileDescription = Constants.FileDescription;

export class DownloadPanelRenderer {
    private downloadPanelBase

    constructor(filesList: FileDescription[]) {
        const initialProgress = Array(filesList.length).fill(0)

        render(
            <DownloadPanelBase
                onDownloadClickedCallback={() => {}}
                progress={initialProgress}
                filesList={filesList}
                ref={f => this.downloadPanelBase = f}
            />, document.getElementById("download-panel")
        )
    }

    public setOnDownloadClickedCallback(callback: (progress: number[]) => void) {
        this.downloadPanelBase.props.onDownloadClickedCallback = callback;
    }

    public updateProgress(progress: number[]) {
        this.downloadPanelBase.setProgress(progress)
    }
}
