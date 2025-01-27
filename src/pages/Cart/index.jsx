import TextField from '@mui/material/TextField';
import { useEffect, useState, useRef } from 'react';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import api from '../../api/api';
import '../../assets/css/global.css';
import { Alert, Box, Paper, styled, Table, TableBody, TableCell, tableCellClasses, TableContainer, TableHead, TablePagination, TableRow } from '@mui/material';


function Cart() {
  const [carts, setCart] = useState([]);
  const [items, setItems] = useState([]);
  const [editingCartId, setEditingCartId] = useState(null);
  const inputQuantityCart = useRef();
  const inputProduct = useRef();
  const [filterText, setFilterText] = useState('');
  const [page, setPage] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const clearMessages = () => {
    setTimeout(() => {
      setErrorMessage('');
      setSuccessMessage('');
    }, 2000);
  };

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
    const itemId = inputProduct.current.value;

    if (quantityCart === "" || itemId === "") {
      setErrorMessage("Campo vazio, por favor preencha todos os campos");
      clearMessages();
      return;
    }

    if (isNaN(quantityCart) || quantityCart <= 0) {
      setErrorMessage("Campo Quantidade deve ser um número maior que zero, por favor preencha o campo corretamente");
      clearMessages();
      return;
    }

    try {
      await api.post('v1/carts', { quantityCart, itemId });
      inputQuantityCart.current.value = "";
      inputProduct.current.value = "";
      setSuccessMessage("Carrinho criado com sucesso!");
      clearMessages();
      getCart();
    } catch (error) {
      console.error("Error creating cart:", error);
      setErrorMessage("Erro ao criar carrinho, tente novamente");
      clearMessages();
    }
  }
  async function updateCart(id) {
    try {
      const quantityCart = inputQuantityCart.current.value;
      const itemId = inputProduct.current.value;

      if (quantityCart === "" || itemId === "") {
        setErrorMessage("Campo vazio, por favor preencha todos os campos");
        clearMessages();
        return;
      }

      if (isNaN(quantityCart) || quantityCart <= 0) {
        setErrorMessage("Campo Quantidade deve ser um número maior que zero, por favor preencha o campo corretamente");
        clearMessages();
        return;
      }

      await api.put(`v1/carts/${id}`, { quantityCart, itemId });
      inputQuantityCart.current.value = "";
      inputProduct.current.value = "";
      setSuccessMessage("Carrinho atualizado com sucesso!");
      clearMessages();
      setEditingCartId(null);
      getCart();
    } catch (error) {
      console.error("Error updating cart:", error);
      setErrorMessage("Erro ao atualizar carrinho, tente novamente");
      clearMessages();
    }
  }

  function editCart(cart) {
    console.log(cart);
    inputQuantityCart.current.value = cart.quantityCart;
    inputProduct.current.value = cart.productId;
    setEditingCartId(cart.id);
  }

  async function deleteCart(id) {
    try {
      await api.delete(`v1/carts/${id}`);
      setSuccessMessage("Carrinho deletado com sucesso!");
      clearMessages();
      getCart();
    } catch (error) {
      console.error("Error deleting item:", error);
      setErrorMessage("Erro ao deletar carrinho, tente novamente");
      clearMessages();
    }
  }

  useEffect(() => {
    getCart();
    getItem();
  }, []);


  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: '#023E73',
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 16,
    },
  }));

  return (
    <div className='container'>
      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
      {successMessage && <Alert severity="success">{successMessage}</Alert>}
      <form style={{ marginTop: '20px', maxWidth: '80%', display: 'flex', flexDirection: 'row', gap: '16px', justifyContent: 'center', alignItems: 'center', marginLeft: 'auto', marginRight: 'auto', flexWrap: 'wrap', }}>
        <TextField
          id="outlined-select-product"
          select
          defaultValue=""
          inputRef={inputProduct}
          size='small'
          placeholder='Produto'
          label="Produto"
          sx={{ width: '300px' }}
        >
          {items.map((item) => (
            <MenuItem key={item.id} value={item.id}>
              {item.productName.charAt(0).toUpperCase() + item.productName.slice(1)}    - {item.quantity} disponíveis
            </MenuItem>
          ))}
        </TextField>

        <TextField
          placeholder='Quantidade'
          size='small'
          id="quantityCart"
          variant="outlined"
          inputRef={inputQuantityCart}
          sx={{ width: '300px' }}
        />
        <Button style={{ width: "100px" }} variant="contained" color="success" type='button' onClick={editingCartId ? () => updateCart(editingCartId) : createCart}>
          {editingCartId ? "Atualizar" : "Adicionar"}
        </Button>
      </form>

      <br />

      <TableContainer component={Paper} sx={{ width: '50%', minWidth: 200, margin: '0 auto', boxShadow: 3, padding: 2, borderRadius: 2, }} >
        <Box sx={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 2 }}>
          <TextField
            width='40%'
            label="Pesquisar"
            id="search"
            variant="outlined"
            value={filterText}
            onChange={handleFilterChange}
            sx={{ marginRight: 2 }}
            size='small'
          >
          </TextField>
        </Box>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <StyledTableCell sx={{ fontSize: '18px', fontWeight: 'bold', }}>Produto</StyledTableCell>
              <StyledTableCell sx={{ fontSize: '18px', fontWeight: 'bold', }}>Quantidade</StyledTableCell>
              <StyledTableCell sx={{ fontSize: '18px', fontWeight: 'bold', }} align="center">Ações</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {
              filteredCarts !== null ? filteredCarts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((cart) => (
                <TableRow
                  key={cart.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell sx={{ fontSize: '17px' }} align="left"> {cart.productName.charAt(0).toUpperCase() + cart.productName.slice(1)}</TableCell>
                  <TableCell sx={{ fontSize: '17px' }} >{cart.quantityCart}</TableCell>
                  <TableCell sx={{ fontSize: '17px' }} align="center">
                    <Button variant="contained" color="info" onClick={() => editCart(cart)}>Editar</Button> &nbsp;
                    <Button variant="contained" color="error" onClick={() => deleteCart(cart.id)}>Excluir</Button>
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
          rowsPerPageOptions={[]} />
      </TableContainer>
    </div>
  );
}

export default Cart;