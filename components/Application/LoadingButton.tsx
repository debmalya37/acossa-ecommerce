import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import React, { ComponentPropsWithoutRef } from "react";

// All props of <Button> + our custom ones
interface ButtonLoadingProps extends ComponentPropsWithoutRef<typeof Button> {
  text: string;
  loading?: boolean;
}

const ButtonLoading: React.FC<ButtonLoadingProps> = ({
  type = "button",
  text,
  loading = false,
  className,
  onClick,
  ...props
}) => {
  return (
    <Button
      type={type}
      disabled={loading}
      onClick={onClick}
      className={cn(className)}
      {...props}
    >
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {text}
    </Button>
  );
};

export default ButtonLoading;
