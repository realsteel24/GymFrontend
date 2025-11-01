import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { BACKEND_URL } from "../config";
import { EnquiryInput } from "realsteelgym";

export interface MemberOptions {
  id: string;
  name: string;
  email: string;
  dob: string | null;
  contact: string;
  gender: string;
  status: string;
  goals: string;
  address: string;
  medical: string;
  referral: string;
  instagram: string;
  Members: {
    length: number;
    0: {
      id: string;
      enrollmentDate: string;
      gymId: string;
      MemberFees?: { 0: { paidDate?: string } };
      MemberPrograms: MemberProgramOptions[];
    };
  };
  navigate: (path: string) => void;
}

export interface GymOptions {
  logo: string;
  id: string;
  name: string;
  branch: string;
  address: string;
  website: string;
  operationalHours: string;
  navigate: (path: string) => void;
}

export interface ProgramsOptions {
  id: string;
  name: string;
  description: string;
  _count: {
    Batches: number;
    MemberPrograms: number;
  };
}
export interface BatchOptions {
  id: string;
  name: string;
  endTime: string;
  startTime: string;
  days: string;
  _count: {
    MemberPrograms: number;
  };
  Program: {
    name: string;
  };
  MemberPrograms: { Member: { User: { name: string } } };
  navigate: (path: string) => void;
}

export interface FeeOptions {
  id: string;
  frequency: string;
  amount: string;
  description: string;
  _count: {
    MemberFees: number;
  };
}

export interface MemberProgramOptions {
  id: string;
  memberId: string;
  programId: string;
  batchId: string;
  gymId: string;
  Batch: { name: string };
  Member: {
    0: {
      userId: string;
      MemberFees: {
        0: {
          feeCategoryId: string;
          FeeCategories: { 0: { description: string } };
          Payments: {
            0: { amount: number; paymentDate: string; paymentMethd: string };
          };
        };
      };
      User: { 0: { name: string } };
    };
  };
  Program: ProgramsOptions;
}

export interface MemberFeeOptions {
  id: string;
  paidDate: string;
  dueDate: string;
  status: string;
  memberId: string;
  FeeCategory: { description: string; frequency: string };
  Payments: {
    0: {
      amount: number;
      paymentMethod: string;
      PaymentMethod: {
        collectedBy: string;
        id: string;
        mode: string;
      };
    };
  };
  Member: {
    User: { name: string; contact: string };
    MemberPrograms: [
      {
        Batch: { name: true };
        Program: { name: true };
      }
    ];
  };
}

export interface PaymentMethodOptions {
  id: string;
  mode: string;
  collectedBy: string;
}
export interface ItemOptions {
  id: string;
  name: string;
  description: string;
}

export interface SubitemOptions {
  id: string;
  name: string;
  itemId: string;
  costPrice: string;
  sellingPrice: string;
  stock: string;
  Item: ItemOptions;
}

export interface StockInventoryOptions {
  id: string;
  memberId: string;
  quantity: number;
  totalAmount: number;
  unitPrice: number;
  date: string;
  SubItem: SubitemOptions;
  Member: MemberOptions;
  PaymentMethod: PaymentMethodOptions;
}

export const useMembers = ({
  gymId,
  id,
  page,
  rowsPerPage,
}: {
  gymId: string;
  id: string;
  page: number;
  rowsPerPage: number;
}) => {
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState<MemberOptions[]>([]);
  const [dataCount, setDataCount] = useState(0);

  useEffect(() => {
    if (!gymId) return;
    const fetchMembers = async () => {
      try {
        const response = await fetch(
          `${BACKEND_URL}/api/v1/admin/${gymId}/members/${id}?page=${page}&rowsPerPage=${rowsPerPage}`,
          {
            headers: { authorization: localStorage.getItem("token") ?? "" },
          }
        );
        if (!response.ok) {
          throw new Error("Something went wrong");
        }
        const result = await response.json();
        setMembers(result.data);
        setDataCount(result.dataCount);
      } catch (error) {
        console.error("Error fetching members:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [gymId, id, page, rowsPerPage]);

  return {
    members,
    loading,
    dataCount,
  };
};

export const useGyms = ({ gymId }: { gymId: string }) => {
  const [loading, setLoading] = useState(true);
  const [gyms, setGyms] = useState<GymOptions[]>([]);
  useEffect(() => {
    try {
      fetch(`${BACKEND_URL}/api/v1/gym/${gymId}`, {
        headers: {
          authorization: localStorage.getItem("token") ?? "",
        },
      }).then(async (response) => {
        if (!response.ok) {
          throw new Error("Something went wrong");
        }
        const result = await response.json();
        setGyms(result.data);
        setLoading(false);
      });
    } catch (error) {
      console.error(`Error:${error}`);
    }
  }, []);
  return {
    gyms,
    loading,
  };
};
export const usePrograms = ({ gymId }: { gymId: string }) => {
  const [programLoading, setProgramLoading] = useState(true);
  const [programs, setPrograms] = useState<ProgramsOptions[]>([]);
  const fetchPrograms = async () => {
    try {
      fetch(`${BACKEND_URL}/api/v1/admin/${gymId}/programs`).then(
        async (response) => {
          if (!response.ok) {
            throw new Error("Something went wrong");
          }
          const result = await response.json();
          setPrograms(result.data);
          setProgramLoading(false);
        }
      );
    } catch (error) {
      console.error(`Error: ${error}`);
    }
  };
  return {
    programs,
    programLoading,
    fetchPrograms,
  };
};

export const useBatches = ({ id, gymId }: { id: string; gymId: string }) => {
  const [loading, setLoading] = useState(true);
  const [batches, setBatches] = useState<BatchOptions[]>([]);

  useEffect(() => {
    if (!id) {
      setBatches([]);
      setLoading(false);
      return;
    }
    const fetchBatches = async () => {
      try {
        const response = await fetch(
          `${BACKEND_URL}/api/v1/admin/${gymId}/batches/${id}`
        );
        if (!response.ok) {
          throw new Error("Something went wrong");
        }
        const result = await response.json();
        setBatches(result.batch);
      } catch (error) {
        console.error("Error fetching batches:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBatches();
  }, [id]);

  return {
    batches,
    loading,
  };
};

export const useFeeCategories = ({ gymId }: { gymId: string }) => {
  const [feeCategoryLoading, setLoading] = useState(true);
  const [feeCategories, setFeeCategories] = useState<FeeOptions[]>([]);

  const fetchCategories = async () => {
    try {
      const response = await fetch(
        `${BACKEND_URL}/api/v1/admin/${gymId}/feeCategories`,
        {
          headers: { authorization: localStorage.getItem("token") ?? "" },
        }
      );
      if (!response.ok) {
        throw new Error("Something went wrong");
      }
      const result = await response.json();
      setFeeCategories(result.feeCategory);
    } catch (error) {
      console.error("Error fetching batches:", error);
    } finally {
      setLoading(false);
    }
  };

  return {
    feeCategories,
    feeCategoryLoading,
    fetchCategories,
  };
};

//Backend query disabled
export const useMemberPrograms = ({ gymId }: { gymId: string }) => {
  const [memberProgramLoading, setMemberProgramLoading] = useState(true);
  const [memberPrograms, setMemberPrograms] = useState<MemberProgramOptions[]>(
    []
  );

  useEffect(() => {
    const fetchMemberPrograms = async () => {
      try {
        const response = await fetch(
          `${BACKEND_URL}/api/v1/admin/${gymId}/memberPrograms`,
          {
            headers: { authorization: localStorage.getItem("token") ?? "" },
          }
        );
        if (!response.ok) {
          throw new Error("Something went wrong");
        }
        const result = await response.json();
        setMemberPrograms(result.memberProgram);
      } catch (error) {
        console.error("Error fetching batches:", error);
      } finally {
        setMemberProgramLoading(false);
      }
    };

    fetchMemberPrograms();
  }, [gymId]);

  return {
    memberPrograms,
    memberProgramLoading,
  };
};

export const useMemberFees = ({
  gymId,
  memberId,
}: {
  gymId: string;
  memberId?: string;
}) => {
  const queryKey = ["memberFees", gymId, memberId];

  const { data: memberFees = [], isPending: memberFeesLoading } = useQuery({
    queryKey,
    queryFn: async () => {
      const response = await fetch(
        `${BACKEND_URL}/api/v1/admin/${gymId}/memberFees/${memberId}`,
        {
          headers: { authorization: localStorage.getItem("token") ?? "" },
        }
      );

      if (!response.ok) {
        throw new Error("Something went wrong");
      }

      const result = await response.json();
      return result.memberFees;
    },
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: false,
  });

  return {
    memberFees,
    memberFeesLoading,
  };
};

export const useTransactionHistory = ({
  gymId,
  memberId,
  page,
  rowsPerPage,
  type,
}: {
  gymId: string;
  memberId?: string;
  page: number;
  rowsPerPage: number;
  type?: string;
}) => {
  const queryKey = [
    "transactionHistory",
    gymId,
    memberId,
    page,
    rowsPerPage,
    type,
  ];
  const {
    data,
    isPending: transactionHistoryLoading,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey,
    queryFn: async () => {
      const typeParam =
        type === "newAd"
          ? `&type=newAd`
          : type === "defaulter"
          ? `&type=defaulter`
          : "";

      const response = await fetch(
        `${BACKEND_URL}/api/v1/admin/${gymId}/transactionHistory/${memberId}?page=${page}&rowsPerPage=${rowsPerPage}${typeParam}`,
        {
          headers: { authorization: localStorage.getItem("token") ?? "" },
        }
      );

      if (!response.ok) {
        throw new Error("Something went wrong");
      }

      const result = await response.json();

      return {
        data: result.data || [],
        dataCount: result.dataCount || 0,
      };
    },
    // CRITICAL: Configure refetch behavior
    staleTime: 0, // Always consider data stale
    gcTime: 0, // Don't cache - always fetch fresh
    refetchOnMount: "always", // Always refetch when component mounts
    refetchOnWindowFocus: false, // Disable for now to avoid confusion
  });

  return {
    transactionHistory: data?.data || [],
    dataCount: data?.dataCount || 0,
    transactionHistoryLoading,
    refetch,
    isRefetching,
  };
};

export const useTransactionCharts = ({ gymId }: { gymId: string }) => {
  const [transactionChartsLoading, setTransactionChartsLoading] =
    useState(true);
  const [transactionCharts, setTransactionCharts] = useState<
    MemberFeeOptions[]
  >([]);

  useEffect(() => {
    const fetchTransactionHistory = async () => {
      try {
        const response = await fetch(
          `${BACKEND_URL}/api/v1/admin/${gymId}/transactionHistory/charts`,
          {
            headers: { authorization: localStorage.getItem("token") ?? "" },
          }
        );
        if (!response.ok) {
          throw new Error("Something went wrong");
        }
        const result = await response.json();
        setTransactionCharts(result.data);
      } catch (error) {
        console.error("Error fetching batches:", error);
      } finally {
        setTransactionChartsLoading(false);
      }
    };

    fetchTransactionHistory();
  }, [gymId]);

  return {
    transactionCharts,
    transactionChartsLoading,
  };
};

export const useStatusCount = ({ gymId }: { gymId: string }) => {
  const [statusCountLoading, setStatusCountLoading] = useState(true);
  const [defaulterCount, setDefaulterCount] = useState(0);
  const [newAdCount, setNewAdCount] = useState(0);
  const [genderCount, setGenderCount] = useState({
    male: 0,
    female: 0,
    other: 0,
  });
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await fetch(
          `${BACKEND_URL}/api/v1/admin/${gymId}/statusCount`,
          {
            headers: { authorization: localStorage.getItem("token") ?? "" },
          }
        );
        if (!response.ok) {
          throw new Error("Something went wrong");
        }
        const result = await response.json();
        setDefaulterCount(result.defaultersCount);
        setNewAdCount(result.newAdCount);
        setTotalAmount(result.totalAmount);
        setGenderCount({
          male: result.gender.male,
          female: result.gender.female,
          other: result.gender.other,
        });
      } catch (error) {
        console.error("Error fetching count:", error);
      } finally {
        setStatusCountLoading(false);
      }
    };

    fetchPayments();
  }, [gymId]);

  return {
    totalAmount,
    defaulterCount,
    newAdCount,
    statusCountLoading,
    genderCount,
  };
};

export const usePaymentMethod = ({ gymId }: { gymId: string }) => {
  const [methodLoading, setMethodLoading] = useState(true);
  const [mode, setMode] = useState<PaymentMethodOptions[]>([]);

  const fetchMethods = async () => {
    try {
      const response = await fetch(
        `${BACKEND_URL}/api/v1/admin/${gymId}/paymentMethods`,
        {
          headers: { authorization: localStorage.getItem("token") ?? "" },
        }
      );
      if (!response.ok) {
        throw new Error("Something went wrong");
      }
      const result = await response.json();
      setMode(result.method);
    } catch (error) {
      console.error("Error fetching count:", error);
    } finally {
      setMethodLoading(false);
    }
  };

  return {
    methodLoading,
    mode,
    fetchMethods,
  };
};

export const useEnquiry = ({ gymId }: { gymId: string }) => {
  const [enquiryLoading, setEnquiryLoading] = useState(true);
  const [enquiry, setEnquiry] = useState<EnquiryInput[]>([]);

  const fetchEnquiries = async () => {
    try {
      const response = await fetch(
        `${BACKEND_URL}/api/v1/admin/${gymId}/enquiries`,
        {
          headers: { authorization: localStorage.getItem("token") ?? "" },
        }
      );
      if (!response.ok) {
        throw new Error("Something went wrong");
      }
      const result = await response.json();
      setEnquiry(result.data);
    } catch (error) {
      console.error("Error fetching count:", error);
    } finally {
      setEnquiryLoading(false);
    }
  };

  return {
    enquiryLoading,
    enquiry,
    fetchEnquiries,
  };
};

export const useItem = ({
  gymId,
  itemId,
}: {
  gymId: string;
  itemId?: string;
}) => {
  const [itemLoading, setItemLoading] = useState(true);
  const [item, setItem] = useState<ItemOptions[]>([]);

  const fetchItems = async () => {
    try {
      const response = await fetch(
        `${BACKEND_URL}/api/v1/admin/${gymId}/items/${itemId ?? "all"}`,
        {
          headers: { authorization: localStorage.getItem("token") ?? "" },
        }
      );
      if (!response.ok) throw new Error("Something went wrong");
      const result = await response.json();
      setItem(result.data);
    } catch (error) {
      console.error("Error fetching items:", error);
    } finally {
      setItemLoading(false);
    }
  };

  return { itemLoading, item, fetchItems };
};

export const useSubitem = ({
  gymId,
  itemId,
}: {
  gymId: string;
  itemId: string;
}) => {
  const [subitemLoading, setSubitemLoading] = useState(true);
  const [subitem, setSubitem] = useState<SubitemOptions[]>([]);

  const fetchSubitem = async () => {
    if (!itemId) {
      setSubitem([]);
      setSubitemLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${BACKEND_URL}/api/v1/admin/${gymId}/subitems/${itemId}`,
        {
          headers: { authorization: localStorage.getItem("token") ?? "" },
        }
      );
      if (!response.ok) throw new Error("Something went wrong");
      const result = await response.json();
      setSubitem(result.data);
    } catch (error) {
      console.error("Error fetching subitems:", error);
    } finally {
      setSubitemLoading(false);
    }
  };

  useEffect(() => {
    fetchSubitem();
  }, [itemId, gymId]);

  return { subitemLoading, subitem, fetchSubitem };
};

export const useInventoryTransactions = ({
  gymId,
  memberId,
}: {
  gymId: string;
  memberId?: string;
}) => {
  const [inventoryTransactionsLoading, setInventoryTransactionsLoading] =
    useState(true);
  const [inventoryTransaction, setInventoryTransaction] = useState<
    StockInventoryOptions[]
  >([]);

  useEffect(() => {
    const fetchInventoryTransactions = async () => {
      try {
        const response = await fetch(
          `${BACKEND_URL}/api/v1/admin/${gymId}/inventorytransactions/${memberId}`,
          {
            headers: { authorization: localStorage.getItem("token") ?? "" },
          }
        );
        if (!response.ok) {
          throw new Error("Something went wrong");
        }
        const result = await response.json();
        setInventoryTransaction(result.data);
      } catch (error) {
        console.error("Error fetching batches:", error);
      } finally {
        setInventoryTransactionsLoading(false);
      }
    };

    fetchInventoryTransactions();
  }, [gymId]);

  return {
    inventoryTransaction,
    inventoryTransactionsLoading,
  };
};

// export const useBatchMembers = ({ id, gymId }: { id: string; gymId: string }) => {
//   const [loading, setLoading] = useState(true);
//   const [batches, setBatches] = useState<BatchOptions[]>([]);

//   useEffect(() => {
//     if (!id) {
//       setBatches([]);
//       setLoading(false);
//       return;
//     }
//     const fetchBatches = async () => {
//       try {
//         const response = await fetch(
//           `${BACKEND_URL}/api/v1/admin/${gymId}/batches/${id}`,
//           {
//             headers: { authorization: localStorage.getItem("token") ?? "" },
//           }
//         );
//         if (!response.ok) {
//           throw new Error("Something went wrong");
//         }
//         const result = await response.json();
//         setBatches(result.batch);
//       } catch (error) {
//         console.error("Error fetching batches:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBatches();
//   }, [id]);

//   return {
//     batches,
//     loading,
//   };
// };
