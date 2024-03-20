"use client";
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { auth, db } from "../firebase/config";
import Chatroom from "../components/Chatroom";

const initialState = {
    displayName: '',
    email: '',
    photoURL: ''
}

export default function Chat() {
    // const loaderState = useContext(LoaderContext);
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [userData, setUserData] = useState<any>();
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (result) => {
            if (result) {
                const { displayName, email, photoURL } = result;
                if (displayName && email && photoURL) {
                    setUserData(result)
                }
                setIsLoggedIn(true)
            } else {
                setIsLoggedIn(false);
            }
        })
        return () => unsubscribe();
    }, [])

    const signInWithGoogle = () => {
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider)
            .then((result) => {
                const { displayName, email, photoURL } = result.user;
                if (displayName && email && photoURL) {
                    // sessionStorage.setItem('loggedIn', 'true');
                    setUserData(result.user)
                }
                setIsLoggedIn(true)
            }).catch((error) => {
                setIsLoggedIn(false)
                const credential = GoogleAuthProvider.credentialFromError(error);
            });
    }

    const Logout = () => {
        signOut(auth).then(() => {
            setUserData(initialState)
            setIsLoggedIn(false);
            router.push('/');
        }).catch((error) => {
            // An error happened.
        });
    }


    return (
        <div className="container">
            {<main>
                {isLoggedIn ? (
                    <>
                        <nav id="sign_out">
                            <h2>Chat With Friends</h2>
                            <button onClick={Logout} className="bg-[red] cursor-pointer p-[1%] rounded-[10px] border-0 hover:border hover:bg-transparent hover:text-[white]
                             hover:border-solid hover:border-[red];">Sign Out</button>
                        </nav>
                        <Chatroom user={userData} db={db} />
                    </>
                ) : (
                    <section id="sign_in">
                        <h1>Welcome to Chat Room</h1>
                        <button onClick={signInWithGoogle}
                        >Sign In With Google</button>
                    </section>
                )}
            </main>}
        </div>
    );
}