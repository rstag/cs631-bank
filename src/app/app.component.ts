import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  showEmpfunctions: boolean=false;

  constructor(private http: HttpClient) { }

  title = 'cs631dbms';
  E_id = ''

  panelOpenState = false

  getRandomInt() {
    return Math.floor(Math.random() * 999999999999999);
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

  addCustomer() {
    this.cust_Branch_id = localStorage.getItem('Branch_id')
    console.log(this.cust_Branch_id)
    this.Cust_id = this.getRandomInt()
    this.http.post<any>('http://localhost:3000/customer/newcustomer', {
      Cust_id: this.Cust_id,
      cust_name: this.cust_name, cust_ssn: this.cust_ssn, cust_state: this.cust_state, cust_city: this.cust_city, cust_zip: this.cust_zip, cust_street: this.cust_street, cust_apt: this.cust_apt, Branch_id: this.cust_Branch_id, Cust_E_id: this.E_id
    }).subscribe(data => {
      console.log(data)
      this.addAccount()
    })
  }

  // Account
  Acc_no: any = ''
  Acc_last_access = ''
  acc_balance = ''
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
    this.Acc_last_access = '12/07/2021'
    this.acc_balance = '0'
    this.http.post<any>('http://localhost:3000/account/newaccount', { Acc_no: this.Acc_no, Acc_last_access: this.Acc_last_access, acc_balance: this.acc_balance, acc_type: this.acc_type, Acc_Cust_id: this.Cust_id, Acc_sav_interest: this.Acc_sav_interest, Acc_mo_mar_interest: this.Acc_mo_mar_interest, Acc_chk_overdraft: this.Acc_chk_overdraft, Acc_chk_max_amt: this.Acc_chk_max_amt, Acc_chk_min_amt: this.Acc_chk_min_amt, Acc_loan_interest: this.Acc_loan_interest }).subscribe(data => {
      console.log(data)
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
    this.Trans_date = '12/07/2021'
    this.Trans_hour = '12:33 PM'
    this.Trans_payment_mode = 'cash'
    this.Trans_type = 'Deposit'
    this.http.post<any>('http://localhost:3000/acc_transaction/newacc_transaction', {
      Trans_id: this.Trans_id, Trans_date: this.Trans_date, Trans_hour: this.Trans_hour, Trans_amount: this.Trans_amount, Trans_payment_mode: this.Trans_payment_mode, Trans_type: this.Trans_type, Trans_Cust_id: this.Trans_Cust_id, Trans_Acc_no: this.Trans_Acc_no, Trans_code: this.Trans_code
    }).subscribe(data => {
      console.log(data)
      this.updateAccount()
    })
  }
  updateAccount() {
    this.Acc_no = this.Acc_no
    this.Acc_last_access = '12/07/2021'
    this.acc_balance = this.Trans_amount
    this.http.post<any>('http://localhost:3000/account/updateaccount', { Acc_no: this.Acc_no, acc_balance: this.acc_balance }).subscribe(data => {
      console.log(data)
    })
  }

  // customer delete
  del_Cust_id = ''
  del_Branch_id = ''

  deleteCustomer() {
    this.http.post<any>('http://localhost:3000/customer/delcustomer', { Cust_id: this.mod_Cust_id }).subscribe(data => {
      console.log(data)
    })
  }

  // customer modify
  mod_Cust_id = ''
  mod_Cust_ssn = ''

  modifyCustomer() {
    this.http.post<any>('http://localhost:3000/customer/updatecustomer', { Cust_id: this.mod_Cust_id, cust_ssn: this.mod_Cust_ssn }).subscribe(data => {
      console.log(data)
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
    this.http.post<any>('http://localhost:3000/account/findaccount', { Acc_no: this.Acc_no }).subscribe(data => {
      console.log(data)
      this.cust_cur_balance = data.result.acc_balance
      this.cust_cur_balance=0
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
    this.http.post<any>('http://localhost:3000/acc_transaction/findacc_transaction_for_cust', {
      Trans_Cust_id: this.trans_Cust_id
    }).subscribe(data => {
      console.log(data.result)
      this.cust_passbook = data.result
      // this.cust_cur_balance = this.cust_passbook[0].Trans_amount
      this.ck_bal_acc_no = this.cust_passbook[0].Trans_Acc_no

      this.checkbal()
    })
  }

  check_id() {
    this.http.post<any>('http://localhost:3000/employee/findemployee', { E_id: this.E_id }).subscribe(data => {
      console.log(data.result.Branch_id)
      localStorage.setItem('Branch_id', data.result.Branch_id)
      this.showEmpfunctions=true
    })
  }
}
