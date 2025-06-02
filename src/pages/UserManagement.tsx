import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Navigate } from 'react-router-dom';
import { AdminHeader } from '@/components/AdminHeader';
import { InviteUserDialog } from '@/components/InviteUserDialog';
import { DeleteUserDialog } from '@/components/DeleteUserDialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, RotateCcw, Mail, Clock, X } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useAdminProfile } from '@/hooks/useAdminProfile';

export default function UserManagement() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();
  const { profile, profileLoading, isAdmin } = useAdminProfile();

  // Fetch all users with their profiles
  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ['users', searchQuery],
    queryFn: async () => {
      let query = supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      // Apply search filter
      if (searchQuery.trim()) {
        query = query.or(`first_name.ilike.%${searchQuery}%,last_name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%`);
      }

      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching users:', error);
        return [];
      }
      return data || [];
    },
    enabled: isAdmin,
  });

  // Fetch pending invitations
  const { data: pendingInvitations, isLoading: invitationsLoading, refetch: refetchInvitations } = useQuery({
    queryKey: ['pending-invitations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('invitations')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching pending invitations:', error);
        return [];
      }
      return data || [];
    },
    enabled: isAdmin,
  });

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-[#E5D3BC] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  // Redirect non-admin users
  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  const handlePasswordReset = async (userId: string, email: string) => {
    try {
      const userName = users?.find(user => user.id === userId);
      const fullName = userName?.first_name && userName?.last_name 
        ? `${userName.first_name} ${userName.last_name}`
        : 'User';

      const { data, error } = await supabase.functions.invoke('reset-password', {
        body: { 
          userId, 
          userEmail: email, 
          userName: fullName 
        }
      });

      if (error) {
        throw error;
      }

      if (!data.success) {
        throw new Error(data.error || 'Failed to reset password');
      }

      toast({
        title: "Password Reset Successfully",
        description: `Password reset email sent to ${email}. The user will receive a temporary password and must change it on their next login.`,
      });

    } catch (error: any) {
      console.error('Error resetting password:', error);
      toast({
        title: "Password Reset Failed",
        description: error.message || 'Please try again.',
        variant: "destructive",
      });
    }
  };

  const handleCancelInvitation = async (invitationId: string, email: string) => {
    try {
      const { error } = await supabase
        .from('invitations')
        .delete()
        .eq('id', invitationId);

      if (error) {
        throw error;
      }

      toast({
        title: "Invitation Cancelled",
        description: `Invitation for ${email} has been cancelled.`,
      });

      refetchInvitations();
    } catch (error: any) {
      console.error('Error cancelling invitation:', error);
      toast({
        title: "Failed to Cancel Invitation",
        description: error.message || 'Please try again.',
        variant: "destructive",
      });
    }
  };

  const handleResendInvitation = async (invitationId: string, email: string) => {
    try {
      // Get the invitation details
      const { data: invitation, error: fetchError } = await supabase
        .from('invitations')
        .select('*')
        .eq('id', invitationId)
        .single();

      if (fetchError || !invitation) {
        throw new Error('Failed to fetch invitation details');
      }

      // Call the invite-user function to resend
      const { error } = await supabase.functions.invoke('invite-user', {
        body: {
          email: invitation.email,
          role: invitation.role,
          firstName: invitation.first_name,
          lastName: invitation.last_name
        }
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Invitation Resent",
        description: `A new invitation has been sent to ${email}.`,
      });

      refetchInvitations();
    } catch (error: any) {
      console.error('Error resending invitation:', error);
      toast({
        title: "Failed to Resend Invitation",
        description: error.message || 'Please try again.',
        variant: "destructive",
      });
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin':
        return 'destructive';
      case 'user':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const isInvitationExpired = (expiresAt: string) => {
    return new Date(expiresAt) < new Date();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <AdminHeader profile={profile} />

      {/* Main Content */}
      <main className="px-6 lg:px-12 pb-12 pt-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">User Management</h2>
                <p className="text-slate-600">Manage user accounts, roles, and invitations</p>
              </div>
              <InviteUserDialog />
            </div>
            
            {/* Search Input */}
            <div className="relative max-w-md mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                type="text"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="pl-10 bg-white border-slate-200 focus:border-slate-400 focus:ring-slate-400"
              />
            </div>

            {/* Pending Invitations Section */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Pending Invitations
                </CardTitle>
                <CardDescription>
                  {pendingInvitations?.length || 0} pending invitation(s)
                </CardDescription>
              </CardHeader>
              <CardContent>
                {invitationsLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
                  </div>
                ) : pendingInvitations && pendingInvitations.length > 0 ? (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Email</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Invited</TableHead>
                          <TableHead>Expires</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pendingInvitations.map((invitation) => (
                          <TableRow key={invitation.id}>
                            <TableCell className="font-medium">
                              {invitation.email}
                            </TableCell>
                            <TableCell>
                              {invitation.first_name && invitation.last_name 
                                ? `${invitation.first_name} ${invitation.last_name}`
                                : 'Not provided'
                              }
                            </TableCell>
                            <TableCell>
                              <Badge variant={getRoleBadgeVariant(invitation.role)}>
                                {invitation.role}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-slate-600">
                              {formatDate(invitation.created_at)}
                            </TableCell>
                            <TableCell className="text-slate-600">
                              {formatDate(invitation.expires_at)}
                            </TableCell>
                            <TableCell>
                              {isInvitationExpired(invitation.expires_at) ? (
                                <Badge variant="destructive">
                                  <Clock className="h-3 w-3 mr-1" />
                                  Expired
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="text-orange-600 border-orange-200">
                                  <Clock className="h-3 w-3 mr-1" />
                                  Pending
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex gap-2 justify-end">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleResendInvitation(invitation.id, invitation.email)}
                                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                >
                                  <Mail className="h-4 w-4 mr-1" />
                                  Resend
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleCancelInvitation(invitation.id, invitation.email)}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  <X className="h-4 w-4 mr-1" />
                                  Cancel
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Mail className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-600">No pending invitations</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Users Table */}
            <Card>
              <CardHeader>
                <CardTitle>All Users</CardTitle>
                <CardDescription>
                  {users?.length || 0} total users
                </CardDescription>
              </CardHeader>
              <CardContent>
                {usersLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
                  </div>
                ) : users && users.length > 0 ? (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Created</TableHead>
                          <TableHead>Last Updated</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {users.map((userItem) => (
                          <TableRow key={userItem.id}>
                            <TableCell className="font-medium">
                              {userItem.first_name && userItem.last_name 
                                ? `${userItem.first_name} ${userItem.last_name}`
                                : 'No name provided'
                              }
                            </TableCell>
                            <TableCell>{userItem.email}</TableCell>
                            <TableCell>
                              <Badge variant={getRoleBadgeVariant(userItem.role)}>
                                {userItem.role}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-slate-600">
                              {formatDate(userItem.created_at)}
                            </TableCell>
                            <TableCell className="text-slate-600">
                              {formatDate(userItem.updated_at)}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex gap-2 justify-end">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handlePasswordReset(userItem.id, userItem.email)}
                                  className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                                >
                                  <RotateCcw className="h-4 w-4 mr-1" />
                                  Reset Password
                                </Button>
                                {userItem.id !== user?.id && (
                                  <DeleteUserDialog
                                    userId={userItem.id}
                                    userName={userItem.first_name && userItem.last_name 
                                      ? `${userItem.first_name} ${userItem.last_name}`
                                      : 'No name provided'
                                    }
                                    userEmail={userItem.email}
                                  />
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-slate-600">No users found</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
