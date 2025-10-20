import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Auth } from './components/Auth';
import { Onboarding } from './components/Onboarding';
import { Dashboard } from './components/Dashboard';

function AppContent() {
  const { user, profile, loading } = useAuth();

  console.log('AppContent render:', { user, profile, loading });

  if (loading) {
    console.log('Showing loading screen');
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0A1628] via-[#0D2847] to-[#1a3a5c] flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    console.log('No user, showing Auth');
    return <Auth />;
  }

  if (!profile?.income_range || profile.income_range === 'not_specified') {
    console.log('No profile, showing Onboarding');
    return <Onboarding />;
  }

  console.log('Showing Dashboard');
  return <Dashboard />;
}

function App() {
  console.log('App render');
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;