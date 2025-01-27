import TextField from '@mui/material/TextField';
import { useEffect, useState, useRef } from 'react';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import api from '../../api/api';
import '../../assets/css/global.css';
import { Alert, Box, Paper, styled, Table, TableBody, TableCell, tableCellClasses, TableContainer, TableHead, TablePagination, TableRow } from '@mui/material';

function Item() {
  const [items, setItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [editingItemId, setEditingItemId] = useState(null);
  const inputQuantity = useRef();
  const inputUnitMeasure = useRef();
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

  const filteredItems = items.filter(item => {
    console.log("item", item)
    return (item.productName && item.productName.toLowerCase().includes(filterText.toLowerCase())) ||
      (item.unitMeasure && item.unitMeasure.toLowerCase().includes(filterText.toLowerCase()))
  })


  async function getItem() {
    try {
      const item = await api.get('v1/items');
      setItems(item.data.$values);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  }

  async function getProducts() {
    try {
      const response = await api.get('v1/products');
      console.log("Fetched products:", response.data.$values);
      setProducts(response.data.$values);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  }

  async function createItem() {
    try {
      const quantity = inputQuantity.current.value;
      const unitMeasure = inputUnitMeasure.current.value;
      const productId = inputProduct.current.value;

      if (quantity === "" || unitMeasure === "" || productId === "") {
        setErrorMessage("Campos vazios, por favor preencha os campos");
        clearMessages();
        return;
      }


      if (isNaN(quantity) || quantity <= 0) {
        setErrorMessage("Campo Quantidade deve ser um número maior que zero, por favor preencha o campo corretamente");
        clearMessages();
        return;
      }

      if (!isNaN(unitMeasure)) {
        setErrorMessage("Campo Unidade de Medida não pode ser um número, por favor preencha o campo corretamente");
        clearMessages();
        return;
      }

      await api.post('v1/items', { quantity, unitMeasure, productId });
      inputQuantity.current.value = "";
      inputUnitMeasure.current.value = "";
      inputProduct.current.value = "";
      setErrorMessage('');
      setSuccessMessage("Produto cadastrado com sucesso!");
      clearMessages();
      getItem();
    } catch (error) {
      console.error("Error creating item:", error);
      setErrorMessage("Erro ao criar produto, tente novamente");
      clearMessages();
    }
  }

  async function updateItem(id) {
    try {
      const quantity = inputQuantity.current.value;
      const unitMeasure = inputUnitMeasure.current.value;
      const productId = inputProduct.current.value;

      if (quantity === "" || unitMeasure === "" || productId === "") {
        setErrorMessage("Campo vazio, por favor preencha todos os campos");
        clearMessages();
        return;
      }

      if (isNaN(quantity) || quantity <= 0) {
        setErrorMessage("Campo Quantidade deve ser um número maior que zero, por favor preencha o campo corretamente");
        clearMessages();
        return;
      }

      if (!isNaN(unitMeasure)) {
        setErrorMessage("Campo Unidade de Medida não pode ser um número, por favor preencha o campo corretamente");
        clearMessages();
        return;
      }

      await api.put(`v1/items/${id}`, { quantity, unitMeasure, productId });
      inputQuantity.current.value = "";
      inputUnitMeasure.current.value = "";
      inputProduct.current.value = "";
      setSuccessMessage("Item atualizado com sucesso!");
      clearMessages();
      getItem();
    } catch (error) {
      console.error("Error updating item:", error);
      setErrorMessage("Erro ao atualizar item, tente novamente");
      clearMessages();
    }
  }

  function editItem(item) {
    inputQuantity.current.value = item.quantity;
    inputUnitMeasure.current.value = item.unitMeasure;
    inputProduct.current.value = item.productId;
    setEditingItemId(item.id);
  }

  async function deleteItem(id) {
    try {
      await api.delete(`v1/items/${id}`);
      setSuccessMessage("Item deletado com sucesso!");
      clearMessages();
      getItem();
    } catch (error) {
      console.error("Error deleting item:", error);
      setErrorMessage("Erro ao deletar item, tente novamente");
      clearMessages();
    }
  }

  useEffect(() => {
    getItem();
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

  return (
    <div className='container'>
      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
      {successMessage && <Alert severity="success">{successMessage}</Alert>}
      <form style={{marginTop: '20px',maxWidth: '80%',display: 'flex',flexDirection: 'row',gap: '16px',justifyContent: 'center',alignItems: 'center',marginLeft: 'auto',marginRight: 'auto',flexWrap: 'wrap',}}>
        <TextField
          id="outlined-select-product"
          select
          placeholder="Produto"
          defaultValue=""
          inputRef={inputProduct}
          size="small"
          sx={{ width: '300px' }}
        >
          {products.map((product) => (
            <MenuItem key={product.id} value={product.id}>
              {product.name.charAt(0).toUpperCase() + product.name.slice(1)}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          size="small"
          id="quantity"
          placeholder="Quantidade"
          variant="outlined"
          inputRef={inputQuantity}
          sx={{ width: '300px' }}
        />
        <TextField
          size="small"
          id="unitMeasure"
          placeholder="Unidade de Medida"
          variant="outlined"
          inputRef={inputUnitMeasure}
          sx={{ width: '300px' }}
        />
        <Button
          variant="contained"
          color="success"
          type="button"
          style={{ width: '150px', height: '39px' }}
          onClick={editingItemId ? () => updateItem(editingItemId) : createItem}
        >
          {editingItemId ? "Atualizar" : "Criar"}
        </Button>
      </form>

      <br />
      
      <TableContainer component={Paper} sx={{
          width: '50%',
          minWidth: 200,
          margin: '0 auto',
          boxShadow: 3,
          padding: 2,
          borderRadius: 2,
        }}>
      <Box  sx={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 2 }}>
        <TextField
          width='40%'
          placeholder="Pesquisar"
          id="search"
          variant="outlined"
          value={filterText}
          onChange={handleFilterChange}
          sx={{ marginRight: 2 }}
          size='small'
        />
      </Box>  
        <Table  aria-label="simple table">
          <TableHead>
            <TableRow>
              <StyledTableCell sx={{ fontSize: '18px', fontWeight: 'bold', }}>Produto</StyledTableCell>
              <StyledTableCell sx={{ fontSize: '18px', fontWeight: 'bold', }}>Quantidade</StyledTableCell>
              <StyledTableCell sx={{ fontSize: '18px', fontWeight: 'bold', }}>Unidade de Medida</StyledTableCell>
              <StyledTableCell sx={{ fontSize: '18px', fontWeight: 'bold', }} align="center">Ações</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {
              filteredItems !== null ? filteredItems.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item) => (
                <TableRow
                  key={item.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >

                  <TableCell sx={{ fontSize: '17px' }}> {products.find(product => product.id === item.productId)?.name.charAt(0).toUpperCase() + products.find(product => product.id === item.productId)?.name.slice(1)}</TableCell>
                  <TableCell sx={{ fontSize: '17px' }} align="left">{item.quantity}</TableCell>
                  <TableCell sx={{ fontSize: '17px' }} align="left">{item.unitMeasure.charAt(0).toUpperCase() + item.unitMeasure.slice(1)}</TableCell>
                  <TableCell align="center">
                    <Button variant="contained" color='info' onClick={() => editItem(item)} >Editar</Button> &nbsp;
                    <Button variant="contained" color='error' onClick={() => deleteItem(item.id)} >Excluir</Button>
                  </TableCell>
                </TableRow>
              )) : (<TableRow><TableCell>Loading... </TableCell></TableRow>)}
          </TableBody>
        </Table>
        <TablePagination sx={{ fontSize: '1.1rem' }}
          component="div"
          count={items != null ? items.length : 0}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[]}
        />
      </TableContainer>
    </div>
  );
}

export default Item;