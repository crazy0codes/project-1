import { useEffect, useState, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { AuthContext } from "../context/AuthContext";

const TeamDetails = () => {
  const { id } = useParams();
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    const fetchTeamDetails = async () => {
      const db = getFirestore();
      const teamRef = doc(db, "teams", id);
      const teamDoc = await getDoc(teamRef);

      if (teamDoc.exists()) {
        setTeam({ id: teamDoc.id, ...teamDoc.data() });
      } else {
        console.error("No such document!");
      }
      setLoading(false);
    };

    fetchTeamDetails();
  }, [id]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading team details...</div>;
  }

  if (!team) {
    return <div className="min-h-screen flex items-center justify-center">Team not found.</div>;
  }

  return (
    <div className="min-h-screen bg-blue-50">
      <header className="bg-black text-white py-4 mb-8">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold">Team Details</h1>
        </div>
      </header>
      <div className="container mx-auto px-4">
        <Card className="bg-white shadow-md">
          <CardHeader>
            <CardTitle className="text-black-800">{team.title}</CardTitle>
            <p className="text-sm text-black-500">Team Leader: {team.lead}</p>
          </CardHeader>
          <CardContent>
            <p className="text-black-600">{team.description}</p>
            <h3 className="text-lg font-semibold mt-4">Team Members:</h3>
            <ul className="list-disc pl-5 mt-2">
              {team.members.length > 0 ? (
                team.members.map((member) => (
                  <li key={typeof member === 'string' ? member : member.id} className="text-black-600">
                    {typeof member === 'string' ? member : member.name}
                  </li>
                ))
              ) : (
                <li className="text-black-600">No members in this team yet.</li>
              )}
            </ul>

          </CardContent>
          <CardFooter className="flex justify-end">
            <Link to={'/teams'}>
              <Button className="bg-blue-500 hover:bg-blue-700">Back to Teams</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default TeamDetails;
