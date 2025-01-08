import React from "react";
import { useEffect } from "react";

const TestComp = React.memo(
  ({ departmentName }: { departmentName: string }) => {
    useEffect(() => {
      alert(departmentName);
    }, []);
    return <>{departmentName}</>;
  }
);

export default TestComp;
