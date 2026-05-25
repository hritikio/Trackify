import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authoptions } from "@/app/api/auth/[...nextauth]/route";
import StatCard from '@/Components/StatCardInfo'

export default async function DashboardPage() {
	const session = await getServerSession(authoptions);
    console.log("Session in dashboard:", session);

	if (!session) {
		redirect("/login");
	}
	
	

	return (
    <div className="bg-gray-100 w-full  h-[calc(100vh-56px)] text-black">
		<div>
			<StatCard />
			
		</div>
	</div>
  );
}

