// AchievementPost type
export const AchievementPost = {
    achievementPostId: String,
    title: String,
    description: String,
    imageUrl: String,
    authorId: String,
    authorName: String,
    profileImageUrl: String,
    likes: Array,
    comments: Array,
    createdAt: String
};

// Comment type
export const Comment = {
    commentId: String,
    content: String,
    authorId: String,
    authorName: String,
    profileImageUrl: String,
    createdAt: String
};

// AchievementPostRequest type
export const AchievementPostRequest = {
    skill: String,
    title: String,
    templateType: String,
    templateData: Object
};

// CommentRequest type
export const CommentRequest = {
    content: String
}; 