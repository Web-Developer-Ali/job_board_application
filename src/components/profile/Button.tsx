const Button = ({ onClick, children, disabled = false }: { onClick: () => void; children: React.ReactNode; disabled?: boolean }) => (
    <button
      onClick={onClick}
      className={`bg-gray-200 dark:bg-gray-700 border dark:text-white border-gray-300 dark:border-gray-700 px-4 py-2 rounded-md shadow-sm ${
        disabled
          ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed'
          : 'hover:bg-gray-100 dark:hover:bg-gray-600'
      } focus:ring-2 focus:ring-blue-500 transition duration-150`}
      disabled={disabled}
    >
      {children}
    </button>
  );
  
  export default Button;
  