import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatRelativeTime } from "@/lib/utils";
import { FileEdit, Check, Bell, UserPlus } from "lucide-react";

interface Activity {
    id: string;
    type: "quote_created" | "payment_received" | "reminder_sent" | "client_added";
    title: string;
    description: string;
    detail: string;
    timestamp: string;
}

interface RecentActivityProps {
    activities: Activity[];
}

const iconMap = {
    quote_created: { icon: FileEdit, bg: "bg-blue-50", color: "text-blue-600" },
    payment_received: { icon: Check, bg: "bg-emerald-50", color: "text-emerald-600" },
    reminder_sent: { icon: Bell, bg: "bg-orange-50", color: "text-orange-600" },
    client_added: { icon: UserPlus, bg: "bg-slate-100", color: "text-slate-600" },
};

export function RecentActivity({ activities }: RecentActivityProps) {
    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold">Activités Récentes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {activities.map((activity) => {
                    const { icon: Icon, bg, color } = iconMap[activity.type];
                    return (
                        <div key={activity.id} className="flex items-start gap-3">
                            <div className={`rounded-lg p-2 ${bg}`}>
                                <Icon className={`h-4 w-4 ${color}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-slate-900">
                                    {activity.title}{" "}
                                    <span className="font-normal text-slate-600">{activity.description}</span>
                                </p>
                                <p className="text-xs text-slate-500">
                                    {formatRelativeTime(activity.timestamp)} • {activity.detail}
                                </p>
                            </div>
                        </div>
                    );
                })}

                <Button variant="outline" className="w-full mt-4">
                    VOIR TOUT L&apos;HISTORIQUE
                </Button>
            </CardContent>
        </Card>
    );
}
