API Documentation

Authentication Routes

1. Register a New User

POST /auth/register

Description: Allows a new user to register an account.

Body Parameters:

name: string

email: string

password: string

2. Login

POST /auth/login

Description: Logs in an existing user and generates a token.

Body Parameters:

email: string

password: string

3. Logout

POST /auth/logout

Description: Logs out the authenticated user.

Headers:

Authorization: Bearer token

4. Change Password

PATCH /auth/change-Password

Description: Allows the user to change their password.

Headers:

Authorization: Bearer token

Body Parameters:

currentPassword: string

newPassword: string

5. Update Account Details

PATCH /auth/update-Account

Description: Updates the user’s account details.

Headers:

Authorization: Bearer token

Body Parameters:

name: string (optional)

email: string (optional)

6. Get Current User

GET /auth/current-user

Description: Fetches details of the authenticated user.

Headers:

Authorization: Bearer token

User Routes

1. Get User by ID

GET /users/:id

Description: Fetches user details by ID.

Headers:

Authorization: Bearer token

2. Get All Users

GET /users/

Description: Fetches all users (Admin only).

Headers:

Authorization: Bearer token

Admin: Required

Product Routes

1. Create Product

POST /products/

Description: Adds a new product to the catalog.

Headers:

Authorization: Bearer token

Form Data:

thumbnail: file

name: string

price: number

description: string

2. Get All Products

GET /products/

Description: Fetches all products.

3. Get Product by ID

GET /products/:id

Description: Fetches product details by ID.

4. Update Product

PATCH /products/:id

Description: Updates a product’s details by ID.

5. Undelete Product

PATCH /products/undelete/:id

Description: Restores a previously deleted product.

6. Delete Product

DELETE /products/:id

Description: Deletes a product by ID.

Cart Routes

1. Add to Cart

POST /cart/

Description: Adds a product to the user’s cart.

Headers:

Authorization: Bearer token

Body Parameters:

productId: string

quantity: number

2. Get User’s Cart

GET /cart/

Description: Fetches the cart items for the authenticated user.

Headers:

Authorization: Bearer token

3. Get Cart Item by ID

GET /cart/:id

Description: Fetches details of a specific cart item by ID.

4. Update Cart Item

PATCH /cart/:id

Description: Updates the quantity or details of a cart item.

5. Remove from Cart

DELETE /cart/:id

Description: Removes a product from the cart by ID.

Review Routes

1. Create Review

POST /reviews/

Description: Adds a new review for a product.

Headers:

Authorization: Bearer token

Body Parameters:

product: string

rating: number (1-5)

comment: string

2. Get Reviews by Product

GET /reviews/product/:productId

Description: Fetches all reviews for a specific product.

3. Update Review

PATCH /reviews/:id

Description: Updates a review by its ID.

4. Delete Review

DELETE /reviews/:id

Description: Deletes a review by its ID.

Wishlist Routes

1. Add to Wishlist

POST /wishlist/

Description: Adds a product to the user’s wishlist.

Headers:

Authorization: Bearer token

Body Parameters:

product: string

2. Get User’s Wishlist

GET /wishlist/

Description: Fetches all wishlist items for the authenticated user.

3. Get Wishlist Item by ID

GET /wishlist/:id

Description: Fetches a specific wishlist item by ID.

4. Update Wishlist Item

PATCH /wishlist/:id

Description: Updates details of a wishlist item by ID.

5. Remove from Wishlist

DELETE /wishlist/:id

Description: Removes a product from the wishlist by ID.

Category Routes

1. Get All Categories

GET /categories/

Description: Fetches all categories.

2. Create Category

POST /categories/

Description: Adds a new category.

Body Parameters:

name: string
