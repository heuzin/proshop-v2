export const addDecilamals = (num: number) => {
  return (Math.round(num * 100) / 100).toFixed(2);
};

export const updateCart = (
  state = {
    cartItems: [],
    itemsprice: "0",
    shippingprice: "0",
    taxprice: "0",
    totalprice: "0",
  }
) => {
  // Calculate items price
  state.itemsprice = addDecilamals(
    state.cartItems.reduce(
      (acc: number, item: any) => acc + item.price * item.qty,
      0
    )
  );

  // Calculate shipping price (If order is over $100, free shipping, else $10 shipping)
  state.shippingprice = addDecilamals(Number(state.itemsprice) > 100 ? 0 : 10);

  // Calculate tax price (15% tax)
  state.taxprice = addDecilamals(
    Number((0.15 * Number(state.itemsprice)).toFixed(2))
  );

  // Calculate total price
  state.totalprice = (
    Number(state.itemsprice) +
    Number(state.shippingprice) +
    Number(state.taxprice)
  ).toFixed(2);

  localStorage.setItem("cart", JSON.stringify(state));

  return state;
};
