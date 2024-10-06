'use client'
import { useParams } from "next/navigation";

const page = () => {
  const { username } = useParams();
  return <div>Message page{username}</div>;
};

export default page;
