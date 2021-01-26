# ENDPOINTS

## Aplicación

- **GET** - [/events] - Obtener la lista de lugares misteriosos. ✅
- **GET** - [/events/:idEvent] - Obtener la info de un lugar misterioso concreto. ✅
- **GET** - [/events/favourites/:idUser] - Obtener la lista de lugares favoritos. ✅ **CON TOKEN**

- **POST** - [/events] - Insertar un nuevo lugar misterioso. ✅ **CON TOKEN**
- **POST** - [/events/:idEvent/comments] - Comentar un lugar misterioso. ✅ **CON TOKEN**
- **POST** - [/events/:idEvent/votes] - Valorar un lugar misterioso. ✅ **CON TOKEN**
- **POST** - [/events/:idEvent/favoutires] - Añadir a favoritos un lugar misterioso. ✅ **CON TOKEN**

- **PUT** - [/events/:idEvent] - Editar un lugar misterioso. ✅ **CON TOKEN**
- **PUT** - [/events/:idEvent/comments/:idComment] - Editar un comentario. ✅ **CON TOKEN**
- **PUT** - [/events/:idEvent/votes/:idRating] - Editar una valoración. ✅ **CON TOKEN**

- **DELETE** - [/events/:idEvent] - Eliminar un lugar misterioso. ✅ **CON TOKEN**
- **DELETE** - [/events/:idEvent/photos/:idPhoto] - Eliminar una foto asignada a un lugar misterioso. ✅ **CON TOKEN**
- **DELETE** - [/events/:idEvent/comments/:idComment] - Eliminar un comentario. ✅ **CON TOKEN**
- **DELETE** - [/events/:idEvent/favourites] - Eliminar un lugar favorito. ✅ **CON TOKEN**

## Usuarios

- **GET** - [/users/validate/:regCode] - Valida un usuario. ✅
- **GET** - [/users/:idUser] - Obtener info de usuario.

- **POST** - [/users] - Crea un usuario pendiente de activar. ✅
- **POST** - [/users/:idEvent] - Login de usuario. ✅

- **PUT** - [/users/:idUser] - Editar datos de usuario.
- **PUT** - [/users/:idUser/password] - Editar contraseña.
