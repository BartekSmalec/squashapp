package io.squashapp.squashapp.repository;

import io.squashapp.squashapp.models.Comment;
import org.springframework.data.repository.CrudRepository;

public interface CommentRepository extends CrudRepository<Comment, Long> {
}
