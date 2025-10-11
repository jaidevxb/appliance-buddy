CREATE TABLE IF NOT EXISTS "appliances" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"brand" varchar(255) NOT NULL,
	"model" varchar(255) NOT NULL,
	"purchase_date" timestamp NOT NULL,
	"warranty_duration_months" integer NOT NULL,
	"serial_number" varchar(255),
	"purchase_location" varchar(255),
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "linked_documents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"appliance_id" uuid NOT NULL,
	"title" varchar(255) NOT NULL,
	"url" varchar(1000) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "maintenance_tasks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"appliance_id" uuid NOT NULL,
	"task_name" varchar(255) NOT NULL,
	"scheduled_date" timestamp NOT NULL,
	"frequency" varchar(50) NOT NULL,
	"service_provider" jsonb,
	"notes" text,
	"status" varchar(50) NOT NULL,
	"completed_date" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "support_contacts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"appliance_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"company" varchar(255),
	"phone" varchar(50),
	"email" varchar(255),
	"website" varchar(500),
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "linked_documents" ADD CONSTRAINT "linked_documents_appliance_id_appliances_id_fk" FOREIGN KEY ("appliance_id") REFERENCES "appliances"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "maintenance_tasks" ADD CONSTRAINT "maintenance_tasks_appliance_id_appliances_id_fk" FOREIGN KEY ("appliance_id") REFERENCES "appliances"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "support_contacts" ADD CONSTRAINT "support_contacts_appliance_id_appliances_id_fk" FOREIGN KEY ("appliance_id") REFERENCES "appliances"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
