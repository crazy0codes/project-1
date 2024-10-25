import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "./ui/card"
import { Label } from "./ui/label"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { ArrowLeft, Mail } from "lucide-react"
import { Link } from "react-router-dom"
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useContext } from "react";
import { FirebaseContext } from "../context/firebase"


let gradientBackground = {
    backgroundColor: "#e0eafc",
    backgroundImage: "linear-gradient(120deg, #e0eafc 0%, #cfdef3 50%, #a1c4fd 100%)",
}

export default function Login() {
    const app = useContext(FirebaseContext);
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();

    const signInWithGoogle = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            console.log("User Info:", user);
        } catch (error) {
            console.error("Error logging in with Google:", error);
        }
    };

    return (
        <div className="flex h-screen items-center justify-center" style={gradientBackground}>
            <Card className="mx-auto max-w-sm">
                <CardHeader className="space-y-1 relative">
                    {/* Back Button with text on top */}
                    <Link to="/" className="absolute left-0 -top-14">
                        <Button className="p-2 bg-black text-white hover:bg-black flex items-center space-x-2"
                            style={{ borderRadius: "10px", padding: "6px 12px" }}>
                            <ArrowLeft className="h-6 w-6" />
                            <span>Back</span>
                        </Button>
                    </Link>
                    <CardTitle className="text-2xl font-bold">Login</CardTitle>
                    <CardDescription>Use your Google email account to login</CardDescription>
                </CardHeader>
                <CardContent>
                    {/* <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" placeholder="m@example.com" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" type="password" required />
                        </div>
                    </div> */}
                    <Button type="submit" className="w-full" onClick={signInWithGoogle}>
                    <Mail /> <p style={{display : "inline-block"}}>Google Login</p>
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}
