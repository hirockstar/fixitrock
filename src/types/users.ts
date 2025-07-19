export type NotificationType = 'team_request' | 'follow' | 'comment' | 'like' | 'other'

export type Notification = {
    id: number
    user_id: string
    type: NotificationType
    data: JSON
    is_read: boolean
    created_at: string
}

export type TeamMember = {
    id: number
    team_id: string
    team_username: string
    user_id: string
    job_title?: string
    status: 'pending' | 'accepted' | 'rejected'
    invited_by?: string
    created_at: string
    updated_at: string
}
