import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button, Card, ErrorState, Input, Label } from '../components/ui';

export function RegisterPage() {
  const { register, loading, error } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', password: '' });

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      await register(form);
      navigate('/');
    } catch {
      // error already surfaced via context
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-12">
      <h1 className="text-2xl font-bold text-text">Créer un compte</h1>
      <p className="mt-1 text-sm text-muted">Rejoignez Bêtes &amp; Frais pour commander en quelques clics.</p>

      <Card className="mt-6 p-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && <ErrorState message={error} />}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="firstName">Prénom</Label>
              <Input id="firstName" required value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="lastName">Nom</Label>
              <Input id="lastName" required value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
            </div>
          </div>
          <div>
            <Label htmlFor="email">Adresse e-mail</Label>
            <Input id="email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div>
            <Label htmlFor="phone">Téléphone</Label>
            <Input id="phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+229 ..." />
          </div>
          <div>
            <Label htmlFor="password">Mot de passe</Label>
            <Input
              id="password"
              type="password"
              required
              minLength={6}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>
          <Button type="submit" disabled={loading} className="mt-2 w-full">
            {loading ? 'Création…' : 'Créer mon compte'}
          </Button>
        </form>
      </Card>

      <p className="mt-6 text-center text-sm text-muted">
        Déjà inscrit ?{' '}
        <Link to="/connexion" className="font-semibold text-primary">
          Se connecter
        </Link>
      </p>
    </div>
  );
}
