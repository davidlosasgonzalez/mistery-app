# ENDPOINTS

## Aplicación

- **GET** - [/events] - Obtener la lista de lugares misteriosos. ✅
- **GET** - [/events/:idPlace] - Obtener la info de un lugar misterioso concreto. ✅
- **GET** - [/events/favourites/:idUser] - Obtener la lista de lugares favoritos. ✅

- **POST** - [/events] - Insertar un nuevo lugar misterioso.
- **POST** - [/events/:idPlace/comments] - Comentar un lugar misterioso.
- **POST** - [/events/:idPlace/votes] - Valorar un lugar misterioso.
- **POST** - [/events/:idPlace/favoutires] - Añadir a favoritos un lugar misterioso.

- **PUT** - [/events/:idPlace] - Editar un lugar misterioso.
- **PUT** - [/events/:idPlace/comments/:idComment] - Editar un comentario.
- **PUT** - [/events/:idPlace/votes/:idVote] - Editar una valoración.

- **DELETE** - [/events/:idPlace] - Eliminar un lugar misterioso.
- **DELETE** - [/events/:idPlace/comments/:idComment] - Eliminar un comentario.
- **DELETE** - [/events/:idPlace/favourites] - Eliminar un lugar favorito.

## Usuarios

- **GET** - [/users/:idPlace] - Login de usuario.
- **GET** - [/users/validate/:regCode] - Valida un usuario.
- **GET** - [/users/:idUser] - Obtener info de usuario.

- **POST** - [/users] - Crea un usuario pendiente de activar.

- **PUT** - [/users/:idUser] - Editar datos de usuario.
- **PUT** - [/users/:idUser/password] - Editar contraseña.
