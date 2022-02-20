import { PageHeader } from "antd";
import React from "react";

// displays a page header

export default function Header() {
  return (
    <a href="https://github.com/angeldao/evmos-liquid-stake" target="_blank" rel="noopener noreferrer">
      <PageHeader
        title="Evmos Liquid Staking"
        style={{ cursor: "pointer" }}
      />
    </a>
  );
}
