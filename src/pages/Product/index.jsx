import TextField from '@mui/material/TextField';
import { useEffect, useState, useRef } from 'react';
import Button from '@mui/material/Button';
import api from '../../api/api';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Box, styled, TablePagination } from '@mui/material';

import './style.css';

function Product() {
  const [products, setProducts] = useState([]);
  const [editingProductId, setEditingProductId] = useState(null);
  const [page, setPage] = useState(0);  // Current page index
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const inputName = useRef();

  const [filterText, setFilterText] = useState('');


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
        alert("Campo vazio, por favor preencha o campo");
        return;
      }
      await api.post('v1/products', { name });
      inputName.current.value = "";
      getProduct();
    } catch (error) {
      console.error("Error creating product:", error);
    }
  }

  async function updateProduct(id) {
    try {
      const name = inputName.current.value;

      if (name === "") {
        alert("Campo vazio, por favor preencha o campo");
        return;
      }
      await api.put(`v1/products/${id}`, { name });
      console.log("Updated product:", name);
      setEditingProductId(null);
      inputName.current.value = "";
      getProduct();
    } catch (error) {
      console.error("Error updating product:", error);
    }
  }


  function editProduct(product) {
    inputName.current.value = product.name;
    setEditingProductId(product.id);
  }

  async function deleteProduct(id) {
    try {
      await api.delete(`v1/products/${id}`);
      console.log("Deleted product:", id);
      getProduct();
    } catch (error) {
      console.error("Error deleting product:", error);
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
    
        <form style={{ padding: '0px', maxWidth: '100%',  display: 'flex',flexDirection: 'row',  }}>
          <TextField id="nome" label="Nome" variant="outlined" sx={{width: '100%'}} inputRef={inputName} />
          <Button variant="contained" color="success" type='button' style={{width: "125px"}} onClick={editingProductId ? () => updateProduct(editingProductId) : createProduct}>
            {editingProductId ? "Atualizar" : "Criar"}
          </Button>
        </form>
  
      <br />
      <TableContainer component={Paper} sx={{ width:500,  minWidth: 200 }}>

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
      <Table sx={{  minWidth: 200 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Produtos</StyledTableCell>
            <StyledTableCell align="left">Ações</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
        {
          
          filteredProducts !== null? filteredProducts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((product) => (
            <TableRow
            key={product.id}
            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell>{product.name}</TableCell>
              <TableCell>
                <Button  variant="contained" color='warning' onClick={() => editProduct(product)}>Editar</Button> &nbsp;
                <Button  variant="outlined" color='error' onClick={() => deleteProduct(product.id)}>Excluir</Button>
              </TableCell> 
            </TableRow>
            )) : (<TableRow><TableCell>Loading... </TableCell></TableRow>)}
        </TableBody>
      </Table>
      <TablePagination  sx={{ fontSize: '1.1rem' }}
            component="div"
            count={products!= null? products.length: 0}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}  />
    </TableContainer>
    </div>
  );
}

export default Product;