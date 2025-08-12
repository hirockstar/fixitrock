'use server'

import { cookies } from 'next/headers'

import { User } from '@/app/login/types'
import { adminAuth } from '@/firebase/admin'
import { createClient } from '@/supabase/server'
import { TeamMember } from '@/types/teams'
import { Notification } from '@/types/users'

async function userSession() {
    const cookieStore = await cookies()
    const token = cookieStore.get('session')?.value

    if (!token) {
        throw new Error('Not authenticated')
    }

    try {
        const decoded = await adminAuth.verifyIdToken(token)
        const uid = decoded.uid

        const supabase = await createClient()
        const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', uid)
            .single()

        if (error || !user) {
            throw new Error('User not found')
        }

        return user as User
    } catch {
        throw new Error('Authentication failed')
    }
}

// 1. Invite (create) member
export async function inviteMember({
    user_id,
    job_title,
}: {
    user_id: string
    job_title?: string
}): Promise<TeamMember | null> {
    const currentUser = await userSession()

    if (![2, 3].includes(currentUser.role as number)) throw new Error('Not authorized')
    const supabase = await createClient()
    const team_username = currentUser.username
    const { data, error } = await supabase
        .from('team_members')
        .insert([
            {
                team_id: currentUser.id,
                team_username,
                user_id,
                job_title,
                status: 'pending',
                invited_by: currentUser.id,
            },
        ])
        .select()
        .single()

    if (error) throw new Error(error.message)

    return data as TeamMember
}

// 1. Invite user to team and create notification
export async function inviteUserToTeam({
    team_id,
    team_username,
    user_id,
    job_title,
    invited_by,
    invited_by_name,
    invited_by_avatar,
}: {
    team_id: string
    team_username: string
    user_id: string
    job_title?: string
    invited_by: string
    invited_by_name: string
    invited_by_avatar?: string
}): Promise<{ member: TeamMember; notification: Notification }> {
    const supabase = await createClient()

    // 1. Insert into team_members
    const { data: member, error: memberError } = await supabase
        .from('team_members')
        .insert([
            {
                team_id,
                team_username,
                user_id,
                job_title,
                status: 'pending',
                invited_by,
            },
        ])
        .select()
        .single()

    if (memberError || !member) throw new Error(memberError?.message || 'Failed to invite')

    // 2. Insert into notifications
    const { data: notification, error: notifError } = await supabase
        .from('notifications')
        .insert([
            {
                user_id, // recipient
                type: 'team_request',
                data: {
                    team_id,
                    team_username,
                    job_title,
                    team_member_id: member.id,
                    invited_by,
                    invited_by_name,
                    invited_by_avatar,
                },
                is_read: false,
            },
        ])
        .select()
        .single()

    if (notifError || !notification) throw new Error(notifError?.message || 'Failed to notify')

    return { member, notification }
}

// 2. Edit member
export async function updateMember({
    id,
    job_title,
    status,
}: {
    id: number
    job_title?: string
    status?: 'pending' | 'accepted' | 'rejected'
}): Promise<TeamMember | null> {
    const currentUser = await userSession()
    const supabase = await createClient()
    const { data: member } = await supabase.from('team_members').select('*').eq('id', id).single()

    if (
        !member ||
        (status &&
            status !== 'pending' &&
            member.user_id !== currentUser.id &&
            member.team_id !== currentUser.id)
    ) {
        throw new Error('Not authorized')
    }
    const { data, error } = await supabase
        .from('team_members')
        .update({
            ...(job_title && { job_title }),
            ...(status && { status }),
        })
        .eq('id', id)
        .select()
        .single()

    if (error) throw new Error(error.message)

    return data as TeamMember
}

// 3. Delete member
export async function deleteMember(id: number): Promise<boolean> {
    const currentUser = await userSession()
    const supabase = await createClient()
    const { data: member } = await supabase.from('team_members').select('*').eq('id', id).single()

    if (!member || member.team_id !== currentUser.id) throw new Error('Not authorized')
    const { error } = await supabase.from('team_members').delete().eq('id', id)

    if (error) throw new Error(error.message)

    return true
}

// 4. Fetch members by team (shopkeeper/admin) id
export async function getMembers(team_id: string): Promise<TeamMember[]> {
    const currentUser = await userSession()

    if (currentUser.id !== team_id) throw new Error('Not authorized')
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .eq('team_id', team_id)
        .eq('status', 'accepted')

    if (error) throw new Error(error.message)

    return (data as TeamMember[]) || []
}

// 4. Get all accepted team members for a team
export async function getTeamMembers(team_id: string) {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .eq('team_id', team_id)
        .eq('status', 'accepted')

    if (error) throw new Error(error.message)

    return data // array of TeamMember
}

// 5. Search users (role 1) by username/phone
export async function searchUsers(query: string): Promise<User[]> {
    const currentUser = await userSession()

    if (![2, 3].includes(currentUser.role as number)) throw new Error('Not authorized')
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .or(`username.ilike.%${query}%,phone.ilike.%${query}%`)
        .eq('role', 1)

    if (error) throw new Error(error.message)

    return (data as User[]) || []
}

// 5. Get all teams where user is an accepted member
export async function getUserTeams(user_id: string) {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .eq('user_id', user_id)
        .eq('status', 'accepted')

    if (error) throw new Error(error.message)

    return data // array of TeamMember
}

// Fetch pending invites for a user
export async function getPendingInvitesForUser(user_id: string) {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .eq('user_id', user_id)
        .eq('status', 'pending')

    if (error) throw new Error(error.message)

    return data as TeamMember[]
}

// Fetch count of pending invites for a user
export async function getPendingInvitesCount(user_id: string) {
    const supabase = await createClient()
    const { count, error } = await supabase
        .from('team_members')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user_id)
        .eq('status', 'pending')

    if (error) throw new Error(error.message)

    return count || 0
}

// 2. Get all notifications for a user
export async function getUserNotifications(user_id: string) {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user_id)
        .order('created_at', { ascending: false })

    if (error) throw new Error(error.message)

    return data // array of Notification
}

// 3. Respond to a team request (accept/reject)
export async function respondToTeamRequest({
    team_member_id,
    status,
}: {
    team_member_id: number
    status: 'accepted' | 'rejected'
}) {
    const supabase = await createClient()
    // 1. Update team_members
    const { error: memberError } = await supabase
        .from('team_members')
        .update({ status })
        .eq('id', team_member_id)

    if (memberError) throw new Error(memberError.message)

    // 2. Mark notification as read
    await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('data->>team_member_id', team_member_id.toString())
        .eq('type', 'team_request')
}
