"use client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { useParams } from "next/navigation";
import { useState } from "react";

const page = () => {
  const { username } = useParams();
  const [message, setMessage] = useState("");
  const { toast } = useToast();

  const sendMessages = async () => {
    try {
      const response = await axios.post(`/api/send-message`, {
        username,
        content: message,
      });
      toast({
        title: "Message sent successfully",
        description: "message sent",
      });
      setMessage("");
      console.log(response);
    } catch (err: any) {
      console.log(err);
      toast({
        title: "Error",
        description: err.response.data.message,
        variant: "destructive",
      });
    }
  };

  return (
    <section className='max-w-[1640px] mx-auto px-2'>
      <h1 className='text-center font-extrabold text-xl md:text-3xl mt-8'>
        Public Profile Link
      </h1>
      <div className='grid w-full gap-1.5 max-w-[500px] mx-auto mt-12'>
        <Label htmlFor='message-2'>
          Send messages anonymously to @{username}
        </Label>
        <Textarea
          placeholder='Type your message here.'
          id='message-2'
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <p className='text-sm text-muted-foreground'>
          Your message will be anonymous, Only you and receiver know about it.
        </p>
        <Button onClick={sendMessages}>Send Messages</Button>
      </div>
    </section>
  );
};

export default page;
