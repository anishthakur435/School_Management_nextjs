"use client";
import React, { useState } from "react";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";

import SubjectIcon from "@mui/icons-material/Subject";
import AssignmentIcon from "@mui/icons-material/Assignment";
import GradingIcon from "@mui/icons-material/Grading";
import CoPresentIcon from "@mui/icons-material/CoPresent";
import AssignmentIndRoundedIcon from "@mui/icons-material/AssignmentIndRounded";
import SchoolIcon from "@mui/icons-material/School";

import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";

import EscalatorWarningIcon from "@mui/icons-material/EscalatorWarning";
import FamilyRestroomOutlinedIcon from "@mui/icons-material/FamilyRestroomOutlined";

import {
  AddBoxOutlined,
  AddBoxRounded,
  AppRegistrationOutlined,
  AssessmentSharp,
  CalendarMonthOutlined,
  ClassOutlined,
  Create,
  EventAvailable,
  EventAvailableOutlined,
  FactCheckOutlined,
  GroupsOutlined,
  LibraryBooksOutlined,
  LocalLibraryOutlined,
  Person3,
  PersonAddAlt1,
  RateReviewOutlined,
  RequestPageOutlined,
  RuleOutlined,
  Schedule,
  SpaceDashboardOutlined,
  SupervisorAccountOutlined,
  ViewListOutlined,
  WorkspacePremiumOutlined,
  PeopleAltOutlined,
  MenuBookOutlined,
  PaymentsOutlined,
  PostAddOutlined,
  TuneOutlined,
  AssignmentReturnedOutlined,
  QuizOutlined,
  EventNoteOutlined,
} from "@mui/icons-material";

export const Sidenav = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const [menuCollapse, setMenuCollapse] = useState(false);
  const [openSubMenu, setOpenSubMenu] = useState(null);
  const [openSubMenu2, setOpenSubMenu2] = useState(null);

  const handleSubMenuToggle = (menu) => {
    setOpenSubMenu((prev) => (prev === menu ? null : menu));
  };

  const handleSubMenu2Toggle = (menu) => {
    setOpenSubMenu2((prev) => (prev === menu ? null : menu));
  };

  if (status === "loading" || !session) return null;

  const role = session?.user?.role?.trim().toUpperCase();

  return (
    <div className="sticky top-0 h-screen flex flex-col backdrop-blur-xl border-r border-gray-200">
      <Sidebar
        collapsed={menuCollapse}
        backgroundColor="transparent"
        rootStyles={{ border: "none", height: "100%" }}
      >
        <Menu
          menuItemStyles={{
            button: ({ active }) => ({
              height: "64px",
              padding: "0 20px",
              color: active ? "#2563eb" : "#4b5563",
              backgroundColor: active ? "#eff6ff" : "transparent",
              borderRadius: "8px",
              margin: "4px 8px",
              "&:hover": {
                backgroundColor: active ? "#eff6ff" : "rgba(0,0,0,0.04)",
              },
            }),
          }}
        >
          {/* HEADER */}
          <MenuItem
            onClick={() => setMenuCollapse(!menuCollapse)}
            icon={<MenuRoundedIcon />}
          >
            {!menuCollapse && (
              <span className="font-extrabold text-sm tracking-wider text-gray-800">
                <SchoolIcon sx={{ fontSize: 18, mr: 1 }} />
                Delux School
              </span>
            )}
          </MenuItem>

          {/* DASHBOARD */}
          <MenuItem
            icon={<SpaceDashboardOutlined sx={{ fontSize: 20 }} />}
            active={pathname === "/dashboard"}
            onClick={() => router.push("/dashboard")}
          >
            Dashboard
          </MenuItem>

          {/* ADMIN */}
          {role === "ADMIN" && (
            <>
              <SubMenu
                open={openSubMenu === "user"}
                onOpenChange={() => handleSubMenuToggle("user")}
                label="User Management"
                icon={<PeopleAltOutlined sx={{ fontSize: 20 }} />}
              >
                <MenuItem
                  icon={<Person3 sx={{ fontSize: 20 }} />}
                  active={pathname === "/dashboard/users"}
                  onClick={() => router.push("/dashboard/users")}
                >
                  Users
                </MenuItem>

                <MenuItem
                  icon={<SchoolIcon sx={{ fontSize: 20 }} />}
                  active={pathname === "/dashboard/users/students"}
                  onClick={() => router.push("/dashboard/users/students")}
                >
                  Students
                </MenuItem>

                <MenuItem
                  icon={<CoPresentIcon sx={{ fontSize: 20 }} />}
                  active={pathname === "/dashboard/users/teachers"}
                  onClick={() => router.push("/dashboard/users/teachers")}
                >
                  Teachers
                </MenuItem>

                <MenuItem
                  icon={<FamilyRestroomOutlinedIcon sx={{ fontSize: 20 }} />}
                  active={pathname === "/dashboard/users/parents"}
                  onClick={() => router.push("/dashboard/users/parents")}
                >
                  Parents
                </MenuItem>

                <MenuItem
                  icon={<PersonAddAlt1 sx={{ fontSize: 20 }} />}
                  active={pathname === "/dashboard/admin/adduser"}
                  onClick={() => router.push("/dashboard/admin/adduser")}
                >
                  Add User
                </MenuItem>
              </SubMenu>

              {/* ACADEMICS */}
              <SubMenu
                open={openSubMenu === "management"}
                onOpenChange={() => handleSubMenuToggle("management")}
                label="Academics"
                icon={<LocalLibraryOutlined sx={{ fontSize: 20 }} />}
              >
                <MenuItem
                  icon={<PaymentsOutlined sx={{ fontSize: 18 }} />}
                  active={pathname === "/dashboard/admin/fees"}
                  onClick={() => router.push("/dashboard/admin/fees")}
                >
                  Fees
                </MenuItem>

                {/* Classes */}
                <SubMenu
                  open={openSubMenu2 === "class"}
                  onOpenChange={() => handleSubMenu2Toggle("class")}
                  label="Classes"
                  icon={<ClassOutlined sx={{ fontSize: 20 }} />}
                >
                  <MenuItem
                    icon={<ViewListOutlined sx={{ fontSize: 18 }} />}
                    active={pathname === "/dashboard/admin/allclasses"}
                    onClick={() => router.push("/dashboard/admin/allclasses")}
                  >
                    All Classes
                  </MenuItem>

                  <MenuItem
                    icon={<AddBoxOutlined sx={{ fontSize: 18 }} />}
                    active={pathname === "/dashboard/admin/addclass"}
                    onClick={() => router.push("/dashboard/admin/addclass")}
                  >
                    Add Class
                  </MenuItem>
                </SubMenu>

                {/* Subjects */}
                <SubMenu
                  open={openSubMenu2 === "subject"}
                  onOpenChange={() => handleSubMenu2Toggle("subject")}
                  label="Subjects"
                  icon={<SubjectIcon sx={{ fontSize: 20 }} />}
                >
                  <MenuItem
                    icon={<ViewListOutlined sx={{ fontSize: 18 }} />}
                    active={pathname === "/dashboard/admin/allsubject"}
                    onClick={() => router.push("/dashboard/admin/allsubject")}
                  >
                    Subject List
                  </MenuItem>

                  <MenuItem
                    icon={<PostAddOutlined sx={{ fontSize: 18 }} />}
                    active={pathname === "/dashboard/admin/addsubject"}
                    onClick={() => router.push("/dashboard/admin/addsubject")}
                  >
                    Add Subject
                  </MenuItem>
                </SubMenu>

                {/* Courses */}
                <SubMenu
                  open={openSubMenu2 === "course"}
                  onOpenChange={() => handleSubMenu2Toggle("course")}
                  label="Courses"
                  icon={<LibraryBooksOutlined sx={{ fontSize: 20 }} />}
                >
                  <MenuItem
                    icon={<AssignmentIcon sx={{ fontSize: 18 }} />}
                    active={pathname === "/dashboard/admin/assignedcourses"}
                    onClick={() =>
                      router.push("/dashboard/admin/assignedcourses")
                    }
                  >
                    All Courses
                  </MenuItem>

                  <MenuItem
                    icon={<TuneOutlined sx={{ fontSize: 18 }} />}
                    active={pathname === "/dashboard/admin/course"}
                    onClick={() => router.push("/dashboard/admin/course")}
                  >
                    Allocate Courses
                  </MenuItem>
                </SubMenu>

                {/* Enrollments */}
                <SubMenu
                  open={openSubMenu2 === "classassign"}
                  onOpenChange={() => handleSubMenu2Toggle("classassign")}
                  label="Enrollments"
                  icon={<AppRegistrationOutlined sx={{ fontSize: 20 }} />}
                >
                  <MenuItem
                    icon={<SupervisorAccountOutlined sx={{ fontSize: 18 }} />}
                    active={pathname === "/dashboard/admin/assignedclass"}
                    onClick={() =>
                      router.push("/dashboard/admin/assignedclass")
                    }
                  >
                    Class Rosters
                  </MenuItem>

                  <MenuItem
                    icon={<AssignmentIndRoundedIcon sx={{ fontSize: 18 }} />}
                    active={pathname === "/dashboard/admin/class"}
                    onClick={() => router.push("/dashboard/admin/class")}
                  >
                    Enroll Students
                  </MenuItem>
                </SubMenu>
              </SubMenu>

              {/* EXAMS */}
              <SubMenu
                open={openSubMenu === "exam"}
                onOpenChange={() => handleSubMenuToggle("exam")}
                label="Exam Record"
                icon={<QuizOutlined sx={{ fontSize: 20 }} />}
              >
                <MenuItem
                  icon={<EventNoteOutlined sx={{ fontSize: 20 }} />}
                  active={pathname === "/dashboard/exam"}
                  onClick={() => router.push("/dashboard/exam")}
                >
                  Exam Schedule
                </MenuItem>

                <MenuItem
                  icon={<Schedule sx={{ fontSize: 20 }} />}
                  active={pathname === "/dashboard/exam/schedule"}
                  onClick={() => router.push("/dashboard/exam/schedule")}
                >
                  Create Schedule
                </MenuItem>
              </SubMenu>
            </>
          )}

          {/* STUDENT */}
          {role === "STUDENT" && (
            <>
              <MenuItem
                icon={<CalendarMonthOutlined sx={{ fontSize: 20 }} />}
                active={pathname === "/dashboard/student/attendance"}
                onClick={() => router.push("/dashboard/student/attendance")}
              >
                Attendance Record
              </MenuItem>

              <MenuItem
                icon={<MenuBookOutlined sx={{ fontSize: 20 }} />}
                active={pathname === "/dashboard/student/allbooks"}
                onClick={() => router.push("/dashboard/student/allbooks")}
              >
                View Books
              </MenuItem>

              <MenuItem
                icon={<AssignmentReturnedOutlined sx={{ fontSize: 20 }} />}
                active={pathname === "/dashboard/student/allbooks/issued"}
                onClick={() =>
                  router.push("/dashboard/student/allbooks/issued")
                }
              >
                Issued Books
              </MenuItem>

              <MenuItem
                icon={<WorkspacePremiumOutlined sx={{ fontSize: 20 }} />}
                active={pathname === "/dashboard/student/reportcard"}
                onClick={() => router.push("/dashboard/student/reportcard")}
              >
                Academic Report
              </MenuItem>

              <MenuItem
                icon={<QuizOutlined sx={{ fontSize: 20 }} />}
                active={pathname === "/dashboard/student/exam"}
                onClick={() => router.push("/dashboard/student/exam")}
              >
                Exam Schedule
              </MenuItem>

              <MenuItem
                icon={<AssignmentIcon sx={{ fontSize: 20 }} />}
                active={pathname === "/dashboard/student/assignment"}
                onClick={() => router.push("/dashboard/student/assignment")}
              >
                My Assignments
              </MenuItem>
            </>
          )}

          {/* TEACHER */}
          {role === "TEACHER" && (
            <>
              <MenuItem
                icon={<GroupsOutlined sx={{ fontSize: 20 }} />}
                active={pathname === "/dashboard/teacher/mystudents"}
                onClick={() => router.push("/dashboard/teacher/mystudents")}
              >
                Class Roster
              </MenuItem>

              <SubMenu
                open={openSubMenu === "books"}
                onOpenChange={() => handleSubMenuToggle("books")}
                label="Books"
                icon={<MenuBookOutlined sx={{ fontSize: 20 }} />}
              >
                <MenuItem
                  icon={<MenuBookOutlined sx={{ fontSize: 18 }} />}
                  active={pathname === "/dashboard/teacher/allbooks"}
                  onClick={() => router.push("/dashboard/teacher/allbooks")}
                >
                  View Books
                </MenuItem>

                <MenuItem
                  icon={<AssignmentReturnedOutlined sx={{ fontSize: 18 }} />}
                  active={pathname === "/dashboard/teacher/allbooks/issued"}
                  onClick={() =>
                    router.push("/dashboard/teacher/allbooks/issued")
                  }
                >
                  Issued Books
                </MenuItem>
              </SubMenu>

              <SubMenu
                open={openSubMenu === "attendance"}
                onOpenChange={() => handleSubMenuToggle("attendance")}
                label="Attendance"
                icon={<FactCheckOutlined sx={{ fontSize: 20 }} />}
              >
                <MenuItem
                  icon={<CoPresentIcon sx={{ fontSize: 20 }} />}
                  active={pathname === "/dashboard/teacher/attendance"}
                  onClick={() => router.push("/dashboard/teacher/attendance")}
                >
                  View Records
                </MenuItem>

                <MenuItem
                  icon={<EventAvailableOutlined sx={{ fontSize: 20 }} />}
                  active={pathname === "/dashboard/teacher/attendance/add"}
                  onClick={() =>
                    router.push("/dashboard/teacher/attendance/add")
                  }
                >
                  Mark Attendance
                </MenuItem>
              </SubMenu>

              <SubMenu
                open={openSubMenu === "grading"}
                onOpenChange={() => handleSubMenuToggle("grading")}
                label="Grading"
                icon={<RuleOutlined sx={{ fontSize: 20 }} />}
              >
                <MenuItem
                  icon={<GradingIcon sx={{ fontSize: 20 }} />}
                  active={pathname === "/dashboard/teacher/grading"}
                  onClick={() => router.push("/dashboard/teacher/grading")}
                >
                  View Grades
                </MenuItem>

                <MenuItem
                  icon={<RateReviewOutlined sx={{ fontSize: 20 }} />}
                  active={pathname === "/dashboard/teacher/grading/remarks"}
                  onClick={() =>
                    router.push("/dashboard/teacher/grading/remarks")
                  }
                >
                  Add Record
                </MenuItem>
              </SubMenu>

              <SubMenu
                open={openSubMenu === "assignment"}
                onOpenChange={() => handleSubMenuToggle("assignment")}
                label="Assignment"
                icon={<AssessmentSharp sx={{ fontSize: 20 }} />}
              >
                <MenuItem
                  icon={<AssignmentIcon sx={{ fontSize: 20 }} />}
                  active={pathname === "/dashboard/teacher/assignment"}
                  onClick={() => router.push("/dashboard/teacher/assignment")}
                >
                  Assignment
                </MenuItem>

                <MenuItem
                  icon={<Create sx={{ fontSize: 20 }} />}
                  active={pathname === "/dashboard/teacher/assignment/create"}
                  onClick={() =>
                    router.push("/dashboard/teacher/assignment/create")
                  }
                >
                  Create Assignment
                </MenuItem>
              </SubMenu>

              <MenuItem
                icon={<QuizOutlined sx={{ fontSize: 20 }} />}
                active={pathname === "/dashboard/teacher/exam"}
                onClick={() => router.push("/dashboard/teacher/exam")}
              >
                Exam Schedule
              </MenuItem>
            </>
          )}

          {/* LIBRARIAN */}
          {role === "LIBRARIAN" && (
            <>
              <MenuItem
                icon={<MenuBookOutlined sx={{ fontSize: 18 }} />}
                active={pathname === "/dashboard/library/allbooks"}
                onClick={() => router.push("/dashboard/library/allbooks")}
              >
                View Books
              </MenuItem>

              <SubMenu
                open={openSubMenu === "library"}
                onOpenChange={() => handleSubMenuToggle("library")}
                label="Library"
                icon={<LibraryBooksOutlined sx={{ fontSize: 20 }} />}
              >
                <MenuItem
                  icon={<AddBoxRounded sx={{ fontSize: 18 }} />}
                  active={pathname === "/dashboard/library/addbook"}
                  onClick={() => router.push("/dashboard/library/addbook")}
                >
                  Add Book
                </MenuItem>

                <MenuItem
                  icon={<EventAvailable sx={{ fontSize: 18 }} />}
                  active={pathname === "/dashboard/library/issuedbook"}
                  onClick={() => router.push("/dashboard/library/issuedbook")}
                >
                  Issued Book
                </MenuItem>

                <MenuItem
                  icon={<RequestPageOutlined sx={{ fontSize: 18 }} />}
                  active={pathname === "/dashboard/library/bookrequests"}
                  onClick={() => router.push("/dashboard/library/bookrequests")}
                >
                  Book Requests
                </MenuItem>
              </SubMenu>
            </>
          )}
        </Menu>
      </Sidebar>
    </div>
  );
};

export default Sidenav;
