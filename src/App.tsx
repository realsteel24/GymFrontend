import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { Gym } from "./pages/tables/Gym";
import { Programs } from "./pages/tables/Programs";
import { Layout } from "./components/Layout";
import { Batches } from "./pages/tables/Batches";
import { GymProfile } from "./pages/GymProfile";
import { SignIn } from "./components/forms/SignIn";
import { FeeCategories } from "./pages/tables/FeeCategories";
import { Members } from "./pages/tables/Members";
import { MemberFees } from "./pages/tables/MemberFees";
import { GymNameProvider } from "./context/Gym";
import { TransactionHistory } from "./pages/tables/TransactionHistory";
import { BulkForm } from "./pages/BulkForm";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/gym" element={<Layout children={<Gym />} />} />
          <Route
            path="/gym/:gymId/*"
            element={
              <GymNameProvider>
                <Routes>
                  <Route
                    path="menu"
                    element={
                      <Layout children={<GymProfile component="Dashboard" />} />
                    }
                  />
                  <Route
                    path="programs"
                    element={<Layout children={<Programs />} />}
                  />
                  <Route
                    path="dashboard"
                    element={
                      <Layout children={<GymProfile component="Dashboard" />} />
                    }
                  />
                  <Route
                    path="importForm"
                    element={
                      <Layout children={<BulkForm />} />
                    }
                  />
                </Routes>
              </GymNameProvider>
            }
          />

          <Route
            path="/gym/:gymId/batches/:id"
            element={<Layout children={<Batches />} />}
          />
          <Route
            path="/gym/:gymId/feeCategories"
            element={<Layout children={<FeeCategories />} />}
          />
          <Route
            path="/gym/:gymId/members/:id"
            element={<Layout children={<Members />} />}
          />
          <Route
            path="/gym/:gymId/memberFees/:memberId"
            element={<Layout children={<MemberFees />} />}
          />
          <Route
            path="/gym/:gymId/transactionHistory/:memberId"
            element={<Layout children={<TransactionHistory />} />}
          />
          <Route path="/" element={<SignIn />} />
          <Route path="/payment" element={<Batches />} />
          <Route path="/test" element={<SignIn />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
