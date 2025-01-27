import TextField from '@mui/material/TextField';
import { useEffect, useState, useRef } from 'react';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import api from '../../api/api';
import '../../assets/css/global.css';
import { Box, Paper, styled, Table, TableBody, TableCell, tableCellClasses, TableContainer, TableHead, TablePagination, TableRow } from '@mui/material';


function Cart() {
  const [carts, setCart] = useState([]);
  const [items, setItems] = useState([]);
  const [editingCartId, setEditingCartId] = useState(null);
  const inputQuantityCart = useRef();
  const inputProduct = useRef();

  const [filterText, setFilterText] = useState('');
  const [page, setPage] = useState(0);  // Current page index
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleFilterChange = (e) => {
    setFilterText(e.target.value);
    setPage(0)
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredCarts = carts.filter(cart => {
    return cart.productName && cart.productName.toLowerCase().includes(filterText.toLowerCase())
  })

  async function getCart() {
    try {
      const response = await api.get('v1/carts');
      const cartData = response.data.$values || response.data;
      setCart(cartData);
    } catch (error) {
      console.error("Error fetching carts:", error);
    }
  }

  async function getItem() {
    try {
      const item = await api.get('v1/items');
      setItems(item.data.$values);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  }

  async function createCart() {

    const quantityCart = inputQuantityCart.current.value;
    const ItemId = inputProduct.current.value;

    if (quantityCart === "" || ItemId === "") {
      alert("Campo vazio, por favor preencha todos os campos");
      return;
    }

    try {
      await api.post('v1/carts', { quantityCart, ItemId });
      inputQuantityCart.current.value = "";
      inputProduct.current.value = "";
      getCart();
    } catch (error) {
      console.error("Error creating item:", error);
    }
  }

  async function updateCart(id) {
    try {
      const quantityCart = inputQuantityCart.current.value;
      const ItemId = inputProduct.current.value;
      if (quantityCart === "" || ItemId === "") {
        alert("Campo vazio, por favor preencha todos os campos");
        return;
      }
      await api.put(`v1/carts/${id}`, { quantityCart, ItemId });
      inputQuantityCart.current.value = "";
      inputProduct.current.value = "";
      setEditingCartId(null);
      getCart();
    } catch (error) {
      console.error("Error updating item:", error);
    }
  }

  function editCart(cart) {
    console.log(cart);
    inputQuantityCart.current.value = cart.quantityCart;
    inputProduct.current.value = cart.productId;
    // const selectElement = document.getElementById('outlined-select-product');
    // selectElement.textContent = cart.productName;
    setEditingCartId(cart.id);
  }

  async function deleteCart(id) {
    try {
      await api.delete(`v1/carts/${id}`);
      getCart();
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  }

  useEffect(() => {
    getCart();
    getItem();
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

  return (
    <div className='container'>
      <form action="" style={{ padding: '0px' }}>
        <label htmlFor="outlined-select-product">Produto</label>
        <TextField
          id="outlined-select-product"
          select
          defaultValue=""
          inputRef={inputProduct}
          size='small'
          placeholder='Produto'
          label=""
        >
          {items.map((item) => (
            <MenuItem key={item.id} value={item.id}>
              {item.productName}
            </MenuItem>
          ))}
        </TextField>

        <TextField placeholder='Quantidade' size='small' id="quantityCart" variant="outlined" inputRef={inputQuantityCart} />
        <Button style={{ width: "100px" }} variant="contained" color="success" type='button' onClick={editingCartId ? () => updateCart(editingCartId) : createCart}>
          {editingCartId ? "Atualizar" : "Adicionar"}
        </Button>
      </form>


      <TableContainer component={Paper} sx={{ width: 500, minWidth: 200 }}>
      <Box style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
        <TextField
          width='40%'
          label="Pesquisar"
          id="search"
          variant="outlined"
          value={filterText}
          onChange={handleFilterChange}
        >
            </TextField>
                </Box>
        <Table sx={{ minWidth: 200 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Produto</StyledTableCell>
              <StyledTableCell>Quantidade</StyledTableCell>
              <StyledTableCell align="left">Ações</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {
              filteredCarts !== null ? filteredCarts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((cart) => (
                <TableRow
                  key={cart.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell align="left">{cart.productName}</TableCell>
                  <TableCell>{cart.quantityCart}</TableCell>
                  <TableCell align="center">
                    <Button variant="contained" color="warning" onClick={() => editCart(cart)}>Editar</Button> &nbsp;
                    <Button variant="outlined" color="error" onClick={() => deleteCart(cart.id)}>Excluir</Button>
                  </TableCell>
                  </TableRow>
                    )) : (<TableRow><TableCell>Loading... </TableCell></TableRow>)}
            </TableBody>
        </Table>
        <TablePagination sx={{ fontSize: '1.1rem' }}
          component="div"
          count={carts != null ? carts.length : 0}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]} />
      </TableContainer>
    </div>
  );
}

export default Cart;