import React, { useState } from 'react';
import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth';
import auth from './firebase.init';

const FirebaseTest = () => {
  const [testResult, setTestResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testGoogleAuth = async () => {
    setLoading(true);
    setTestResult('');
    
    try {
      console.log('Testing Firebase configuration...');
      console.log('Auth object:', auth);
      
      const provider = new GoogleAuthProvider();
      provider.addScope('email');
      provider.addScope('profile');
      
      console.log('Google provider created:', provider);
      
      const result = await signInWithPopup(auth, provider);
      console.log('Google sign-in test successful:', result);
      
      setTestResult(`✅ Google Authentication Test Successful!
User: ${result.user.email}
Display Name: ${result.user.displayName}
UID: ${result.user.uid}`);
      
    } catch (error) {
      console.error('Google sign-in test failed:', error);
      setTestResult(`❌ Google Authentication Test Failed!
Error Code: ${error.code}
Error Message: ${error.message}
Full Error: ${JSON.stringify(error, null, 2)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Firebase Google Auth Test</h2>
      
      <button
        onClick={testGoogleAuth}
        disabled={loading}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 mb-4"
      >
        {loading ? 'Testing...' : 'Test Google Authentication'}
      </button>
      
      {testResult && (
        <div className="mt-4 p-4 bg-gray-100 rounded-lg">
          <h3 className="font-semibold mb-2">Test Result:</h3>
          <pre className="text-sm whitespace-pre-wrap">{testResult}</pre>
        </div>
      )}
      
      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold mb-2">Firebase Config Check:</h3>
        <p className="text-sm">
          Auth Domain: {auth.config?.authDomain || 'Not found'}<br/>
          Project ID: {auth.config?.projectId || 'Not found'}<br/>
          API Key: {auth.config?.apiKey ? '✅ Set' : '❌ Missing'}
        </p>
      </div>
    </div>
  );
};

export default FirebaseTest; 