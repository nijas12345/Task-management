import type React from "react";
import { Link,  } from "react-router-dom";

const Home = (): React.JSX.Element => {
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-6">
      {/* Header Section */}
      <h1 className="text-4xl font-bold text-blue-700 mb-4">
        Welcome to Project Manager
      </h1>

      {/* Description */}
      <p className="text-gray-600 text-center max-w-xl mb-8">
        Streamline your workflow and collaborate effectively.  
        Sign in to access your personalized dashboard — whether you’re managing projects 
        or completing assigned tasks.
      </p>

      {/* Role Selection Buttons */}
      <div className="flex gap-6">
        <Link
  to="/login?role=manager"
  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-center"
>
  Sign in as Project Manager
</Link>

<Link
  to="/login?role=member"
  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-center"
>
  Sign in as Team Member
</Link>

      </div>
    </div>
  );
};

export default Home;
