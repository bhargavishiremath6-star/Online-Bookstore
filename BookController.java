package com.example.bookstore;

import org.springframework.web.bind.annotation.*;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
@CrossOrigin
public class BookController {
    private final List<Book> books = new ArrayList<>(List.of(
        new Book(1, "The Alchemist", "Paulo Coelho", "A story about following your dreams.", 299),
        new Book(2, "Wings of Fire", "A. P. J. Abdul Kalam", "The inspiring autobiography of Dr. A. P. J. Abdul Kalam.", 250),
        new Book(3, "Atomic Habits", "James Clear", "A practical guide to building good habits.", 399),
        new Book(4, "The Blue Umbrella", "Ruskin Bond", "A charming story set in the hills of India.", 180),
        new Book(5, "Ikigai", "Hector Garcia and Francesc Miralles", "Explore ideas for a meaningful life.", 320)
    ));
    private final Map<Long, CartItem> cart = new ConcurrentHashMap<>();

    @GetMapping("/books")
    public List<Book> getBooks(@RequestParam(required = false) String search) {
        if (search == null || search.isBlank()) return books;
        String q = search.toLowerCase();
        return books.stream().filter(b -> b.getTitle().toLowerCase().contains(q)
            || b.getAuthor().toLowerCase().contains(q)).collect(Collectors.toList());
    }

    @GetMapping("/books/{id}")
    public Book getBook(@PathVariable long id) {
        return books.stream().filter(b -> b.getId() == id).findFirst()
            .orElseThrow(() -> new NoSuchElementException("Book not found"));
    }

    @PostMapping("/cart/{id}")
    public Map<String, String> addToCart(@PathVariable long id) {
        Book book = getBook(id);
        cart.compute(id, (key, item) -> item == null ? new CartItem(book, 1)
            : new CartItem(book, item.getQuantity() + 1));
        return Map.of("message", "Book added to cart");
    }

    @GetMapping("/cart")
    public Map<String, Object> getCart() {
        List<CartItem> items = new ArrayList<>(cart.values());
        double total = items.stream().mapToDouble(CartItem::getSubtotal).sum();
        return Map.of("items", items, "total", total);
    }

    @DeleteMapping("/cart/{id}")
    public Map<String, String> removeFromCart(@PathVariable long id) {
        cart.remove(id);
        return Map.of("message", "Book removed from cart");
    }

    @PostMapping("/checkout")
    public Map<String, String> checkout() {
        if (cart.isEmpty()) return Map.of("message", "Your cart is empty.");
        cart.clear();
        return Map.of("message", "Order placed successfully! Thank you for shopping.");
    }
}
