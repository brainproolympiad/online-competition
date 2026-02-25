// src/pages/dashboards/utils/adminUtils.ts
export const LOCAL_STORAGE_KEYS = {
    ADMIN_SETTINGS: "admin_dashboard_settings",
    PARTICIPANTS_CACHE: "participants_cache",
    LAST_FETCH_TIME: "last_fetch_time",
};
export const saveToLocalStorage = (key, data) => {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    }
    catch (error) {
        console.error(`Error saving to localStorage (${key}):`, error);
    }
};
export const normalizeCourses = (courses) => {
    if (!courses)
        return [];
    if (Array.isArray(courses))
        return courses.map(String);
    if (typeof courses === "string") {
        try {
            const parsed = JSON.parse(courses);
            if (Array.isArray(parsed))
                return parsed.map(String);
        }
        catch { }
        return courses.split(",").map((s) => s.trim()).filter(Boolean);
    }
    return [String(courses)];
};
export const normalizeScores = (scores) => {
    if (!scores)
        return null;
    if (typeof scores === "object" && !Array.isArray(scores)) {
        const map = {};
        Object.keys(scores).forEach((k) => {
            const v = parseInt(scores[k], 10);
            map[k] = isNaN(v) ? 0 : v;
        });
        return map;
    }
    if (typeof scores === "string") {
        try {
            const parsed = JSON.parse(scores);
            if (typeof parsed === "object" && !Array.isArray(parsed))
                return normalizeScores(parsed);
        }
        catch { }
        const map = {};
        scores.split(",").forEach((part) => {
            const [k, v] = part.split(":").map((s) => s?.trim());
            if (k)
                map[k] = v ? parseInt(v, 10) || 0 : 0;
        });
        return Object.keys(map).length ? map : null;
    }
    return null;
};
export const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];
