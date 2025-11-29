// ENDPOINTS 

Verificar API
https://api-comida-d4z6.onrender.com

GET PRODUCTOS
https://api-comida-d4z6.onrender.com/productos

GET PRODUCTOS POR ID
https://api-comida-d4z6.onrender.com/productos/1  //esto es un ejemplo con un ID 

GET PEDIDOS
https://api-comida-d4z6.onrender.com/pedidos


GET BY ID PEDIDOS
https://api-comida-d4z6.onrender.com/pedidos/1


POST PEDIDOS

https://api-comida-d4z6.onrender.com/pedidos


Body:

{
  "nombreUsuario": "Karen",
  "productosIds": [1,2,3,4,5]
}

PUT BY ID PEDIDOS

https://api-comida-d4z6.onrender.com/pedidos/1


Body:

{
  "nombreUsuario": "Yulieth",
  "productosIds": [2, 3, 4]
}

DELETE BY ID PEDIDOS

https://api-comida-d4z6.onrender.com/pedidos/1
