import React, {useContext, useEffect, useRef, useState} from 'react';
import { Toast } from 'primereact/toast';
import { FileUpload } from 'primereact/fileupload';
import { ProgressBar } from 'primereact/progressbar';
import { Button } from 'primereact/button';
import { Tooltip } from 'primereact/tooltip';
import { Tag } from 'primereact/tag';
import axios from "axios";
import {FileContext} from "@/components/multipartform/formproduct/MultiProductForm";

const MuliProductFile = ()=>{
    const toast = useRef(null);
    const [totalSize, setTotalSize] = useState(0);
    const fileUploadRef = useRef(null);
    const [filesInfo,setFilesInfo,disableFile , setDisableFile] = useContext(FileContext);
    const onTemplateSelect = (e) => {
        let _totalSize = totalSize;
        let files = e.files;
        Object.keys(files).forEach((key) => {
            _totalSize += files[key].size || 0;
        });
        setTotalSize(_totalSize);
    };

    const onTemplateRemove = (file, callback) => {
        setTotalSize(totalSize - file.size);
        callback();
    };

    const onTemplateClear = () => {
        setTotalSize(0);
    };

    const headerTemplate = (options) => {
        const { className, chooseButton, uploadButton, cancelButton } = options;
        const value = totalSize / 800;
        const formatedValue = fileUploadRef && fileUploadRef.current ? fileUploadRef.current.formatSize(totalSize) : '0 B';

        return (
            <div className={className} style={{ backgroundColor: 'transparent', display: 'flex', alignItems: 'center' }}>
                {chooseButton}
                {uploadButton}
                {cancelButton}
                <div className="flex align-items-center gap-3 ml-auto">
                    <span className={``}>{formatedValue} / 800 KB</span>
                    <ProgressBar value={value} showValue={false} style={{ width: '10rem', height: '12px' }}></ProgressBar>
                </div>
            </div>
        );
    };

    const itemTemplate = (file, props) => {
        return (
            <div className="flex align-items-center flex-wrap">
                <div className="flex align-items-center" style={{ width: '40%' }}>
                    <img alt={file.name} role="presentation" src={file.objectURL} width={100} />
                    <span className="flex flex-column text-left ml-3">
                        {file.name}
                        <small>{new Date().toLocaleDateString()}</small>
                    </span>
                </div>
                <Tag value={props.formatSize} severity="warning" className="px-3 py-2" />
                <Button type="button" icon="pi pi-times" className="p-button-outlined p-button-rounded p-button-danger ml-auto" onClick={() => onTemplateRemove(file, props.onRemove)} />
            </div>
        );
    };

    const emptyTemplate = () => {
        return (
            <div className="flex align-items-center flex-column">
                <i className="pi pi-image mt-3 p-5" style={{ fontSize: '5em', borderRadius: '50%', backgroundColor: 'var(--surface-b)', color: 'var(--surface-d)' }}></i>
                <span style={{ fontSize: '1.2em', color: 'var(--text-color-secondary)' }} className="my-5">
                    Drag and Drop Image Here
                </span>
            </div>
        );
    };
    const chooseOptions = { icon: 'pi pi-fw pi-images', iconOnly: true, className: 'custom-choose-btn p-button-rounded p-button-outlined' };
    const uploadOptions = { icon: 'pi pi-fw pi-cloud-upload', iconOnly: true, className: 'custom-upload-btn p-button-success p-button-rounded p-button-outlined' };
    const cancelOptions = { icon: 'pi pi-fw pi-times', iconOnly: true, className: 'custom-cancel-btn p-button-danger p-button-rounded p-button-outlined' };
    let files = [];
    function getAll(){
        setFilesInfo(files)
        setDisableFile(!disableFile)
    }

    return(
            disableFile ?
               (
                <React.Fragment>
                    <h1 className={`bg-white text-black font font-vazir`}>آپلود فایل با موفقیت انجام شد.</h1>
                </React.Fragment>
            ): (
                    <React.Fragment>
                        <Toast ref={toast}></Toast>
                        <Tooltip target=".custom-choose-btn" content="Choose" position="bottom" />
                        <Tooltip target=".custom-upload-btn" content="Upload" position="bottom" />
                        <Tooltip target=".custom-cancel-btn" content="Clear" position="bottom" />
                        <FileUpload ref={fileUploadRef}
                                    multiple
                                    className={disableFile?"hidden":"block"}
                                    onClear={onTemplateClear}
                                    cancelOptions={cancelOptions}
                                    uploadOptions={uploadOptions}
                                    chooseOptions={chooseOptions}
                                    onBeforeUpload={()=>{
                                        const uploadedFiles = fileUploadRef.current.getFiles();
                                        uploadedFiles.forEach((file) => {
                                            files.push(file);
                                        });
                                        getAll();
                                    }}
                                    headerTemplate={headerTemplate}
                        />
                    </React.Fragment>
                )
    )
}
export default MuliProductFile