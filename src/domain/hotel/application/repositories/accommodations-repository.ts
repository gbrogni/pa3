import { Accommodation } from '@/domain/hotel/enterprise/entities/accommodation';

export abstract class AccommodationsRepository {
    abstract findAll({ page }: { page: number }): Promise<Accommodation[]>;
    abstract findBySlug(slug: string): Promise<Accommodation | null>;
}