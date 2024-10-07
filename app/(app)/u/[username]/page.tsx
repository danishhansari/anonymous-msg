"use client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { useParams } from "next/navigation";
import { useState } from "react";

const page = () => {
  const { username } = useParams();
  const [message, setMessage] = useState("Hi there");

  const sendMessages = async () => {
    const response = await axios.post(`/api/send-message`, {
      username,
      content: message,
    });
    console.log(response);
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
        <Textarea placeholder='Type your message here.' id='message-2' />
        <p className='text-sm text-muted-foreground'>
          Your message will be anonymous, Only you and receiver know about it.
        </p>
        <Button onClick={sendMessages}>Send Messages</Button>
      </div>
    </section>
  );
};

export default page;
