"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { ApiResponse } from "@/types/ApiResponse";
import { messageAcceptValidation } from "@/validation/messageAcceptValidation";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2, RefreshCcw } from "lucide-react";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import MessageCard from "@/components/message-card";

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const [acceptMessages, setAcceptMessages] = useState(false);
  const { toast } = useToast();

  console.log(messages);
  interface MessageProps {
    id: string;
    content: string;
    createdAt: string;
    userId: number;
  }

  const handleDeleteMessage = async (messageId: string) => {
    try {
      await axios.delete(`/api/delete-message/${messageId}`);
      toast({
        title: "Message deleted",
        description: "The message has been successfully deleted.",
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message || "Failed to delete message",
      });
    }
  };

  const { data: session } = useSession();

  const form = useForm({
    resolver: zodResolver(messageAcceptValidation),
  });

  const { setValue, register } = form;

  const fetchAcceptMessages = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>(`/api/accept-messages`);
      setValue("acceptMessages", response.data.isAcceptingMessages);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message ||
          "Failed to fetch message setting",
      });
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue]);

  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setIsLoading(true);
      setIsSwitchLoading(false);
      try {
        const response = await axios.get<ApiResponse>(`/api/get-messages`);
        setMessages(response.data.messages || []);
        if (refresh) {
          toast({
            title: "Refreshed",
            description: "Showing latest messages",
          });
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast({
          title: "Error",
          description:
            axiosError.response?.data.message || "Failed to fetch messages",
        });
      } finally {
        setIsLoading(false);
        setIsSwitchLoading(false);
      }
    },
    [setIsLoading, setMessages]
  );

  useEffect(() => {
    if (!session || !session.user) return;
    fetchMessages();
    fetchAcceptMessages();
  }, [session, setValue, fetchAcceptMessages, fetchMessages]);

  const handleSwitchChange = async () => {
    const newAcceptMessages = !acceptMessages;

    try {
      // Optionally set a loading state here
      const response = await axios.post<ApiResponse>("/api/accept-messages", {
        acceptMessages: newAcceptMessages,
      });

      setValue("acceptMessages", newAcceptMessages); // Update the state
      toast({
        title: "Message status is update",
        description: response.data.message,
        variant: "default",
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;

      toast({
        title: "Error",
        description:
          axiosError.response?.data.message || "Failed to update messages",
      });
    }
  };

  if (!session || !session.user) {
    return <>Please log in</>;
  }

  const { username } = session.user as User;
  const baseURL = `${window.location.protocol}//${window.location.host}`;
  const profileURL = `${baseURL}/u/${username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileURL);
    toast({
      title: "URL copied",
      description: "Profile has been copied to clipboard",
    });
  };

  return (
    <div className='my-8 mx-4 md:mx-8 ld:mx-auto p-6 bg-white rounded w-full max-w-6xl'>
      <h1 className='text-4xl font-bold mb-4'>User Dashboard</h1>

      <div className='mb-4'>
        <h2 className='text-lg font-semibold mb-2'>Copy your unique link</h2>
        <div className='flex items-center'>
          <input
            type='text'
            value={profileURL}
            disabled
            className='input input-bordered w-full p-2 mr-2'
          />
          <Button onClick={copyToClipboard}>Copy</Button>
        </div>
      </div>

      <div className='mb-4'>
        <Switch
          {...register("acceptMessages")}
          checked={acceptMessages}
          onCheckedChange={() => {
            setAcceptMessages((prev) => !prev);
            handleSwitchChange();
          }}
          disabled={isSwitchLoading}
        />
        <span>Accept Messages: {acceptMessages ? "On" : "Off"}</span>
      </div>
      <Separator />
      <Button
        className='mt-4'
        variant={"outline"}
        onClick={(e) => {
          e.preventDefault();
          fetchMessages(true);
        }}
      >
        {isLoading ? (
          <Loader2 className='h-4 w-4 animate-spin' />
        ) : (
          <RefreshCcw className='h-4 w-4' />
        )}
      </Button>

      <div className='mt-4 grid grid-cols-1 md:grid-cols-2'>
        {messages.length > 0 ? (
          messages.map((message: MessageProps, index) => (
            <MessageCard
              key={message.id}
              message={message}
              onMessageDelete={() => handleDeleteMessage(message.id)}
            />
          ))
        ) : (
          <p>No messages to display.</p>
        )}
      </div>
    </div>
  );
}
