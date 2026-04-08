import apisos, { setApiAuthToken } from '@/services/apisos';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React, { createContext, ReactNode, useCallback, useEffect, useState } from 'react';

type SignInProps = { email: string; password: string };
const STORAGE_USER_KEY = '@AppSaaS:user';
const STORAGE_TOKEN_KEY = '@AppSaaS:token';

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
    await AsyncStorage.setItem(STORAGE_USER_KEY, JSON.stringify(data));
  }

  async function storeToken(token: string) {
    await AsyncStorage.setItem(STORAGE_TOKEN_KEY, token);
  }

  useEffect(() => {
    async function loadStorage() {
      const [storageUser, storageToken] = await Promise.all([
        AsyncStorage.getItem(STORAGE_USER_KEY),
        AsyncStorage.getItem(STORAGE_TOKEN_KEY),
      ]);

      if (storageUser) {
        setUser(JSON.parse(storageUser));
      }

      setApiAuthToken(storageToken);
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

      const { result, success, access_token } = response.data;
      if (!success) {
        setLoginError('Falha no login. Verifique suas credenciais.');
        return;
      }
      if (!access_token) {
        setLoginError('Token de acesso não retornado pela API.');
        return;
      }

      const userData: UserProps = {
        id: result.id,
        name: result.name, // Ajustado de 'nome' para 'name'
        tenant_id: result.tenant_id
      };

      await Promise.all([storeUser(userData), storeToken(access_token)]);
      setApiAuthToken(access_token);
      setUser(userData);
      router.replace('/home'); // Navega para a home após o login

    } catch (err) {
      setLoginError('E-mail e/ou senha inválidos.');
    } finally {
      setLoading(false);
    }
  }, []);

  async function signOut() {
    try {
      await apisos.post('logoutuser');
    } catch {
      // Ignora erro de logout no servidor para não bloquear saída local
    }

    await Promise.all([
      AsyncStorage.removeItem(STORAGE_USER_KEY),
      AsyncStorage.removeItem(STORAGE_TOKEN_KEY),
    ]);
    setApiAuthToken(null);
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
