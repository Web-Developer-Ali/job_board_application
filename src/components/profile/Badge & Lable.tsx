const Badge = ({ children }: { children: React.ReactNode }) => (
    <span className="bg-gray-200 dark:bg-gray-700 dark:text-white text-sm px-3 py-1 rounded-full mr-2 shadow-sm">
      {children}
    </span>
  );
  

  const Label = ({ children }: { children: React.ReactNode }) => (
    <label className="text-md font-bold dark:text-gray-300">{children}</label>
  );
  
  export {Label,Badge};
  