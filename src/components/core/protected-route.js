import _ from "lodash";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export function Private({ children }) {
  const navigate = useNavigate();

  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (user === null) {
      navigate("/sign-in");
    }
  }, [user]);

  return <div>{user ? children : <div />}</div>;
}

export function Public({ children }) {
  const navigate = useNavigate();

  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    // if (user) {
    //   navigate(hasLeague ? `/league/${_.first(user?.leagues).slug}` : "/");
    // }
  }, [user]);

  return <div>{user ? <div /> : children}</div>;
}
