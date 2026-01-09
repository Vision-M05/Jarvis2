export type QuoteStatus = "DRAFT" | "SENT" | "SIGNED" | "REFUSED" | "PENDING";
export type InvoiceStatus = "PAID" | "PENDING" | "LATE";
export type ItemCategory = "GROS OEUVRE" | "ELECTRICITE" | "PLOMBERIE" | "ISOLATION" | "MENUISERIE" | "PEINTURE";

export interface Profile {
    id: string;
    email: string;
    full_name: string | null;
    avatar_url: string | null;
    created_at: string;
}

export interface Client {
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
    address: string | null;
    city: string | null;
    zip: string | null;
    user_id?: string;
    created_at: string;
}

export interface Item {
    id: string;
    reference: string;
    name: string;
    unit: string;
    price_ht: number;
    category: string;
    created_at: string;
}

export interface Quote {
    id: string;
    reference: string;
    client_id: string | null;
    project_name: string | null;
    status: QuoteStatus;
    total_ht: number;
    valid_until: string | null;
    user_id?: string;
    created_at: string;
    updated_at: string;
    // Joined data
    client?: Client;
}

export interface QuoteItem {
    id: string;
    quote_id: string;
    item_id: string | null;
    label: string;
    quantity: number;
    unit_price: number;
    created_at: string;
}

export interface Invoice {
    id: string;
    quote_id: string | null;
    reference: string;
    status: InvoiceStatus;
    total_ht: number;
    billed_percentage: number;
    due_date: string | null;
    created_at: string;
    // Joined data
    quote?: Quote;
}

export interface QuoteWithClient extends Omit<Quote, "client"> {
    client: {
        id: string;
        name: string;
        email: string | null;
    } | null;
}

export interface InvoiceWithQuote extends Omit<Invoice, "quote"> {
    quote: QuoteWithClient | null;
}

// Database type for Supabase client
export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: Profile;
                Insert: Omit<Profile, "created_at">;
                Update: Partial<Omit<Profile, "id">>;
            };
            clients: {
                Row: Client;
                Insert: Omit<Client, "id" | "created_at">;
                Update: Partial<Omit<Client, "id" | "created_at">>;
            };
            items: {
                Row: Item;
                Insert: Omit<Item, "id" | "created_at">;
                Update: Partial<Omit<Item, "id" | "created_at">>;
            };
            quotes: {
                Row: Quote;
                Insert: Omit<Quote, "id" | "created_at" | "updated_at" | "client">;
                Update: Partial<Omit<Quote, "id" | "created_at" | "updated_at" | "client">>;
            };
            quote_items: {
                Row: QuoteItem;
                Insert: Omit<QuoteItem, "id" | "created_at">;
                Update: Partial<Omit<QuoteItem, "id" | "created_at">>;
            };
            invoices: {
                Row: Invoice;
                Insert: Omit<Invoice, "id" | "created_at" | "quote">;
                Update: Partial<Omit<Invoice, "id" | "created_at" | "quote">>;
            };
        };
    };
}
