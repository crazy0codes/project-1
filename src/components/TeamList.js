import { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "./ui/pagination";
import { Users } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import { sendEmail } from "../utils/email";
import { getFirestore, collection, getDocs, doc, updateDoc, arrayUnion } from "firebase/firestore";

const formatTimestamp = (timestamp) => {
  if (!timestamp || !timestamp.seconds) return "N/A";
  const date = new Date(timestamp.seconds * 1000);
  return date.toLocaleDateString();
};

export default function TeamList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const teamsPerPage = 4;
  const { currentUser } = useContext(AuthContext);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeams = async () => {
      const db = getFirestore();
      const teamsCollection = collection(db, "teams");
      const teamDocs = await getDocs(teamsCollection);
      const teamsData = teamDocs.docs.map(doc => {
        const team = doc.data();
        return {
          id: doc.id,
          ...team,
          isFull: team.size >= team.maxSize,
          hasRequested: team.pendingRequests?.includes(currentUser?.uid) || false
        };
      });
      setTeams(teamsData);
      setLoading(false);
    };

    fetchTeams();
  }, [currentUser]);

  const filteredTeams = teams.filter(team =>
    team.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastTeam = currentPage * teamsPerPage;
  const indexOfFirstTeam = indexOfLastTeam - teamsPerPage;
  const currentTeams = filteredTeams.slice(indexOfFirstTeam, indexOfLastTeam);
  const totalPages = Math.ceil(filteredTeams.length / teamsPerPage);

  const handleJoinTeam = async (teamId) => {
    if (!currentUser) {
      alert("You need to log in to join a team.");
      return;
    }

    const teamToJoin = teams.find(team => team.id === teamId);

    if (teamToJoin.isFull) {
      alert("This team is already full.");
      return;
    }

    if (teamToJoin.hasRequested) {
      alert("You have already sent a join request for this team.");
      return;
    }

    // Immediately add the applicant if there's space in the team
    const newSize = teamToJoin.size + 1;
    const newTeamData = {
      ...teamToJoin,
      size: newSize,
      requestStatus: "You have been added to the team!",
      hasRequested: true
    };

    setTeams(prevTeams =>
      prevTeams.map(team => (team.id === teamId ? newTeamData : team))
    );

    try {
      await updateTeamInFirestore(teamId, newSize, currentUser.uid);

      // Send email notification to the team owner
      await sendEmail(
        teamToJoin.ownerEmail,
        "New Team Member Added",
        `${currentUser.displayName} has joined your team, ${teamToJoin.title}.`
      );
    } catch (error) {
      console.error("Error updating team size or sending email:", error);
      setTeams(prevTeams =>
        prevTeams.map(team =>
          team.id === teamId ? { ...team, requestStatus: "An error occurred. Please try again.", hasRequested: false } : team
        )
      );
    }
  };

  const updateTeamInFirestore = async (teamId, newSize, userId) => {
    const db = getFirestore();
    const teamRef = doc(db, "teams", teamId);
    await updateDoc(teamRef, {
      size: newSize,
      members: arrayUnion(userId) // Add the new member to the team
    });
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading teams...</div>;
  }

  return (
    <div className="min-h-screen bg-blue-50">
      <header className="bg-black text-white py-4 mb-8">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold">Team Explorer</h1>
        </div>
      </header>
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-black-800 mb-4">Explore Teams</h2>
        <p className="text-black-600 mb-8">
          Discover your ideal team! Browse through publicly listed teams, find the perfect match, and join forces with like-minded members. Your next fit awaits!
        </p>
        <div className="flex mb-8">
          <Input
            type="text"
            placeholder="Search teams..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mr-2"
          />
          <Button className="bg-blue-500 hover:bg-blue-700">Search...</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {currentTeams.map((team) => (
            <Card key={team.id} className="bg-white hover:shadow-lg transition-shadow">
              <Link to={`/teams/${team.id}/details`}>
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src={team.avatar} alt={team.title} />
                      <AvatarFallback>{team.avatar}</AvatarFallback>
                    </Avatar>
                    <CardTitle className="text-black-800">{team.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-black-600">{team.description}</p>
                  <p className="text-sm text-black-400 mt-2">{formatTimestamp(team.createdAt)}</p>
                  {/* Show team owner's mobile number if the user has joined */}
                  {team.hasRequested && team.members.includes(currentUser.uid) && (
                    <p className="mt-2 text-green-600">
                      <a href={`https://wa.me/${team.ownerPhone}`} target="_blank" rel="noopener noreferrer">
                        Contact Team Leader: {team.ownerPhone}
                      </a>
                    </p>
                  )}
                </CardContent>
              </Link>
              <CardFooter className="flex justify-between items-center">
                <div className="flex items-center text-black-600">
                  <Users className="h-4 w-4 mr-2" />
                  <span className="text-sm">{team.size}/{team.maxSize}</span>
                </div>
                <Button
                  onClick={() => handleJoinTeam(team.id)}
                  disabled={team.isFull || team.hasRequested}
                  className={`bg-blue-500 hover:bg-blue-400 disabled:bg-blue-300 ${team.isFull || team.hasRequested ? "cursor-not-allowed" : ""}`}
                >
                  {team.isFull ? "Team Full" : team.hasRequested ? "Applied" : "Join Team"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="bg-blue-100 text-black-600 hover:bg-blue-200"
              />
            </PaginationItem>
            {[...Array(totalPages)].map((_, index) => (
              <PaginationItem key={index}>
                <PaginationLink
                  onClick={() => setCurrentPage(index + 1)}
                  isActive={currentPage === index + 1}
                  className={currentPage === index + 1 ? "bg-blue-500 text-white" : "bg-blue-100 text-black-600 hover:bg-blue-200"}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="bg-blue-100 text-black-600 hover:bg-blue-200"
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
