import { supabase } from "../../../../lib/supabase";

import type {
	AdminDashboardData,
	AdminEvent,
	AdminNotice,
	DashboardAttendanceStatus,
	DashboardClassSummary,
	DashboardRecentStudent,
	DashboardStatistics,
	DashboardTodayAttendance,
} from "../types/adminDashboardTypes";

const readSingle = async <T>(view: string): Promise<T> => {
	const { data, error } = await supabase.from(view).select("*").single();

	if (error) {
		throw new Error(`${view}: ${error.message}`);
	}

	return data as T;
};

const readMany = async <T>(view: string): Promise<T[]> => {
	const { data, error } = await supabase.from(view).select("*");

	if (error) {
		throw new Error(`${view}: ${error.message}`);
	}

	return (data ?? []) as T[];
};

export const fetchAdminDashboard = async (): Promise<AdminDashboardData> => {
	const [statistics, todayAttendance, attendance, classes, notices, events, recentStudents] =
		await Promise.all([
			readSingle<DashboardStatistics>("admin_dashboard_statistics"),
			readSingle<DashboardTodayAttendance>("admin_dashboard_today_attendance"),
			readMany<DashboardAttendanceStatus>("admin_dashboard_attendance_status"),
			readMany<DashboardClassSummary>("admin_dashboard_students_by_class"),
			readMany<AdminNotice>("admin_dashboard_recent_notices"),
			readMany<AdminEvent>("admin_dashboard_upcoming_events"),
			readMany<DashboardRecentStudent>("admin_dashboard_recent_students"),
		]);

	return {
		statistics,
		todayAttendance,
		attendance,
		classes,
		notices,
		events,
		recentStudents,
	};
};
