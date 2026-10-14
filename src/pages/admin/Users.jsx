import React, { useEffect, useState } from 'react';
import { TableSkeleton } from '../../components/Skeletons';
import { supabase } from '../../lib/supabase';
import { Users as UsersIcon, Shield, User, ChevronDown, Package, Mail } from 'lucide-react';
import toast from 'react-hot-toast';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // For the dropdown
  const [expandedUser, setExpandedUser] = useState(null);
  const [userOrders, setUserOrders] = useState({});
  const [userEmails, setUserEmails] = useState({});
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      
      setUsers(data || []);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError(err.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };
  
  const toggleUser = async (userId) => {
    if (expandedUser === userId) {
      setExpandedUser(null);
      return;
    }
    
    setExpandedUser(userId);
    
    // Fetch user's orders if we haven't already
    if (!userOrders[userId]) {
      const { data: ordersData, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
        
      if (!error && ordersData) {
        setUserOrders(prev => ({ ...prev, [userId]: ordersData }));
        
        // Extract email from their latest order
        if (ordersData.length > 0 && ordersData[0].email) {
           setUserEmails(prev => ({ ...prev, [userId]: ordersData[0].email }));
        }
      }
    }
  };

  const deleteUser = (userToDelete, e) => {
    e.stopPropagation();
    if (userToDelete.role === 'admin') {
      toast.error('Admin accounts cannot be deleted');
      return;
    }
    setDeleteConfirmId(userToDelete.id);
  };

  const confirmDelete = async () => {
    if (!deleteConfirmId) return;

    const targetUser = users.find(u => u.id === deleteConfirmId);
    if (targetUser?.role === 'admin') {
      toast.error('Admin accounts cannot be deleted');
      setDeleteConfirmId(null);
      return;
    }
    
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', deleteConfirmId);
      
    if (error) {
      toast.error('Failed to delete user: ' + error.message);
    } else {
      setUsers(prev => prev.filter(u => u.id !== deleteConfirmId));
      if (expandedUser === deleteConfirmId) setExpandedUser(null);
      toast.success('User profile deleted');
    }
    setDeleteConfirmId(null);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6 md:mb-8 pb-4 border-b border-[#DCC6A8]">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-[#292923] tracking-tight">Manage Users</h2>
          <p className="text-xs md:text-sm text-[#829078] mt-1">View, inspect and manage user accounts</p>
        </div>
        <span className="text-xs md:text-sm font-bold bg-[#E9E9E0] text-[#344B38] px-3.5 py-1.5 rounded-xl border border-[#DCC6A8]">
          Total: {users.length}
        </span>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600">
          <p className="font-bold">Error:</p>
          <p>{error}</p>
        </div>
      )}

      {loading ? (
        <TableSkeleton rows={5} />
      ) : users.length === 0 ? (
        <div className="bg-white border border-[#DCC6A8] rounded-2xl p-12 text-center text-[#829078] shadow-sm">
          <UsersIcon size={44} className="mx-auto text-[#829078]/40 mb-3" />
          <p className="font-bold text-base text-[#292923]">No users found</p>
          <p className="text-sm mt-1">There are currently no customer or admin profiles registered.</p>
        </div>
      ) : (
        <>
          {/* ========================================================
              Mobile View (< md): Clean Responsive User Cards
              ======================================================== */}
          <div className="block md:hidden space-y-3.5">
            {users.map((user) => {
              const isAdmin = user.role === 'admin';
              const isExpanded = expandedUser === user.id;

              return (
                <div 
                  key={user.id} 
                  className={`bg-white border rounded-2xl p-4 shadow-sm transition-all duration-200 ${
                    isExpanded ? 'border-[#344B38] ring-1 ring-[#344B38]/20' : 'border-[#DCC6A8]'
                  }`}
                >
                  {/* Card Header */}
                  <div 
                    onClick={() => toggleUser(user.id)}
                    className="flex items-center justify-between gap-3 cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 shadow-2xs ${
                        isAdmin ? 'bg-purple-100 text-purple-800' : 'bg-[#E9E9E0] text-[#344B38]'
                      }`}>
                        {user.full_name ? user.full_name.charAt(0).toUpperCase() : <User size={18} />}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-[#292923] text-sm truncate">{user.full_name || 'Unnamed User'}</p>
                        <p className="text-[11px] text-[#829078] font-mono truncate">ID: #{String(user?.id || '').split('-')[0]}</p>
                      </div>
                    </div>

                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold shrink-0 ${
                      isAdmin 
                        ? 'bg-purple-100 text-purple-800 border border-purple-200' 
                        : 'bg-[#E9E9E0] text-[#292923] border border-[#DCC6A8]'
                    }`}>
                      {isAdmin ? <Shield size={12} /> : <User size={12} />}
                      {user.role ? user.role.toUpperCase() : 'CUSTOMER'}
                    </span>
                  </div>

                  {/* Card Footer Actions */}
                  <div className="mt-3 pt-3 border-t border-[#E9E9E0] flex items-center justify-between">
                    <span className="text-[11px] text-[#829078]">
                      Joined: <strong className="text-[#292923] font-semibold">{user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}</strong>
                    </span>

                    <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                      {isAdmin ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#829078] bg-[#E9E9E0] px-2.5 py-1 rounded-xl select-none">
                          <Shield size={12} className="text-[#344B38]" /> Protected
                        </span>
                      ) : (
                        <button 
                          onClick={(e) => deleteUser(user, e)}
                          className="text-xs font-bold text-rose-600 hover:text-white hover:bg-rose-600 transition-colors border border-rose-200 px-3 py-1 rounded-xl"
                        >
                          Delete
                        </button>
                      )}

                      <button
                        onClick={() => toggleUser(user.id)}
                        className="p-1 text-[#829078] hover:text-[#344B38] transition-colors"
                        aria-label="Toggle user details"
                      >
                        <div className={`transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : 'rotate-0'}`}>
                          <ChevronDown size={18} />
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Expanded User Details in Mobile Card */}
                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-[#E9E9E0] space-y-3.5 animate-in fade-in duration-200">
                      {/* User Info Box */}
                      <div className="bg-[#F8F6F1] p-3.5 rounded-xl border border-[#DCC6A8]/70 space-y-2.5">
                        <h4 className="text-xs font-bold text-[#344B38] flex items-center gap-1.5 uppercase tracking-wider">
                          <User size={13} /> Account Details
                        </h4>
                        <div>
                          <p className="text-[10px] text-[#829078] uppercase font-bold">Full UUID</p>
                          <p className="text-xs font-mono text-[#292923] break-all">{user.id}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-[#829078] uppercase font-bold">Email Address</p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <Mail size={13} className="text-[#829078] shrink-0" />
                            <p className="text-xs font-medium text-[#292923] break-all">{user.email || userEmails[user.id] || 'Email not saved in profile'}</p>
                          </div>
                        </div>
                        <div>
                          <p className="text-[10px] text-[#829078] uppercase font-bold">Order Volume</p>
                          <p className="text-xs font-bold text-[#292923]">{userOrders[user.id] ? userOrders[user.id].length : 0} Orders placed</p>
                        </div>
                      </div>

                      {/* Orders History Box */}
                      <div className="space-y-2">
                        <p className="text-xs font-bold text-[#292923] flex items-center gap-1.5">
                          <Package size={14} className="text-[#344B38]" /> Order History
                        </p>
                        {!userOrders[user.id] ? (
                          <p className="text-xs text-[#829078]">Loading orders...</p>
                        ) : userOrders[user.id].length === 0 ? (
                          <p className="text-xs text-[#829078] italic bg-[#F8F6F1] p-3 rounded-xl border border-[#DCC6A8]/50">This user hasn't placed any orders yet.</p>
                        ) : (
                          <div className="max-h-[180px] overflow-y-auto space-y-2 pr-1">
                            {userOrders[user.id].map(order => (
                              <div key={order.id} className="flex items-center justify-between p-2.5 bg-[#F8F6F1] border border-[#DCC6A8] rounded-xl text-xs">
                                <div>
                                  <p className="font-bold text-[#292923]">#{String(order?.id || '').split('-')[0].toUpperCase()}</p>
                                  <p className="text-[10px] text-[#829078]">{new Date(order.created_at).toLocaleDateString()}</p>
                                </div>
                                <div className="text-right">
                                  <p className="font-bold text-[#344B38]">₹{Number(order.total_amount || 0).toFixed(2)}</p>
                                  <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full ${
                                    order.order_status === 'delivered' ? 'bg-green-100 text-green-800' :
                                    order.order_status === 'shipped' ? 'bg-indigo-100 text-indigo-800' :
                                    order.order_status === 'cancelled' ? 'bg-rose-100 text-rose-800' :
                                    'bg-yellow-100 text-yellow-800'
                                  }`}>
                                    {order.order_status || 'pending'}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* ========================================================
              Desktop View (>= md): Full Data Table
              ======================================================== */}
          <div className="hidden md:block bg-white border border-[#DCC6A8] rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#E9E9E0]/40 border-b border-[#E9E9E0]">
                    <th className="p-4 text-xs font-bold text-[#292923]/60 uppercase tracking-wider whitespace-nowrap">User</th>
                    <th className="p-4 text-xs font-bold text-[#292923]/60 uppercase tracking-wider whitespace-nowrap">ID</th>
                    <th className="p-4 text-xs font-bold text-[#292923]/60 uppercase tracking-wider whitespace-nowrap">Joined</th>
                    <th className="p-4 text-xs font-bold text-[#292923]/60 uppercase tracking-wider whitespace-nowrap">Role</th>
                    <th className="p-4 text-xs font-bold text-[#292923]/60 uppercase tracking-wider text-right whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E9E9E0]">
                  {users.map((user) => {
                    const isAdmin = user.role === 'admin';
                    const isExpanded = expandedUser === user.id;

                    return (
                      <React.Fragment key={user.id}>
                        <tr 
                          onClick={() => toggleUser(user.id)}
                          className={`hover:bg-[#E9E9E0]/20 transition-colors cursor-pointer ${isExpanded ? 'bg-[#E9E9E0]/30' : ''}`}
                        >
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                                isAdmin ? 'bg-purple-100 text-purple-800' : 'bg-[#E9E9E0] text-[#344B38]'
                              }`}>
                                {user.full_name ? user.full_name.charAt(0).toUpperCase() : <User size={20} />}
                              </div>
                              <div>
                                <p className="font-bold text-[#292923]">{user.full_name || 'Unnamed User'}</p>
                                <p className="text-xs text-[#344B38] font-bold mt-0.5">Click to view details</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-sm text-[#829078] font-mono whitespace-nowrap">
                            #{String(user?.id || '').split('-')[0]}...
                          </td>
                          <td className="p-4 text-sm text-[#829078] whitespace-nowrap">
                            {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                          </td>
                          <td className="p-4 whitespace-nowrap">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                              isAdmin 
                                ? 'bg-purple-100 text-purple-800 border border-purple-200' 
                                : 'bg-[#E9E9E0] text-[#292923] border border-[#DCC6A8]'
                            }`}>
                              {isAdmin ? <Shield size={14} /> : <User size={14} />}
                              {user.role ? user.role.toUpperCase() : 'CUSTOMER'}
                            </span>
                          </td>
                          <td className="p-4 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-3" onClick={e => e.stopPropagation()}>
                              {isAdmin ? (
                                <span className="inline-flex items-center gap-1 text-xs font-bold text-[#829078] bg-[#E9E9E0] px-3 py-1.5 rounded-xl select-none">
                                  <Shield size={13} className="text-[#344B38]" /> Protected
                                </span>
                              ) : (
                                <button 
                                  onClick={(e) => deleteUser(user, e)}
                                  className="text-xs font-bold text-rose-600 hover:text-white hover:bg-rose-600 transition-colors border border-rose-200 px-3 py-1.5 rounded-xl whitespace-nowrap shadow-2xs"
                                >
                                  Delete
                                </button>
                              )}
                              <span className="text-[#829078]">
                                <div className={`transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : 'rotate-0'}`}>
                                  <ChevronDown size={20} />
                                </div>
                              </span>
                            </div>
                          </td>
                        </tr>
                        
                        {/* Expanded Row for Desktop User Details */}
                        <tr>
                          <td colSpan="5" className="p-0 border-b-0">
                            <div className={`grid transition-all duration-300 ease-in-out ${isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                              <div className="overflow-hidden">
                                <div className="bg-[#F8F6F1] p-6 shadow-inner border-b-2 border-[#344B38]/20">
                                  
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Profile Info */}
                                    <div className="bg-white p-5 rounded-2xl border border-[#DCC6A8] shadow-sm">
                                      <h4 className="text-sm font-bold text-[#292923] mb-4 border-b border-[#E9E9E0] pb-2 flex items-center gap-2">
                                        <User size={16} className="text-[#344B38]" /> User Information
                                      </h4>
                                      <div className="space-y-3">
                                        <div>
                                          <p className="text-xs text-[#829078] uppercase font-semibold">Full ID</p>
                                          <p className="text-sm font-mono text-[#292923] break-all">{user.id}</p>
                                        </div>
                                        <div>
                                          <p className="text-xs text-[#829078] uppercase font-semibold">Email Address</p>
                                          <div className="flex items-center gap-2 mt-0.5">
                                            <Mail size={14} className="text-[#829078]" />
                                            <p className="text-sm font-medium text-[#292923]">{user.email || userEmails[user.id] || 'Email not saved in profile'}</p>
                                          </div>
                                        </div>
                                        <div>
                                          <p className="text-xs text-[#829078] uppercase font-semibold">Total Orders Placed</p>
                                          <p className="text-sm font-bold text-[#292923]">{userOrders[user.id] ? userOrders[user.id].length : 0} Orders</p>
                                        </div>
                                      </div>
                                    </div>
                                  
                                    {/* Order History */}
                                    <div className="bg-white p-5 rounded-2xl border border-[#DCC6A8] shadow-sm">
                                      <h4 className="text-sm font-bold text-[#292923] mb-4 border-b border-[#E9E9E0] pb-2 flex items-center gap-2">
                                        <Package size={16} className="text-[#344B38]" /> Order History
                                      </h4>
                                      
                                      <div className="max-h-[200px] overflow-y-auto pr-2">
                                        {!userOrders[user.id] ? (
                                          <p className="text-sm text-[#829078]">Loading orders...</p>
                                        ) : userOrders[user.id].length === 0 ? (
                                          <p className="text-sm text-[#829078] italic">This user hasn't placed any orders yet.</p>
                                        ) : (
                                          <div className="flex flex-col gap-3">
                                            {userOrders[user.id].map(order => (
                                              <div key={order.id} className="flex items-center justify-between p-3 border border-[#DCC6A8] rounded-xl hover:bg-[#F8F6F1]">
                                                <div>
                                                  <p className="text-xs font-bold text-[#292923]">Order #{String(order?.id || '').split('-')[0].toUpperCase()}</p>
                                                  <p className="text-xs text-[#829078]">{new Date(order.created_at).toLocaleDateString()}</p>
                                                </div>
                                                <div className="text-right">
                                                  <p className="text-sm font-bold text-[#344B38]">₹{Number(order.total_amount || 0).toFixed(2)}</p>
                                                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                                                    order.order_status === 'delivered' ? 'bg-green-100 text-green-800' :
                                                    order.order_status === 'shipped' ? 'bg-indigo-100 text-indigo-800' :
                                                    order.order_status === 'cancelled' ? 'bg-rose-100 text-rose-800' :
                                                    'bg-yellow-100 text-yellow-800'
                                                  }`}>
                                                    {order.order_status || 'pending'}
                                                  </span>
                                                </div>
                                              </div>
                                            ))}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl max-w-[320px] md:max-w-sm w-full p-5 md:p-6 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-lg md:text-xl font-bold text-center text-gray-900 mb-2">Confirm Delete</h3>
            <p className="text-center text-gray-600 mb-3 text-sm font-medium">Are you sure you want to delete this customer's profile? This action cannot be undone.</p>
            <div className="p-2.5 mb-5 bg-[#F8F6F1] border border-[#DCC6A8] rounded-xl text-left">
              <p className="text-[11px] text-[#829078] font-semibold leading-relaxed">
                Note: Orders previously placed by this customer will remain in store history labeled with a <span className="font-bold text-rose-700">User Deleted</span> badge.
              </p>
            </div>
            <div className="flex gap-2.5 md:gap-3">
              <button 
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 bg-gray-100 text-gray-700 font-bold py-2 md:py-2.5 text-sm md:text-base rounded-xl hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                className="flex-1 bg-red-600 text-white font-bold py-2 md:py-2.5 text-sm md:text-base rounded-xl hover:bg-red-700 transition-colors shadow-sm"
              >
                Delete User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
