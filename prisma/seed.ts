import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { permissions } from './permisssion/meunPromission';

// initialize the Prisma Client
const prisma = new PrismaClient();

const ordinaryUserList = [10000, 10001];

interface Permission {
  connect: {
    code: number;
  };
}

interface AdminRole {
  permission: Permission;
}

async function main() {
  const password = await bcrypt.hash(
    'test123456',
    +process.env.ROUNDSOFHASHING,
  );

  // role
  const adminRolePermissions: AdminRole[] = [];
  const OrdinaryUserPermissions = ordinaryUserList.map((permission) => {
    return {
      permission: {
        connect: {
          code: permission,
        },
      },
    };
  });
  for (const permission of permissions) {
    adminRolePermissions.push({
      permission: {
        connect: {
          code: permission.code,
        },
      },
    });

    await prisma.permission.upsert({
      where: { code: permission.code },
      update: {
        code: permission.code,
        parentCode: permission.parentCode,
        name: permission.name,
      },
      create: {
        code: permission.code,
        parentCode: permission.parentCode,
        name: permission.name,
      },
    });
  }

  const roleAdmin = await prisma.role.upsert({
    where: { name: 'Administrator' },
    update: {
      name: 'Administrator',
    },
    create: {
      name: 'Administrator',
      irreplaceable: true,
      PermissionsOnRoles: {
        create: [...adminRolePermissions],
      },
    },
  });

  const roleOrdinaryAdmin = await prisma.role.upsert({
    where: { name: 'OrdinaryUser' },
    update: {
      name: 'OrdinaryUser',
    },
    create: {
      name: 'OrdinaryUser',
      irreplaceable: true,
      PermissionsOnRoles: {
        create: [...OrdinaryUserPermissions],
      },
    },
  });

  // user

  const userAdmin = await prisma.user.upsert({
    where: { email: 'kris.admin@test.com' },
    update: {
      password: password,
      roleId: roleAdmin.id,
      phone: '13888888888',
    },
    create: {
      email: 'kris.admin@test.com',
      name: 'kris',
      password,
      phone: '13888888888',
      irreplaceable: true,
      roleId: roleAdmin.id,
    },
  });

  console.log(roleAdmin, userAdmin, roleOrdinaryAdmin);
}

// execute the main function
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // close the Prisma Client at the end
    await prisma.$disconnect();
  });
