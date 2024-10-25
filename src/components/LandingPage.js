import { Button } from "./ui/button"; // Assuming ShadCN's Button component
import { useTheme } from "./ThemeProvider"; // If you have a theme provider for dynamic styling
import { Link } from "react-router-dom";

let gradientBackground = {
  backgroundColor: "#2120b1",
  backgroundImage: "linear-gradient(0deg, #2120b1 0%, #020305 49%, #2120b1 100%)",
};

let gradientText = {
  backgroundImage: "linear-gradient(90deg, #ea4b8b, #7c4dff)",
  backgroundClip: "text",
  color: "transparent",
};

export default function LandingPage() {
  const theme = useTheme();

  return (
    <div className="min-h-screen flex flex-col justify-between" style={gradientBackground}>
      <header className="py-4">
        <nav className="container mx-auto px-4 flex justify-center space-x-8 text-white">
          <Link to={'/'} className="hover:underline">Home</Link>
          <Link to={'/about'} className="hover:underline">About</Link>
          <Link to={'/'} className="hover:underline">Work</Link>
          <Link to={'/teams'} className="hover:underline">search/teams</Link>
          <Link to={'/login'} className="hover:underline">Login</Link>
        </nav>
      </header>

      <main className="flex-grow flex flex-col justify-center items-center text-center px-4">
        <h1 className="text-5xl font-bold" style={gradientText}>HackoHelper</h1>
        <p className="text-white mt-4">The ultimate platform to evaluate your hackathon ideas</p>

        <div className="mt-8 space-y-4">
          <Link to={'/idea-verification'} >
            <Button className="w-48 m-4 bg-blue-600 text-white hover:bg-blue-700">
              Submit Idea
            </Button>
          </Link>
          <Link to={'/create-team'}><Button className="w-48 bg-transparent text-white border-2 border-white hover:bg-white hover:text-black">
            Create Team
          </Button>
          </Link>
        </div>
      </main>

      <footer className="py-4 flex justify-center items-center">
        <div className="flex items-center space-x-1">
          <a href="#work" className="text-white hover:underline">Work</a>
        </div>
      </footer>
    </div>
  );
}
