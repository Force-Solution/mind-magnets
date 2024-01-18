import { Request, Response, Router } from 'express';

import { AppRoute } from '@src/appRouting';
import * as ErrorBoundary from '@src/helper/ErrorHandling';

export class TeacherController implements AppRoute {
  public route = '/teacher';
  public router: Router = Router();

  constructor() {
    this.router.get('/getMarks', this.getMarks);
    this.router.get('/getStudents', this.getStudents);
    this.router.get('/attendance', this.getAttendance);
  }

  private async getStudents(
    request: Request,
    response: Response,
  ): Promise<any> {
    try {
      return response.send('getTeachers');
    } catch (error) {
      ErrorBoundary.catchError(request, response, error);
    }
  }
  private async getMarks(request: Request, response: Response): Promise<any> {
    try {
      return response.send('getMarks');
    } catch (error) {
      ErrorBoundary.catchError(request, response, error);
    }
  }
  private async getAttendance(
    request: Request,
    response: Response,
  ): Promise<any> {
    try {
      return response.send('getAttendance');
    } catch (error) {
      ErrorBoundary.catchError(request, response, error);
    }
  }
}
