import React from "react";
import numeral from "numeral";

function CurrencyFormat({ amount }) {
  // Destructure the props properly
  // Handle cases where amount might be undefined, null, or not a number
  const numericAmount = parseFloat(amount);
  const formatedAmount = isNaN(numericAmount)
    ? "$0.00"
    : numeral(numericAmount).format("$0,0.00");

  return <>{formatedAmount}</>;
}

export default CurrencyFormat;
