export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string
          title: string
          description: string
          image_url: string
          technologies: string[]
          github_url: string
          demo_url: string | null
          featured: boolean
          position: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          image_url: string
          technologies?: string[]
          github_url: string
          demo_url?: string | null
          featured?: boolean
          position?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          image_url?: string
          technologies?: string[]
          github_url?: string
          demo_url?: string | null
          featured?: boolean
          position?: number
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}