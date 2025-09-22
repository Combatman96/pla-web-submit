import React from 'react';
import FileUpload from './FileUpload';

interface NetworkSubmissionProps {
  network: 'AppLovin' | 'Google' | 'Unity';
  color: string;
  iconSrc: string;
  onFileSelect: (network: string, file: File | null) => void;
  submitSuccess: boolean;
  submitError?: string; // Made optional
}

const NetworkSubmission: React.FC<NetworkSubmissionProps> = ({ 
  network, 
  color, 
  iconSrc, 
  onFileSelect,
  submitSuccess,
  submitError
}) => {
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

  const handleFileSelect = (file: File | null) => {
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

  return (
    <div className="network-submission" style={{ borderTopColor: color }}>
      <div className="network-header">
        <div className="network-icon">
          <img src={iconSrc} alt={`${network} logo`} className="network-icon-img" />
        </div>
        <div className="network-info">
          <h2>{network}</h2>
          <p>{getNetworkDescription()}</p>
        </div>
      </div>

      <div className="submission-content">
        <FileUpload
          network={network}
          onFileSelect={handleFileSelect}
          acceptedTypes={getAcceptedTypes()}
          maxSizeMB={100}
        />

        {submitSuccess && (
          <div className="success-message">
            ✅ Successfully submitted to {network}!
          </div>
        )}

        {submitError && (
          <div className="error-message">
            ❌ {submitError}
          </div>
        )}
      </div>
    </div>
  );
};

export default NetworkSubmission;