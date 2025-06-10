import React from "react";

const LoadingComponent = ({ height }: { height?: string }) => {
  return (
    <div className={`flex ${height ?? 'h-screen'} w-full items-center justify-center`}>
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-primary border-solid" />
    </div>
  );
};

export default LoadingComponent;
