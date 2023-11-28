export type GetRole = {
  keyword: string;
  offset: number;
  limit: number;
};

interface Permission {
  connect: {
    code: number;
  };
}

export interface AdminRole {
  permission: Permission;
}
