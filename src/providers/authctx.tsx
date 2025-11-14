// providers/authctx.tsx
import React, {
	createContext,
	useContext,
	useEffect,
	useState,
	ReactNode,
} from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { signInWithEmail, signUpWithEmail, signOutUser } from "../api/authApi";

type AuthContextType = {
	user: any;
	isLoading: boolean;
	signIn: (email: string, password: string) => Promise<void>;
	signUp: (email: string, password: string) => Promise<void>;
	signOut: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | undefined>(
	undefined
);

type Props = {
	children: ReactNode;
};

export const AuthProvider = ({ children }: Props) => {
	const [user, setUser] = useState<any>(null);
	const [isLoading, setIsLoading] = useState(true);

	// Lytt til auth-status (som i Yuan sin kode med onAuthStateChanged)
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
			await signInWithEmail(email, password);
			// onAuthStateChanged vil oppdatere user
		} finally {
			setIsLoading(false);
		}
	};

	const handleSignUp = async (email: string, password: string) => {
		setIsLoading(true);
		try {
			await signUpWithEmail(email, password);
		} finally {
			setIsLoading(false);
		}
	};

	const handleSignOut = async () => {
		setIsLoading(true);
		try {
			await signOutUser();
		} finally {
			setIsLoading(false);
		}
	};

	const value: AuthContextType = {
		user,
		isLoading,
		signIn: handleSignIn,
		signUp: handleSignUp,
		signOut: handleSignOut,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Lite hjelpe-hook (Yuan pleier å gjøre dette)
export const useAuthSession = () => {
	const ctx = useContext(AuthContext);
	if (!ctx) {
		throw new Error("useAuthSession must be used within AuthProvider");
	}
	return ctx;
};
