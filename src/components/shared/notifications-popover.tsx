"use client";

import { useState } from "react";
import { Bell, FileText, CreditCard, CheckCircle, Clock } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { formatRelativeTime } from "@/lib/utils";

interface Notification {
    id: string;
    type: "quote_signed" | "payment_received" | "invoice_late" | "quote_sent";
    title: string;
    description: string;
    timestamp: Date;
    read: boolean;
}

const mockNotifications: Notification[] = [
    {
        id: "1",
        type: "quote_signed",
        title: "Devis signé",
        description: "M. Thomas a signé le devis DEV-2024-001",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        read: false,
    },
    {
        id: "2",
        type: "payment_received",
        title: "Paiement reçu",
        description: "1 250 € reçus de SARL Durieux",
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
        read: false,
    },
    {
        id: "3",
        type: "invoice_late",
        title: "Facture en retard",
        description: "FAC-2024-003 est en retard de 15 jours",
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
        read: true,
    },
    {
        id: "4",
        type: "quote_sent",
        title: "Devis envoyé",
        description: "DEV-2024-007 envoyé à Mme. Lefebvre",
        timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000),
        read: true,
    },
];

const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
        case "quote_signed":
            return <CheckCircle className="h-4 w-4 text-green-500" />;
        case "payment_received":
            return <CreditCard className="h-4 w-4 text-blue-500" />;
        case "invoice_late":
            return <Clock className="h-4 w-4 text-red-500" />;
        case "quote_sent":
            return <FileText className="h-4 w-4 text-purple-500" />;
    }
};

export function NotificationsPopover() {
    const [notifications, setNotifications] = useState(mockNotifications);
    const [isOpen, setIsOpen] = useState(false);

    const unreadCount = notifications.filter((n) => !n.read).length;

    const markAllAsRead = () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    };

    const markAsRead = (id: string) => {
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, read: true } : n))
        );
    };

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <button className="relative rounded-lg p-2 hover:bg-slate-100">
                    <Bell className="h-5 w-5 text-slate-600" />
                    {unreadCount > 0 && (
                        <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                            {unreadCount}
                        </span>
                    )}
                </button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
                <div className="flex items-center justify-between border-b px-4 py-3">
                    <h4 className="font-semibold text-slate-900">Notifications</h4>
                    {unreadCount > 0 && (
                        <button
                            onClick={markAllAsRead}
                            className="text-xs text-blue-600 hover:underline"
                        >
                            Tout marquer comme lu
                        </button>
                    )}
                </div>
                <div className="max-h-[300px] overflow-y-auto">
                    {notifications.length === 0 ? (
                        <div className="p-6 text-center text-sm text-slate-500">
                            Aucune notification
                        </div>
                    ) : (
                        notifications.map((notification) => (
                            <button
                                key={notification.id}
                                onClick={() => markAsRead(notification.id)}
                                className={`flex w-full items-start gap-3 p-4 text-left hover:bg-slate-50 ${!notification.read ? "bg-blue-50/50" : ""
                                    }`}
                            >
                                <div className="mt-0.5">
                                    {getNotificationIcon(notification.type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-slate-900">
                                        {notification.title}
                                    </p>
                                    <p className="text-xs text-slate-500 truncate">
                                        {notification.description}
                                    </p>
                                    <p className="text-xs text-slate-400 mt-1">
                                        {formatRelativeTime(notification.timestamp)}
                                    </p>
                                </div>
                                {!notification.read && (
                                    <div className="h-2 w-2 rounded-full bg-blue-500" />
                                )}
                            </button>
                        ))
                    )}
                </div>
                <div className="border-t p-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="w-full text-sm"
                        onClick={() => setIsOpen(false)}
                    >
                        Voir toutes les notifications
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    );
}
