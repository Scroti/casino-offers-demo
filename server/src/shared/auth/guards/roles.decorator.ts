import { SetMetadata } from '@nestjs/common';
import { Role } from '../data-access/enums/role.enum';
import { ROLES_KEY } from './roles.guard';

export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);


