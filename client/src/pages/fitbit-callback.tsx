import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

export default function FitbitCallback() {
  const [, setLocation] = useLocation();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [message, setMessage] = useState('Processing Fitbit authorization...');

  useEffect(() => {
    handleFitbitCallback();
  }, []);

  const handleFitbitCallback = async () => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const state = urlParams.get('state');
      const error = urlParams.get('error');

      if (error) {
        setStatus('error');
        setMessage(`Authorization failed: ${error}`);
        return;
      }

      if (!code || !state) {
        setStatus('error');
        setMessage('Missing authorization code or state parameter');
        return;
      }

      // Verify state parameter
      const storedState = localStorage.getItem('fitbit_oauth_state');
      if (state !== storedState) {
        setStatus('error');
        setMessage('Invalid state parameter - possible security issue');
        return;
      }

      // Exchange code for access token
      const tokenResponse = await fetch('/api/fitbit/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
          redirectUri: window.location.origin + '/fitbit-callback'
        })
      });

      if (!tokenResponse.ok) {
        const errorData = await tokenResponse.json();
        throw new Error(errorData.error || 'Failed to exchange authorization code');
      }

      const tokenData = await tokenResponse.json();
      
      // Store tokens securely
      localStorage.setItem('fitbit_access_token', tokenData.access_token);
      localStorage.setItem('fitbit_refresh_token', tokenData.refresh_token);
      localStorage.setItem('fitbit_user_id', tokenData.user_id);
      
      // Clean up OAuth state
      localStorage.removeItem('fitbit_oauth_state');

      setStatus('success');
      setMessage('Successfully connected to Fitbit! Redirecting...');

      // Redirect back to sleep tab after 2 seconds
      setTimeout(() => {
        setLocation('/?tab=sleep');
      }, 2000);

    } catch (error) {
      console.error('Fitbit callback error:', error);
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Unknown error occurred');
    }
  };

  const handleRetry = () => {
    setLocation('/?tab=sleep');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gray-900 border-gray-700">
        <CardHeader className="text-center">
          <CardTitle className="text-white flex items-center justify-center gap-2">
            {status === 'processing' && <Loader2 className="h-5 w-5 animate-spin text-blue-400" />}
            {status === 'success' && <CheckCircle className="h-5 w-5 text-green-400" />}
            {status === 'error' && <XCircle className="h-5 w-5 text-red-400" />}
            Fitbit Authorization
          </CardTitle>
          <CardDescription className="text-gray-400">
            Connecting your Fitbit account to DreamSpeak
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert className={`${
            status === 'success' ? 'bg-green-900/20 border-green-500/50' :
            status === 'error' ? 'bg-red-900/20 border-red-500/50' :
            'bg-blue-900/20 border-blue-500/50'
          }`}>
            <AlertDescription className={`${
              status === 'success' ? 'text-green-300' :
              status === 'error' ? 'text-red-300' :
              'text-blue-300'
            }`}>
              {message}
            </AlertDescription>
          </Alert>

          {status === 'error' && (
            <Button 
              onClick={handleRetry}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Return to Sleep Tab
            </Button>
          )}

          {status === 'processing' && (
            <div className="text-center text-gray-400 text-sm">
              Please wait while we process your authorization...
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}