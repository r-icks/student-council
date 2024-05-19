import React from "react";
import { Transition } from "@headlessui/react";

const Loading = () => {
  return (
    <Transition
      show={true}
      enter="transition-opacity duration-300"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition-opacity duration-300"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full border-t-4 border-primary border-opacity-75 border-solid h-16 w-16"></div>
      </div>
    </Transition>
  );
};

export default Loading;
