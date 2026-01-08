export const addDecilamals = (num: number) => {
  return (Math.round(num * 100) / 100).toFixed(2);
};

export const updateCart = (
  state = {
    cartItems: [],
    itemsPrice: "0",
    shippingPrice: "0",
    taxPrice: "0",
    totalPrice: "0",
  }
) => {
  // Calculate items price
  state.itemsPrice = addDecilamals(
    state.cartItems.reduce(
      (acc: number, item: any) => acc + item.price * item.qty,
      0
    )
  );

  // Calculate shipping price (If order is over $100, free shipping, else $10 shipping)
  state.shippingPrice = addDecilamals(Number(state.itemsPrice) > 100 ? 0 : 10);

  // Calculate tax price (15% tax)
  state.taxPrice = addDecilamals(
    Number((0.15 * Number(state.itemsPrice)).toFixed(2))
  );

  // Calculate total price
  state.totalPrice = (
    Number(state.itemsPrice) +
    Number(state.shippingPrice) +
    Number(state.taxPrice)
  ).toFixed(2);

  localStorage.setItem("cart", JSON.stringify(state));

  return state;
};
