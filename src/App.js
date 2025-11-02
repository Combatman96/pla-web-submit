import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useMemo, useState } from 'react';
import NetworkSubmission from './components/NetworkSubmission';
import './App.css';
import applovinIcon from './assets/img/applovin_icon.png';
import googleIcon from './assets/img/google-icon.png';
import unityIcon from './assets/img/unity_icon.png';
import members from './assets/json/members_data.json';
import projects from './assets/json/projects_data.json';
// Enhance the modal styling
function ErrorModal({ message, onClose }) {
    return (_jsx("div", { className: "modal-overlay", style: {
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
        }, children: _jsxs("div", { className: "modal", style: {
                backgroundColor: '#fff',
                padding: '20px',
                borderRadius: '8px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                maxWidth: '400px',
                textAlign: 'center'
            }, children: [_jsx("p", { style: {
                        fontSize: '16px',
                        color: '#333',
                        marginBottom: '20px'
                    }, children: message }), _jsx("button", { onClick: onClose, className: "modal-close-btn", style: {
                        backgroundColor: '#007BFF',
                        color: '#fff',
                        border: 'none',
                        padding: '10px 20px',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }, children: "Close" })] }) }));
}
// Add SuccessModal component
function SuccessModal({ message, onClose }) {
    return (_jsx("div", { className: "modal-overlay", style: {
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
        }, children: _jsxs("div", { className: "modal", style: {
                backgroundColor: '#fff',
                padding: '20px',
                borderRadius: '8px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                maxWidth: '400px',
                textAlign: 'center'
            }, children: [_jsx("p", { style: {
                        fontSize: '16px',
                        color: '#333',
                        marginBottom: '20px'
                    }, children: message }), _jsx("button", { onClick: onClose, className: "modal-close-btn", style: {
                        backgroundColor: '#007BFF',
                        color: '#fff',
                        border: 'none',
                        padding: '10px 20px',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }, children: "Close" })] }) }));
}
function App() {
    const [selectedFiles, setSelectedFiles] = useState({
        AppLovin: null,
        Google: null,
        Unity: null
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState([]);
    const [submitError, setSubmitError] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    // Global metadata fields
    const [projectName, setProjectName] = useState('');
    const [plaName, setPlaName] = useState('');
    const [assigneeEmail, setAssigneeEmail] = useState('');
    const [difficulty, setDifficulty] = useState('');
    // Build dropdown options from JSON
    const memberOptions = useMemo(() => members.map(m => ({ label: `${m.name} (${m.email})`, value: m.email })), []);
    const projectOptions = useMemo(() => projects.map(p => ({ label: p.name, value: p.name })), []);
    const handleFileSelect = (network, file) => {
        setSelectedFiles(prev => ({
            ...prev,
            [network]: file
        }));
        setSubmitError('');
        if (file === null) {
            setSubmitSuccess(prev => prev.filter(n => n !== network));
        }
    };
    // Ensure the error message is set correctly
    const handleError = (errorMessage) => {
        setSubmitError(errorMessage);
        setShowErrorModal(true);
    };
    const validateForm = () => {
        if (!projectName.trim()) {
            handleError('Project Name is required.');
            return false;
        }
        if (!plaName.trim()) {
            handleError('PLA Name is required.');
            return false;
        }
        if (!assigneeEmail.trim()) {
            handleError('Assignee Email is required.');
            return false;
        }
        if (difficulty === '' || difficulty < 0) {
            handleError('Difficulty must be a non-negative number.');
            return false;
        }
        return true;
    };
    const handleSubmitAll = async () => {
        if (!validateForm()) {
            return;
        }
        const filesToSubmit = Object.entries(selectedFiles).filter(([_, file]) => file !== null);
        if (filesToSubmit.length === 0) {
            handleError('Please select at least one file to submit');
            return;
        }
        setIsSubmitting(true);
        setSubmitError('');
        setSubmitSuccess([]);
        try {
            const formData = new FormData();
            filesToSubmit.forEach(([network, file]) => {
                if (file) {
                    formData.append(`${network}_file`, file);
                }
            });
            formData.append('projectName', projectName || '');
            formData.append('plaName', plaName || '');
            formData.append('assigneeEmail', assigneeEmail || '');
            formData.append('difficulty', difficulty === '' ? '' : String(difficulty));
            /// load from .env
            const url = import.meta.env.VITE_API_BASE_URL + 'playable-ads-submit';
            // const url = "http://localhost:3888/api/playable-ads-submit";
            const response = await fetch(url, {
                method: 'POST',
                body: formData,
            });
            if (response.ok) {
                setSubmitSuccess(Object.keys(selectedFiles));
                setSelectedFiles({
                    AppLovin: null,
                    Google: null,
                    Unity: null,
                });
                setProjectName('');
                setPlaName('');
                setAssigneeEmail('');
                setDifficulty('');
                setShowSuccessModal(true);
            }
            else {
                handleError('Failed to submit files. Please try again.');
            }
        }
        catch (error) {
            handleError('An error occurred. Please try again later.');
        }
        finally {
            setIsSubmitting(false);
        }
    };
    const hasSelectedFiles = Object.values(selectedFiles).some(file => file !== null);
    return (_jsxs("div", { className: "app", children: [_jsxs("header", { className: "app-header", children: [_jsx("h1", { children: "PLA Web Submit" }), _jsx("p", { children: "Submit your creative assets to advertising networks" })] }), _jsxs("main", { className: "app-main", children: [_jsxs("section", { className: "global-form-section", children: [_jsx("h2", { className: "global-form-title", children: "Submission Details" }), _jsxs("div", { className: "form-row", children: [_jsxs("div", { className: "form-field", children: [_jsx("label", { htmlFor: "projectName", children: "Project Name" }), _jsxs("select", { id: "projectName", className: "dropdown", value: projectName, onChange: (e) => setProjectName(e.target.value), children: [_jsx("option", { value: "", id: "projectName-option", className: "dropdown-option", children: "Select a project" }), projectOptions.map(opt => (_jsx("option", { value: opt.value, className: "dropdown-option", children: opt.label }, opt.value)))] })] }), _jsxs("div", { className: "form-field", children: [_jsx("label", { htmlFor: "plaName", children: "PLA Name" }), _jsx("input", { id: "plaName", type: "text", className: "text-input", placeholder: "Enter PLA name", value: plaName, onChange: (e) => setPlaName(e.target.value) })] })] }), _jsxs("div", { className: "form-row", children: [_jsxs("div", { className: "form-field", children: [_jsx("label", { htmlFor: "assigneeEmail", children: "Assignee (Email)" }), _jsxs("select", { id: "assigneeEmail", className: "dropdown", value: assigneeEmail, onChange: (e) => setAssigneeEmail(e.target.value), children: [_jsx("option", { value: "", id: "assigneeEmail-option", className: "dropdown-option", children: "Select a member" }), memberOptions.map(opt => (_jsx("option", { value: opt.value, className: "dropdown-option", children: opt.label }, opt.value)))] })] }), _jsxs("div", { className: "form-field", children: [_jsx("label", { htmlFor: "difficulty", children: "Difficulty" }), _jsx("input", { id: "difficulty", type: "number", min: 0, step: 1, className: "text-input", placeholder: "0", value: difficulty, onChange: (e) => {
                                                    const val = e.target.value;
                                                    setDifficulty(val === '' ? '' : Number(val));
                                                } })] })] })] }), _jsxs("div", { className: "networks-container", children: [_jsx(NetworkSubmission, { network: "AppLovin", color: "#00C853", iconSrc: applovinIcon, selectedFile: selectedFiles.AppLovin, onFileSelect: handleFileSelect, submitSuccess: submitSuccess.includes('AppLovin') }), _jsx(NetworkSubmission, { network: "Google", color: "#4285F4", iconSrc: googleIcon, selectedFile: selectedFiles.Google, onFileSelect: handleFileSelect, submitSuccess: submitSuccess.includes('Google') }), _jsx(NetworkSubmission, { network: "Unity", color: "#000000", iconSrc: unityIcon, selectedFile: selectedFiles.Unity, onFileSelect: handleFileSelect, submitSuccess: submitSuccess.includes('Unity') })] }), _jsxs("div", { className: "global-submit-section", children: [_jsx("button", { type: "button", onClick: handleSubmitAll, disabled: !hasSelectedFiles || isSubmitting, className: "global-submit-btn", children: isSubmitting ? (_jsxs(_Fragment, { children: [_jsx("span", { className: "loading-spinner" }), "Submitting..."] })) : ('Submit All Files') }), submitSuccess.length > 0 && (_jsxs("div", { className: "global-success-message", children: ["\u2705 Successfully submitted to: ", submitSuccess.join(', ')] }))] })] }), _jsx("footer", { className: "app-footer", children: _jsx("p", { children: "\u00A9 2025 PLA Web Submit. All rights reserved." }) }), showErrorModal && (_jsx(ErrorModal, { message: submitError, onClose: () => setShowErrorModal(false) })), showSuccessModal && (_jsx(SuccessModal, { message: "All files submitted successfully!", onClose: () => setShowSuccessModal(false) }))] }));
}
export default App;
