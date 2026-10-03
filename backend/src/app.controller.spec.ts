
import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {

  @Get()
  getHello() {
    return {
      message: 'FitFlow Backend is running!',
    };
  }

  @Get('workouts')
  getWorkouts() {
    return [
      {
        id: 1,
        title: 'Full Body Workout',
        duration: 30,
        difficulty: 'Beginner',
      },
      {
        id: 2,
        title: 'Cardio Training',
        duration: 20,
        difficulty: 'Intermediate',
      },
      {
        id: 3,
        title: 'Strength Training',
        duration: 45,
        difficulty: 'Advanced',
      },
    ];
  }

}