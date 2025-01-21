"use server";

import prisma from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function syncUser() {
  try {
    const { userId } = await auth();
    const user = await currentUser();
    if (!userId || !user) return;
    const exixstingUser = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
    });
    if (exixstingUser) return exixstingUser;

    const dbUser = await prisma.user.create({
      data: {
        clerkId: userId,
        name: `${user.firstName || ""} ${user.lastName || ""}`,
        username:
          user.username ?? user.emailAddresses[0].emailAddress.split("@")[0],
        email: user.emailAddresses[0].emailAddress,
        image: user.imageUrl,
      },
    });
    return dbUser;
  } catch (error) {
    console.log("Error in syncUser", error);
  }
}
export async function getUserByClerkId(clerkId: string) {
  return prisma.user.findUnique({
    where: {
      clerkId,
    },
    include: {
      _count: {
        select: {
          followers: true,
          following: true,
          posts: true,
        },
      },
    },
  });
}
export async function getDbUserId() {
  const { userId: clearkId } = await auth();
  if (!clearkId) return null;
  const user = await getUserByClerkId(clearkId);
  if (!user) throw new Error("User Not Found");
  return user.id;
}
export async function getRandomUser() {
  try {
    const userId = await getDbUserId();
    if (!userId) return [];
    // get 3 random users exlude ourselves& user we already follow
    const randomUsers = await prisma.user.findMany({
      where: {
        AND: [
          { NOT: { id: userId } },
          { NOT: { followers: { some: { followerId: userId } } } },
        ],
      },
      select: {
        id: true,
        name: true,
        username: true,
        image: true,
        _count: {
          select: {
            followers: true,
          },
        },
      },
      take: 3,
    });
    return randomUsers;
  } catch (error) {
    console.log("Error in fetching Users", error);
    return [];
  }
}
export async function toggleFollow(targetUserId: string) {
  try {
    const userId = await getDbUserId();
    if (!userId) return;
    if (userId === targetUserId) throw new Error("You can't follow yourself");

    const exixstingFollow = await prisma.follows.findUnique({
      where: {
        followerId_followingId: {
          followerId: userId,
          followingId: targetUserId,
        },
      },
    });
    if (exixstingFollow) {
      // unfollow
      await prisma.follows.delete({
        where: {
          followerId_followingId: {
            followerId: userId,
            followingId: targetUserId,
          },
        },
      });
    } else {
      // follow
      await prisma.follows.create({
        data: {
          followerId: userId,
          followingId: targetUserId,
        },
      });
      prisma.notification.create({
        data: {
          type: "FOLLOW",
          userId: targetUserId, //user being followed
          creatorId: userId, //user who is following
        },
      });
    }
    revalidatePath("/")
    return { success: true };
  } catch (error) {
    console.log("Error in toggleFollow", error);
    return { success: false, error: "Failed to toggle follow" };
  }
}