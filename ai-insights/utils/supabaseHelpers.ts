import supabase from '../src/config/supabaseConfig';

export const createUser = async (id: string, userDetails: IUser) => {
  return await supabase.from('user').insert({
    ...userDetails,
    is_paid_user: false,
    registration_date: new Date().toISOString(),
    id,
  });
};

export const getUser = async (id: string) => {
  return await supabase.from('user').select().eq('id', id);
};

export const updateUser = async (id: string, fields: any) => {
  return await supabase.from('user').update(fields).eq('id', id);
};

export const getAllCampaigns = async () => {
  return await supabase.from('campaign').select();
};

export const getAllAudiences = async () => {
  return await supabase.from('audience').select();
};
