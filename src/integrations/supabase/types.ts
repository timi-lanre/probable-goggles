export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      advisors: {
        Row: {
          address: string | null
          branch: string | null
          business_phone: string | null
          city: string | null
          created_at: string
          email: string | null
          firm: string | null
          first_name: string | null
          id: string
          last_name: string | null
          linkedin_url: string | null
          mobile_phone: string | null
          postal_code: string | null
          province: string | null
          team_name: string | null
          title: string | null
          updated_at: string
          website_url: string | null
        }
        Insert: {
          address?: string | null
          branch?: string | null
          business_phone?: string | null
          city?: string | null
          created_at?: string
          email?: string | null
          firm?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          linkedin_url?: string | null
          mobile_phone?: string | null
          postal_code?: string | null
          province?: string | null
          team_name?: string | null
          title?: string | null
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          address?: string | null
          branch?: string | null
          business_phone?: string | null
          city?: string | null
          created_at?: string
          email?: string | null
          firm?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          linkedin_url?: string | null
          mobile_phone?: string | null
          postal_code?: string | null
          province?: string | null
          team_name?: string | null
          title?: string | null
          updated_at?: string
          website_url?: string | null
        }
        Relationships: []
      }
      business_metrics: {
        Row: {
          calculated_at: string
          id: string
          metadata: Json | null
          metric_name: string
          metric_value: number
          time_period: string
        }
        Insert: {
          calculated_at?: string
          id?: string
          metadata?: Json | null
          metric_name: string
          metric_value: number
          time_period: string
        }
        Update: {
          calculated_at?: string
          id?: string
          metadata?: Json | null
          metric_name?: string
          metric_value?: number
          time_period?: string
        }
        Relationships: []
      }
      database_metrics: {
        Row: {
          execution_time_ms: number
          id: string
          query_hash: string | null
          query_type: string
          recorded_at: string
          row_count: number | null
          table_name: string
        }
        Insert: {
          execution_time_ms: number
          id?: string
          query_hash?: string | null
          query_type: string
          recorded_at?: string
          row_count?: number | null
          table_name: string
        }
        Update: {
          execution_time_ms?: number
          id?: string
          query_hash?: string | null
          query_type?: string
          recorded_at?: string
          row_count?: number | null
          table_name?: string
        }
        Relationships: []
      }
      favorite_list_items: {
        Row: {
          added_at: string
          advisor_id: string
          favorite_list_id: string
          id: string
        }
        Insert: {
          added_at?: string
          advisor_id: string
          favorite_list_id: string
          id?: string
        }
        Update: {
          added_at?: string
          advisor_id?: string
          favorite_list_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorite_list_items_advisor_id_fkey"
            columns: ["advisor_id"]
            isOneToOne: false
            referencedRelation: "advisors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "favorite_list_items_favorite_list_id_fkey"
            columns: ["favorite_list_id"]
            isOneToOne: false
            referencedRelation: "favorite_lists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_favorite_list_items_advisor_id"
            columns: ["advisor_id"]
            isOneToOne: false
            referencedRelation: "advisors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_favorite_list_items_favorite_list_id"
            columns: ["favorite_list_id"]
            isOneToOne: false
            referencedRelation: "favorite_lists"
            referencedColumns: ["id"]
          },
        ]
      }
      favorite_lists: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_favorite_lists_user_id"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      invitations: {
        Row: {
          accepted_at: string | null
          created_at: string
          email: string
          expires_at: string
          first_name: string | null
          id: string
          invited_by: string
          last_name: string | null
          role: string
          status: string
          token: string
        }
        Insert: {
          accepted_at?: string | null
          created_at?: string
          email: string
          expires_at?: string
          first_name?: string | null
          id?: string
          invited_by: string
          last_name?: string | null
          role?: string
          status?: string
          token: string
        }
        Update: {
          accepted_at?: string | null
          created_at?: string
          email?: string
          expires_at?: string
          first_name?: string | null
          id?: string
          invited_by?: string
          last_name?: string | null
          role?: string
          status?: string
          token?: string
        }
        Relationships: []
      }
      issue_reports: {
        Row: {
          advisor_id: string
          column_name: string
          created_at: string
          id: string
          issue_description: string
          resolved_at: string | null
          resolved_by: string | null
          status: string | null
          user_id: string
        }
        Insert: {
          advisor_id: string
          column_name: string
          created_at?: string
          id?: string
          issue_description: string
          resolved_at?: string | null
          resolved_by?: string | null
          status?: string | null
          user_id: string
        }
        Update: {
          advisor_id?: string
          column_name?: string
          created_at?: string
          id?: string
          issue_description?: string
          resolved_at?: string | null
          resolved_by?: string | null
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "issue_reports_advisor_id_fkey"
            columns: ["advisor_id"]
            isOneToOne: false
            referencedRelation: "advisors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "issue_reports_resolved_by_fkey"
            columns: ["resolved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "issue_reports_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          first_name: string | null
          id: string
          last_name: string | null
          password_reset_at: string | null
          password_reset_required: boolean | null
          role: Database["public"]["Enums"]["app_role"]
          two_factor_enabled: boolean | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          first_name?: string | null
          id: string
          last_name?: string | null
          password_reset_at?: string | null
          password_reset_required?: boolean | null
          role?: Database["public"]["Enums"]["app_role"]
          two_factor_enabled?: boolean | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          password_reset_at?: string | null
          password_reset_required?: boolean | null
          role?: Database["public"]["Enums"]["app_role"]
          two_factor_enabled?: boolean | null
          updated_at?: string
        }
        Relationships: []
      }
      reports: {
        Row: {
          advisor_ids: string[]
          created_at: string
          description: string | null
          id: string
          name: string
          search_filters: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          advisor_ids: string[]
          created_at?: string
          description?: string | null
          id?: string
          name: string
          search_filters?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          advisor_ids?: string[]
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          search_filters?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_reports_user_id"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      system_metrics: {
        Row: {
          endpoint: string | null
          id: string
          metadata: Json | null
          metric_type: string
          metric_unit: string
          metric_value: number
          recorded_at: string
        }
        Insert: {
          endpoint?: string | null
          id?: string
          metadata?: Json | null
          metric_type: string
          metric_unit: string
          metric_value: number
          recorded_at?: string
        }
        Update: {
          endpoint?: string | null
          id?: string
          metadata?: Json | null
          metric_type?: string
          metric_unit?: string
          metric_value?: number
          recorded_at?: string
        }
        Relationships: []
      }
      uptime_logs: {
        Row: {
          checked_at: string
          error_message: string | null
          id: string
          response_time_ms: number | null
          service_name: string
          status: string
        }
        Insert: {
          checked_at?: string
          error_message?: string | null
          id?: string
          response_time_ms?: number | null
          service_name: string
          status: string
        }
        Update: {
          checked_at?: string
          error_message?: string | null
          id?: string
          response_time_ms?: number | null
          service_name?: string
          status?: string
        }
        Relationships: []
      }
      user_2fa_codes: {
        Row: {
          code: string
          created_at: string
          expires_at: string
          id: string
          purpose: string
          used_at: string | null
          user_id: string
        }
        Insert: {
          code: string
          created_at?: string
          expires_at: string
          id?: string
          purpose?: string
          used_at?: string | null
          user_id: string
        }
        Update: {
          code?: string
          created_at?: string
          expires_at?: string
          id?: string
          purpose?: string
          used_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_2fa_settings: {
        Row: {
          backup_codes: string[] | null
          created_at: string
          id: string
          is_enabled: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          backup_codes?: string[] | null
          created_at?: string
          id?: string
          is_enabled?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          backup_codes?: string[] | null
          created_at?: string
          id?: string
          is_enabled?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_analytics: {
        Row: {
          event_data: Json | null
          event_type: string
          id: string
          ip_address: unknown | null
          recorded_at: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          event_data?: Json | null
          event_type: string
          id?: string
          ip_address?: unknown | null
          recorded_at?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          event_data?: Json | null
          event_type?: string
          id?: string
          ip_address?: unknown | null
          recorded_at?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      advisor_filter_options: {
        Row: {
          branches: string[] | null
          cities: string[] | null
          firms: string[] | null
          provinces: string[] | null
          teams: string[] | null
        }
        Relationships: []
      }
      advisor_filter_options_optimized: {
        Row: {
          branches: string[] | null
          cities: string[] | null
          firms: string[] | null
          provinces: string[] | null
          teams: string[] | null
        }
        Relationships: []
      }
    }
    Functions: {
      cleanup_expired_2fa_codes: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      cleanup_expired_invitations: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      generate_backup_codes: {
        Args: Record<PropertyKey, never>
        Returns: string[]
      }
      get_cascading_filter_options: {
        Args: {
          selected_provinces?: string[]
          selected_cities?: string[]
          selected_firms?: string[]
          selected_branches?: string[]
          selected_teams?: string[]
        }
        Returns: Json
      }
      get_cascading_filter_options_optimized: {
        Args: {
          selected_provinces?: string[]
          selected_cities?: string[]
          selected_firms?: string[]
          selected_branches?: string[]
          selected_teams?: string[]
        }
        Returns: Json
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_favorite_list_count: {
        Args: { list_id: string }
        Returns: number
      }
      get_single_filter_options: {
        Args: {
          target_column: string
          selected_provinces?: string[]
          selected_cities?: string[]
          selected_firms?: string[]
          selected_branches?: string[]
          selected_teams?: string[]
          max_results?: number
        }
        Returns: Json
      }
      is_admin: {
        Args: { user_id: string }
        Returns: boolean
      }
      is_advisor_in_favorite_list: {
        Args: { list_id: string; advisor_id: string }
        Returns: boolean
      }
      is_current_user_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      search_advisors_optimized: {
        Args: {
          search_text?: string
          filter_provinces?: string[]
          filter_cities?: string[]
          filter_firms?: string[]
          filter_branches?: string[]
          filter_teams?: string[]
          page_size?: number
          page_offset?: number
        }
        Returns: {
          id: string
          first_name: string
          last_name: string
          title: string
          firm: string
          branch: string
          team_name: string
          city: string
          province: string
          email: string
          linkedin_url: string
          website_url: string
          total_count: number
        }[]
      }
      test_cascading_logic: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
