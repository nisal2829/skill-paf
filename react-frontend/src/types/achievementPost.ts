export enum TemplateType {
  TODAY_I_LEARNED = 'TODAY_I_LEARNED',
  SKILL_MILESTONE = 'SKILL_MILESTONE',
  PROJECT_COMPLETION = 'PROJECT_COMPLETION'
}

export interface TemplateData {
  templateTitle: string;
  topicSkill: string;
  whatYouLearned: string;
  nextSteps: string;
}

export interface AchievementPost {
  id: string;
  authorId: string;
  authorName: string;
  postedDate: string;
  profileImageUrl: string;
  skill: string;
  title: string;
  templateType: TemplateType;
  templateData: TemplateData;
  likedUserIds: string[];
  noOfLikes: number;
  comments: Comment[];
}

export interface AchievementPostRequest {
  skill: string;
  title: string;
  templateType: TemplateType;
  templateData: TemplateData;
}

export interface Comment {
  id: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: string;
  profileImageUrl: string;
}

export interface CommentRequest {
  content: string;
} 