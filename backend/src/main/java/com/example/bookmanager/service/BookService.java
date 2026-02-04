package com.example.bookmanager.service;

import com.example.bookmanager.dto.BookRequest;
import com.example.bookmanager.dto.BookResponse;
import com.example.bookmanager.entity.Book;
import com.example.bookmanager.entity.User;
import com.example.bookmanager.repository.BookRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BookService {

    private final BookRepository bookRepository;

    @Transactional(readOnly = true)
    public List<BookResponse> getAllBooks() {
        User currentUser = getCurrentUser();
        return bookRepository.findByUserIdOrderByCreatedAtDesc(currentUser.getId())
                .stream()
                .map(BookResponse::fromEntity)
                .toList();
    }

    @Transactional(readOnly = true)
    public BookResponse getBookById(Long id) {
        User currentUser = getCurrentUser();
        Book book = bookRepository.findByIdAndUserId(id, currentUser.getId())
                .orElseThrow(() -> new RuntimeException("Book not found"));
        return BookResponse.fromEntity(book);
    }

    @Transactional
    public BookResponse createBook(BookRequest request) {
        User currentUser = getCurrentUser();

        Book book = Book.builder()
                .title(request.getTitle())
                .author(request.getAuthor())
                .isbn(request.getIsbn())
                .publishedDate(request.getPublishedDate())
                .description(request.getDescription())
                .user(currentUser)
                .build();

        Book savedBook = bookRepository.save(book);
        return BookResponse.fromEntity(savedBook);
    }

    @Transactional
    public BookResponse updateBook(Long id, BookRequest request) {
        User currentUser = getCurrentUser();

        Book book = bookRepository.findByIdAndUserId(id, currentUser.getId())
                .orElseThrow(() -> new RuntimeException("Book not found"));

        book.setTitle(request.getTitle());
        book.setAuthor(request.getAuthor());
        book.setIsbn(request.getIsbn());
        book.setPublishedDate(request.getPublishedDate());
        book.setDescription(request.getDescription());

        Book updatedBook = bookRepository.save(book);
        return BookResponse.fromEntity(updatedBook);
    }

    @Transactional
    public void deleteBook(Long id) {
        User currentUser = getCurrentUser();

        if (!bookRepository.existsByIdAndUserId(id, currentUser.getId())) {
            throw new RuntimeException("Book not found");
        }

        bookRepository.deleteById(id);
    }

    private User getCurrentUser() {
        return (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }
}
