"use client";

import { ConfirmModal } from "@/components/modals/confirm-modal";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useConfettiStore } from "@/hooks/use-confetti-store";
import axios from "axios";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface CourseActionsProps {

  courseId: string;
  isPublished: boolean;
  disabled: boolean;
}

export const CourseActions = ({

  courseId,
  isPublished,
  disabled,
}: CourseActionsProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const confettit = useConfettiStore();

  console.log("CourseActionsProps", disabled)

  const onClick = async () => {
    try {
      setIsLoading(true);

      if (isPublished) {
        await axios.patch(
          `/api/courses/${courseId}/unpublish`
        );
        toast({
          title: "Course has been unpublished",
        });

      } else {
        await axios.patch(
          `/api/courses/${courseId}/publish`
        );
        toast({
          title: "Course has been published",
        });
          confettit.onOpen();
      }

      router.refresh();
    } catch (error) {
      toast({
        title: "Something went wrong",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setIsLoading(true);

      await axios.delete(`/api/courses/${courseId}`);
      toast({
        title: "Course deleted",
        description: "Course has been deleted",
      });

      router.refresh();

      router.push(`/teacher/courses`);
    } catch (error) {
      toast({
        title: "Something went wrong",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="flex items-center gap-x-2">
      <Button
        variant="outline"
        size="sm"
        disabled={!disabled || isLoading}
        aria-disabled={!disabled || isLoading}
        onClick={onClick}
        type="button"
        aria-label={disabled ? "Unpublish" : "Publish"}
      >
        {isPublished ? "Unpublish" : "Publish"}
      </Button>
      <ConfirmModal onConfirm={onDelete}>
        <Button
          type="button"
          size="sm"
          aria-label={`Delete chapter`}
          disabled={isLoading}
          aria-disabled={isLoading}
        >
          <Trash />
        </Button>
      </ConfirmModal>
    </section>
  );
};
