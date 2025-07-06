import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    balance: 0,
    loan: 0,
    loanPurpose: '',
    isLoading: false
};


const accountSlice = createSlice({
    name: 'account',
    initialState,
    reducers: {
        deposit(state, action) {
            state.balance += action.payload
        },
        withdraw(state, action) {
            state.balance -= action.payload;
        },
        requestLoan: {
            prepare(amount, purpose) {
                return {
                    payload: {
                        amount,
                        purpose
                    }
                };
            },

            reducer(state, action) {
                if (state.loan > 0) return;
                state.loan = action.payload.amount;
                state.loanPurpose = action.payload.purpose;
                state.balance += action.payload.amount;
            }
        },
        payLoan(state, action) {
            state.loanPurpose = "";
            state.balance -= state.loan;
            state.loan = 0;
        }
    }
});

export const { deposit, withdraw, requestLoan, payLoan } = accountSlice.actions;
export default accountSlice.reducer;
/* //OLD WAY
export default function accountReducer(state = initialState, action) {
   switch (action.type) {
       case 'account/deposit':
           return { ...state, balance: state.balance + action.payload, isLoading: false };
       case 'account/withdraw':
           return { ...state, balance: state.balance - action.payload };
       case 'account/requestLoan':
           if (state.loan > 0) return state;
           return { ...state, loan: action.payload.amount, loanPurpose: action.payload.purpose, balance: state.balance + action.payload.amount };
       case 'account/payLoan':
           return { ...state, loan: 0, loanPurpose: '', balance: state.balance - state.loan }
       case 'account/convertingCurrency':
           return { ...state, isLoading: true }
       default:
           return state;

   }
}

export const deposit = (amount, currency) => {
   if (currency === 'USD')
       return { type: 'account/deposit', payload: amount }

   return async function (dispatch, getState) {
       dispatch({ type: 'account/convertingCurrency' });
       //API CALL
       const res = await fetch(`https://api.frankfurter.dev/v1/latest?base=USD&symbols=${currency}`);
       const data = await res.json();

       const convertedAmount = (amount * data.rates[currency].toFixed(2))
       dispatch({ type: 'account/deposit', payload: convertedAmount });
   }
}
export const withdraw = (amount) => {
   return { type: 'account/withdraw', payload: amount }
}
export const requestLoan = (amount, purpose) => {
   return { type: 'account/requestLoan', payload: { amount: amount, purpose: purpose } }
}
export const payLoan = () => {
   return { type: 'account/payLoan' }
}
   */