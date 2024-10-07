"use client";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import MessageArray from "@/data/messages.json";
export default function Home() {
  return (
    <main className='flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12'>
      <section className='text-center mb-8 md:mb-12'>
        <h1 className='text-3xl md:text-5xl font-bold'>
          Dive into the World of Anonymous Conversation
        </h1>
        <p className='mt-3 md:mt-4 text-base md:text-lg'>
          Explore Mystery Message - Where your identity remains a secret.
        </p>
      </section>

      <Carousel
        plugins={[Autoplay({ delay: 2000 })]}
        className='w-full max-w-xs'
      >
        <CarouselContent>
          {MessageArray.map((message, index) => (
            <CarouselItem key={index}>
              <div className='p-1'>
                <Card>
                  <CardTitle className="px-4">{message.title}</CardTitle>
                  <CardContent className='flex aspect-square items-center justify-center p-6 text-xl font-semibold'>
                    {message.content}
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </main>
  );
}
