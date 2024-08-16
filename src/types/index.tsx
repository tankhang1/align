export type TZaloRecord = {
  zalo_device_id: string;
  followed_oa?: boolean;
  name: string;
  avatar: string;
  is_sensitive: boolean;
  zalo_app_id: string;
  access_token: string;
  code_get_phone: string;
};

export type TFormSubmit = {
  result1: string;
  result2: string;
  result3: string;
  result4: string;
  result5: string;
  result6: string;
  result7: string;
  result8: string;
  result9: string;
  zalo_device_id: string;
};
