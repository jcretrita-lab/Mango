import { Injectable } from '@nestjs/common';
import { PrismaCrudService } from '../../common/crud/prisma-crud.service';
import { PrismaService } from '../../core/prisma/prisma.service';

@Injectable()
export class EmployeesService extends PrismaCrudService<'employee'> {
  constructor(prisma: PrismaService) {
    super(prisma, {
      path: 'employees',
      model: 'employee',
      label: 'Employee',
      readRoles: ['Superadmin', 'Approver', 'Employee'],
      employeeReadScope: { field: 'id' },
      searchFields: [
        'firstName',
        'lastName',
        'displayName',
        'email',
        'employeeNumber',
      ],
      filterFields: [
        'status',
        'jobType',
        { query: 'department', field: 'orgUnitJson', jsonPath: ['department'] },
      ],
    });
  }

  // Example of domain-specific logic override
  async findActive() {
    return this.findAll({
      // Potentially add default filtering for active status if we had a status column
      // For now, we just demonstrate that this service can house custom logic
    });
  }

  /**
   * Domain-specific business logic can be added here,
   * such as auto-generating employee numbers or triggering
   * onboarding workflow creation on create().
   */
}
