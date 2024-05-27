import { Either, left, right } from '@/core/either';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Payment } from '@/domain/hotel/enterprise/entities/payment';
import { Injectable } from '@nestjs/common';
import { PaymentsRepository } from '../repositories/payments-repository';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { ReservationStatus } from '../../enterprise/entities/reservation';
import { ReservationsRepository } from '../repositories/reservations-repository';

interface MakePaymentUseCaseRequest {
    amount: number;
    paymentDate: Date;
    reservationId: string;
    paymentMethod: string;
    cardNumber: string;
    cardName: string;
    expiryDate: Date;
    cvc: string;
}

type MakePaymentUseCaseResponse = Either<ResourceNotFoundError, boolean>;

@Injectable()
export class MakePaymentUseCase {

    constructor(
        private paymentsRepository: PaymentsRepository,
        private reservationsRepository: ReservationsRepository
    ) { }

    async execute({
        amount,
        paymentDate,
        reservationId,
        paymentMethod,
        cardNumber,
        cardName,
        expiryDate,
        cvc,
    }: MakePaymentUseCaseRequest): Promise<MakePaymentUseCaseResponse> {

        const payment = Payment.create({
            amount,
            paymentDate,
            reservationId: new UniqueEntityID(reservationId),
            paymentMethod: Payment.getPaymentMethod(paymentMethod),
            cardNumber,
            cardName,
            expiryDate,
            cvc
        });

        const reservation = await this.reservationsRepository.findById(reservationId);

        if (!reservation) {
            return left(new ResourceNotFoundError());
        }

        await this.reservationsRepository.updateStatus(reservationId, ReservationStatus.CONFIRMED);
        await this.paymentsRepository.create(payment);

        return right(true);
    }

}