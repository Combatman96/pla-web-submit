import { useMemo, useState } from 'react'
import NetworkSubmission from './components/NetworkSubmission'
import './App.css'
import applovinIcon from './assets/img/applovin_icon.png'
import googleIcon from './assets/img/google-icon.png'
import unityIcon from './assets/img/unity_icon.png'
import members from './assets/json/members_data.json'
import projects from './assets/json/projects_data.json'

type Member = { name: string; email: string }
type Project = { name: string }

interface NetworkFiles {
  AppLovin: File | null;
  Google: File | null;
  Unity: File | null;
}

// Enhance the modal styling
function ErrorModal({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <div className="modal-overlay" style={{
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
    }}>
      <div className="modal" style={{
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        maxWidth: '400px',
        textAlign: 'center'
      }}>
        <p style={{
          fontSize: '16px',
          color: '#333',
          marginBottom: '20px'
        }}>{message}</p>
        <button
          onClick={onClose}
          className="modal-close-btn"
          style={{
            backgroundColor: '#007BFF',
            color: '#fff',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
}

function App() {
  const [selectedFiles, setSelectedFiles] = useState<NetworkFiles>({
    AppLovin: null,
    Google: null,
    Unity: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<string[]>([]);
  const [submitError, setSubmitError] = useState<string>('');
  const [showErrorModal, setShowErrorModal] = useState(false);
  // Global metadata fields
  const [projectName, setProjectName] = useState<string>('');
  const [plaName, setPlaName] = useState<string>('');
  const [assigneeEmail, setAssigneeEmail] = useState<string>('');
  const [difficulty, setDifficulty] = useState<number | ''>('');

  // Build dropdown options from JSON
  const memberOptions = useMemo(() => (members as Member[]).map(m => ({ label: `${m.name} (${m.email})`, value: m.email })), [])
  const projectOptions = useMemo(() => (projects as Project[]).map(p => ({ label: p.name, value: p.name })), [])

  const handleFileSelect = (network: string, file: File | null) => {
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
  const handleError = (errorMessage: string) => {
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

      const response = await fetch('https://example.com/api/submit-all', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        alert('All files submitted successfully!');
        setSubmitSuccess(Object.keys(selectedFiles));
        setSelectedFiles({
          AppLovin: null,
          Google: null,
          Unity: null,
        });
      } else {
        handleError('Failed to submit files. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting files:', error);
      handleError('An error occurred. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasSelectedFiles = Object.values(selectedFiles).some(file => file !== null);
  return (
    <div className="app">
      <header className="app-header">
        <h1>PLA Web Submit</h1>
        <p>Submit your creative assets to advertising networks</p>
      </header>

      <main className="app-main">
        <section className="global-form-section">
          <h2 className="global-form-title">Submission Details</h2>
          <div className="form-row">
            <div className="form-field">
              <label htmlFor="projectName">Project Name</label>
              <select
                id="projectName"
                className="dropdown"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
              >
                <option value="" id="projectName-option" className="dropdown-option">
                  Select a project
                </option>
                {projectOptions.map(opt => (
                  <option key={opt.value} value={opt.value} className="dropdown-option">
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-field">
              <label htmlFor="plaName">PLA Name</label>
              <input
                id="plaName"
                type="text"
                className="text-input"
                placeholder="Enter PLA name"
                value={plaName}
                onChange={(e) => setPlaName(e.target.value)}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-field">
              <label htmlFor="assigneeEmail">Assignee (Email)</label>
              <select
                id="assigneeEmail"
                className="dropdown"
                value={assigneeEmail}
                onChange={(e) => setAssigneeEmail(e.target.value)}
              >
                <option value=""
                  id="assigneeEmail-option"
                  className="dropdown-option"
                >Select a member</option>
                {memberOptions.map(opt => (
                  <option key={ opt.value } value={ opt.value } className="dropdown-option">{opt.label}</option>
                ))}
              </select>
            </div>
            <div className="form-field">
              <label htmlFor="difficulty">Difficulty</label>
              <input
                id="difficulty"
                type="number"
                min={0}
                step={1}
                className="text-input"
                placeholder="0"
                value={difficulty}
                onChange={(e) => {
                  const val = e.target.value;
                  setDifficulty(val === '' ? '' : Number(val));
                }}
              />
            </div>
          </div>
        </section>
        <div className="networks-container">
          <NetworkSubmission
            network="AppLovin"
            color="#00C853"
            iconSrc={applovinIcon}
            selectedFile={selectedFiles.AppLovin}
            onFileSelect={handleFileSelect}
            submitSuccess={submitSuccess.includes('AppLovin')}
          />
          
          <NetworkSubmission
            network="Google"
            color="#4285F4"
            iconSrc={googleIcon}
            selectedFile={selectedFiles.Google}
            onFileSelect={handleFileSelect}
            submitSuccess={submitSuccess.includes('Google')}
          />
          
          <NetworkSubmission
            network="Unity"
            color="#000000"
            iconSrc={unityIcon}
            selectedFile={selectedFiles.Unity}
            onFileSelect={handleFileSelect}
            submitSuccess={submitSuccess.includes('Unity')}
          />
        </div>

        <div className="global-submit-section">
          <button
            type="button"
            onClick={handleSubmitAll}
            disabled={!hasSelectedFiles || isSubmitting}
            className="global-submit-btn"
          >
            {isSubmitting ? (
              <>
                <span className="loading-spinner"></span>
                Submitting...
              </>
            ) : (
              'Submit All Files'
            )}
          </button>
          
          {submitSuccess.length > 0 && (
            <div className="global-success-message">
              ✅ Successfully submitted to: {submitSuccess.join(', ')}
            </div>
          )}
        </div>
      </main>

      <footer className="app-footer">
        <p>&copy; 2025 PLA Web Submit. All rights reserved.</p>
      </footer>

      {showErrorModal && (
        <ErrorModal
          message={submitError}
          onClose={() => setShowErrorModal(false)}
        />
      )}
    </div>
  )
}

export default App
