"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/lib/constants";
import { useAppSelector } from "@/lib/redux/hooks";
import type { User, ApiResponse } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Trash2, Search, CheckCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { showDeleteConfirm } from "@/lib/sweetalert";

export default function AdminUsersPage() {
  const router = useRouter();
  const currentUser = useAppSelector((state) => state.auth.user);
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (!currentUser || currentUser.role !== "admin") {
      router.push("/");
      return;
    }

    fetchUsers();
  }, [currentUser, router]);

  const fetchUsers = async () => {
    try {
      const response: ApiResponse<User[]> = await apiClient.get(
        API_ENDPOINTS.USERS.ALL,
        accessToken || undefined
      );
      setUsers(response.data);
      setFilteredUsers(response.data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(
        (user) =>
          user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchQuery, users]);

  const deleteUser = async (id: string) => {
    const confirmed = await showDeleteConfirm("this user");
    if (!confirmed) return;

    try {
      await apiClient.delete(
        API_ENDPOINTS.USERS.GET(id),
        accessToken || undefined
      );
      setUsers(users.filter((u) => u._id !== id));
    } catch (error) {
      console.error("Failed to delete user:", error);
      toast("Failed to delete user", "Please try again.", "error");
    }
  };

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500'></div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-linear-to-b from-white to-gray-50 py-8'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl'>
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-900 mb-2'>
            User Management
          </h1>
          <p className='text-gray-600'>
            Manage all registered users on the platform
          </p>
        </div>

        {/* Search */}
        <Card className='mb-6'>
          <CardContent className='pt-6'>
            <div className='relative'>
              <Search className='absolute left-3 top-3 h-4 w-4 text-gray-400' />
              <Input
                placeholder='Search by name or email...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='pl-10'
              />
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className='grid md:grid-cols-4 gap-4 mb-6'>
          <Card>
            <CardHeader className='pb-2'>
              <CardTitle className='text-sm text-gray-600'>
                Total Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{users.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='pb-2'>
              <CardTitle className='text-sm text-gray-600'>
                Premium Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {users.filter((u) => u.isPremium).length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='pb-2'>
              <CardTitle className='text-sm text-gray-600'>
                Verified Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {users.filter((u) => u.isVerified).length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='pb-2'>
              <CardTitle className='text-sm text-gray-600'>Admins</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {users.filter((u) => u.role === "admin").length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Users</CardTitle>
            <CardDescription>
              {filteredUsers.length} users found
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='overflow-x-auto'>
              <table className='w-full'>
                <thead>
                  <tr className='border-b'>
                    <th className='text-left py-3 px-4 font-semibold text-sm'>
                      Name
                    </th>
                    <th className='text-left py-3 px-4 font-semibold text-sm'>
                      Email
                    </th>
                    <th className='text-left py-3 px-4 font-semibold text-sm'>
                      Role
                    </th>
                    <th className='text-left py-3 px-4 font-semibold text-sm'>
                      Status
                    </th>
                    <th className='text-left py-3 px-4 font-semibold text-sm'>
                      Joined
                    </th>
                    <th className='text-left py-3 px-4 font-semibold text-sm'>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user._id} className='border-b hover:bg-gray-50'>
                      <td className='py-3 px-4'>
                        <div className='flex items-center gap-2'>
                          <div className='w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-bold'>
                            {user.fullName.charAt(0).toUpperCase()}
                          </div>
                          <span className='font-medium'>{user.fullName}</span>
                        </div>
                      </td>
                      <td className='py-3 px-4 text-sm text-gray-600'>
                        {user.email}
                      </td>
                      <td className='py-3 px-4'>
                        <Badge
                          variant={
                            user.role === "admin" ? "default" : "secondary"
                          }
                        >
                          {user.role}
                        </Badge>
                      </td>
                      <td className='py-3 px-4'>
                        <div className='flex gap-1'>
                          {user.isPremium && (
                            <Badge className='bg-yellow-500 text-white'>
                              Premium
                            </Badge>
                          )}
                          {user.isVerified && (
                            <Badge variant='outline'>
                              <CheckCircle className='w-3 h-3 mr-1' />
                              Verified
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className='py-3 px-4 text-sm text-gray-600'>
                        {new Date(user.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className='py-3 px-4'>
                        <div className='flex gap-2'>
                          <Button
                            size='sm'
                            variant='outline'
                            onClick={() => router.push(`/profile/${user._id}`)}
                          >
                            View
                          </Button>
                          {user._id !== currentUser?._id && (
                            <Button
                              size='sm'
                              variant='ghost'
                              onClick={() => deleteUser(user._id)}
                            >
                              <Trash2 className='w-4 h-4 text-red-500' />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
