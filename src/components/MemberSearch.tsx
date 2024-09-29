import React, { useState, useCallback, useEffect } from "react";
import { debounce } from "lodash";
import { MemberOptions } from "@/hooks";
import { BACKEND_URL } from "@/config";
import { useSearchParams } from "react-router-dom";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandDialog,
} from "././ui/command";
import { ScanSearch } from "lucide-react";

interface SearchMemberProps {
  gymId: string;
  setMemberId?: (memberId: string) => void;
  id: string;
}

const SearchMembers: React.FC<SearchMemberProps> = ({ gymId }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [memberSearch, setMemberSearch] = useState<MemberOptions[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<MemberOptions | null>(
    null
  );
  const [open, setOpen] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");

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
      <div
        onClick={() => setOpen((prev) => !prev)}
        className=" text-md flex justify-between"
      >
        <div>
          <ScanSearch className="h-16 w-16 text-muted-foreground" />
        </div>
      </div>
      <CommandDialog open={open} onOpenChange={setOpen}>
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
                      value={member.id}
                      onSelect={() => {
                        handleMemberSelect(member);
                        selectedStatus;
                      }}
                      className="text-md"
                    >
                      {member.name}
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
