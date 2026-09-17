import { useQuery, useMutation } from '@tanstack/react-query';
import { authService } from '../services/auth.service';
import type { LoginDto, RegisterDto } from '../types';

export function useLogin() {
  return useMutation({
    mutationFn: (credentials: LoginDto) => authService.login(credentials),
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: (data: RegisterDto) => authService.register(data),
  });
}

export function useProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: () => authService.getProfile(),
    enabled: authService.isAuthenticated(),
  });
}
