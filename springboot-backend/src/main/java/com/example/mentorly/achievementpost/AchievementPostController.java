package com.example.mentorly.achievementpost;

import com.example.mentorly.comment.Comment;
import com.example.mentorly.comment.CommentMapper;
import com.example.mentorly.comment.CommentRequest;
import com.example.mentorly.notification.NotificationDto;
import com.example.mentorly.notification.NotificationMapper;
import com.example.mentorly.notification.NotificationService;
import com.example.mentorly.notification.NotificationType;
import com.example.mentorly.user.User;
import com.example.mentorly.user.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.server.resource.introspection.OAuth2IntrospectionAuthenticatedPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
  
@RestController
@RequestMapping("/api/v1/achievement-posts")
@RequiredArgsConstructor
public class AchievementPostController {

    private final AchievementPostService achievementPostService;
    private final UserService userService;
    private final NotificationService notificationService;
    private final AchievementPostMapper achievementPostMapper;
    private final CommentMapper commentMapper;
    private final NotificationMapper notificationMapper;

    @PostMapping
    public ResponseEntity<AchievementPostDto> saveAchievementPost(
            @Valid @RequestBody AchievementPostRequest request
    ) {
        // Convert request to entity
        AchievementPost achievementPost = achievementPostMapper.toEntity(request);

        // Set default author details for unauthenticated requests
        achievementPost.setAuthorId("anonymous");
        achievementPost.setProfileImageUrl("");
        achievementPost.setAuthorName("Anonymous User");

        // Save and convert to DTO
        AchievementPost savedPost = achievementPostService.save(achievementPost);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(achievementPostMapper.toDto(savedPost));
    }

    @GetMapping
    public ResponseEntity<List<AchievementPostDto>> getAllAchievementPosts() {
        List<AchievementPost> allAchievementPosts = achievementPostService.findAll();
        List<AchievementPostDto> dtos = allAchievementPosts.stream()
                .map(achievementPostMapper::toDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{achievement-post-id}")
    public ResponseEntity<AchievementPostDto> getAchievementPostById(
            @PathVariable("achievement-post-id") String achievementPostId) {
        AchievementPost achievementPost = achievementPostService.findById(achievementPostId);
        return ResponseEntity.ok(achievementPostMapper.toDto(achievementPost));
    }

    @PutMapping("/{achievement-post-id}")
    public ResponseEntity<AchievementPostDto> updateAchievementPost(
            @PathVariable("achievement-post-id") String achievementPostId,
            @Valid @RequestBody AchievementPostRequest request
    ) {
        // Get existing post
        AchievementPost existingPost = achievementPostService.findById(achievementPostId);

        // Update fields while preserving metadata
        achievementPostMapper.updateEntityFromRequest(request, existingPost);

        // Save and return
        AchievementPost updatedPost = achievementPostService.update(existingPost);
        return ResponseEntity.ok(achievementPostMapper.toDto(updatedPost));
    }

    @DeleteMapping("/{achievement-post-id}")
    public ResponseEntity<Void> deleteAchievementPost(
            @PathVariable("achievement-post-id") String achievementPostId
    ) {
        achievementPostService.delete(achievementPostId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{achievement-post-id}/like")
    public ResponseEntity<AchievementPostDto> likeAchievementPost(
            @PathVariable("achievement-post-id") String achievementPostId
    ) {
        AchievementPost updatedPost = achievementPostService.addLike(achievementPostId, "anonymous", "Anonymous User");
        return ResponseEntity.ok(achievementPostMapper.toDto(updatedPost));
    }

    @DeleteMapping("/{achievement-post-id}/like")
    public ResponseEntity<AchievementPostDto> unlikeAchievementPost(
            @PathVariable("achievement-post-id") String achievementPostId
    ) {
        AchievementPost updatedPost = achievementPostService.removeLike(achievementPostId, "anonymous");
        return ResponseEntity.ok(achievementPostMapper.toDto(updatedPost));
    }

    @PostMapping("/{achievement-post-id}/comments")
    public ResponseEntity<AchievementPostDto> addComment(
            @PathVariable("achievement-post-id") String achievementPostId,
            @Valid @RequestBody CommentRequest commentRequest
    ) {
        AchievementPost post = achievementPostService.findById(achievementPostId);

        // Set comment metadata
        Comment comment = commentMapper.toEntity(commentRequest);
        comment.setCommentId(new ObjectId());
        comment.setAuthorId("anonymous");
        comment.setAuthorName("Anonymous User");
        comment.setProfileImageUrl("");

        // Add comment to post
        post.getComments().add(comment);
        AchievementPost updatedPost = achievementPostService.update(post);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(achievementPostMapper.toDto(updatedPost));
    }

    @DeleteMapping("/{achievement-post-id}/comments/{comment-id}")
    public ResponseEntity<AchievementPostDto> deleteComment(
            @PathVariable("achievement-post-id") String achievementPostId,
            @PathVariable("comment-id") String commentId
    ) {
        AchievementPost post = achievementPostService.findById(achievementPostId);
        post.getComments().removeIf(comment -> comment.getCommentId().toHexString().equals(commentId));
        AchievementPost updatedPost = achievementPostService.update(post);
        return ResponseEntity.ok(achievementPostMapper.toDto(updatedPost));
    }

    @PutMapping("/{achievement-post-id}/comments/{comment-id}")
    public ResponseEntity<AchievementPostDto> updateComment(
            @PathVariable("achievement-post-id") String achievementPostId,
            @PathVariable("comment-id") String commentId,
            @Valid @RequestBody CommentRequest updatedCommentRequest
    ) {
        AchievementPost post = achievementPostService.findById(achievementPostId);
        post.getComments().stream()
                .filter(comment -> comment.getCommentId().toHexString().equals(commentId))
                .findFirst()
                .ifPresent(comment -> {
                    comment.setContent(updatedCommentRequest.getContent());
                });
        AchievementPost updatedPost = achievementPostService.update(post);
        return ResponseEntity.ok(achievementPostMapper.toDto(updatedPost));
    }

    @GetMapping("/user/{user-id}")
    public ResponseEntity<List<AchievementPostDto>> getPostsByUser(
            @PathVariable("user-id") String userId) {
        List<AchievementPost> posts = achievementPostService.findByUserId(userId);
        List<AchievementPostDto> postDtos = posts.stream()
                .map(achievementPostMapper::toDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(postDtos);
    }

    @GetMapping("/me")
    public ResponseEntity<List<AchievementPostDto>> getCurrentUserPosts() {
        List<AchievementPost> posts = achievementPostService.findByUserId("anonymous");
        List<AchievementPostDto> postDtos = posts.stream()
                .map(achievementPostMapper::toDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(postDtos);
    }

    @GetMapping("/feed")
    public ResponseEntity<List<AchievementPostDto>> getFeed() {
        List<AchievementPost> posts = achievementPostService.findAll();
        List<AchievementPostDto> postDtos = posts.stream()
                .map(achievementPostMapper::toDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(postDtos);
    }

    @GetMapping("/liked")
    public ResponseEntity<List<AchievementPostDto>> getLikedPosts() {
        List<AchievementPost> posts = achievementPostService.findLikedByUser("anonymous");
        List<AchievementPostDto> postDtos = posts.stream()
                .map(achievementPostMapper::toDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(postDtos);
    }
}