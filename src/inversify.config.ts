import "reflect-metadata";
import { Container } from 'inversify';
import { BatchRepo } from '@src/dao/repository/BatchRepo';
import { ClassRepo } from '@src/dao/repository/ClassRepo';
import { DepartmentRepo } from '@src/dao/repository/DepartmentRepo';
import { MarksRepo } from '@src/dao/repository/MarksRepo';
import { NotificationRepo } from '@src/dao/repository/NotificationRepo';
import { PaymentRepo } from '@src/dao/repository/PaymentRepo';
import { PostRepo } from '@src/dao/repository/PostRepo';
import { StudentRepo } from '@src/dao/repository/StudentRepo';
import { TeacherRepo } from '@src/dao/repository/TeacherRepo';
import { TestRepo } from '@src/dao/repository/TestRepo';
import { TokenRepo } from '@src/dao/repository/TokenRepo';
import { UserRepo } from '@src/dao/repository/UserRepo';
import { AdminService } from '@src/services/admin';
import { BatchService } from '@src/services/batch';
import { ClassService } from '@src/services/class';
import { DepartmentService } from '@src/services/department';
import { NotificationService } from '@src/services/notifications';
import { PaymentService } from '@src/services/payment';
import { PostService } from '@src/services/post';
import { StudentService } from '@src/services/student';
import { TeacherService } from '@src/services/teacher';
import { TestService } from '@src/services/test';
import { TokenService } from '@src/services/token';
import { UserService } from '@src/services/user';
import { TYPES } from '@src/types/types';

const container = new Container();

container.bind<BatchRepo>(TYPES.BatchRepo).to(BatchRepo);
container.bind<ClassRepo>(TYPES.ClassRepo).to(ClassRepo);
container.bind<DepartmentRepo>(TYPES.DepartmentRepo).to(DepartmentRepo);
container.bind<MarksRepo>(TYPES.MarksRepo).to(MarksRepo);
container.bind<NotificationRepo>(TYPES.NotificationRepo).to(NotificationRepo);
container.bind<PaymentRepo>(TYPES.PaymentRepo).to(PaymentRepo);
container.bind<PostRepo>(TYPES.PostRepo).to(PostRepo);
container.bind<StudentRepo>(TYPES.StudentRepo).to(StudentRepo);
container.bind<TeacherRepo>(TYPES.TeacherRepo).to(TeacherRepo);
container.bind<TestRepo>(TYPES.TestRepo).to(TestRepo);
container.bind<TokenRepo>(TYPES.TokenRepo).to(TokenRepo);
container.bind<UserRepo>(TYPES.UserRepo).to(UserRepo);

container.bind<AdminService>(TYPES.AdminService).to(AdminService)
container.bind<BatchService>(TYPES.BatchService).to(BatchService);
container.bind<ClassService>(TYPES.ClassService).to(ClassService);
container.bind<DepartmentService>(TYPES.DepartmentService).to(DepartmentService);
container.bind<NotificationService>(TYPES.NotificationService).to(NotificationService);
container.bind<PostService>(TYPES.PostService).to(PostService);
container.bind<PaymentService>(TYPES.PaymentService).to(PaymentService);
container.bind<StudentService>(TYPES.StudentService).to(StudentService);
container.bind<TokenService>(TYPES.TokenService).to(TokenService);
container.bind<TeacherService>(TYPES.TeacherService).to(TeacherService);
container.bind<TestService>(TYPES.TestService).to(TestService);
container.bind<UserService>(TYPES.UserService).to(UserService);

export { container };
