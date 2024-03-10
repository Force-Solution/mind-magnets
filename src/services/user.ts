import {
  AuthFailureError,
  BadTokenError,
  NotFoundError,
} from '@src/core/API_Handler/ApiError';

import { IRole } from '@src/types/roles';
import { tokenType } from '@src/types/token';
import { IUser, IUserDoc } from '@src/types/user';

import { UserRepo } from '@src/dao/repository/UserRepo';
import { PaymentTypes } from '@src/types/payment';
import { PaymentService } from '@src/services/payment';
import { TokenService } from '@src/services/token';
import { StudentService } from '@src/services/student';
import { TestService } from '@src/services/test';
import { TeacherService } from '@src/services/teacher';

export class UserService{
  user: UserRepo;
  payment: PaymentService;
  token: TokenService;
  student: StudentService;
  test: TestService;
  teacher: TeacherService;

  constructor(){
    this.user = new UserRepo();
    this.payment = new PaymentService();
    this.token = new TokenService();
    this.student = new StudentService();
    this.test = new TestService();
    this.teacher = new TeacherService();
  }

  public async loginWithEmailAndPassword(
    email: string,
    password: string,
  ):Promise<IUserDoc>{
    const user = await this.user.getUserByEmail(email);
    if (!user || !(await user.isPasswordMatch(password))) {
      throw new AuthFailureError('Incorrect email or password');
    }
    return user;
  };
  
  public async  logout(refreshToken: string): Promise<void>{
    const refreshTokenDoc = await this.token.verifyToken({
      token: refreshToken,
      type: tokenType.REFRESH,
      blacklisted: false,
    });
  
    if (!refreshTokenDoc) throw new NotFoundError();
  
    await this.token.deleteToken(refreshTokenDoc);
  };
  
  public async refreshAuth(refreshToken: string): Promise<IUserDoc>{
    try {
      const refreshTokenDoc = await this.token.verifyToken({
        token: refreshToken,
        type: tokenType.REFRESH,
        blacklisted: false,
      });
      if (!refreshTokenDoc) throw new NotFoundError();
  
      const user = await this.user.getUserById(refreshTokenDoc.user);
      if (!user)  throw new AuthFailureError('Invalid token');
      
      await this.token.deleteToken(refreshTokenDoc);
  
      return user;
    } catch (error) {
       throw new AuthFailureError('Invalid token');
    }
  };

  public async createUser(user: IUser): Promise<IUserDoc>{
    return await this.user.createUser(user);
  };
  
  public async getDashboardKPIData(
    userId: number | string,
    role: string | string[] | undefined,
  ){
    if (typeof role !== 'string') throw new BadTokenError();
  
    if (role === IRole.Admin) {
      const teachers =  await this.user.countUserByRole(IRole.Teacher);
      const students =  await this.user.countUserByRole(IRole.Student);
      const pendingDueByInstallments =  await this.payment.getPaymentPendingCountByType(PaymentTypes.Installments);
  
      return {teacherCount: teachers, studentCount: students, pendingDueByInstallments};
    } else if (role === IRole.Teacher) {
      const user =  await this.getUserByUserId(userId);
      if(!user) return
  
      const teacher = await this.teacher.getTeacherFromUserId(user._id);
      const countAllTests = await this.test.countAllTestsByTeacher(teacher?.id);
      const averageStudentsPerformance = await this.test.getAveragePerformanceByTeacher(teacher?.id);
  
      return {totalClasses: teacher?.classes.length, totalTest: countAllTests, averageStudentsPerformance}
  
    } else if (role === IRole.Parent) {
    } else if (role === IRole.Student) {
      const totalClasses = await this.student.countTotalClass(userId);
      console.log(totalClasses);
    } else {
      throw new BadTokenError();
    }
  };
  
  public async  addPasswordToUser(email: string, password: string, tokenStr: string): Promise<IUserDoc | null>{
    const tokenDoc = await this.token.verifyTokenByType(tokenStr, tokenType.VERIFY_EMAIL);
    const user = await this.user.getUserByEmail(email);
  
    if(!tokenDoc || !user ||  tokenDoc.user.toString() !== user._id.toString()) throw new BadTokenError();
    
    user.password = password;
    user.isEmailVerified = true;
  
    return await this.user.updateUserPassword(user);
  }
  
  public async getUserByUserId(userId: number | string): Promise<IUserDoc | null>{
    return await this.user.getUserByUserId(userId);
  }

}