import { SetMetadata } from '@nestjs/common';

export const PUBLIC_ROUTE_KEY = 'IS_PUBLIC_ROUTE';
export const Public = () => SetMetadata(PUBLIC_ROUTE_KEY, true);
