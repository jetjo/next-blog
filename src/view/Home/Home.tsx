// @ts-check

import * as React from "react";
import { Content } from "./Content";

// console.log(renderToStaticMarkup(React.createElement(Content)))

const HomePage = () => {
  return (
    <div className="px-7 p-10 overflow-x-hidden">
      <Content />
    </div>
  );
};

export default HomePage;
