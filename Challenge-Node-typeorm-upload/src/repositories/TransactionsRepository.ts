import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;

  outcome: number;

  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactions = await this.find(); // buscando direto do banco de dados

    const { income, outcome } = transactions.reduce(
      (accumulator, transaction) => {
        switch (transaction.type) {
          case 'income':
            accumulator.income += Number(transaction.value); // adiciona o valor da transação atual

            break;

          case 'outcome':
            accumulator.outcome += Number(transaction.value); // subtrai o valor da transação atual

            break;

          default:
            break;
        }

        return accumulator;
      },

      {
        income: 0,

        outcome: 0,

        total: 0,
      },
    );

    const total = income - outcome;

    return { income, outcome, total };
  }
}

export default TransactionsRepository;
