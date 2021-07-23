import React from "react";
import {
  MdDelete,
  MdAddCircleOutline,
  MdRemoveCircleOutline,
} from "react-icons/md";

import { Container, ProductTable, Total } from "./styles";

const Cart = (): JSX.Element => {

  return (
    <Container>
      <ProductTable>
        <thead>
          <tr>
            <th aria-label="product image" />
            <th>PRODUTO</th>
            <th>QTD</th>
            <th>SUBTOTAL</th>
            <th aria-label="delete icon" />
          </tr>
        </thead>
        <tbody>
            <tr >
              <td>
                <img src={"https://rocketseat-cdn.s3-sa-east-1.amazonaws.com/modulo-redux/tenis1.jpg"} alt={"teste"} />
              </td>
              <td>
                <strong>teste</strong>
                <span>R$200,00</span>
              </td>
              <td>
                <div>
                  <button
                    type="button"
                    disabled={false}
                    onClick={() => console.log('diminui um')}
                  >
                    <MdRemoveCircleOutline size={20} />
                  </button>
                  <input
                    type="text"
                    readOnly
                    value={200}
                  />
                  <button
                    type="button"
                    onClick={() => console.log('adicionei')}
                  >
                    <MdAddCircleOutline size={20} />
                  </button>
                </div>
              </td>
              <td>
                <strong>valor: 200,00</strong>
              </td>
              <td>
                <button
                  type="button"
                  onClick={() => console.log('Entrei aqui')}
                >
                  <MdDelete size={20} />
                </button>
              </td>
            </tr>
        </tbody>
      </ProductTable>

      <footer>
        <button type="button">Finalizar pedido</button>

        <Total>
          <span>TOTAL</span>
          <strong>200</strong>
        </Total>
      </footer>
    </Container>
  );
};

export default Cart;
