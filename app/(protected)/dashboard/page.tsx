import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import StatCardProps from "@/Components/statCardProps"
import { authoptions } from "@/app/api/auth/[...nextauth]/route";

export default async function DashboardPage() {
	const session = await getServerSession(authoptions);
    console.log("Session in dashboard:", session);

	if (!session) {
		redirect("/login");
	}
	
	

	return (
    <div className="bg-gray-100 w-full  h-[calc(100vh-56px)] text-black">
		<div>
			<StatCardProps title="total balance " amount={45320} change={2150} changeType="amount"/>
			<StatCardProps title="total balance " amount={45320}/>
		</div>
	</div>
  );
}
