import { useEffect, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { format, parseISO } from "date-fns";
import { BACKEND_URL } from "@/config";
import { useParams } from "react-router-dom";
import { Portal } from "@radix-ui/react-popover";

type Birthdays = {
  id: string;
  name: string;
  dob: string; // Format: YYYY-MM-DD
};

export const Notifications = () => {
  const [birthdays, setBirthdays] = useState<Birthdays[]>([]);
  const { gymId } = useParams<{ gymId: string }>();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const today = new Date();
  const todayMonth = today.getMonth();
  const todayDate = today.getDate();

  useEffect(() => {
    const fetchBirthdays = async () => {
      try {
        const response = await fetch(
          `${BACKEND_URL}/api/v1/admin/${gymId}/birthdays`,
          {
            headers: {
              "Content-Type": "application/json",
              authorization: localStorage.getItem("token") ?? "",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch birthdays");
        }

        const result = await response.json();
        setBirthdays(
          result.data?.map(({ id, name, dob }: Birthdays) => ({
            id,
            name,
            dob: dob.split("T")[0],
          })) || []
        );
      } catch (err) {
        setError("Failed to load birthdays");
      } finally {
        setLoading(false);
      }
    };

    fetchBirthdays();
  }, [gymId]);

  const upcomingBirthdays = birthdays
    .filter((member) => {
      const dob = new Date(member.dob);
      const dobMonth = dob.getUTCMonth(); // Ensure we get the correct month
      const dobDate = dob.getUTCDate(); // Ensure we get the correct date

      return (
        dobMonth > todayMonth ||
        (dobMonth === todayMonth && dobDate >= todayDate)
      );
    })
    .sort((a, b) => {
      const aDate = new Date(a.dob);
      const bDate = new Date(b.dob);
      return (
        aDate.getUTCMonth() - bDate.getUTCMonth() ||
        aDate.getUTCDate() - bDate.getUTCDate()
      );
    });

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="relative cursor-pointer">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 611.999 611.999"
            className="fill-current text-black dark:text-white h-4 w-4"
          >
            <path
              d="M570.107,500.254c-65.037-29.371-67.511-155.441-67.559-158.622v-84.578c0-81.402-49.742-151.399-120.427-181.203
          C381.969,34,347.883,0,306.001,0c-41.883,0-75.968,34.002-76.121,75.849c-70.682,29.804-120.425,99.801-120.425,181.203v84.578
          c-0.046,3.181-2.522,129.251-67.561,158.622c-7.409,3.347-11.481,11.412-9.768,19.36c1.711,7.949,8.74,13.626,16.871,13.626
          h164.88c3.38,18.594,12.172,35.892,25.619,49.903c17.86,18.608,41.479,28.856,66.502,28.856
          c25.025,0,48.644-10.248,66.502-28.856c13.449-14.012,22.241-31.311,25.619-49.903h164.88c8.131,0,15.159-5.676,16.872-13.626
          C581.586,511.664,577.516,503.6,570.107,500.254z"
            />
          </svg>

          {/* Notification count badge */}
          {upcomingBirthdays.length > 0 && (
            <span className="absolute -top-1.5 h-4 w-4 flex justify-center flex-col items-center -right-2 bg-red-500 text-white text-xs font-bold rounded-full">
              {upcomingBirthdays.length}
            </span>
          )}
        </div>
      </PopoverTrigger>

      {/* Popover Content */}
      <Portal>
        <PopoverContent className="p-3 shadow-lg rounded-lg mx-4 mt-2 bg-gray-300 dark:bg-black backdrop-blur-md">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            🎉 Upcoming Birthdays
          </h3>

          {loading ? (
            <p className="text-sm text-gray-500">Loading...</p>
          ) : error ? (
            <p className="text-sm text-red-500">{error}</p>
          ) : (
            <NotifList members={upcomingBirthdays} />
          )}
        </PopoverContent>
      </Portal>
    </Popover>
  );
};

const NotifList = ({ members }: { members: Birthdays[] }) => {
  const today = new Date();
  const todayMonth = today.getMonth();
  const todayDay = today.getDate();

  return (
    <div className="mt-2 max-h-60 overflow-y-auto space-y-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">
      {members.length === 0 ? (
        <p className="text-sm text-gray-500">No upcoming birthdays</p>
      ) : (
        members.map((member) => {
          const memberDate = parseISO(member.dob); // Convert string to Date
          const memberMonth = memberDate.getMonth();
          const memberDay = memberDate.getDate();
          const isToday = todayMonth === memberMonth && todayDay === memberDay; // Ignore year

          return (
            <div
              key={member.id}
              className={`flex justify-between items-center p-2 rounded-md ${
                isToday
                  ? "bg-yellow-100 dark:bg-yellow-800"
                  : "hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {member.name}
              </span>
              <span
                className={`text-xs ${
                  isToday ? "text-black dark:text-white" : "text-gray-500"
                }`}
              >
                {isToday ? "🎂 Today" : format(new Date(member.dob), "MMM dd")}
              </span>
            </div>
          );
        })
      )}
    </div>
  );
};
