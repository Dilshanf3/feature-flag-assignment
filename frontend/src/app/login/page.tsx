'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/lib/auth';
import { Eye, EyeOff, Car } from 'lucide-react';
import { Button, Input, Card, Container } from '@/components/ui';
import { strings } from '@/lib/strings';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!email || !password) {
      setError(strings.fillAllFields);
      setLoading(false);
      return;
    }

    try {
      await authService.login(email, password);
      const user = authService.getStoredUser();
      
      if (user?.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/reports');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjAzIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40"></div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary-600/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary-600/20 rounded-full blur-3xl"></div>
        <div className="relative z-10 flex flex-col justify-center px-16 text-white max-w-xl">
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
                <Car className="w-10 h-10" />
              </div>
              <div>
                <h2 className="text-3xl font-bold tracking-tight">{strings.carReports}</h2>
                <p className="text-neutral-300 text-sm mt-1">{strings.professionalAssessmentSystem}</p>
              </div>
            </div>
            <p className="text-lg text-neutral-200 leading-relaxed">
              {strings.streamlineReporting}
            </p>
          </div>
          <div className="space-y-6">
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center bg-white px-4 sm:px-6 lg:px-8 py-12">
        <Container maxWidth="sm">
          <div className="mb-12">
            <div className="lg:hidden flex items-center gap-3 mb-10">
              <div className="p-3 bg-neutral-900 rounded-2xl">
                <Car className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-neutral-900">{strings.carReports}</h1>
                <p className="text-neutral-500 text-sm">{strings.professionalAssessmentSystem}</p>
              </div>
            </div>
            <h2 className="text-4xl font-bold text-neutral-900 mb-3">{strings.welcomeBack}</h2>
            <p className="text-neutral-600 text-lg">{strings.signInToDashboard}</p>
          </div>

          <Card className="border border-neutral-200 shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-damage-critical/20 rounded-xl px-4 py-3.5 flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-damage-critical/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-damage-critical"></div>
                  </div>
                  <span className="text-damage-critical text-sm font-medium">{error}</span>
                </div>
              )}

              <Input
                label={strings.email}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={strings.emailPlaceholder}
                required
              />

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  {strings.password}
                </label>
                <div className="relative">
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type={showPassword ? 'text' : 'password'}
                    className="w-full border border-neutral-300 rounded-xl px-4 py-3 pr-11 text-neutral-900 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    placeholder={strings.passwordPlaceholder}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                isLoading={loading}
                className="w-full py-3.5 text-base font-semibold shadow-sm"
              >
                {loading ? strings.signingIn : strings.signIn}
              </Button>

              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-neutral-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-neutral-500 font-medium">{strings.quickAccess}</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-xl hover:border-neutral-300 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-xs font-bold text-neutral-700 tracking-wide">{strings.adminAccount}</div>
                    <div className="px-2 py-0.5 bg-primary-600 text-white text-xs font-semibold rounded">{strings.fullAccess}</div>
                  </div>
                  <div className="text-sm text-neutral-900 font-mono mb-1">admin@example.com</div>
                  <div className="text-sm text-neutral-600 font-mono">password</div>
                </div>
                <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-xl hover:border-neutral-300 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-xs font-bold text-neutral-700 tracking-wide">{strings.regularUserLabel}</div>
                    <div className="px-2 py-0.5 bg-neutral-400 text-white text-xs font-semibold rounded">{strings.standard}</div>
                  </div>
                  <div className="text-sm text-neutral-900 font-mono mb-1">user@example.com</div>
                  <div className="text-sm text-neutral-600 font-mono">password</div>
                </div>
              </div>
            </form>
          </Card>
        </Container>
      </div>
    </div>
  );
}
