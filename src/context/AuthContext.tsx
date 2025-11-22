import apisos from '@/services/apisos';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React, { createContext, ReactNode, useCallback, useEffect, useState } from 'react';

type SignInProps = { email: string; password: string };

// Interface para definir a estrutura do objeto de usuário
interface UserProps {
  id: string;
  name: string;
  tenant_id: string;
}

// Interface para definir o que o contexto irá prover
interface AuthContextData {
  user: UserProps | null;
  loading: boolean;
  loginError: string;
  signIn: ({ email, password }: SignInProps) => Promise<void>;
  signOut: () => Promise<void>;
}

// Criando o contexto com um valor inicial vazio, mas tipado
export const AuthContext = createContext({} as AuthContextData);

// Componente Provedor
function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProps | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string>("");

  // Armazena usuário no storage
  async function storeUser(data: UserProps) {
    await AsyncStorage.setItem('@AppSaaS:user', JSON.stringify(data));
  }

  useEffect(() => {
    async function loadStorage() {
      const storageUser = await AsyncStorage.getItem('@AppSaaS:user');
      if (storageUser) {
        setUser(JSON.parse(storageUser));
      }
    }
    loadStorage();
  }, []);

  const signIn = useCallback(async ({ email, password }: SignInProps) => {
    setLoading(true);
    setLoginError(""); // Limpa erro anterior

    try {
      const response = await apisos.post('loginuser', {
        "email": email,
        "password": password
      });

      const { result, success } = response.data;
      if (!success) {
        setLoginError('Falha no login. Verifique suas credenciais.');
        return;
      }

      const userData: UserProps = {
        id: result.id,
        name: result.name, // Ajustado de 'nome' para 'name'
        tenant_id: result.tenant_id
      };

      await storeUser(userData);
      setUser(userData);
      router.replace('/home'); // Navega para a home após o login

    } catch (err) {
      setLoginError('E-mail e/ou senha inválidos.');
    } finally {
      setLoading(false);
    }
  }, []);

  async function signOut() {
    await AsyncStorage.removeItem('@AppSaaS:user');
    setUser(null);
    router.replace('/'); // Volta para a tela de login
  }

  return (
    <AuthContext.Provider value={{ user, loading, loginError, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;