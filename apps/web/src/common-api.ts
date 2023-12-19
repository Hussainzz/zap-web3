export const fetchEventStats = async (headers: any) => {
  const res = await fetch(`${process.env.ZAP_APP_URL}/api/event/stats`, {
    method: "GET",
    ...(headers && {
      headers: headers(),
    }),
  });
  if (!res.ok) {
    throw new Error("Failed to fetch stats");
  }
  return res.json();
};
