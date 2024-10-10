"use client";
import { X } from "lucide-react";
import {
  AlertDialogAction,
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader } from "./ui/card";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { ApiResponse } from "@/types/ApiResponse";

type MessageCartProps = {
  message: {
    id: string;
    content: string;
  };
  onMessageDelete: (messageId: string) => void;
};

const messageCard = ({ message, onMessageDelete }: MessageCartProps) => {
  const handleDeleteConfirm = async () => {
    const response = await axios.delete<ApiResponse>(
      `/api/delete-message/${message.id}`
    );
    toast({
      title: response.data.message,
    });
    onMessageDelete(message.id);
  };
  const { toast } = useToast();

  return (
    <Card>
      <div className='relative top-0 left-0'>
        <AlertDialog>
          <AlertDialogTrigger className='w-8' asChild>
            <X className='w-4' />
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                account and remove your data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteConfirm}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <CardHeader>
        <CardDescription>Card Description</CardDescription>
      </CardHeader>
      <CardContent>{message.content}</CardContent>
    </Card>
  );
};

export default messageCard;
