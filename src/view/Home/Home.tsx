// @ts-check

import * as React from "react";
import Nav from "@/app/(community)/components/Nav";
import { renderToStaticMarkup } from "react-dom/server";
import { Content } from "./Content";

// console.log(renderToStaticMarkup(React.createElement(Content)))

const HomePage = () => {
  return (
    <>
      {" "}
      <header className="px-7">
        <Nav />
      </header>
      <div className="px-7 p-10 overflow-x-hidden">
        <Content />
      </div>
    </>
  );
};

export default HomePage;
