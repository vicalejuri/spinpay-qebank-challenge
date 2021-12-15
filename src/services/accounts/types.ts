export interface UserAccountHandle {
  id: number;
  name: string;
  document: {
    type: 'CPF' | 'CNPJ';
    value: string;
  };
  phone: string;
}
