import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  showEmpfunctions: boolean = false;
  loading = false

  constructor(private http: HttpClient) { }

  title = 'cs631dbms';
  E_id = ''

  panelOpenState = false

  getRandomInt() {
    return Math.floor(Math.random() * 999999999999999);
  }

  getDate() {
    let d = new Date(),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();
    return [year, month, day].join('/');
  }

  getTime() {
    let d = new Date()
    return [d.getHours(), d.getMinutes()].join(':');
  }

  // customer add
  Cust_id: any = ''
  cust_name = ''
  cust_ssn = ''
  cust_state = ''
  cust_city = ''
  cust_zip = ''
  cust_street = ''
  cust_apt = ''
  cust_Branch_id: any = ''
  Cust_E_id = ''
  userCreated = false
  userModified = false
  userRemoved = false
  userDeposited = false
  userWithdraw = false

  addCustomer() {
    if (parseInt(this.Trans_amount) < 500) {
      alert("Minimum amount should be 500$")
    } else {
      this.cust_Branch_id = localStorage.getItem('Branch_id')
      console.log(this.cust_Branch_id)
      this.Cust_id = this.getRandomInt()
      this.loading = true
      this.http.post<any>('https://cs631-bank-api.herokuapp.com/customer/newcustomer', {
        Cust_id: this.Cust_id,
        cust_name: this.cust_name, cust_ssn: this.cust_ssn, cust_state: this.cust_state, cust_city: this.cust_city, cust_zip: this.cust_zip, cust_street: this.cust_street, cust_apt: this.cust_apt, Branch_id: this.cust_Branch_id, Cust_E_id: this.E_id
      }).subscribe(data => {
        console.log(data)
        this.loading = false
        this.addAccount()
      })
    }
  }

  // Account
  Acc_no: any = ''
  Acc_last_access = ''
  acc_balance: any = ''
  acc_type = ''
  Acc_Cust_id = ''
  Acc_sav_interest = '4'
  Acc_mo_mar_interest = '4'
  Acc_chk_overdraft = ''
  Acc_chk_max_amt = '0'
  Acc_chk_min_amt = '0'
  Acc_loan_interest = '4'

  addAccount() {
    this.Acc_no = this.getRandomInt()
    this.Acc_last_access = this.getDate()
    this.acc_balance = '0'
    this.loading = true
    this.http.post<any>('https://cs631-bank-api.herokuapp.com/account/newaccount', { Acc_no: this.Acc_no, Acc_last_access: this.Acc_last_access, acc_balance: this.acc_balance, acc_type: this.acc_type, Acc_Cust_id: this.Cust_id, Acc_sav_interest: this.Acc_sav_interest, Acc_mo_mar_interest: this.Acc_mo_mar_interest, Acc_chk_overdraft: this.Acc_chk_overdraft, Acc_chk_max_amt: this.Acc_chk_max_amt, Acc_chk_min_amt: this.Acc_chk_min_amt, Acc_loan_interest: this.Acc_loan_interest }).subscribe(data => {
      console.log(data)
      this.loading = false
      this.userCreated = true
      this.addTransaction()
    })
  }

  // Transaction
  Trans_id: any = ''
  Trans_date = ''
  Trans_hour = ''
  Trans_amount = ''
  Trans_payment_mode = ''
  Trans_type = ''
  Trans_Cust_id = ''
  Trans_Acc_no = ''
  Trans_code = ''

  addTransaction() {
    this.Trans_id = this.getRandomInt()
    this.Trans_Cust_id = this.Cust_id
    this.Trans_Acc_no = this.Acc_no
    this.Trans_code = 'DP01'
    this.Trans_date = this.getDate()
    this.Trans_hour = this.getTime()
    this.Trans_payment_mode = 'cash'
    this.Trans_type = 'Deposit'
    this.loading = true
    this.http.post<any>('https://cs631-bank-api.herokuapp.com/acc_transaction/newacc_transaction', {
      Trans_id: this.Trans_id, Trans_date: this.Trans_date, Trans_hour: this.Trans_hour, Trans_amount: this.Trans_amount, Trans_payment_mode: this.Trans_payment_mode, Trans_type: this.Trans_type, Trans_Cust_id: this.Trans_Cust_id, Trans_Acc_no: this.Trans_Acc_no, Trans_code: this.Trans_code
    }).subscribe(data => {
      console.log(data)
      this.loading = false
      this.updateAccount()
    })
  }
  updateAccount() {
    this.Acc_no = this.Acc_no
    this.Acc_last_access = this.getDate()
    this.acc_balance = this.Trans_amount
    this.loading = true
    this.http.post<any>('https://cs631-bank-api.herokuapp.com/account/updateaccount', { Acc_no: this.Acc_no, acc_balance: this.acc_balance }).subscribe(data => {
      console.log(data)
      this.loading = false
    })
  }

  // customer delete
  del_Cust_id = ''
  del_Branch_id = ''

  deleteCustomer() {
    this.loading = true
    this.http.post<any>('https://cs631-bank-api.herokuapp.com/customer/delcustomer', { Cust_id: this.del_Cust_id }).subscribe(data => {
      console.log(data)
      this.loading = false
      this.userRemoved = true
    })
  }

  // customer modify
  mod_Cust_id = ''
  mod_Cust_ssn = ''

  modifyCustomer() {
    this.loading = true
    this.http.post<any>('https://cs631-bank-api.herokuapp.com/customer/updatecustomer', { Cust_id: this.mod_Cust_id, cust_ssn: this.mod_Cust_ssn }).subscribe(data => {
      console.log(data)
      this.loading = false
      this.userModified = true
    })
  }

  // Passbook
  trans_Cust_id = ''
  cust_passbook: any = []
  cust_cur_balance: any = 0
  ck_bal_acc_no: any = ''

  checkbal() {
    this.Acc_no = this.ck_bal_acc_no
    // this.Acc_last_access = '12/07/2021'
    this.acc_balance = ''
    this.loading = true
    this.http.post<any>('https://cs631-bank-api.herokuapp.com/account/findaccount', { Acc_no: this.Acc_no }).subscribe(data => {
      console.log(data)
      this.loading = false
      this.cust_cur_balance = data.result.acc_balance
      this.cust_cur_balance = 0
      // this.cust_passbook[0].bal = this.cust_cur_balance
      for (let i = 0; i < this.cust_passbook.length; i++) {
        if (this.cust_passbook[i].Trans_type == 'Deposit')
          this.cust_passbook[i].bal = parseInt(this.cust_cur_balance) + parseInt(this.cust_passbook[i].Trans_amount)
        else
          this.cust_passbook[i].bal = parseInt(this.cust_cur_balance) - parseInt(this.cust_passbook[i].Trans_amount)
        this.cust_cur_balance = this.cust_passbook[i].bal
      }
      console.log(this.cust_passbook)
    })
  }

  printPassbook() {
    this.loading = true
    this.http.post<any>('https://cs631-bank-api.herokuapp.com/acc_transaction/findacc_transaction_for_cust', {
      Trans_Cust_id: this.trans_Cust_id
    }).subscribe(data => {
      this.loading = false
      console.log(data.result)
      this.cust_passbook = data.result
      // this.cust_cur_balance = this.cust_passbook[0].Trans_amount
      this.ck_bal_acc_no = this.cust_passbook[0].Trans_Acc_no

      this.checkbal()
    })
  }

  // make Deposit
  dep_acc_no: any = ''
  dep_amount = ''
  dep_Trans_payment_mode = 'cash'
  dep_Trans_cheque_acc: any = ''
  dep_cust_id: any = ''
  dep_Trans_cheque_cust: any = ''

  makeDeposit() {
    this.Trans_id = this.getRandomInt()
    this.Trans_Cust_id = this.dep_cust_id
    this.Trans_Acc_no = this.dep_acc_no
    this.Trans_code = (this.dep_Trans_payment_mode == 'cash') ? 'DP01' : 'DP02'
    this.Trans_date = this.getDate()
    this.Trans_hour = this.getTime()
    this.Trans_payment_mode = this.dep_Trans_payment_mode
    this.Trans_amount = this.dep_amount
    this.Trans_type = 'Deposit'
    this.loading = true
    this.http.post<any>('https://cs631-bank-api.herokuapp.com/acc_transaction/newacc_transaction', {
      Trans_id: this.Trans_id, Trans_date: this.Trans_date, Trans_hour: this.Trans_hour, Trans_amount: this.Trans_amount, Trans_payment_mode: this.Trans_payment_mode, Trans_type: this.Trans_type, Trans_Cust_id: this.Trans_Cust_id, Trans_Acc_no: this.Trans_Acc_no, Trans_code: this.Trans_code
    }).subscribe(data => {
      console.log(data)
      this.loading = false
      // this.updateAccount()
      this.Acc_no = this.Trans_Acc_no
      // this.Acc_last_access = '12/07/2021'
      this.acc_balance = ''
      this.loading = true
      this.http.post<any>('https://cs631-bank-api.herokuapp.com/account/findaccount', { Acc_no: this.Acc_no }).subscribe(data => {
        console.log(data)
        this.loading = false
        this.cust_cur_balance = data.result.acc_balance
        this.Acc_last_access = this.getDate()
        this.acc_balance = parseInt(this.cust_cur_balance) + parseInt(this.Trans_amount) * (this.Trans_type == "Deposit" ? 1 : -1)
        this.loading = true
        this.http.post<any>('https://cs631-bank-api.herokuapp.com/account/updateaccount', { Acc_no: this.Acc_no, acc_balance: this.acc_balance }).subscribe(data => {
          console.log(data)
          this.loading = false
          this.userDeposited = true
          if (this.dep_Trans_payment_mode != 'cash') {
            // Checque withdrawal
            this.Trans_id = this.getRandomInt()
            this.Trans_Cust_id = this.dep_Trans_cheque_cust
            this.Trans_Acc_no = this.dep_Trans_cheque_acc
            this.Trans_code = 'WD03'
            this.Trans_date = this.getDate()
            this.Trans_hour = this.getTime()
            this.Trans_payment_mode = this.dep_Trans_payment_mode
            this.Trans_amount = this.dep_amount
            this.Trans_type = 'Withdrawal'
            this.loading = true
            this.http.post<any>('https://cs631-bank-api.herokuapp.com/acc_transaction/newacc_transaction', {
              Trans_id: this.Trans_id, Trans_date: this.Trans_date, Trans_hour: this.Trans_hour, Trans_amount: this.Trans_amount, Trans_payment_mode: this.Trans_payment_mode, Trans_type: this.Trans_type, Trans_Cust_id: this.Trans_Cust_id, Trans_Acc_no: this.Trans_Acc_no, Trans_code: this.Trans_code
            }).subscribe(data => {
              console.log(data)
              this.loading = false
              // this.updateAccount()
              this.Acc_no = this.Trans_Acc_no
              // this.Acc_last_access = '12/07/2021'
              this.acc_balance = ''
              this.loading = true
              this.http.post<any>('https://cs631-bank-api.herokuapp.com/account/findaccount', { Acc_no: this.Acc_no }).subscribe(data => {
                console.log(data)
                this.loading = false
                this.cust_cur_balance = data.result.acc_balance
                this.Acc_last_access = this.getDate()
                this.acc_balance = parseInt(this.cust_cur_balance) + parseInt(this.Trans_amount) * (this.Trans_type == "Deposit" ? 1 : -1)
                this.loading = true
                this.http.post<any>('https://cs631-bank-api.herokuapp.com/account/updateaccount', { Acc_no: this.Acc_no, acc_balance: this.acc_balance }).subscribe(data => {
                  console.log(data)
                  this.loading = false
                })
              })
            })
          }


        })
      })
    })

  }


  //withdrawal
  wt_acc_no: any = ''
  wt_amount: any = ''
  wt_Trans_payment_mode = 'cash'
  wt_cust_id: any = ''

  makeWithdrawl() {
    this.Trans_id = this.getRandomInt()
    this.Trans_Cust_id = this.wt_cust_id
    this.Trans_Acc_no = this.wt_acc_no
    this.Trans_code = 'WD01'
    this.Trans_date = this.getDate()
    this.Trans_hour = this.getTime()
    this.Trans_payment_mode = this.wt_Trans_payment_mode
    this.Trans_amount = this.wt_amount
    this.Trans_type = 'Withdrawal'
    this.loading = true
    this.http.post<any>('https://cs631-bank-api.herokuapp.com/acc_transaction/newacc_transaction', {
      Trans_id: this.Trans_id, Trans_date: this.Trans_date, Trans_hour: this.Trans_hour, Trans_amount: this.Trans_amount, Trans_payment_mode: this.Trans_payment_mode, Trans_type: this.Trans_type, Trans_Cust_id: this.Trans_Cust_id, Trans_Acc_no: this.Trans_Acc_no, Trans_code: this.Trans_code
    }).subscribe(data => {
      console.log(data)
      this.loading = false
      // this.updateAccount()
      this.Acc_no = this.Trans_Acc_no
      // this.Acc_last_access = '12/07/2021'
      this.acc_balance = ''
      this.loading = true
      this.http.post<any>('https://cs631-bank-api.herokuapp.com/account/findaccount', { Acc_no: this.Acc_no }).subscribe(data => {
        console.log(data)
        this.loading = false
        this.cust_cur_balance = data.result.acc_balance
        this.Acc_last_access = this.getDate()
        this.acc_balance = parseInt(this.cust_cur_balance) + parseInt(this.Trans_amount) * (this.Trans_type == "Deposit" ? 1 : -1)
        this.loading = true
        this.http.post<any>('https://cs631-bank-api.herokuapp.com/account/updateaccount', { Acc_no: this.Acc_no, acc_balance: this.acc_balance }).subscribe(data => {
          console.log(data)
          this.loading = false
          this.userWithdraw = true
        })
      })
    })

  }

  check_id() {
    this.loading = true
    this.http.post<any>('https://cs631-bank-api.herokuapp.com/employee/findemployee', { E_id: this.E_id }).subscribe(data => {
      this.loading = false
      console.log(data.result.Branch_id)
      localStorage.setItem('Branch_id', data.result.Branch_id)
      this.showEmpfunctions = true
    })
  }

  addServiceCharges() {
    this.loading = true
    this.http.get<any>('https://cs631-bank-api.herokuapp.com/account/all').subscribe(data => {
      this.loading = false
      console.log(data)
      // this.showEmpfunctions = true
      for (let i = 0; i < data.length; i++) {
        let cust=data[i]
        this.Trans_id = this.getRandomInt()
        this.Trans_Cust_id = cust.Acc_Cust_id
        this.Trans_Acc_no = cust.Acc_no
        this.Trans_code = 'SV01'
        this.Trans_date = this.getDate()
        this.Trans_hour = this.getTime()
        this.Trans_payment_mode = 'cash'
        this.Trans_amount = '10'
        this.Trans_type = 'Service Charge'
        this.loading = true
        this.http.post<any>('https://cs631-bank-api.herokuapp.com/acc_transaction/newacc_transaction', {
          Trans_id: this.Trans_id, Trans_date: this.Trans_date, Trans_hour: this.Trans_hour, Trans_amount: this.Trans_amount, Trans_payment_mode: this.Trans_payment_mode, Trans_type: this.Trans_type, Trans_Cust_id: this.Trans_Cust_id, Trans_Acc_no: this.Trans_Acc_no, Trans_code: this.Trans_code
        }).subscribe(data => {
          console.log(data)
          this.loading = false
          // this.updateAccount()
          this.Acc_no = this.Trans_Acc_no
          // this.Acc_last_access = '12/07/2021'
          this.acc_balance = ''
          this.loading = true
          this.http.post<any>('https://cs631-bank-api.herokuapp.com/account/findaccount', { Acc_no: this.Acc_no }).subscribe(data => {
            console.log(data)
            this.loading = false
            this.cust_cur_balance = data.result.acc_balance
            this.Acc_last_access = this.getDate()
            this.acc_balance = parseInt(this.cust_cur_balance) + parseInt(this.Trans_amount) * (this.Trans_type == "Deposit" ? 1 : -1)
            this.loading = true
            this.http.post<any>('https://cs631-bank-api.herokuapp.com/account/updateaccount', { Acc_no: this.Acc_no, acc_balance: this.acc_balance }).subscribe(data => {
              console.log(data)
              this.loading = false
              this.userWithdraw = true
            })
          })
        })

      }
    })

  }
}
