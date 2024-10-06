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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { ApiResponse } from "@/types/ApiResponse";

type MessageCartProps = {
  message: {
    id: string;
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
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant='destructive'>
              <X className='w-5 h-5' />
            </Button>
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
        <CardDescription>Card Description</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Card Content</p>
      </CardContent>
    </Card>
  );
};

export default messageCard;
