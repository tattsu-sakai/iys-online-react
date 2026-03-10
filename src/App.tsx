import { Routes, Route } from "react-router-dom";

import InitialSetupFlow from "@/features/InitialSetupFlow";

export default function App() {
  return (
    <Routes>
      <Route path="*" element={<InitialSetupFlow />} />
    </Routes>
  );
}
