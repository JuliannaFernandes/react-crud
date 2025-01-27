import TextField from '@mui/material/TextField';
import { useEffect, useState, useRef } from 'react';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import api from '../../api/api';
import '../../assets/css/global.css';
import { Box, Paper, styled, Table, TableBody, TableCell, tableCellClasses, TableContainer, TableHead, TablePagination, TableRow } from '@mui/material';

function Product() {
  const [products, setProducts] = useState([]);
  const [editingProductId, setEditingProductId] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const inputName = useRef();
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [filterText, setFilterText] = useState('');

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

  const filteredProducts = products.filter(product => {
    return product.name && product.name.toLowerCase().includes(filterText.toLowerCase())
  })


  async function getProduct() {
    try {
      const productName = await api.get('v1/products');
      setProducts(productName.data.$values);
      console.log("Products fetched:", productName.data.$values);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  }

  async function createProduct() {
    try {
      const name = inputName.current.value;
      if (name === "") {
        setErrorMessage("Campo vazio, por favor preencha o campo");
        clearMessages();
        return;
      }

      if (!isNaN(name)) {
        setErrorMessage("Campo não pode ser um número, por favor preencha o campo corretamente");
        clearMessages();
        return;
      }

      await api.post('v1/products', { name });
      inputName.current.value = "";
      setErrorMessage('');
      setSuccessMessage("Produto cadastrado com sucesso!");
      clearMessages();
      getProduct();
    } catch (error) {
      console.error("Error creating product:", error);
      setErrorMessage("Erro ao criar produto, tente novamente");
      clearMessages();
    }
  }

  async function updateProduct(id) {
    try {
      const name = inputName.current.value;
      if (name === "") {
        setErrorMessage("Campo vazio, por favor preencha o campo");
        clearMessages();
        return;
      }

      if (!isNaN(name)) {
        setErrorMessage("Campo não pode ser um número, por favor preencha o campo corretamente");
        clearMessages();
        return;
      }

      await api.put(`v1/products/${id}`, { name });
      inputName.current.value = "";
      setErrorMessage('');
      setSuccessMessage("Produto atualizado com sucesso!");
      clearMessages();
      getProduct();
    } catch (error) {
      console.error("Error updating product:", error);
      setErrorMessage("Error ao atualizar produto, tente novamente");
      clearMessages();
    }
  }


  function editProduct(product) {
    inputName.current.value = product.name;
    setEditingProductId(product.id);
  }

  async function deleteProduct(id) {
    try {
      await api.delete(`v1/products/${id}`);
      setSuccessMessage("Produto deletado com sucesso!");
      getProduct();
    } catch (error) {
      console.error("Error deleting product:", error);
      setErrorMessage("Error ao deletar produto, tente novamente");
      clearMessages();
    }
  }

  useEffect(() => {
    getProduct();
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

      <form style={{ marginTop: '20px', maxWidth: '40%', display: 'flex', flexDirection: 'row', gap: '16px', justifyContent: 'center', alignItems: 'center', marginLeft: 'auto', marginRight: 'auto' }}>
        <TextField id="name" size="small" placeholder="Nome do produto" variant="outlined" sx={{ flexGrow: 1, '.MuiInputBase-root': { borderRadius: '8px', }, }} inputRef={inputName} />
        <Button variant="contained" color="success" type='button' sx={{ width: '150px', height: '39px', fontSize: '17px', textTransform: 'none',
        }} onClick={editingProductId ? () => updateProduct(editingProductId) : createProduct}>
          {editingProductId ? "Atualizar" : "Criar"}
        </Button>
      </form>

      <br />
      <TableContainer
        component={Paper}
        sx={{
          width: '50%',
          minWidth: 200,
          margin: '0 auto',
          boxShadow: 3,
          padding: 2,
          borderRadius: 2,
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 2 }}>
          <TextField
            width="40%"
            placeholder="Pesquisar"
            id="search"
            variant="outlined"
            value={filterText}
            onChange={handleFilterChange}
            sx={{ marginRight: 2 }}
            size="small"
          />
        </Box>
        <Table aria-label="simple table">
          <TableHead >
            <TableRow >
              <StyledTableCell sx={{ fontSize: '18px', fontWeight: 'bold', }} >Produtos</StyledTableCell>
              <StyledTableCell align="center" sx={{ fontSize: '18px', fontWeight: 'bold', }}>Ações</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProducts !== null ? (
              filteredProducts
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((product) => (
                  <TableRow
                    key={product.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell sx={{ fontSize: '17px' }} >{product.name.charAt(0).toUpperCase() + product.name.slice(1)}</TableCell>
                    <TableCell align="center">
                      <Button
                        variant="contained"
                        color="info"
                        onClick={() => editProduct(product)}
                      >
                        Editar
                      </Button>{' '}
                      &nbsp;
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => deleteProduct(product.id)}
                      >
                        Excluir
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
            ) : (
              <TableRow>
                <TableCell>Loading... </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          sx={{ fontSize: '1.1rem' }}
          component="div"
          count={products != null ? products.length : 0}
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

export default Product;