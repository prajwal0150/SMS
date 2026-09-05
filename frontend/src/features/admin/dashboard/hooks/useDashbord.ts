import { useEffect, useState } from "react";

import { fetchAdminDashboard } from "../services/adminDashboardService";
import type { AdminDashboardData } from "../types/adminDashboardTypes";

const useDashboard = () => {
	const [data, setData] = useState<AdminDashboardData | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let active = true;

		const loadDashboard = async () => {
			setLoading(true);
			setError(null);

			try {
				const dashboard = await fetchAdminDashboard();

				if (active) {
					setData(dashboard);
				}
			} catch (dashboardError) {
				if (active) {
					setError(
						dashboardError instanceof Error
							? dashboardError.message
							: "Unable to load the dashboard.",
					);
				}
			} finally {
				if (active) {
					setLoading(false);
				}
			}
		};

		void loadDashboard();

		return () => {
			active = false;
		};
	}, []);

	return { data, loading, error };
};

export default useDashboard;
