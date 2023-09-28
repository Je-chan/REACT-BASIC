import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import Products from "./Products";
import Options from "./Options";
import ErrorBanner from "./ErrorBanner";
import { OrderContext } from "../context/OrderContext";

function Type({ orderType }) {
  const [items, setItems] = useState([]);
  const [error, setError] = useState(false);
  const [orderData, updateItemCount] = useContext(OrderContext);

  useEffect(() => {
    loadItems(orderType).then(console.log);
  }, [orderType]);

  const loadItems = async (orderType) => {
    try {
      const res = await axios.get(`http://localhost:4000/${orderType}`);
      setItems(res.data);
    } catch (err) {
      setError(true);
    }
  };

  const ItemComponent = orderType === "products" ? Products : Options;

  if (error) {
    return <ErrorBanner message={"에러가 발생했습니다."}></ErrorBanner>;
  }
  return (
    <div>
      <h2>주문 종류</h2>
      <p>하나의 가격</p>
      <p>총 가격: {orderData.totals[orderType]}</p>
      <div
        style={{
          display: "flex",
          flexDirection: orderType === "options" ? "column" : "row",
        }}
      >
        {items.map((item) => (
          <ItemComponent
            key={item.name}
            name={item.name}
            imagePath={item.imagePath}
            updateItemCount={(itemName, newItemCount) =>
              updateItemCount(itemName, newItemCount, orderType)
            }
          />
        ))}
      </div>
    </div>
  );
}

export default Type;
