export type PaymentMethod = {
    id:string,
    name: string;
    type: string;
    code: string;
    account_name: string;
    account_number:string;
    image_url?:string|null;
};
  