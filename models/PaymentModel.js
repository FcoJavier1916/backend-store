
// backend/models/Payment.js

function Payment({ token, email, phone, amount, description }) {
  this.token = token;
  this.email = email;
  this.phone = phone;
  this.amount = amount;
  this.description = description;

  this.isValid = function() {
    return (
      this.token &&
      this.email &&
      this.phone &&
      this.amount > 0 &&
      this.description
    );
  };
}

module.exports = Payment;
