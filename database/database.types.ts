export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      app_settings: {
        Row: {
          area: string | null
          created_at: string
          id: string
          notes: string | null
          setting: string
          updated_at: string
          value: string | null
        }
        Insert: {
          area?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          setting: string
          updated_at?: string
          value?: string | null
        }
        Update: {
          area?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          setting?: string
          updated_at?: string
          value?: string | null
        }
        Relationships: []
      }
      budget_accounts: {
        Row: {
          account_type: Database["public"]["Enums"]["budget_account_type"]
          available_balance: number | null
          created_at: string
          current_balance: number
          id: string
          institution: string | null
          is_active: boolean
          name: string
          notes: string | null
          owner: Database["public"]["Enums"]["budget_account_owner"] | null
          updated_at: string
        }
        Insert: {
          account_type?: Database["public"]["Enums"]["budget_account_type"]
          available_balance?: number | null
          created_at?: string
          current_balance?: number
          id?: string
          institution?: string | null
          is_active?: boolean
          name: string
          notes?: string | null
          owner?: Database["public"]["Enums"]["budget_account_owner"] | null
          updated_at?: string
        }
        Update: {
          account_type?: Database["public"]["Enums"]["budget_account_type"]
          available_balance?: number | null
          created_at?: string
          current_balance?: number
          id?: string
          institution?: string | null
          is_active?: boolean
          name?: string
          notes?: string | null
          owner?: Database["public"]["Enums"]["budget_account_owner"] | null
          updated_at?: string
        }
        Relationships: []
      }
      budget_categories: {
        Row: {
          category_type: Database["public"]["Enums"]["budget_category_type"]
          created_at: string
          goal_behavior: Database["public"]["Enums"]["budget_goal_behavior"]
          group_name: string | null
          id: string
          is_active: boolean
          monthly_goal_amount: number | null
          name: string
          notes: string | null
          sort_order: number | null
          updated_at: string
        }
        Insert: {
          category_type?: Database["public"]["Enums"]["budget_category_type"]
          created_at?: string
          goal_behavior?: Database["public"]["Enums"]["budget_goal_behavior"]
          group_name?: string | null
          id?: string
          is_active?: boolean
          monthly_goal_amount?: number | null
          name: string
          notes?: string | null
          sort_order?: number | null
          updated_at?: string
        }
        Update: {
          category_type?: Database["public"]["Enums"]["budget_category_type"]
          created_at?: string
          goal_behavior?: Database["public"]["Enums"]["budget_goal_behavior"]
          group_name?: string | null
          id?: string
          is_active?: boolean
          monthly_goal_amount?: number | null
          name?: string
          notes?: string | null
          sort_order?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      budget_merchants: {
        Row: {
          created_at: string
          default_category_id: string | null
          id: string
          name: string
          notes: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          default_category_id?: string | null
          id?: string
          name: string
          notes?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          default_category_id?: string | null
          id?: string
          name?: string
          notes?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "budget_merchants_default_category_id_fkey"
            columns: ["default_category_id"]
            isOneToOne: false
            referencedRelation: "budget_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      budget_savings_bucket_activity: {
        Row: {
          activity_date: string
          activity_type: Database["public"]["Enums"]["budget_savings_bucket_activity_type"]
          amount: number
          bucket_id: string
          created_at: string
          id: string
          notes: string | null
          transaction_id: string | null
          updated_at: string
        }
        Insert: {
          activity_date: string
          activity_type: Database["public"]["Enums"]["budget_savings_bucket_activity_type"]
          amount: number
          bucket_id: string
          created_at?: string
          id?: string
          notes?: string | null
          transaction_id?: string | null
          updated_at?: string
        }
        Update: {
          activity_date?: string
          activity_type?: Database["public"]["Enums"]["budget_savings_bucket_activity_type"]
          amount?: number
          bucket_id?: string
          created_at?: string
          id?: string
          notes?: string | null
          transaction_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "budget_savings_bucket_activity_bucket_id_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "budget_savings_buckets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "budget_savings_bucket_activity_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "budget_transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      budget_savings_buckets: {
        Row: {
          created_at: string
          current_amount: number
          id: string
          name: string
          notes: string | null
          owner: Database["public"]["Enums"]["budget_account_owner"] | null
          status: Database["public"]["Enums"]["budget_savings_bucket_status"]
          target_amount: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          current_amount?: number
          id?: string
          name: string
          notes?: string | null
          owner?: Database["public"]["Enums"]["budget_account_owner"] | null
          status?: Database["public"]["Enums"]["budget_savings_bucket_status"]
          target_amount?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          current_amount?: number
          id?: string
          name?: string
          notes?: string | null
          owner?: Database["public"]["Enums"]["budget_account_owner"] | null
          status?: Database["public"]["Enums"]["budget_savings_bucket_status"]
          target_amount?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      budget_settlement_task_transactions: {
        Row: {
          created_at: string
          id: string
          settlement_task_id: string
          transaction_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          settlement_task_id: string
          transaction_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          settlement_task_id?: string
          transaction_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "budget_settlement_task_transactions_settlement_task_id_fkey"
            columns: ["settlement_task_id"]
            isOneToOne: false
            referencedRelation: "budget_settlement_tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "budget_settlement_task_transactions_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "budget_transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      budget_settlement_tasks: {
        Row: {
          amount_due: number
          basis_amount: number | null
          completed_at: string | null
          created_at: string
          due_date: string | null
          id: string
          notes: string | null
          payer: string
          recipient: string
          share_percentage: number | null
          share_type: Database["public"]["Enums"]["budget_settlement_share_type"]
          source_type: Database["public"]["Enums"]["budget_settlement_source_type"]
          status: Database["public"]["Enums"]["budget_settlement_status"]
          title: string
          updated_at: string
        }
        Insert: {
          amount_due: number
          basis_amount?: number | null
          completed_at?: string | null
          created_at?: string
          due_date?: string | null
          id?: string
          notes?: string | null
          payer: string
          recipient: string
          share_percentage?: number | null
          share_type?: Database["public"]["Enums"]["budget_settlement_share_type"]
          source_type?: Database["public"]["Enums"]["budget_settlement_source_type"]
          status?: Database["public"]["Enums"]["budget_settlement_status"]
          title: string
          updated_at?: string
        }
        Update: {
          amount_due?: number
          basis_amount?: number | null
          completed_at?: string | null
          created_at?: string
          due_date?: string | null
          id?: string
          notes?: string | null
          payer?: string
          recipient?: string
          share_percentage?: number | null
          share_type?: Database["public"]["Enums"]["budget_settlement_share_type"]
          source_type?: Database["public"]["Enums"]["budget_settlement_source_type"]
          status?: Database["public"]["Enums"]["budget_settlement_status"]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      budget_transaction_imports: {
        Row: {
          account_id: string
          created_at: string
          created_count: number
          file_name: string
          id: string
          imported_at: string
          institution: string | null
          notes: string | null
          row_count: number
          skipped_count: number
          updated_at: string
        }
        Insert: {
          account_id: string
          created_at?: string
          created_count?: number
          file_name: string
          id?: string
          imported_at?: string
          institution?: string | null
          notes?: string | null
          row_count?: number
          skipped_count?: number
          updated_at?: string
        }
        Update: {
          account_id?: string
          created_at?: string
          created_count?: number
          file_name?: string
          id?: string
          imported_at?: string
          institution?: string | null
          notes?: string | null
          row_count?: number
          skipped_count?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "budget_transaction_imports_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "budget_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      budget_transactions: {
        Row: {
          account_id: string
          amount: number
          category_id: string | null
          created_at: string
          description: string
          external_id: string | null
          id: string
          import_id: string | null
          merchant: string | null
          merchant_id: string | null
          notes: string | null
          raw_import_data: Json | null
          status: Database["public"]["Enums"]["budget_transaction_status"]
          transaction_date: string
          transaction_type: Database["public"]["Enums"]["budget_transaction_type"]
          updated_at: string
        }
        Insert: {
          account_id: string
          amount: number
          category_id?: string | null
          created_at?: string
          description: string
          external_id?: string | null
          id?: string
          import_id?: string | null
          merchant?: string | null
          merchant_id?: string | null
          notes?: string | null
          raw_import_data?: Json | null
          status?: Database["public"]["Enums"]["budget_transaction_status"]
          transaction_date: string
          transaction_type: Database["public"]["Enums"]["budget_transaction_type"]
          updated_at?: string
        }
        Update: {
          account_id?: string
          amount?: number
          category_id?: string | null
          created_at?: string
          description?: string
          external_id?: string | null
          id?: string
          import_id?: string | null
          merchant?: string | null
          merchant_id?: string | null
          notes?: string | null
          raw_import_data?: Json | null
          status?: Database["public"]["Enums"]["budget_transaction_status"]
          transaction_date?: string
          transaction_type?: Database["public"]["Enums"]["budget_transaction_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "budget_transactions_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "budget_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "budget_transactions_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "budget_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "budget_transactions_import_id_fkey"
            columns: ["import_id"]
            isOneToOne: false
            referencedRelation: "budget_transaction_imports"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "budget_transactions_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "budget_merchants"
            referencedColumns: ["id"]
          },
        ]
      }
      dashboard_attention_items: {
        Row: {
          created_at: string
          domain: Database["public"]["Enums"]["dashboard_item_domain"]
          due_date: string | null
          id: string
          item: string
          notes: string | null
          status: Database["public"]["Enums"]["dashboard_item_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          domain: Database["public"]["Enums"]["dashboard_item_domain"]
          due_date?: string | null
          id?: string
          item: string
          notes?: string | null
          status: Database["public"]["Enums"]["dashboard_item_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          domain?: Database["public"]["Enums"]["dashboard_item_domain"]
          due_date?: string | null
          id?: string
          item?: string
          notes?: string | null
          status?: Database["public"]["Enums"]["dashboard_item_status"]
          updated_at?: string
        }
        Relationships: []
      }
      freelance_workflows: {
        Row: {
          created_at: string
          id: string
          notes: string | null
          priority: Database["public"]["Enums"]["freelance_priority"]
          status: Database["public"]["Enums"]["freelance_workflow_status"]
          updated_at: string
          workflow: string
        }
        Insert: {
          created_at?: string
          id?: string
          notes?: string | null
          priority?: Database["public"]["Enums"]["freelance_priority"]
          status?: Database["public"]["Enums"]["freelance_workflow_status"]
          updated_at?: string
          workflow: string
        }
        Update: {
          created_at?: string
          id?: string
          notes?: string | null
          priority?: Database["public"]["Enums"]["freelance_priority"]
          status?: Database["public"]["Enums"]["freelance_workflow_status"]
          updated_at?: string
          workflow?: string
        }
        Relationships: []
      }
      garden_seed_sowing_windows: {
        Row: {
          created_at: string
          id: string
          notes: string | null
          seed_id: string
          sow_direction: Database["public"]["Enums"]["garden_sow_direction"]
          sow_end_weeks: number
          sow_method: Database["public"]["Enums"]["garden_sow_method"]
          sow_reference: Database["public"]["Enums"]["garden_sow_reference"]
          sow_start_weeks: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          notes?: string | null
          seed_id: string
          sow_direction: Database["public"]["Enums"]["garden_sow_direction"]
          sow_end_weeks: number
          sow_method: Database["public"]["Enums"]["garden_sow_method"]
          sow_reference: Database["public"]["Enums"]["garden_sow_reference"]
          sow_start_weeks: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          notes?: string | null
          seed_id?: string
          sow_direction?: Database["public"]["Enums"]["garden_sow_direction"]
          sow_end_weeks?: number
          sow_method?: Database["public"]["Enums"]["garden_sow_method"]
          sow_reference?: Database["public"]["Enums"]["garden_sow_reference"]
          sow_start_weeks?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "garden_seed_sowing_windows_seed_id_fkey"
            columns: ["seed_id"]
            isOneToOne: false
            referencedRelation: "garden_seeds"
            referencedColumns: ["id"]
          },
        ]
      }
      garden_seed_tasks: {
        Row: {
          completed_at: string | null
          created_at: string
          due_date: string
          id: string
          notes: string | null
          seed_id: string
          status: Database["public"]["Enums"]["garden_seed_task_status"]
          title: string
          updated_at: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          due_date: string
          id?: string
          notes?: string | null
          seed_id: string
          status?: Database["public"]["Enums"]["garden_seed_task_status"]
          title: string
          updated_at?: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          due_date?: string
          id?: string
          notes?: string | null
          seed_id?: string
          status?: Database["public"]["Enums"]["garden_seed_task_status"]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "garden_seed_tasks_seed_id_fkey"
            columns: ["seed_id"]
            isOneToOne: false
            referencedRelation: "garden_seeds"
            referencedColumns: ["id"]
          },
        ]
      }
      garden_seeds: {
        Row: {
          created_at: string
          days_to_emerge: number | null
          days_to_maturity: number | null
          id: string
          is_deer_resistant: boolean | null
          is_succession_planted: boolean
          location_number: string | null
          notes: string | null
          overall_rating: number | null
          purchased_from: string | null
          recommended_sow_method:
            | Database["public"]["Enums"]["garden_sow_method"]
            | null
          row_spacing_inches: number | null
          seed_depth_inches:
            | Database["public"]["Enums"]["garden_seed_depth_inches"]
            | null
          source_image_url: string | null
          source_page_url: string | null
          succession_interval_days: number | null
          sun_type: Database["public"]["Enums"]["garden_sun_type"]
          type: string
          updated_at: string
          variety: string
        }
        Insert: {
          created_at?: string
          days_to_emerge?: number | null
          days_to_maturity?: number | null
          id?: string
          is_deer_resistant?: boolean | null
          is_succession_planted?: boolean
          location_number?: string | null
          notes?: string | null
          overall_rating?: number | null
          purchased_from?: string | null
          recommended_sow_method?:
            | Database["public"]["Enums"]["garden_sow_method"]
            | null
          row_spacing_inches?: number | null
          seed_depth_inches?:
            | Database["public"]["Enums"]["garden_seed_depth_inches"]
            | null
          source_image_url?: string | null
          source_page_url?: string | null
          succession_interval_days?: number | null
          sun_type?: Database["public"]["Enums"]["garden_sun_type"]
          type: string
          updated_at?: string
          variety: string
        }
        Update: {
          created_at?: string
          days_to_emerge?: number | null
          days_to_maturity?: number | null
          id?: string
          is_deer_resistant?: boolean | null
          is_succession_planted?: boolean
          location_number?: string | null
          notes?: string | null
          overall_rating?: number | null
          purchased_from?: string | null
          recommended_sow_method?:
            | Database["public"]["Enums"]["garden_sow_method"]
            | null
          row_spacing_inches?: number | null
          seed_depth_inches?:
            | Database["public"]["Enums"]["garden_seed_depth_inches"]
            | null
          source_image_url?: string | null
          source_page_url?: string | null
          succession_interval_days?: number | null
          sun_type?: Database["public"]["Enums"]["garden_sun_type"]
          type?: string
          updated_at?: string
          variety?: string
        }
        Relationships: []
      }
      home_improvement_projects: {
        Row: {
          actual_total: number | null
          area: string | null
          completed_at: string | null
          created_at: string
          description: string | null
          estimated_total: number | null
          id: string
          notes: string | null
          priority: Database["public"]["Enums"]["home_improvement_priority"]
          status: Database["public"]["Enums"]["home_improvement_project_status"]
          target_end_date: string | null
          target_start_date: string | null
          title: string
          updated_at: string
        }
        Insert: {
          actual_total?: number | null
          area?: string | null
          completed_at?: string | null
          created_at?: string
          description?: string | null
          estimated_total?: number | null
          id?: string
          notes?: string | null
          priority?: Database["public"]["Enums"]["home_improvement_priority"]
          status?: Database["public"]["Enums"]["home_improvement_project_status"]
          target_end_date?: string | null
          target_start_date?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          actual_total?: number | null
          area?: string | null
          completed_at?: string | null
          created_at?: string
          description?: string | null
          estimated_total?: number | null
          id?: string
          notes?: string | null
          priority?: Database["public"]["Enums"]["home_improvement_priority"]
          status?: Database["public"]["Enums"]["home_improvement_project_status"]
          target_end_date?: string | null
          target_start_date?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      home_improvement_todos: {
        Row: {
          completed_at: string | null
          created_at: string
          due_date: string | null
          id: string
          notes: string | null
          project_id: string
          sort_order: number | null
          status: Database["public"]["Enums"]["home_improvement_todo_status"]
          title: string
          updated_at: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          due_date?: string | null
          id?: string
          notes?: string | null
          project_id: string
          sort_order?: number | null
          status?: Database["public"]["Enums"]["home_improvement_todo_status"]
          title: string
          updated_at?: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          due_date?: string | null
          id?: string
          notes?: string | null
          project_id?: string
          sort_order?: number | null
          status?: Database["public"]["Enums"]["home_improvement_todo_status"]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "home_improvement_todos_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "home_improvement_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      home_maintenance_completions: {
        Row: {
          completed_at: string
          completed_by: string | null
          created_at: string
          id: string
          notes: string | null
          task_id: string
          updated_at: string
        }
        Insert: {
          completed_at: string
          completed_by?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          task_id: string
          updated_at?: string
        }
        Update: {
          completed_at?: string
          completed_by?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          task_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "home_maintenance_completions_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "home_maintenance_tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      home_maintenance_task_cadences: {
        Row: {
          cadence_interval: number | null
          cadence_type: Database["public"]["Enums"]["home_maintenance_cadence_type"]
          cadence_unit:
            | Database["public"]["Enums"]["home_maintenance_cadence_unit"]
            | null
          created_at: string
          id: string
          notes: string | null
          preferred_day: number | null
          preferred_month: number | null
          season: Database["public"]["Enums"]["home_maintenance_season"] | null
          task_id: string
          updated_at: string
        }
        Insert: {
          cadence_interval?: number | null
          cadence_type: Database["public"]["Enums"]["home_maintenance_cadence_type"]
          cadence_unit?:
            | Database["public"]["Enums"]["home_maintenance_cadence_unit"]
            | null
          created_at?: string
          id?: string
          notes?: string | null
          preferred_day?: number | null
          preferred_month?: number | null
          season?: Database["public"]["Enums"]["home_maintenance_season"] | null
          task_id: string
          updated_at?: string
        }
        Update: {
          cadence_interval?: number | null
          cadence_type?: Database["public"]["Enums"]["home_maintenance_cadence_type"]
          cadence_unit?:
            | Database["public"]["Enums"]["home_maintenance_cadence_unit"]
            | null
          created_at?: string
          id?: string
          notes?: string | null
          preferred_day?: number | null
          preferred_month?: number | null
          season?: Database["public"]["Enums"]["home_maintenance_season"] | null
          task_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "home_maintenance_task_cadences_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "home_maintenance_tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      home_maintenance_tasks: {
        Row: {
          area: Database["public"]["Enums"]["home_maintenance_area"] | null
          created_at: string
          description: string | null
          id: string
          last_completed_at: string | null
          next_due_date: string | null
          notes: string | null
          priority: Database["public"]["Enums"]["home_maintenance_priority"]
          status: Database["public"]["Enums"]["home_maintenance_task_status"]
          title: string
          updated_at: string
        }
        Insert: {
          area?: Database["public"]["Enums"]["home_maintenance_area"] | null
          created_at?: string
          description?: string | null
          id?: string
          last_completed_at?: string | null
          next_due_date?: string | null
          notes?: string | null
          priority?: Database["public"]["Enums"]["home_maintenance_priority"]
          status?: Database["public"]["Enums"]["home_maintenance_task_status"]
          title: string
          updated_at?: string
        }
        Update: {
          area?: Database["public"]["Enums"]["home_maintenance_area"] | null
          created_at?: string
          description?: string | null
          id?: string
          last_completed_at?: string | null
          next_due_date?: string | null
          notes?: string | null
          priority?: Database["public"]["Enums"]["home_maintenance_priority"]
          status?: Database["public"]["Enums"]["home_maintenance_task_status"]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      household_members: {
        Row: {
          budget_owner: string | null
          created_at: string
          email: string | null
          id: string
          name: string
          notes: string | null
          receives_email: boolean
          role: Database["public"]["Enums"]["household_member_role"]
          updated_at: string
        }
        Insert: {
          budget_owner?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name: string
          notes?: string | null
          receives_email?: boolean
          role?: Database["public"]["Enums"]["household_member_role"]
          updated_at?: string
        }
        Update: {
          budget_owner?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          notes?: string | null
          receives_email?: boolean
          role?: Database["public"]["Enums"]["household_member_role"]
          updated_at?: string
        }
        Relationships: []
      }
      notification_rules: {
        Row: {
          channel: Database["public"]["Enums"]["notification_channel"]
          created_at: string
          domain: string
          enabled: boolean
          id: string
          notes: string | null
          timing: string | null
          updated_at: string
        }
        Insert: {
          channel?: Database["public"]["Enums"]["notification_channel"]
          created_at?: string
          domain: string
          enabled?: boolean
          id?: string
          notes?: string | null
          timing?: string | null
          updated_at?: string
        }
        Update: {
          channel?: Database["public"]["Enums"]["notification_channel"]
          created_at?: string
          domain?: string
          enabled?: boolean
          id?: string
          notes?: string | null
          timing?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      security_controls: {
        Row: {
          area: Database["public"]["Enums"]["security_control_area"]
          control: string
          created_at: string
          id: string
          notes: string | null
          status: Database["public"]["Enums"]["security_control_status"]
          updated_at: string
        }
        Insert: {
          area: Database["public"]["Enums"]["security_control_area"]
          control: string
          created_at?: string
          id?: string
          notes?: string | null
          status?: Database["public"]["Enums"]["security_control_status"]
          updated_at?: string
        }
        Update: {
          area?: Database["public"]["Enums"]["security_control_area"]
          control?: string
          created_at?: string
          id?: string
          notes?: string | null
          status?: Database["public"]["Enums"]["security_control_status"]
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      budget_account_owner: "self" | "spouse" | "joint" | "household"
      budget_account_type:
        | "checking"
        | "savings"
        | "credit_card"
        | "investment"
        | "retirement"
        | "cash"
        | "other"
      budget_category_type: "income" | "expense" | "transfer" | "savings"
      budget_goal_behavior:
        | "keep_under"
        | "spend_exactly"
        | "save_at_least"
        | "track_only"
      budget_savings_bucket_activity_type:
        | "allocation"
        | "withdrawal"
        | "purchase"
        | "adjustment"
      budget_savings_bucket_status:
        | "active"
        | "paused"
        | "completed"
        | "archived"
      budget_settlement_share_type:
        | "half"
        | "full"
        | "percentage"
        | "fixed_amount"
        | "custom"
      budget_settlement_source_type:
        | "bill_split"
        | "balance_difference"
        | "purchase_share"
        | "manual"
        | "other"
      budget_settlement_status: "pending" | "completed" | "canceled" | "skipped"
      budget_transaction_status: "pending" | "cleared" | "reviewed" | "ignored"
      budget_transaction_type: "income" | "expense" | "transfer" | "adjustment"
      dashboard_item_domain:
        | "gardening"
        | "maintenance"
        | "improvements"
        | "budgeting"
      dashboard_item_status:
        | "due_soon"
        | "blocked"
        | "needs_review"
        | "upcoming"
        | "overdue"
        | "in_progress"
        | "action_needed"
        | "good"
      freelance_priority: "low" | "medium" | "high"
      freelance_workflow_status: "reserved" | "future" | "deferred"
      garden_seed_depth_inches: "0" | "0.125" | "0.25" | "0.5" | "0.75" | "1"
      garden_seed_task_status: "pending" | "completed" | "skipped" | "canceled"
      garden_sow_direction: "before" | "after"
      garden_sow_method: "inside" | "outside" | "either"
      garden_sow_reference: "last_frost" | "first_frost"
      garden_sun_type:
        | "full_sun"
        | "partial_sun"
        | "partial_shade"
        | "shade"
        | "unknown"
      home_improvement_priority: "low" | "medium" | "high"
      home_improvement_project_status:
        | "idea"
        | "planned"
        | "in_progress"
        | "blocked"
        | "completed"
        | "canceled"
        | "archived"
      home_improvement_todo_status:
        | "pending"
        | "in_progress"
        | "completed"
        | "skipped"
        | "canceled"
      home_maintenance_area: "interior" | "exterior"
      home_maintenance_cadence_type:
        | "monthly"
        | "seasonal"
        | "yearly"
        | "custom"
      home_maintenance_cadence_unit: "days" | "weeks" | "months" | "years"
      home_maintenance_priority: "low" | "medium" | "high"
      home_maintenance_season: "spring" | "summer" | "fall" | "winter"
      home_maintenance_task_status:
        | "active"
        | "in_progress"
        | "paused"
        | "archived"
      household_member_role: "owner" | "household_member"
      notification_channel: "email" | "ntfy" | "sms"
      security_control_area: "hosting" | "auth" | "data" | "exports"
      security_control_status: "planned" | "in_progress" | "active" | "deferred"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      budget_account_owner: ["self", "spouse", "joint", "household"],
      budget_account_type: [
        "checking",
        "savings",
        "credit_card",
        "investment",
        "retirement",
        "cash",
        "other",
      ],
      budget_category_type: ["income", "expense", "transfer", "savings"],
      budget_goal_behavior: [
        "keep_under",
        "spend_exactly",
        "save_at_least",
        "track_only",
      ],
      budget_savings_bucket_activity_type: [
        "allocation",
        "withdrawal",
        "purchase",
        "adjustment",
      ],
      budget_savings_bucket_status: [
        "active",
        "paused",
        "completed",
        "archived",
      ],
      budget_settlement_share_type: [
        "half",
        "full",
        "percentage",
        "fixed_amount",
        "custom",
      ],
      budget_settlement_source_type: [
        "bill_split",
        "balance_difference",
        "purchase_share",
        "manual",
        "other",
      ],
      budget_settlement_status: ["pending", "completed", "canceled", "skipped"],
      budget_transaction_status: ["pending", "cleared", "reviewed", "ignored"],
      budget_transaction_type: ["income", "expense", "transfer", "adjustment"],
      dashboard_item_domain: [
        "gardening",
        "maintenance",
        "improvements",
        "budgeting",
      ],
      dashboard_item_status: [
        "due_soon",
        "blocked",
        "needs_review",
        "upcoming",
        "overdue",
        "in_progress",
        "action_needed",
        "good",
      ],
      freelance_priority: ["low", "medium", "high"],
      freelance_workflow_status: ["reserved", "future", "deferred"],
      garden_seed_depth_inches: ["0", "0.125", "0.25", "0.5", "0.75", "1"],
      garden_seed_task_status: ["pending", "completed", "skipped", "canceled"],
      garden_sow_direction: ["before", "after"],
      garden_sow_method: ["inside", "outside", "either"],
      garden_sow_reference: ["last_frost", "first_frost"],
      garden_sun_type: [
        "full_sun",
        "partial_sun",
        "partial_shade",
        "shade",
        "unknown",
      ],
      home_improvement_priority: ["low", "medium", "high"],
      home_improvement_project_status: [
        "idea",
        "planned",
        "in_progress",
        "blocked",
        "completed",
        "canceled",
        "archived",
      ],
      home_improvement_todo_status: [
        "pending",
        "in_progress",
        "completed",
        "skipped",
        "canceled",
      ],
      home_maintenance_area: ["interior", "exterior"],
      home_maintenance_cadence_type: [
        "monthly",
        "seasonal",
        "yearly",
        "custom",
      ],
      home_maintenance_cadence_unit: ["days", "weeks", "months", "years"],
      home_maintenance_priority: ["low", "medium", "high"],
      home_maintenance_season: ["spring", "summer", "fall", "winter"],
      home_maintenance_task_status: [
        "active",
        "in_progress",
        "paused",
        "archived",
      ],
      household_member_role: ["owner", "household_member"],
      notification_channel: ["email", "ntfy", "sms"],
      security_control_area: ["hosting", "auth", "data", "exports"],
      security_control_status: ["planned", "in_progress", "active", "deferred"],
    },
  },
} as const
