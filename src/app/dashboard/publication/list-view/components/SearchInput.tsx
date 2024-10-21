/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import { Input } from "antd";

const { Search } = Input;

const SearchInput = ({
  onSearch,
}: {
  onSearch: (searchTerm: string) => void;
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleChange = (value: string) => {
    setSearchTerm(value);
    onSearch(value);
  };

  return (
    <div style={{ margin: "20px" }}>
      <Search
        placeholder="Search..."
        size="large"
        value={searchTerm}
        onChange={(e) => handleChange(e.target.value)}
        enterButton={false}
      />
    </div>
  );
};

export default SearchInput;
