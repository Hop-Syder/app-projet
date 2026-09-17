import { useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button, Card, ErrorState, Input, Label } from '../components/ui';

export function LoginPage() {
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/';

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      const user = await login({ email, password });
      const staffRoles = ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'PREPARATEUR', 'LIVREUR'];
      if (staffRoles.includes(user.role) && from === '/') {
        navigate('/admin');
      } else {
        navigate(from, { replace: true });
      }
    } catch {
      // error already surfaced via context
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-12">
      <h1 className="text-2xl font-bold text-text">Connexion</h1>
      <p className="mt-1 text-sm text-muted">Accédez à votre compte Bêtes &amp; Frais.</p>

      <Card className="mt-6 p-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && <ErrorState message={error} />}
          <div>
            <Label htmlFor="email">Adresse e-mail</Label>
            <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="vous@exemple.com" />
          </div>
          <div>
            <Label htmlFor="password">Mot de passe</Label>
            <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
          </div>
          <Button type="submit" disabled={loading} className="mt-2 w-full">
            {loading ? 'Connexion…' : 'Se connecter'}
          </Button>
        </form>
      </Card>

      <p className="mt-6 text-center text-sm text-muted">
        Pas encore de compte ?{' '}
        <Link to="/inscription" className="font-semibold text-primary">
          Créer un compte
        </Link>
      </p>
    </div>
  );
}
