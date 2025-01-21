import { getPosts } from "@/actions/post.action";
import { getDbUserId } from "@/actions/user.action";
import CreatePost from "@/components/CreatePost";
import PostCard from "@/components/PostCard";
import WhoToFollow from "@/components/WhoToFollow";
import { currentUser } from "@clerk/nextjs/server";

export default async function Home() {
  const user = await currentUser();
  const posts = await getPosts();
  const dbUserId = await getDbUserId();

  return (
    <div className="grid grid-cols-1 md:grid-cols-10 gap-6">
      <div className="md:col-span-6">
        {user ? <CreatePost></CreatePost> : null}
        <div className="space-y-6">
          {}
          {posts.map((post) => (
            <PostCard key={post.id} post={post} dbUserId={dbUserId}></PostCard>
          ))}
        </div>
      </div>
      <div className="hidden md:block md:col-span-4 sticky top-20">
        <WhoToFollow></WhoToFollow>
      </div>
    </div>
  );
}
