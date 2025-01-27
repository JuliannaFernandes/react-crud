import TextField from '@mui/material/TextField';
import { useEffect, useState, useRef } from 'react';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import api from '../../api/api';
import './style.css';
import { Paper, styled, Table, TableBody, TableCell, tableCellClasses, TableContainer, TableHead, TableRow } from '@mui/material';

function Item() {
  const [items, setItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [editingItemId, setEditingItemId] = useState(null);
  const inputQuantity = useRef();
  const inputUnitMeasure = useRef();
  const inputProduct = useRef();

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
        alert("Campo vazio, por favor preencha todos os campos");
        return;
      }
      await api.post('v1/items', { quantity, unitMeasure, productId });
      inputQuantity.current.value = "";
      inputUnitMeasure.current.value = "";
      inputProduct.current.value = "";
      getItem();
    } catch (error) {
      console.error("Error creating item:", error);
    }
  }

  async function updateItem(id) {
    try {
      const quantity = inputQuantity.current.value;
      const unitMeasure = inputUnitMeasure.current.value;
      const productId = inputProduct.current.value;
      if (quantity === "" || unitMeasure === "" || productId === "") {
        alert("Campo vazio, por favor preencha todos os campos");
        return;
      }
      await api.put(`v1/items/${id}`, { quantity, unitMeasure, productId });
      console.log("Updated item:", id);
      inputQuantity.current.value = "";
      inputUnitMeasure.current.value = "";
      inputProduct.current.value = "";
      setEditingItemId(null);
      getItem();
    } catch (error) {
      console.error("Error updating item:", error);
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
      getItem();
    } catch (error) {
      console.error("Error deleting item:", error);
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

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));

  return (
    <div className='container'>
      <form style={{ padding: '0px', maxWidth: '100vw', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <TextField
          id="outlined-select-product"
          select
          label="Produto"
          defaultValue=""
          inputRef={inputProduct}
          size="small"
        >
          {products.map((product) => (
            <MenuItem key={product.id} value={product.id}>
              {product.name}
            </MenuItem>
          ))}
        </TextField>
        <TextField size="small" id="quantity" label="Quantidade" variant="outlined" inputRef={inputQuantity} />
        <TextField size="small" id="unitMeasure" label="Unidade de Medida" variant="outlined" inputRef={inputUnitMeasure} />
        <Button variant="contained" color="success" type='button' style={{ width: '100px' }} onClick={editingItemId ? () => updateItem(editingItemId) : createItem}>
          {editingItemId ? "Atualizar" : "Criar"}
        </Button>
      </form>
      <br />
      <TableContainer component={Paper} sx={{ width: 500, minWidth: 200 }}>
        <Table sx={{ minWidth: 200 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Quantidade</StyledTableCell>
              <StyledTableCell>Itens</StyledTableCell>
              <StyledTableCell>Produto</StyledTableCell>
              <StyledTableCell align="left">Ações</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.length > 0 ? (
              items.map(item => (
                <StyledTableRow key={item.name}>
                  <StyledTableCell align="left">{item.quantity}</StyledTableCell>
                  <StyledTableCell align="left">{item.unitMeasure}</StyledTableCell>
                  <StyledTableCell>{products.find(product => product.id === item.productId)?.name}</StyledTableCell>
                  <StyledTableCell align="center">
                    <Button variant="contained" color='warning' onClick={() => editItem(item)} >Editar</Button> &nbsp;
                    <Button variant="outlined" color='error' onClick={() => deleteItem(item.id)} >Excluir</Button>
                  </StyledTableCell>
                </StyledTableRow>

              ))
            ) : (
              <p>Sem itens disponivel</p>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default Item;