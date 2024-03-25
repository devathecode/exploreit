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
        <>
            <div className="grid grid-cols-12">
                {isLoggedIn && <>
                    <div className="col-span-12 md:col-span-3 h-24 md:h-screen bg-gray-700 relative">
                        <nav className="text-white text-center border-b flex justify-between border-gray-500 p-2">
                            <img
                                src={userData.photoURL}
                                alt="Avatar"
                                className="h-12 w-12 rounded-full"
                                width={45}
                                height={45}
                            />
                            <div className="group flex">
                                <div className="flex flex-col my-auto cursor-pointer h-4 w-4">
                                    <div className="h-1 w-1 bg-gray-200 rounded-full"></div>
                                    <div className="h-1 w-1 bg-gray-200 rounded-full my-0.5"></div>
                                    <div className="h-1 w-1 bg-gray-200 rounded-full"></div>
                                </div>
                                <div className="hidden group-hover:block opacity-0 group-hover:opacity-100 transition-all ease-out duration-700 absolute top-12 right-2 bg-gray-600 rounded-sm">
                                    <div className="h-10 w-24 p-2">
                                        <button onClick={Logout}>Logout</button>
                                    </div>
                                </div>
                            </div>

                        </nav>
                    </div>
                    <div className="col-span-12 md:col-span-9">
                        <Chatroom user={userData} db={db} />
                    </div>
                </>}
            </div>
            {!isLoggedIn && <div className="h-screen w-screen flex flex-col justify-center items-center my-auto">
                <div className="bg-gray-100 p-10">
                    <h1 className="text-center">Welcome to Chat Room</h1>
                    <div className="px-6 sm:px-0 max-w-sm mt-4" onClick={signInWithGoogle}>
                        <button type="button" className="text-white w-full  bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center justify-between mr-2 mb-2">
                            <svg className="mr-2 -ml-1 w-4 h-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path></svg>Sign up with Google<div></div></button>
                    </div>
                </div>
            </div>}
        </>
    );
}