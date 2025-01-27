import { useState, useEffect } from "react";
import { Card, CardContent, Typography, CircularProgress, Grid2 } from "@mui/material";
import api from "../../api/api";
import '../../assets/css/global.css';

function Dashboard() {
  const [products, setProducts] = useState([]);
  const [items, setItems] = useState([]);
  const [carts, setCarts] = useState([]);
  const [loading, setLoading] = useState(true);

  async function getProduct() {
    try {
      const productName = await api.get("v1/products");
      setProducts(productName.data.$values);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  }

  async function getItem() {
    try {
      const item = await api.get("v1/items");
      setItems(item.data.$values);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  }

  async function getCart() {
    try {
      const response = await api.get("v1/carts");
      setCarts(response.data.$values);
    } catch (error) {
      console.error("Error fetching carts:", error);
    }
  }

  useEffect(() => {
    async function fetchData() {
      await Promise.all([getProduct(), getItem(), getCart()]);
      setLoading(false);
    }
    fetchData();
  }, []);

  const renderCard = (title, count) => (
    <Card sx={{ minWidth: 275, borderRadius: 4, boxShadow: 3, height: "300px" }}>
      <CardContent sx={{ display: "flex", flexDirection: "column", gap: "50px", alignItems: "center", justifyContent: "center", height: "100%" }}>
        <Typography variant="h4" component="div">
          {title}
        </Typography>
        <Typography variant="h1" color="primary">
          {count}
        </Typography>
      </CardContent>
    </Card>
  );

  return (
    <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "20px", alignItems: "center", height: "80vh", justifyContent: "center"}}>
      <Typography variant="h3" gutterBottom>
        Dashboard
      </Typography>
      {loading ? (
        <div style={{ textAlign: "center", marginTop: "3px" }}>
          <CircularProgress />
        </div>
      ) : (
        <Grid2 container spacing={3}>
          <Grid2 item xs={12} sm={4}>
            {renderCard("Produtos", products.length)}
          </Grid2>
          <Grid2 item xs={12} sm={4}>
            {renderCard("Itens", items.length)}
          </Grid2>
          <Grid2 item xs={12} sm={4}>
            {renderCard("Carrinhos", carts.length)}
          </Grid2>
        </Grid2>
      )}
    </div>
  );
}

export default Dashboard;
