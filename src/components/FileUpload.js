import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import React, { useState, useRef } from 'react';
const FileUpload = ({ network, onFileSelect, acceptedTypes, maxSizeMB = 50, selectedFile: propSelectedFile }) => {
    const [dragActive, setDragActive] = useState(false);
    const [localSelectedFile, setLocalSelectedFile] = useState(null);
    const [error, setError] = useState('');
    const fileInputRef = useRef(null);
    // Sync local state with parent-controlled selectedFile prop so clearing from parent
    // (e.g. on successful submit) resets the displayed file in this component.
    React.useEffect(() => {
        if (typeof propSelectedFile !== 'undefined') {
            setLocalSelectedFile(propSelectedFile ?? null);
            if (propSelectedFile === null) {
                setError('');
                if (fileInputRef.current)
                    fileInputRef.current.value = '';
            }
        }
    }, [propSelectedFile]);
    const validateFile = (file) => {
        setError('');
        // Check file size
        const maxSizeBytes = maxSizeMB * 1024 * 1024;
        if (file.size > maxSizeBytes) {
            setError(`File size must be less than ${maxSizeMB}MB`);
            return false;
        }
        // Check file type
        const allowedExtensions = acceptedTypes.split(',').map(type => type.trim().toLowerCase());
        const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
        const mimeType = file.type.toLowerCase();
        const isValidExtension = allowedExtensions.some(ext => fileExtension === ext || mimeType.includes(ext.replace('.', '')));
        if (!isValidExtension) {
            setError(`Only ${acceptedTypes} files are allowed`);
            return false;
        }
        return true;
    };
    const handleFileChange = (file) => {
        if (file && validateFile(file)) {
            setLocalSelectedFile(file);
            onFileSelect(file);
        }
        else {
            setLocalSelectedFile(null);
            onFileSelect(null);
        }
    };
    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        }
        else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };
    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileChange(e.dataTransfer.files[0]);
        }
    };
    const handleInputChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            handleFileChange(e.target.files[0]);
        }
    };
    const openFileSelector = () => {
        fileInputRef.current?.click();
    };
    const removeFile = () => {
        setLocalSelectedFile(null);
        setError('');
        onFileSelect(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };
    const formatFileSize = (bytes) => {
        if (bytes === 0)
            return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };
    return (_jsxs("div", { className: "file-upload-container", children: [_jsxs("h3", { className: "upload-title", children: [network, " File Upload"] }), _jsxs("div", { className: `upload-area ${dragActive ? 'drag-active' : ''} ${error ? 'error' : ''}`, onDragEnter: handleDrag, onDragLeave: handleDrag, onDragOver: handleDrag, onDrop: handleDrop, onClick: openFileSelector, children: [_jsx("input", { ref: fileInputRef, type: "file", accept: acceptedTypes, onChange: handleInputChange, style: { display: 'none' } }), localSelectedFile ? (_jsxs("div", { className: "file-selected", children: [_jsxs("div", { className: "file-info", children: [_jsx("span", { className: "file-name", children: localSelectedFile.name }), _jsx("span", { className: "file-size", children: formatFileSize(localSelectedFile.size) })] }), _jsx("button", { type: "button", className: "remove-file-btn", onClick: (e) => {
                                    e.stopPropagation();
                                    removeFile();
                                }, children: "\u2715" })] })) : (_jsxs("div", { className: "upload-prompt", children: [_jsx("div", { className: "upload-icon", children: "\uD83D\uDCC1" }), _jsx("p", { children: "Click to select or drag and drop your file here" }), _jsxs("p", { className: "file-types", children: ["Accepted: ", acceptedTypes] }), _jsxs("p", { className: "file-size-limit", children: ["Max size: ", maxSizeMB, "MB"] })] }))] }), error && _jsx("div", { className: "error-message", children: error })] }));
};
export default FileUpload;
