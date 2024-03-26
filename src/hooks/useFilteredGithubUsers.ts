import { useEffect, useRef, useState } from "react";
import { useGithubUsers } from "./useGithubUsers";
import { DiffOperation } from "../types";

// Utility hook that filters the github users based on a search query
// It uses the useGithubUsers hook to fetch the users
export function useFilteredGithubUsers() {
  const { data: users, ...otherState } = useGithubUsers();
  const [search, setSearch] = useState("");
  const [additiveDeletiveState, setAdditiveDeletiveState] = useState<
    DiffOperation<string>
  >({
    additive: [],
    subtractive: [],
  });
  const prevFilteredUsersShallowRef = useRef<string[]>([]);
  // This effect is used to filter the users based on the search query
  // This effect also is used to calculate the additive and subtractive changes based on previous filtered users
  useEffect(() => {
    const filteredUsers = (users || []).filter((post) =>
      post.login.toLowerCase().includes(search.toLowerCase()) ||
      post.login === search
    ).map((x) => x.login);
    const prevFilteredUsers = prevFilteredUsersShallowRef.current;
    const currentFilteredUsers = filteredUsers.slice();
    const additive = currentFilteredUsers.filter((user) =>
      !prevFilteredUsers.includes(user)
    );
    const subtractive = prevFilteredUsers.filter((user) =>
      !currentFilteredUsers.includes(user)
    );
    setAdditiveDeletiveState({ additive, subtractive });
    prevFilteredUsersShallowRef.current = currentFilteredUsers;
  }, [search, users]);

  return {
    ...otherState,
    data: users || [],
    search,
    setSearch,
    additiveDeletiveState,
  };
}
