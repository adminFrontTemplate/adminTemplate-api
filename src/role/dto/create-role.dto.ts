export type RolePermission = {
  type: 'add' | 'delete';
  code: number;
  id: number;
};

export class CreateRoleDto {
  name: string;
  permissions: RolePermission[];
}
