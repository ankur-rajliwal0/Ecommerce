import React, { useEffect, useState } from 'react';
import { TableSkeleton } from '../../components/Skeletons';
import { supabase } from '../../lib/supabase';
import { Users as UsersIcon, Shield, User, ChevronDown, ChevronUp, Package, Mail } from 'lucide-react';
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

  const deleteUser = (userId, e) => {
    e.stopPropagation();
    setDeleteConfirmId(userId);
  };

  const confirmDelete = async () => {
    if (!deleteConfirmId) return;
    
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', deleteConfirmId);
      
    if (error) {
      toast.error('Failed to delete user: ' + error.message);
    } else {
      setUsers(users.filter(u => u.id !== deleteConfirmId));
      if (expandedUser === deleteConfirmId) setExpandedUser(null);
      toast.success('User profile deleted');
    }
    setDeleteConfirmId(null);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8 pb-4 border-b border-border-gray">
        <h2 className="text-2xl font-bold text-gray-900 font-bold">Manage Users</h2>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600">
          <p className="font-bold">Error:</p>
          <p>{error}</p>
        </div>
      )}

      {loading ? (
        <p className="text-gray-500">Loading users...</p>
      ) : (
        <div className="bg-white border border-border-gray rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-border-gray">
                  <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">User</th>
                  <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Joined</th>
                  <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-gray">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-gray-500">
                      <UsersIcon size={40} className="mx-auto text-gray-300 mb-2" />
                      No users found.
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <React.Fragment key={user.id}>
                      <tr 
                        onClick={() => toggleUser(user.id)}
                        className={`hover:bg-gray-50 transition-colors cursor-pointer ${expandedUser === user.id ? 'bg-blue-50/30' : ''}`}
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                              {user.full_name ? user.full_name.charAt(0).toUpperCase() : <User size={20} />}
                            </div>
                            <div>
                              <p className="font-bold text-gray-900">{user.full_name || 'Unnamed User'}</p>
                              <p className="text-xs text-gray-900 font-bold mt-0.5">View details</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-sm text-gray-500 font-mono">
                          {user.id.split('-')[0]}...
                        </td>
                        <td className="p-4 text-sm text-gray-600">
                          {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                            user.role === 'admin' 
                              ? 'bg-purple-100 text-purple-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {user.role === 'admin' ? <Shield size={14} /> : <User size={14} />}
                            {user.role ? user.role.toUpperCase() : 'CUSTOMER'}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-3" onClick={e => e.stopPropagation()}>
                            <button 
                              onClick={(e) => deleteUser(user.id, e)}
                              className="text-sm font-semibold text-red-600 hover:text-red-800 transition-colors border border-red-200 hover:border-red-600 hover:bg-red-50 px-3 py-1 rounded-xl"
                            >
                              Delete User
                            </button>
                            <span className="text-gray-400">
                              <div className={`transform transition-transform duration-300 ${expandedUser === user.id ? 'rotate-180' : 'rotate-0'}`}>
                                <ChevronDown size={20} />
                              </div>
                            </span>
                          </div>
                        </td>
                      </tr>
                      
                      {/* Expanded Row for User Details (Smooth Animation) */}
                      <tr>
                        <td colSpan="5" className="p-0 border-b-0">
                          <div className={`grid transition-all duration-300 ease-in-out ${expandedUser === user.id ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                            <div className="overflow-hidden">
                              <div className="bg-gray-50 p-6 shadow-inner border-b-2 border-primary-teal/20">
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                  {/* Profile Info */}
                                  <div className="bg-white p-5 rounded-xl border border-border-gray shadow-sm">
                                    <h4 className="text-sm font-bold text-gray-900 mb-4 border-b border-border-gray pb-2 flex items-center gap-2">
                                      <User size={16} className="text-gray-900 font-bold" /> User Information
                                    </h4>
                                    <div className="space-y-3">
                                      <div>
                                        <p className="text-xs text-gray-500 uppercase font-semibold">Full ID</p>
                                        <p className="text-sm font-mono text-gray-800 break-all">{user.id}</p>
                                      </div>
                                      <div>
                                        <p className="text-xs text-gray-500 uppercase font-semibold">Email Address</p>
                                        <div className="flex items-center gap-2 mt-0.5">
                                          <Mail size={14} className="text-gray-400" />
                                          <p className="text-sm font-medium text-gray-900">{user.email || userEmails[user.id] || 'Email not saved in profile'}</p>
                                        </div>
                                      </div>
                                      <div>
                                        <p className="text-xs text-gray-500 uppercase font-semibold">Total Orders Placed</p>
                                        <p className="text-sm font-bold text-gray-900">{userOrders[user.id] ? userOrders[user.id].length : 0} Orders</p>
                                      </div>
                                    </div>
                                  </div>
                                
                                {/* Order History */}
                                <div className="bg-white p-5 rounded-xl border border-border-gray shadow-sm">
                                  <h4 className="text-sm font-bold text-gray-900 mb-4 border-b border-border-gray pb-2 flex items-center gap-2">
                                    <Package size={16} className="text-gray-900 font-bold" /> Order History
                                  </h4>
                                  
                                  <div className="max-h-[200px] overflow-y-auto pr-2">
                                    {!userOrders[user.id] ? (
                                      <p className="text-sm text-gray-500">Loading orders...</p>
                                    ) : userOrders[user.id].length === 0 ? (
                                      <p className="text-sm text-gray-500 italic">This user hasn't placed any orders yet.</p>
                                    ) : (
                                      <div className="flex flex-col gap-3">
                                        {userOrders[user.id].map(order => (
                                          <div key={order.id} className="flex items-center justify-between p-3 border border-border-gray rounded-xl hover:bg-gray-50">
                                            <div>
                                              <p className="text-xs font-bold text-gray-900">Order #{order.id.split('-')[0]}</p>
                                              <p className="text-xs text-gray-500">{new Date(order.created_at).toLocaleDateString()}</p>
                                            </div>
                                            <div className="text-right">
                                              <p className="text-sm font-bold text-gray-900">₹{Number(order.total_amount).toFixed(2)}</p>
                                              <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${order.order_status === 'delivered' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
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
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl max-w-[300px] md:max-w-sm w-full p-5 md:p-6 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-lg md:text-xl font-bold text-center text-gray-900 mb-2">Confirm Delete</h3>
            <p className="text-center text-gray-600 mb-5 md:mb-6 text-sm font-medium">Are you sure you want to delete this user's profile? This action cannot be undone.</p>
            <div className="flex gap-2.5 md:gap-3">
              <button 
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 bg-gray-100 text-gray-700 font-bold py-2 md:py-2.5 text-sm md:text-base rounded-xl hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                className="flex-1 bg-red-600 text-white font-bold py-2 md:py-2.5 text-sm md:text-base rounded-xl hover:bg-red-700 transition-colors"
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
