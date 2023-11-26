"use client"

import React, { useEffect, useState } from "react"
import NotificationCard from "./NotificationCard"
import { Database } from "@/supabase/database"
import { createClient } from "@/utils/supabase/client"

interface Data {
	post: {}[]
	profile: {}[]
	comment: {}[]
}

type Notification = Database["public"]["Tables"]["notifications"]["Row"] & Data

interface Props {
	notifications: Notification[]
	currentUserId: string
}

const NotificationsList = ({ notifications }: Props) => {
	const supabase = createClient()
	const [updatedNotifications, setUpdatedNotifications] = useState(notifications)

	const updateNotifications = async () => {
		try {
			const notificationsToUpdate = updatedNotifications.filter((notification) => !notification.is_read)

			if (notificationsToUpdate.length > 0) {
				await Promise.all(
					notificationsToUpdate.map(async (notification) => {
						await supabase.from("notifications").update({ is_read: true }).eq("id", notification.id)
					})
				)

				setUpdatedNotifications((prevNotifications) =>
					prevNotifications.map((notification) =>
						notificationsToUpdate.find((updatedNotification) => updatedNotification.id === notification.id)
							? { ...notification, is_read: true }
							: notification
					)
				)
			}
		} catch (error: any) {
			console.log("Error updating notifications:", error)
		}
	}

	useEffect(() => {
		updateNotifications()
	}, [])

	return (
		<>
			{updatedNotifications && updatedNotifications.length > 0 ? (
				updatedNotifications.map((notification) => <NotificationCard {...notification} key={notification.id} />)
			) : (
				<p className="text-slate-400 my-1.5">No notifications yet.</p>
			)}
		</>
	)
}

export default NotificationsList
