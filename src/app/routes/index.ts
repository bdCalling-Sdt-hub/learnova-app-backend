import express from 'express';
import { UserRoutes } from '../modules/user/user.routes';
import { AuthRoutes } from '../modules/auth/auth.routes';
import { LessonRoutes } from '../modules/lesson/lesson.routes';
import { ShortRoutes } from '../modules/short/short.routes';
import { SubjectRoutes } from '../modules/subject/subject.routes';
import { FollowingRoutes } from '../modules/following/following.routes';
import { LikeRoutes } from '../modules/like/like.routes';
import { QuizRoutes } from '../modules/quiz/quiz.routes';
import { CourseRoutes } from '../modules/course/course.routes';
import { TopicRoutes } from '../modules/topic/topic.routes';
import { EnrollRoutes } from '../modules/enroll/enroll.routes';
import { ProgressRoutes } from '../modules/progress/progress.routes';
import { PackageRoutes } from '../modules/package/package.routes';
import { SubscriptionRoutes } from '../modules/subscription/subscription.routes';
import { FaqRoutes } from '../modules/faq/faq.route';
import { RuleRoutes } from '../modules/rule/rule.route';
import { ViewRoutes } from '../modules/view/view.routes';
import { StudentRoutes } from '../modules/student/student.routes';
import { AdminRoutes } from '../modules/admin/admin.routes';
import { NotificationRoutes } from '../modules/notification/notification.routes';
const router = express.Router();

const apiRoutes = [
    { path: "/user", route: UserRoutes },
    { path: "/auth", route: AuthRoutes },
    { path: "/lesson", route: LessonRoutes },
    { path: "/short", route: ShortRoutes },
    { path: "/subject", route: SubjectRoutes },
    { path: "/following", route: FollowingRoutes },
    { path: "/like", route: LikeRoutes },
    { path: "/quiz", route: QuizRoutes },
    { path: "/course", route: CourseRoutes },
    { path: "/topic", route: TopicRoutes },
    { path: "/enroll", route: EnrollRoutes },
    { path: "/progress", route: ProgressRoutes },
    { path: "/package", route: PackageRoutes },
    { path: "/subscription", route: SubscriptionRoutes },
    { path: "/faq", route: FaqRoutes },
    { path: "/rule", route: RuleRoutes  },
    { path: "/view", route: ViewRoutes  },
    { path: "/student", route: StudentRoutes  },
    { path: "/admin", route: AdminRoutes  },
    { path: "/notification", route: NotificationRoutes  },
]

apiRoutes.forEach(route => router.use(route.path, route.route));
export default router;