import { Header } from "../../../components";

const Dashboard = () => {
  const user = {
    name: "John Doe",
    email: "johndoe1234@gmail.com"
  };

  return (
    <div>
      <main className="dashboard wrapper">
        <Header
          title={`Welcome ${user?.name ?? "Guest"} 👋`}
          description="Track activity, trends and popular destinations in real time."
        />
        Dashboard Page Contents goes here...
      </main>
    </div>
  );
};

export default Dashboard;
