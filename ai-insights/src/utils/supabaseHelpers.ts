import supabase from '../config/supabaseConfig';
import { v4 as uuidv4 } from 'uuid';

export const getAllCampaigns = async () => {
  return await supabase
    .from('campaign')
    .select()
    .order('created_at', { ascending: false });
};

export const getAllOffers = async (id) => {
  if (id) {
    return await supabase
      .from('offers')
      .select()
      .eq('campaign_id', id)
      .order('created_at', { ascending: false });
  }
  return await supabase
    .from('offers')
    .select()
    .order('created_at', { ascending: false });
};

export const createCampaign = async (
  id: string,
  name: string,
  start_date: string,
  end_date: string,
) => {
  return await supabase.from('campaign').insert({
    id,
    campaign_name: name,
    created_at: Date.now(),
    start_date,
    end_date,
  });
};

export const createOffer = async (offerDetails: any, offerId: string) => {
  if (offerId) {
    return await supabase.from('offers').update(offerDetails).eq('id', offerId);
  }
  return await supabase.from('offers').insert({
    id: uuidv4(),
    created_at: Date.now(),
    ...offerDetails,
  });
};

export const uploadImage = async (file: File) => {
  // Generate a unique file name
  const fileName = `${uuidv4()}_${file.name}`;

  // Upload the image to the Supabase storage bucket
  const { data, error } = await supabase.storage
    .from('offer') // Replace with your bucket name
    .upload(fileName, file);

  // Handle errors
  if (error) {
    console.error('Error uploading image:', error);
    return { error };
  }

  // Optionally, you can return the public URL of the uploaded image
  const publicUrl = supabase.storage.from('offer').getPublicUrl(fileName);

  return { data, publicUrl: publicUrl.data.publicUrl };
};

export const updateOfferStatus = async (offerId, isActive) => {
  return await supabase
    .from('offers')
    .update({ is_active: isActive })
    .eq('id', offerId);
};

export const creatAudience = async (name, description, config) => {
  return await supabase.from('audience').insert({
    id: uuidv4(),
    name,
    description,
    config,
  });
};

export const updateCampaign = async (id, details) => {
  return await supabase.from('campaign').update(details).eq('id', id);
};
