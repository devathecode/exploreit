import { useEffect, useState } from "react";
import "firebase/firestore";
import { formatRelative } from "date-fns";
import { addDoc, collection, getDocs, serverTimestamp } from "firebase/firestore";
import firebase from "firebase/compat/app";

interface MessageModel {
    id: string;
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

    const [sending, setSending] = useState(false);

    let imagesListRef: any;

    // initial states
    const [messages, setMessages] = useState<MessageModel[]>([
        {
            id: '',
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
        setSending(true)
        const msgData = {
            text: newMessage,
            createdAt: serverTimestamp(),
            uid,
            displayName,
            photoURL,
        }
        addData(msgData).then(() => setSending(false));
        setNewMessage("");
    };

    const getTime = (secs: any) => {
        return new Date(secs * 1000);
    }

    return (
        <>
            {messages && <main className="border-t border-gray-50 py-40 relative h-screen bg-gray-100">
                <div className="absolute right-0 top-0 w-full bg-white">
                    {messages[0] ? (
                        <div className="flex flex-row p-2">
                            <img
                                src={messages[0].photoURL}
                                alt="Avatar"
                                className="h-12 w-12 rounded-full"
                                width={45}
                                height={45}
                            />
                            <div className="my-auto">
                                <p className="text-gray-600 ms-2">{messages[0].displayName}</p>
                            </div>
                        </div>
                    ) : null}
                </div>
                <ul className="">
                    {messages.sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds).reverse().map((message) => (
                        <li key={message.id} className={`group flex mt-5 ${message.uid === uid ? "flex-row-reverse" : "flex-row"}`}>
                            <img
                                src={message.photoURL}
                                alt="Avatar"
                                className="h-8 w-8 mt-20 rounded-full"
                                width={45}
                                height={45}
                            />

                            <div className="bg-gray-600 w-72 md:w-96 mx-2 rounded-xl text-white">
                                <section className="p-3">
                                    {/* display message text */}
                                    <p className="">{message.text}</p>
                                    {message.createdAt?.seconds && <span className="text-sm hidden group-hover:block text-red-200">{getTime(message.createdAt.seconds).toString().split('GMT')[0]}</span>}
                                </section>
                            </div>
                        </li>
                    ))}
                </ul>

                {/* input form */}
                <form onSubmit={handleSubmit} className="absolute right-0 bottom-0 w-full bg-white">
                    <div className="grid grid-cols-12">
                        <div className="col-span-9 my-auto">
                            <input type="text"
                                className="border-0 text-gray-900 text-sm rounded-lg
                         focus:ring-blue-500 focus:border-blue-500 w-full p-2.5" value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Write your message here..." />
                        </div>
                        <div className="col-span-3">
                            <button type="submit" className="h-full w-full bg-green-700 text-white cursor-pointer flex items-center justify-center" disabled={!newMessage}>
                                {/* Send */}
                                {sending ? <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-white" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                </svg> : 'Send'}
                            </button>
                        </div>
                    </div>
                </form>
            </main>}
        </>
    );
}