import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import FileUpload from './FileUpload';
const NetworkSubmission = ({ network, color, iconSrc, onFileSelect, selectedFile, submitSuccess, submitError }) => {
    // Define accepted file types for each network
    const getAcceptedTypes = () => {
        switch (network) {
            case 'AppLovin':
                return '.zip,.rar,.7z,.html,.htm';
            case 'Google':
                return '.zip,.rar,.html,.htm';
            case 'Unity':
                return '.zip,.rar,.7z,.html,.htm';
            default:
                return '.zip,.rar,.html,.htm';
        }
    };
    const handleFileSelect = (file) => {
        onFileSelect(network, file);
    };
    const getNetworkDescription = () => {
        switch (network) {
            case 'AppLovin':
                return 'Submit your creative assets for AppLovin advertising network';
            case 'Google':
                return 'Submit your creative assets for Google Ads and AdMob';
            case 'Unity':
                return 'Submit your creative assets for Unity Ads network';
            default:
                return 'Submit your creative assets';
        }
    };
    return (_jsxs("div", { className: "network-submission", style: { borderTopColor: color }, children: [_jsxs("div", { className: "network-header", children: [_jsx("div", { className: "network-icon", children: _jsx("img", { src: iconSrc, alt: `${network} logo`, className: "network-icon-img" }) }), _jsxs("div", { className: "network-info", children: [_jsx("h2", { children: network }), _jsx("p", { children: getNetworkDescription() })] })] }), _jsxs("div", { className: "submission-content", children: [_jsx(FileUpload, { network: network, onFileSelect: handleFileSelect, acceptedTypes: getAcceptedTypes(), maxSizeMB: 100, selectedFile: selectedFile }), submitSuccess && (_jsxs("div", { className: "success-message", children: ["\u2705 Successfully submitted to ", network, "!"] })), submitError && (_jsxs("div", { className: "error-message", children: ["\u274C ", submitError] }))] })] }));
};
export default NetworkSubmission;
