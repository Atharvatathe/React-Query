import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { deletePost, fetchPosts, updatePost } from "../API/api.jsx";

export const FetchRQ = () => {
  // Fetch posts data function
  const getPostsData = async () => {
    try {
      const res = await fetchPosts(0);
      return res ? res : [];
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  const { data } = useQuery({
    queryKey: ["posts"], //work like dependncy array
    queryFn: getPostsData, // like useEffect
  });

  return (
    <div>
      <ul className="section-accordion">
        {data?.map((curElem) => {
          const { id, title, body } = curElem;
          return (
            <li key={id}>
              <p>{title}</p>
              <p>{body}</p>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
