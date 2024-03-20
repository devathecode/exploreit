import { useEffect, useState } from "react";
import "firebase/firestore";
import { formatRelative } from "date-fns";
import { addDoc, collection, getDocs } from "firebase/firestore";
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
    }, [db]);

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
        addData({
            text: newMessage,
            createdAt: '',
            uid,
            displayName,
            photoURL,
        })
        setNewMessage("");
    };

    return (
        <>
            <main className="border-t border-gray-50 px-2 py-10 h-screen">
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

                                {/* display user name */}
                                {message.displayName ? <span>{message.displayName}</span> : null}
                                <br />
                                {/* display message date and time */}
                                {message.createdAt?.seconds ? (
                                    <span>
                                        {formatRelative(
                                            new Date(message.createdAt.seconds * 1000),
                                            new Date()
                                        )}
                                    </span>
                                ) : null}
                            </section>
                        </li>
                    ))}
                </ul>

                {/* input form */}
                <form onSubmit={handleSubmit} className="fixed w-[90%] left-2 bottom-0">
                    <input
                        type="text"
                        className="w-[79%] h-10"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message here..."
                    />

                    <button type="submit" className="w-[19.5%] h-12" disabled={!newMessage}>
                        Send
                    </button>
                </form>
            </main>
        </>
    );
}