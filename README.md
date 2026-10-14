# Online Bookstore — Full Stack Java Project

A ready-to-run starter project based on the Online Bookstore brief.

## Features
- Responsive bookstore homepage
- Book listing and search by title/author
- Book details included in each listing
- Add books to cart and remove them
- Automatic cart total and quantity count
- Checkout confirmation
- Java + Spring Boot REST API, HTML, CSS, JavaScript

## Requirements
- JDK 17 or newer
- Maven 3.6+ (or use the Maven support in your IDE)

## Run in VS Code
1. Extract the ZIP file.
2. Open the extracted `Online-Bookstore-Project` folder in VS Code.
3. Ensure JDK 17+ and Maven are installed.
4. Open a terminal in the project folder.
5. Run: `mvn spring-boot:run`
6. Open `http://localhost:8080` in your browser.

If VS Code asks to install Java extensions, install the Extension Pack for Java.

## API endpoints
- `GET /api/books` — list all books
- `GET /api/books?search=atomic` — search by title/author
- `GET /api/books/{id}` — get one book
- `POST /api/cart/{id}` — add a book to cart
- `GET /api/cart` — view cart and total
- `DELETE /api/cart/{id}` — remove a book
- `POST /api/checkout` — clear cart and show confirmation

## Notes
- This is a learning/demo project. Book data and cart are stored in memory, so they reset when the app restarts.
- Checkout is a demonstration only; it does not collect payment or store real orders.
- Login/signup and a database are optional extensions in the supplied project guide.
