import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  Login,
  NotFound,
  RoomRequest,
  ClubProfile as ClubProfile2,
} from "./pages";
import {
  ClubProfile,
  SharedLayout as ClubLayout,
  RoomAllocationForm,
  RoomRequestsTable,
} from "./pages/ClubDashboard";
import {
  EventCalendar,
  Home,
  OurTeam,
  SharedLayout,
  StudentClubs,
} from "./pages/Landing";
import {
  SharedLayout as AdminLayout,
  HandleAccounts,
} from "./pages/AdminDashboard";
import { SharedLayout as SCLayout } from "./pages/CouncilDashboard";
import { SharedLayout as SecurityLayout } from "./pages/SecurityDashboard";
import { SharedLayout as CommonLayout } from "./pages/FacultyDashboard";
import { SharedLayout as SWOLayout } from "./pages/SWODashboard";
import { ProtectedRoute, SharedProtection } from "./components";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/room-request/:reqid"
          element={
            <SharedProtection>
              <RoomRequest />
            </SharedProtection>
          }
        />
        <Route path="/club-profile/:clubId" element={<ClubProfile2 />} />
        <Route path="/" element={<SharedLayout />}>
          <Route index element={<Home />} />
          <Route path="/our-team" element={<OurTeam />} />
          <Route path="/student-clubs" element={<StudentClubs />} />
          <Route path="/event-calendar" element={<EventCalendar />} />
        </Route>
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<HandleAccounts />} />
          <Route path="status" element={<RoomRequestsTable />} />
        </Route>
        <Route
          path="/fa"
          element={
            <ProtectedRoute role="fa">
              <CommonLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<RoomRequestsTable />} />
        </Route>
        <Route
          path="/swo"
          element={
            <ProtectedRoute role="swo">
              <SWOLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<RoomRequestsTable />} />
        </Route>
        <Route
          path="/sc"
          element={
            <ProtectedRoute role="sc">
              <SCLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<RoomRequestsTable />} />
        </Route>
        <Route
          path="/security"
          element={
            <ProtectedRoute role="security">
              <SecurityLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<RoomRequestsTable />} />
        </Route>
        <Route
          path="/club"
          element={
            <ProtectedRoute role="club">
              <ClubLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<ClubProfile />} />
          <Route path="room-request" element={<RoomAllocationForm />} />
          <Route path="status" element={<RoomRequestsTable />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
