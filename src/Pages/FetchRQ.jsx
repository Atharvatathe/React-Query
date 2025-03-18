import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { deletePost, fetchPosts, updatePost } from "../API/api.jsx";
import { NavLink } from "react-router-dom";
import { useState } from "react";

export const FetchRQ = () => {
  const [pageNumber, setPageNumber] = useState(0);

  const queryClient = useQueryClient();

  // Fetch posts data function
  const getPostsData = async () => {
    try {
      const res = await fetchPosts(pageNumber);
      return res ? res : [];
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["posts", pageNumber], //work like dependncy array
    queryFn: getPostsData, // like
    // gcTime: 1000, // garbage collection time - cleare the data from cache after specific time and take data from server
    // staleTime: 10000, // stale time - Will not call api for specific time interval and will colec data from cache
    // refetchInterval: 1000, // polling - call API after specific interval
    // refetchIntervalInBackground: true, // It will continue polling even if you change the current Tab
    placeholderData: keepPreviousData, // this is used with pageinition to show previous data insted of loading when click on next
  });

  //! mutation function to delete the post
  const deleteMutation = useMutation({
    mutationFn: (id) => deletePost(id),
    onSuccess: (data, id) => {
      queryClient.setQueryData(["posts", pageNumber], (curElem) => {
        return curElem?.filter((post) => post.id !== id);
      });
    },
  });

  // Conditional rendering based on loading, error, and posts data
  if (isPending) return <p>Loading...</p>;
  if (isError) return <p>Error :{error.message || "Something went wrong!"}</p>;

  return (
    <div>
      <ul className="section-accordion">
        {data?.map((curElem) => {
          const { id, title, body } = curElem;
          return (
            <li key={id}>
              <NavLink to={`/rq/${id}`}>
                <p>{id}</p>
                <p>{title}</p>
                <p>{body}</p>
              </NavLink>
              <button onClick={() => deleteMutation.mutate(id)}>Delete</button>
            </li>
          );
        })}
      </ul>

      <div className="pagination-section container">
        <button
          disabled={pageNumber === 0 ? true : false}
          onClick={() => setPageNumber((prev) => prev - 3)}
        >
          Prev
        </button>
        <p>{pageNumber / 3 + 1}</p>
        <button onClick={() => setPageNumber((prev) => prev + 3)}>Next</button>
      </div>
    </div>
  );
};
