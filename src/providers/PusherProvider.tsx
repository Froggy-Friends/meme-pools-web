"use client"

import React, { createContext, useEffect, useState } from 'react';
import Pusher from 'pusher-js';

type PusherContextProps = {
  pusher: Pusher | null;
}

export const PusherContext = createContext<PusherContextProps | undefined>(undefined);

export const PusherProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pusher] = useState<Pusher | null>(() => {
    const pusherInstance = new Pusher('a015e9f0282a4e388fd7', {
      cluster: 'us3',
    });
    return pusherInstance;
  });

  useEffect(() => {
    // Cleanup function to disconnect the Pusher instance on unmount
    return () => {
      if (pusher) {
        pusher.disconnect();
      }
    };
  }, [pusher]);

  return (
    <PusherContext.Provider value={{ pusher }}>
      {children}
    </PusherContext.Provider>
  );
};
