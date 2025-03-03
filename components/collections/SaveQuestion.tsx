"use client";

import { useToast } from "@/hooks/use-toast";
import { toggleSavedQuestion } from "@/lib/actions/collection.action";
import { useSession } from "next-auth/react";
import Image from "next/image";
import React, { use, useState } from "react";

const SaveQuestion = ({ questionId, hasSavedQuestionPromise }: { questionId: string, hasSavedQuestionPromise: Promise<ActionResponse<{ saved: boolean }>> }) => {
  const { toast } = useToast();
  const session = useSession();
  const userId = session?.data?.user?.id;

  const {data} = use(hasSavedQuestionPromise)

  const {saved: hasSaved} = data || {}

  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!userId) {
      return toast({
        title: "You need to login to save a question",
        variant: "destructive",
      });
    }
    setIsLoading(true);

    try {
      const { success, error, data } = await toggleSavedQuestion({
        questionId,
      });
      if (!success) throw new Error(error?.message || "An error has occured");

      toast({
        title: `Question ${data?.saved ? "Saved" : "Unsaved"}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "An error has occured",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Image
      src={hasSaved ? "/icons/star-filled.svg" : "/icons/star-red.svg"}
      width={18}
      height={18}
      alt="star"
      className={`cursor-pointer ${isLoading ? "loading" : "opacity-50"}`}
      arial-lable="Save Question"
      onClick={handleSave}
    />
  );
};

export default SaveQuestion;
