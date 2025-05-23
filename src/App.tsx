// @ts-nocheck

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
import { Button } from "./components/ui/button";
import { useState, useEffect } from "react";
import { useToast } from "./components/ui/use-toast";
import { Thankyou } from "./pages/Thankyou";
import { Enquiries } from "./pages/tables/Enquiries";

function App() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallButton, setShowInstallButton] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/service-worker.js")
          .then((registration) => {
            console.log(
              "Service Worker registered with scope:",
              registration.scope
            );
          })
          .catch((error) => {
            console.error("Service Worker registration failed:", error);
          });
      });
    }

    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallButton(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  const isIOS = () => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    return /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
  };

  const isDesktop = () => !/iPad|iPhone|iPod|Android/.test(navigator.userAgent);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          console.log("User accepted the A2HS prompt");
        } else {
          console.log("User dismissed the A2HS prompt");
        }
        setDeferredPrompt(null);
        setShowInstallButton(false);
      });
    } else if (isIOS) {
      // Show instructions only for iOS users
      toast({
        title: "Add to Home Screen",
        description: (
          <div>
            <p>
              To install this app, tap the Share icon in Safari, then select
              "Add to Home Screen."
            </p>
          </div>
        ),
      });
    }
  };

  // Show the install button in a toast notification
  useEffect(() => {
    if (showInstallButton && !isDesktop()) {
      toast({
        title: "Download Admin-App on your device",
        description: (
          <Button
            className="bg-accent dark:text-black"
            onClick={handleInstallClick}
            size={"sm"}
            variant={"outline"}
          >
            Install App
          </Button>
        ),
      });
    }
  }, [showInstallButton, toast]);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/gym/:gymId" element={<Layout children={<Gym />} />} />
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
                  <Route path="importForm" element={<BulkForm />} />
                  <Route path="thankyou" element={<Thankyou />} />
                </Routes>
              </GymNameProvider>
            }
          />

          <Route
            path="/gym/:gymId/batches/:id"
            element={<Layout children={<Batches />} />}
          />
          <Route
            path="/gym/:gymId/enquiries"
            element={<Layout children={<Enquiries />} />}
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
