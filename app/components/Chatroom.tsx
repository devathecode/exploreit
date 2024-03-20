import { useEffect, useState } from "react";
import "firebase/firestore";
import { formatRelative } from "date-fns";
import { addDoc, collection, getDocs, serverTimestamp } from "firebase/firestore";
import firebase from "firebase/compat/app";

interface MessageModel {
    text: string,
    createdAt: any,
    uid: string,
    displayName: string,
    photoURL: string,
}

export default function Chatroom(props: any) {
    const db = props.db;
    const dataCollection = collection(db, 'messages');
    const { uid, displayName, photoURL } = props.user;

    let imagesListRef: any;

    // initial states
    const [messages, setMessages] = useState<MessageModel[]>([
        {
            text: '',
            createdAt: '',
            uid: "",
            displayName: '',
            photoURL: "",
        }
    ]);
    const [newMessage, setNewMessage] = useState("");

    const getData = async () => {
        try {
            // Perform GET operation (e.g., fetch data)
            const data: any[] = [];
            const querySnapshot = await getDocs(dataCollection);
            querySnapshot.forEach((doc: any) => {
                data.push({ id: doc.id, ...doc.data() } as any);
            });
            return data;
        } catch (error) {
            throw new Error("Internal server error");
        }
        // querySnapshot.forEach((doc) => {
        //     data.push({ id: doc.id, ...doc.data() } as Data);
        // });
    }

    // automatically check db for new messages
    useEffect(() => {
        console.log('datacollection', dataCollection)
        getData().then((res) => {
            console.log('temp(dataCollection);', res)
            setMessages(res);
        })
    });

    const addData = async (data: any) => {
        try {
            // Perform POST operation (e.g., create a new document)
            const newDocRef = await addDoc(dataCollection, data);
            return { id: newDocRef.id, ...data };
        } catch (error) {
            throw new Error("Internal server error");
        }
    }

    // when form is submitted
    const handleSubmit = (e: any) => {
        e.preventDefault();
        const msgData = {
            text: newMessage,
            createdAt: serverTimestamp(),
            uid,
            displayName,
            photoURL,
        }
        addData(msgData);
        // setMessages((prev) => {
        //     return [
        //         ...prev,
        //         msgData
        //     ]
        // })
        // setNewMessage("");
    };

    const getTime = (secs: any) => {
        return new Date(secs * 1000);
    }

    return (
        <>
            <main className="border-t border-gray-50 px-2 pb-40">
                <ul>
                    {messages.map((message) => (
                        <li key={message.text} className={message.uid === uid ? "flex flex-row-reverse mr-[5%]" : "received"}>
                            <section className="inline-block">
                                {/* display user image */}
                                {message.photoURL ? (
                                    <img
                                        src={message.photoURL}
                                        alt="Avatar"
                                        className="h-20 w-20 mt-[5%] rounded-full"
                                        width={45}
                                        height={45}
                                    />
                                ) : null}
                            </section>

                            <section className="inline-block">
                                {/* display message text */}
                                <p>{message.text}</p>
                                {message.createdAt?.seconds && <span className="text-sm text-red-200">{getTime(message.createdAt.seconds).toString().split('GMT')[0]}</span>}
                            </section>
                        </li>
                    ))}
                </ul>

                {/* input form */}
                <form onSubmit={handleSubmit} className="fixed left-0 bottom-0 w-full bg-gray-400">
                    <div className="grid grid-cols-12 gap-2 px-2">
                        <div className="col-span-9 my-auto">
                            <input type="text"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                         focus:ring-blue-500 focus:border-blue-500 w-full p-2.5 dark:bg-gray-700
                          dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500
                           dark:focus:border-blue-500" value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Type your message here..." />
                        </div>
                        <div className="col-span-3">
                            <button type="submit" className="h-10 my-2 w-full bg-black/30 cursor-pointer rounded-md" disabled={!newMessage}>
                                Send
                            </button>
                        </div>
                    </div>
                </form>
            </main>
        </>
    );
}