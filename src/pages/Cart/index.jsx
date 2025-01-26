import TextField from '@mui/material/TextField';
import { useEffect, useState, useRef } from 'react';
import Button from '@mui/material/Button';
// import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import api from '../../api/api';
import './style.css';
import { Paper, styled, Table, TableBody, TableCell, tableCellClasses, TableContainer, TableHead, TableRow } from '@mui/material';


function Cart() {
  const [carts, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const inputQuantityCart = useRef();
  const inputProduct = useRef();

  async function getCart() {
    try {
      const response = await api.get('v1/carts');
      const cartData = response.data.$values || response.data;
      console.log("Fetched carts:", cartData);
      setCart(cartData);
    } catch (error) {
      console.error("Error fetching carts:", error);
    }
  }

  async function getProducts() {
    try {
      const response = await api.get('v1/products');
      const productData = response.data.$values || response.data;
      console.log("Fetched products:", productData);
      setProducts(productData);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  }

  useEffect(() => {
    getCart();
    getProducts();
  }, []);


  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: '#1976d2',
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 16,
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));

  return (
    <div className='container'>
      <form action="" style={{ padding: '0px' }}>
        <TextField
          id="outlined-select-product"
          select
          label="Produto"
          defaultValue=""
          inputRef={inputProduct}
          size='small'
        >
          {products.map((product) => (
            <MenuItem key={product.id} value={product.id}>
              {product.name}
            </MenuItem>
          ))}
        </TextField>
        <TextField size='small' id="quantityCart" label="Quantidade" variant="outlined" inputRef={inputQuantityCart} />
        <Button style={{ width: "100px" }} variant="contained" color="success" type='button' onClick={editingCartId ? () => updateCart(editingCartId) : createCart}>
          {editingCartId ? "Atualizar" : "Adicionar"}
        </Button>
      </form>


      <TableContainer component={Paper} sx={{ width: 500, minWidth: 200 }}>
        <Table sx={{ minWidth: 200 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Produto</StyledTableCell>
              <StyledTableCell>Quantidade</StyledTableCell>
              <StyledTableCell align="left">Ações</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {carts.length > 0 ? (
              carts.map(cart => {
                const matchedProduct = products.find(product => product.id === cart.item?.productId);
                return (
                  <StyledTableRow key={cart.id}>
                    <StyledTableCell align="left">
                      {matchedProduct?.name || 'Produto não encontrado'}
                    </StyledTableCell>
                    <StyledTableCell>{cart.quantityCart}</StyledTableCell>
                    <StyledTableCell align="center">
                      <Button variant="contained" color="warning" onClick={() => editCart(cart)}>Editar</Button> &nbsp;
                      <Button variant="outlined" color="error" onClick={() => deleteCart(cart.id)}>Excluir</Button>
                    </StyledTableCell>
                  </StyledTableRow>
                );
              })
            ) : (
              <StyledTableRow>
                <StyledTableCell colSpan={3} align="center">Sem itens disponível</StyledTableCell>
              </StyledTableRow>
            )}

          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default Cart;