import React, { useState, useCallback, useEffect } from "react";
import { debounce } from "lodash";
import { MemberOptions } from "@/hooks";
import { BACKEND_URL } from "@/config";
import { useSearchParams } from "react-router-dom";
import { Label } from "../ui/label";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { CaretSortIcon } from "@radix-ui/react-icons";

interface SelectMemberProps {
  gymId: string;
  setMemberId: (memberId: string) => void;
  id: string;
  type?: string;
}

const SelectMember: React.FC<SelectMemberProps> = ({
  gymId,
  setMemberId,
  type,
}) => {
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
        `${BACKEND_URL}/api/v1/admin/${gymId}/members/${
          type === "member" ? "selectMembers" : "select"
        }?search=${search}`,
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
    }, 800),
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
    setMemberId(member.Members[0].id);
    setSearchParams("");
    setOpen(false);
  };

  return (
    <div className="grid grid-cols-4 items-center gap-4 py-2">
      <Label htmlFor="members" className="text-right text-md">
        Member
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="col-span-3 justify-between p-3 font-normal text-md"
          >
            {selectedStatus ? (
              <>
                {selectedStatus.name} <CaretSortIcon opacity={"50%"} />
              </>
            ) : (
              <>
                Select Member
                <CaretSortIcon opacity={"50%"} />
              </>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="col-span-3 p-0 z-50" align="start">
          <Command>
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
                        value={`${member.name},${member.Members[0].id}`}
                        onSelect={() => handleMemberSelect(member)}
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
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default SelectMember;
