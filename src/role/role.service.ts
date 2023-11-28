import { Injectable } from '@nestjs/common';
import { CreateRoleDto, RolePermission } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { GetRole } from 'src/type/role';
import { PrismaService } from './../prisma/prisma.service';
import { UserEntity } from 'src/users/entities/user.entity';

@Injectable()
export class RoleService {
  constructor(private prisma: PrismaService) {}
  async create(createRoleDto: CreateRoleDto) {
    try {
      const { name, permissions } = createRoleDto;

      const adminRolePermissions = permissions.map(
        (permission: RolePermission) => {
          return {
            permission: {
              connect: {
                code: permission.code,
              },
            },
          };
        },
      );

      const role = await this.prisma.role.create({
        data: {
          name,
          PermissionsOnRoles: {
            create: [...adminRolePermissions],
          },
          irreplaceable: false,
        },
      });

      return role;
    } catch (error) {
      return error;
    }
  }

  async findAll(params: GetRole, user: UserEntity) {
    const { keyword, offset, limit } = params;

    const { roleId } = user;

    const roleInfo = await this.prisma.role.findMany({
      where: {
        id: roleId,
      },
    });

    const isAdminUser = roleInfo?.length
      ? roleInfo[0]?.name === 'Administrator'
      : false;

    const param = roleId && !isAdminUser ? { id: roleId } : {};

    console.log(isAdminUser, param, roleInfo);

    const roles = await this.prisma.role.findMany({
      where: { name: { contains: keyword }, ...param },
      skip: offset,
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        PermissionsOnRoles: true,
      },
    });

    return roles;
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} role`;
  // }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    const { name, permissions } = updateRoleDto;

    const deletePermissions: number[] = [];
    const createPermissions = [];

    permissions.forEach((item: RolePermission) => {
      if (item.type === 'delete') {
        deletePermissions.push(item.code);
      } else {
        createPermissions.push({
          roleId: id,
          permissionId: item.id,
        });
      }
    });

    await this.prisma.role.update({
      where: { id },
      data: { name },
    });

    await this.prisma.permissionsOnRoles.deleteMany({
      where: {
        roleId: id,
        permissionId: {
          in: deletePermissions,
        },
      },
    });

    await this.prisma.permissionsOnRoles.createMany({
      data: createPermissions,
    });

    return this.prisma.role.findUnique({
      where: { id },
      include: { PermissionsOnRoles: { include: { permission: true } } },
    });
  }

  async remove(roleId: number) {
    // 删除关联的权限
    await this.prisma.permissionsOnRoles.deleteMany({
      where: { roleId },
    });

    // 删除角色
    await this.prisma.role.delete({
      where: { id: roleId },
    });
    return `删除成功`;
  }
}
