import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useTheme } from "./ThemeProvider";
import { ArrowLeft, Users, Plus, Trash2 } from "lucide-react";

let gradientBackground = {
    backgroundColor: "#e0eafc",
    backgroundImage: "linear-gradient(120deg, #e0eafc 0%, #cfdef3 50%, #a1c4fd 100%)",
}

export default function CreateTeam() {
    const theme = useTheme();
    const navigate = useNavigate();
    const auth = getAuth();
    const db = getFirestore();
    const [user, setUser] = useState(null);

    const [teamData, setTeamData] = useState({
        title: '',
        description: '',
        maxSize: '5',
        tags: '',
        members: [''],
        lead: '',
        phoneNumber: '',
        size: 1,
    });

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
            } else {
                navigate('/login');
            }
        });
        return () => unsubscribe();
    }, [auth, navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setTeamData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSelectChange = (value) => {
        setTeamData(prevData => ({
            ...prevData,
            maxSize: value
        }));
    };

    const handleMemberChange = (index, value) => {
        const updatedMembers = [...teamData.members];
        updatedMembers[index] = value;
        setTeamData(prevData => ({
            ...prevData,
            members: updatedMembers,
            size: updatedMembers.length
        }));
    };

    const addMemberInput = () => {
        setTeamData(prevData => ({
            ...prevData,
            members: [...prevData.members, ''],
            size: prevData.size + 1
        }));
    };

    const removeMemberInput = (index) => {
        const updatedMembers = teamData.members.filter((_, i) => i !== index);
        setTeamData(prevData => ({
            ...prevData,
            members: updatedMembers,
            size: updatedMembers.length
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await addDoc(collection(db, "teams"), {
                ...teamData,
                createdBy: user.uid,
                createdAt: new Date(),
                ownerEmail: user.email,
            });
            console.log('Team created:', teamData);
            navigate('/teams');
        } catch (error) {
            console.error("Error adding team to Firestore:", error);
        }
    };

    if (!user) return null;

    return (
        <div className="min-h-screen flex flex-col justify-center items-center relative" style={gradientBackground}>
            <div className="flex items-center justify-center mb-8 relative w-full max-w-lg">
                <Link to="/" className="absolute left-0">
                    <Button className="p-2 bg-black text-white hover:bg-black" style={{ width: "50px", height: "24px", borderRadius: "10px" }}>
                        <ArrowLeft className="h-6 w-6 arrow-move" />
                    </Button>
                </Link>
                <h1 className="text-3xl font-bold text-gray-800 ml-10">Create a New Team</h1>
            </div>

            <main className="w-full max-w-lg">
                <Card className="bg-white shadow-lg">
                    <CardHeader className="text-center py-4">
                        <CardTitle className="text-gray-800 text-2xl">Team Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="title" className="text-gray-800">Team Title</Label>
                                <Input
                                    id="title"
                                    name="title"
                                    value={teamData.title}
                                    onChange={handleInputChange}
                                    placeholder="Enter team title"
                                    className="bg-gray-100 text-gray-800"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description" className="text-gray-800">Team Description</Label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    value={teamData.description}
                                    onChange={handleInputChange}
                                    placeholder="Describe your team's goals"
                                    className="bg-gray-100 text-gray-800"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="lead" className="text-gray-800">Team Lead Name</Label>
                                <Input
                                    id="lead"
                                    name="lead"
                                    value={teamData.lead}
                                    onChange={handleInputChange}
                                    placeholder="Enter team lead name"
                                    className="bg-gray-100 text-gray-800"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phoneNumber" className="text-gray-800">Team Owner's Phone Number</Label>
                                <Input
                                    id="phoneNumber"
                                    name="phoneNumber"
                                    value={teamData.phoneNumber}
                                    onChange={handleInputChange}
                                    placeholder="Enter your phone number"
                                    className="bg-gray-100 text-gray-800"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="maxSize" className="text-gray-800">Maximum Team Size</Label>
                                <Select name="maxSize" value={teamData.maxSize} onValueChange={handleSelectChange}>
                                    <SelectTrigger className="bg-gray-100 text-gray-800">
                                        <SelectValue placeholder="Select maximum team size" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-gray-100 text-gray-800">
                                        {[2, 3, 4, 5, 6, 7, 8, 9, 10].map(size => (
                                            <SelectItem key={size} value={size.toString()}>{size}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="tags" className="text-gray-800">Tags (comma-separated)</Label>
                                <Input
                                    id="tags"
                                    name="tags"
                                    value={teamData.tags}
                                    onChange={handleInputChange}
                                    placeholder="e.g., technology, design, marketing"
                                    className="bg-gray-100 text-gray-800"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="members" className="text-gray-800">Team Members</Label>
                                {teamData.members.map((member, index) => (
                                    <div key={index} className="flex items-center space-x-2">
                                        <Input
                                            value={member}
                                            onChange={(e) => handleMemberChange(index, e.target.value)}
                                            placeholder={`Enter team member ${index + 1} name`}
                                            className="bg-gray-100 text-gray-800 flex-1"
                                        />
                                        <Button type="button" onClick={() => removeMemberInput(index)} className="bg-red-500 text-white hover:bg-red-600 p-2 rounded">
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ))}
                                <Button type="button" onClick={addMemberInput} className="mt-2 bg-gray-100 text-blue-600 hover:text-blue-700 flex items-center">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Member
                                </Button>
                            </div>

                            <Button type="submit" className="w-full bg-blue-500 text-white hover:bg-blue-600 flex items-center justify-center">
                                <Users className="w-4 h-4 mr-2" />
                                Create Team
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
