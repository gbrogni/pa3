import { Payment } from '@/domain/hotel/enterprise/entities/payment';

export abstract class PaymentsRepository {
    abstract create(payment: Payment): Promise<void>;
}