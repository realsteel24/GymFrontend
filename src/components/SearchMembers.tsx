import React, { useState, useCallback, useEffect } from "react";
import { debounce } from "lodash";
import { MemberOptions } from "@/hooks";
import { BACKEND_URL } from "@/config";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandDialog,
} from "./ui/command";
import { Search, SearchIcon } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { DialogTitle } from "@radix-ui/react-dialog";
import { DialogDescription } from "./ui/dialog";
import { useToast } from "./ui/use-toast";

interface SearchMemberProps {
  gymId: string;
  setMemberId?: (memberId: string) => void;
  id: string;
  data?: number;
  type?: string;
}

const SearchMembers: React.FC<SearchMemberProps> = ({ gymId, data, type }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [memberSearch, setMemberSearch] = useState<MemberOptions[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<MemberOptions | null>(
    null
  );
  const [open, setOpen] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const navigate = useNavigate();
  const { toast } = useToast();
  const fetchMembers = async (search: string) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${BACKEND_URL}/api/v1/admin/${gymId}/members/select?search=${search}`,
        {
          headers: {
            "Content-Type": "application/json",
            authorization: localStorage.getItem("token") ?? "",
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();

      if (data.data) {
        setMemberSearch(data.data);
      } else {
        throw new Error("Invalid response structure");
      }
    } catch (error) {
      console.error("Error fetching members:", error);
      setMemberSearch([]);
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetchMembers = useCallback(
    debounce((search: string) => {
      fetchMembers(search);
    }, 400),
    [gymId]
  );

  useEffect(() => {
    const search = searchParams.get("search") || "";
    setSearch(search);
    debouncedFetchMembers(search);
  }, [searchParams, debouncedFetchMembers]);

  const handleInputChange = (newValue: string) => {
    setSearchParams({ search: newValue });
    setSearch(newValue);
    debouncedFetchMembers(newValue);
  };

  const handleMemberSelect = (member: MemberOptions) => {
    setSelectedStatus(member);
    // setMemberId(member.Members[0].id);
    setSearchParams("");
    setOpen(false);
  };

  return (
    <div>
      {type === "search" ? (
        <SearchIcon
          onClick={() => {
            setOpen((prev) => !prev);
            setSearchParams("");
          }}
          className="cursor-pointer text-slate-600"
        />
      ) : (
        <div
          onClick={() => {
            setOpen((prev) => !prev);
            setSearchParams("");
          }}
          className=" text-md flex justify-between"
        >
          {/* <div>
          <ScanSearch className="h-16 w-16 text-muted-foreground" />
        </div> */}

          <Card x-chunk="dashboard-01-chunk-3">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Member Search
              </CardTitle>
              <Search className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold pt-0">{data} </div>

              <p className="text-xs text-muted-foreground">Total Members</p>
            </CardContent>
          </Card>
        </div>
      )}
      <CommandDialog open={open} onOpenChange={setOpen}>
        <DialogTitle className="hidden">Search</DialogTitle>
        <DialogDescription className="hidden">
          Search for members
        </DialogDescription>
        <Command className="rounded-lg shadow-md md:min-w-[450px]">
          <CommandInput
            className="text-md"
            placeholder="Search members..."
            value={search}
            onChangeCapture={(e) => handleInputChange(e.currentTarget.value)}
          />
          <CommandList>
            {loading ? (
              <div className="p-2">Loading...</div>
            ) : (
              <>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup>
                  {memberSearch.map((member) => (
                    <CommandItem
                      key={member.Members[0].id}
                      value={member.name}
                      onSelect={() => {
                        handleMemberSelect(member);
                        selectedStatus;
                        member.status === "member"
                          ? navigate(
                              `/gym/${gymId}/transactionHistory/${member.Members[0].id}`
                            )
                          : toast({
                              title: "Error: User not enrolled",
                              description:
                                "Enroll User to a Program then try again",
                            });
                      }}
                      className="text-md justify-between"
                    >
                      <div>{member.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {member.status}
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </CommandDialog>
    </div>
  );
};

export default SearchMembers;
