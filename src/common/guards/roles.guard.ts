import {
	CanActivate,
	ExecutionContext,
	ForbiddenException,
	Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
	constructor(private reflector: Reflector) {}

	canActivate(context: ExecutionContext): boolean {
		const roles = this.reflector.get<string[]>(
			'roles',
			context.getHandler(),
		);
		if (!roles) return true;

		const request = context
			.switchToHttp()
			.getRequest<{ user: { role: string } }>();
		const { role } = request.user;

		if (!roles.includes(role)) {
			throw new ForbiddenException(
				'You do not have permission to access this resource',
			);
		}

		return true;
	}
}
