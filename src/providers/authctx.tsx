import React, {
	createContext,
	useContext,
	useEffect,
	useState,
	ReactNode,
} from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import * as authApi from "../api/authApi";

// Denne koden er basert på kode fra Lecture12-query-profilePage-likes i TDS200

type AuthContextType = {
	user: User | null;
	isLoading: boolean;
	userNameSession: string | null; // 👈 nytt, i Yuan-stil
	signIn: (email: string, password: string) => Promise<void>;
	signUp: (email: string, password: string, username: string) => Promise<void>;
	signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type Props = {
	children: ReactNode;
};

export const AuthProvider = ({ children }: Props) => {
	const [user, setUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	// Lytter til Firebase-auth endringer
	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
			setUser(firebaseUser ?? null);
			setIsLoading(false);
		});

		return unsubscribe;
	}, []);

	const handleSignIn = async (email: string, password: string) => {
		setIsLoading(true);
		try {
			await authApi.signIn(email, password);
		} finally {
			setIsLoading(false);
		}
	};

	const handleSignUp = async (
		email: string,
		password: string,
		username: string
	) => {
		setIsLoading(true);
		try {
			await authApi.signUp(email, password, username);
		} finally {
			setIsLoading(false);
		}
	};

	const handleSignOut = async () => {
		setIsLoading(true);
		try {
			await authApi.signOut();
		} finally {
			setIsLoading(false);
		}
	};

	const userNameSession = user?.displayName ?? user?.email ?? null;

	const value: AuthContextType = {
		user,
		isLoading,
		userNameSession,
		signIn: handleSignIn,
		signUp: handleSignUp,
		signOut: handleSignOut,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthSession = () => {
	const ctx = useContext(AuthContext);
	if (!ctx) {
		throw new Error("useAuthSession must be used within AuthProvider");
	}
	return ctx;
};
