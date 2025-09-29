export type Json =
	| string
	| number
	| boolean
	| null
	| { [key: string]: Json | undefined }
	| Json[];

export type Database = {
	// Allows to automatically instantiate createClient with right options
	// instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
	__InternalSupabase: {
		PostgrestVersion: "12.2.3 (519615d)";
	};
	public: {
		Tables: {
			audit_change_request_links: {
				Row: {
					audit_id: string;
					change_request_id: string;
					created_at: string;
					id: string;
				};
				Insert: {
					audit_id: string;
					change_request_id: string;
					created_at?: string;
					id?: string;
				};
				Update: {
					audit_id?: string;
					change_request_id?: string;
					created_at?: string;
					id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "audit_change_request_links_audit_id_fkey";
						columns: ["audit_id"];
						isOneToOne: false;
						referencedRelation: "audits";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "audit_change_request_links_change_request_id_fkey";
						columns: ["change_request_id"];
						isOneToOne: false;
						referencedRelation: "change_requests";
						referencedColumns: ["id"];
					}
				];
			};
			audit_findings: {
				Row: {
					assigned_to: string | null;
					audit_date: string;
					audit_id: string;
					audit_type: string;
					auditor_name: string | null;
					batch_id: string | null;
					corrective_action: string | null;
					created_at: string;
					created_by: string;
					description: string;
					due_date: string | null;
					evidence: string | null;
					finding_type: string;
					id: string;
					requirement_reference: string | null;
					stage_id: string | null;
					status: string;
					title: string;
					updated_at: string;
					verification_method: string | null;
					verified_at: string | null;
					verified_by: string | null;
				};
				Insert: {
					assigned_to?: string | null;
					audit_date: string;
					audit_id: string;
					audit_type?: string;
					auditor_name?: string | null;
					batch_id?: string | null;
					corrective_action?: string | null;
					created_at?: string;
					created_by: string;
					description: string;
					due_date?: string | null;
					evidence?: string | null;
					finding_type?: string;
					id?: string;
					requirement_reference?: string | null;
					stage_id?: string | null;
					status?: string;
					title: string;
					updated_at?: string;
					verification_method?: string | null;
					verified_at?: string | null;
					verified_by?: string | null;
				};
				Update: {
					assigned_to?: string | null;
					audit_date?: string;
					audit_id?: string;
					audit_type?: string;
					auditor_name?: string | null;
					batch_id?: string | null;
					corrective_action?: string | null;
					created_at?: string;
					created_by?: string;
					description?: string;
					due_date?: string | null;
					evidence?: string | null;
					finding_type?: string;
					id?: string;
					requirement_reference?: string | null;
					stage_id?: string | null;
					status?: string;
					title?: string;
					updated_at?: string;
					verification_method?: string | null;
					verified_at?: string | null;
					verified_by?: string | null;
				};
				Relationships: [];
			};
			audit_logs: {
				Row: {
					action: string;
					created_at: string;
					id: string;
					ip_address: unknown | null;
					new_values: Json | null;
					old_values: Json | null;
					reason: string | null;
					resource_id: string | null;
					resource_type: string;
					user_agent: string | null;
					user_id: string;
				};
				Insert: {
					action: string;
					created_at?: string;
					id?: string;
					ip_address?: unknown | null;
					new_values?: Json | null;
					old_values?: Json | null;
					reason?: string | null;
					resource_id?: string | null;
					resource_type: string;
					user_agent?: string | null;
					user_id: string;
				};
				Update: {
					action?: string;
					created_at?: string;
					id?: string;
					ip_address?: unknown | null;
					new_values?: Json | null;
					old_values?: Json | null;
					reason?: string | null;
					resource_id?: string | null;
					resource_type?: string;
					user_agent?: string | null;
					user_id?: string;
				};
				Relationships: [];
			};
			audits: {
				Row: {
					audit_number: string;
					auditor: string;
					batch_id: string | null;
					completed_date: string | null;
					created_at: string;
					created_by: string;
					cycle_id: string | null;
					documents: string[] | null;
					findings_count: number | null;
					id: string;
					linked_capa_ids: string[] | null;
					linked_deviation_ids: string[] | null;
					location: string | null;
					notes: string | null;
					open_findings: number | null;
					scheduled_date: string | null;
					scope: string | null;
					status: string;
					title: string;
					type: string;
					updated_at: string;
				};
				Insert: {
					audit_number: string;
					auditor: string;
					batch_id?: string | null;
					completed_date?: string | null;
					created_at?: string;
					created_by: string;
					cycle_id?: string | null;
					documents?: string[] | null;
					findings_count?: number | null;
					id?: string;
					linked_capa_ids?: string[] | null;
					linked_deviation_ids?: string[] | null;
					location?: string | null;
					notes?: string | null;
					open_findings?: number | null;
					scheduled_date?: string | null;
					scope?: string | null;
					status?: string;
					title: string;
					type?: string;
					updated_at?: string;
				};
				Update: {
					audit_number?: string;
					auditor?: string;
					batch_id?: string | null;
					completed_date?: string | null;
					created_at?: string;
					created_by?: string;
					cycle_id?: string | null;
					documents?: string[] | null;
					findings_count?: number | null;
					id?: string;
					linked_capa_ids?: string[] | null;
					linked_deviation_ids?: string[] | null;
					location?: string | null;
					notes?: string | null;
					open_findings?: number | null;
					scheduled_date?: string | null;
					scope?: string | null;
					status?: string;
					title?: string;
					type?: string;
					updated_at?: string;
				};
				Relationships: [];
			};
			batch_photos: {
				Row: {
					batch_id: string;
					created_at: string;
					description: string | null;
					file_name: string;
					file_path: string;
					file_url: string;
					id: string;
					stage_id: string | null;
					updated_at: string;
					uploaded_by: string;
				};
				Insert: {
					batch_id: string;
					created_at?: string;
					description?: string | null;
					file_name: string;
					file_path: string;
					file_url: string;
					id?: string;
					stage_id?: string | null;
					updated_at?: string;
					uploaded_by: string;
				};
				Update: {
					batch_id?: string;
					created_at?: string;
					description?: string | null;
					file_name?: string;
					file_path?: string;
					file_url?: string;
					id?: string;
					stage_id?: string | null;
					updated_at?: string;
					uploaded_by?: string;
				};
				Relationships: [
					{
						foreignKeyName: "batch_photos_batch_id_fkey";
						columns: ["batch_id"];
						isOneToOne: false;
						referencedRelation: "batches";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "batch_photos_batch_id_fkey";
						columns: ["batch_id"];
						isOneToOne: false;
						referencedRelation: "v_batch_daily_summary";
						referencedColumns: ["batch_id"];
					},
					{
						foreignKeyName: "batch_photos_batch_id_fkey";
						columns: ["batch_id"];
						isOneToOne: false;
						referencedRelation: "v_batch_yield_analysis";
						referencedColumns: ["batch_id"];
					},
					{
						foreignKeyName: "batch_photos_stage_id_fkey";
						columns: ["stage_id"];
						isOneToOne: false;
						referencedRelation: "stages";
						referencedColumns: ["id"];
					}
				];
			};
			batch_records: {
				Row: {
					approval_date: string | null;
					approval_signature: string | null;
					assigned_at: string | null;
					batch_id: string;
					batch_number: string;
					created_at: string;
					created_by: string;
					digital_signature_hash: string | null;
					dry_weight: number | null;
					environmental_compliance: boolean | null;
					id: string;
					lab_testing_complete: boolean | null;
					linked_capa_ids: string[] | null;
					linked_coa_ids: string[] | null;
					linked_cycle_id: string | null;
					linked_deviation_ids: string[] | null;
					linked_environmental_ids: string[] | null;
					linked_stage_logs: string[] | null;
					packaging_complete: boolean | null;
					plant_count: number;
					priority: string;
					quality_standards_met: boolean | null;
					regulatory_requirements_met: boolean | null;
					rejection_reason: string | null;
					review_completed_at: string | null;
					review_notes: string | null;
					review_started_at: string | null;
					reviewer: string | null;
					status: string;
					strain: string;
					updated_at: string;
					wet_weight: number | null;
					yield_percentage: number | null;
				};
				Insert: {
					approval_date?: string | null;
					approval_signature?: string | null;
					assigned_at?: string | null;
					batch_id: string;
					batch_number: string;
					created_at?: string;
					created_by: string;
					digital_signature_hash?: string | null;
					dry_weight?: number | null;
					environmental_compliance?: boolean | null;
					id?: string;
					lab_testing_complete?: boolean | null;
					linked_capa_ids?: string[] | null;
					linked_coa_ids?: string[] | null;
					linked_cycle_id?: string | null;
					linked_deviation_ids?: string[] | null;
					linked_environmental_ids?: string[] | null;
					linked_stage_logs?: string[] | null;
					packaging_complete?: boolean | null;
					plant_count?: number;
					priority?: string;
					quality_standards_met?: boolean | null;
					regulatory_requirements_met?: boolean | null;
					rejection_reason?: string | null;
					review_completed_at?: string | null;
					review_notes?: string | null;
					review_started_at?: string | null;
					reviewer?: string | null;
					status?: string;
					strain: string;
					updated_at?: string;
					wet_weight?: number | null;
					yield_percentage?: number | null;
				};
				Update: {
					approval_date?: string | null;
					approval_signature?: string | null;
					assigned_at?: string | null;
					batch_id?: string;
					batch_number?: string;
					created_at?: string;
					created_by?: string;
					digital_signature_hash?: string | null;
					dry_weight?: number | null;
					environmental_compliance?: boolean | null;
					id?: string;
					lab_testing_complete?: boolean | null;
					linked_capa_ids?: string[] | null;
					linked_coa_ids?: string[] | null;
					linked_cycle_id?: string | null;
					linked_deviation_ids?: string[] | null;
					linked_environmental_ids?: string[] | null;
					linked_stage_logs?: string[] | null;
					packaging_complete?: boolean | null;
					plant_count?: number;
					priority?: string;
					quality_standards_met?: boolean | null;
					regulatory_requirements_met?: boolean | null;
					rejection_reason?: string | null;
					review_completed_at?: string | null;
					review_notes?: string | null;
					review_started_at?: string | null;
					reviewer?: string | null;
					status?: string;
					strain?: string;
					updated_at?: string;
					wet_weight?: number | null;
					yield_percentage?: number | null;
				};
				Relationships: [
					{
						foreignKeyName: "batch_records_batch_id_fkey";
						columns: ["batch_id"];
						isOneToOne: true;
						referencedRelation: "batches";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "batch_records_batch_id_fkey";
						columns: ["batch_id"];
						isOneToOne: true;
						referencedRelation: "v_batch_daily_summary";
						referencedColumns: ["batch_id"];
					},
					{
						foreignKeyName: "batch_records_batch_id_fkey";
						columns: ["batch_id"];
						isOneToOne: true;
						referencedRelation: "v_batch_yield_analysis";
						referencedColumns: ["batch_id"];
					},
					{
						foreignKeyName: "batch_records_created_by_fkey";
						columns: ["created_by"];
						isOneToOne: false;
						referencedRelation: "profiles";
						referencedColumns: ["user_id"];
					},
					{
						foreignKeyName: "batch_records_reviewer_fkey";
						columns: ["reviewer"];
						isOneToOne: false;
						referencedRelation: "profiles";
						referencedColumns: ["user_id"];
					}
				];
			};
			batch_releases: {
				Row: {
					batch_id: string;
					created_at: string;
					ebr_id: string;
					id: string;
					quarantine_lifted_at: string | null;
					release_certificate_url: string | null;
					release_conditions: string | null;
					release_date: string;
					released_by: string;
				};
				Insert: {
					batch_id: string;
					created_at?: string;
					ebr_id: string;
					id?: string;
					quarantine_lifted_at?: string | null;
					release_certificate_url?: string | null;
					release_conditions?: string | null;
					release_date?: string;
					released_by: string;
				};
				Update: {
					batch_id?: string;
					created_at?: string;
					ebr_id?: string;
					id?: string;
					quarantine_lifted_at?: string | null;
					release_certificate_url?: string | null;
					release_conditions?: string | null;
					release_date?: string;
					released_by?: string;
				};
				Relationships: [
					{
						foreignKeyName: "batch_releases_ebr_id_fkey";
						columns: ["ebr_id"];
						isOneToOne: false;
						referencedRelation: "qms_ebr";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "batch_releases_released_by_fkey";
						columns: ["released_by"];
						isOneToOne: false;
						referencedRelation: "profiles";
						referencedColumns: ["user_id"];
					},
					{
						foreignKeyName: "fk_batch_releases_released_by";
						columns: ["released_by"];
						isOneToOne: false;
						referencedRelation: "profiles";
						referencedColumns: ["user_id"];
					}
				];
			};
			batch_stages: {
				Row: {
					batch_id: string;
					can_start_next: boolean | null;
					completed_at: string | null;
					created_at: string;
					cycle_stage_id: string | null;
					id: string;
					notes: string | null;
					previous_stage_weight: number | null;
					stage_id: string;
					stage_progression_locked: boolean | null;
					stage_weight: number | null;
					started_at: string | null;
					status: string;
					updated_at: string;
					weight_variance: number | null;
					weight_variance_percentage: number | null;
				};
				Insert: {
					batch_id: string;
					can_start_next?: boolean | null;
					completed_at?: string | null;
					created_at?: string;
					cycle_stage_id?: string | null;
					id?: string;
					notes?: string | null;
					previous_stage_weight?: number | null;
					stage_id: string;
					stage_progression_locked?: boolean | null;
					stage_weight?: number | null;
					started_at?: string | null;
					status?: string;
					updated_at?: string;
					weight_variance?: number | null;
					weight_variance_percentage?: number | null;
				};
				Update: {
					batch_id?: string;
					can_start_next?: boolean | null;
					completed_at?: string | null;
					created_at?: string;
					cycle_stage_id?: string | null;
					id?: string;
					notes?: string | null;
					previous_stage_weight?: number | null;
					stage_id?: string;
					stage_progression_locked?: boolean | null;
					stage_weight?: number | null;
					started_at?: string | null;
					status?: string;
					updated_at?: string;
					weight_variance?: number | null;
					weight_variance_percentage?: number | null;
				};
				Relationships: [
					{
						foreignKeyName: "batch_stages_batch_id_fkey";
						columns: ["batch_id"];
						isOneToOne: false;
						referencedRelation: "batches";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "batch_stages_batch_id_fkey";
						columns: ["batch_id"];
						isOneToOne: false;
						referencedRelation: "v_batch_daily_summary";
						referencedColumns: ["batch_id"];
					},
					{
						foreignKeyName: "batch_stages_batch_id_fkey";
						columns: ["batch_id"];
						isOneToOne: false;
						referencedRelation: "v_batch_yield_analysis";
						referencedColumns: ["batch_id"];
					},
					{
						foreignKeyName: "batch_stages_stage_id_fkey";
						columns: ["stage_id"];
						isOneToOne: false;
						referencedRelation: "stages";
						referencedColumns: ["id"];
					}
				];
			};
			batches: {
				Row: {
					batch_id: string | null;
					clone_date: string | null;
					created_at: string;
					created_by: string;
					current_stage: Database["public"]["Enums"]["growth_stage"];
					cycle_id: string;
					expected_harvest_date: string | null;
					id: string;
					name: string;
					notes: string | null;
					plant_count: number;
					progress: number;
					room: string;
					start_date: string | null;
					status: Database["public"]["Enums"]["batch_status"];
					strain: string;
					strain_id: string | null;
					updated_at: string;
				};
				Insert: {
					batch_id?: string | null;
					clone_date?: string | null;
					created_at?: string;
					created_by: string;
					current_stage?: Database["public"]["Enums"]["growth_stage"];
					cycle_id: string;
					expected_harvest_date?: string | null;
					id?: string;
					name: string;
					notes?: string | null;
					plant_count?: number;
					progress?: number;
					room: string;
					start_date?: string | null;
					status?: Database["public"]["Enums"]["batch_status"];
					strain: string;
					strain_id?: string | null;
					updated_at?: string;
				};
				Update: {
					batch_id?: string | null;
					clone_date?: string | null;
					created_at?: string;
					created_by?: string;
					current_stage?: Database["public"]["Enums"]["growth_stage"];
					cycle_id?: string;
					expected_harvest_date?: string | null;
					id?: string;
					name?: string;
					notes?: string | null;
					plant_count?: number;
					progress?: number;
					room?: string;
					start_date?: string | null;
					status?: Database["public"]["Enums"]["batch_status"];
					strain?: string;
					strain_id?: string | null;
					updated_at?: string;
				};
				Relationships: [
					{
						foreignKeyName: "batches_created_by_fkey";
						columns: ["created_by"];
						isOneToOne: false;
						referencedRelation: "profiles";
						referencedColumns: ["user_id"];
					},
					{
						foreignKeyName: "batches_cycle_id_fkey";
						columns: ["cycle_id"];
						isOneToOne: false;
						referencedRelation: "growth_cycles";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "batches_strain_id_fkey";
						columns: ["strain_id"];
						isOneToOne: false;
						referencedRelation: "strains";
						referencedColumns: ["id"];
					}
				];
			};
			capa_records: {
				Row: {
					actual_completion_date: string | null;
					actual_cost: number | null;
					approval_date: string | null;
					approval_required: boolean | null;
					approved_by: string | null;
					assigned_to: string | null;
					capa_number: string;
					capa_type: string;
					corrective_action: string | null;
					cost_estimate: number | null;
					created_at: string;
					created_by: string;
					description: string | null;
					effectiveness_check: string | null;
					id: string;
					immediate_action: string | null;
					linked_audit_id: string | null;
					linked_deviation_id: string | null;
					preventive_action: string | null;
					priority: string | null;
					root_cause_analysis: string | null;
					status: string;
					target_completion_date: string | null;
					title: string;
					updated_at: string;
					verification_method: string | null;
				};
				Insert: {
					actual_completion_date?: string | null;
					actual_cost?: number | null;
					approval_date?: string | null;
					approval_required?: boolean | null;
					approved_by?: string | null;
					assigned_to?: string | null;
					capa_number: string;
					capa_type?: string;
					corrective_action?: string | null;
					cost_estimate?: number | null;
					created_at?: string;
					created_by: string;
					description?: string | null;
					effectiveness_check?: string | null;
					id?: string;
					immediate_action?: string | null;
					linked_audit_id?: string | null;
					linked_deviation_id?: string | null;
					preventive_action?: string | null;
					priority?: string | null;
					root_cause_analysis?: string | null;
					status?: string;
					target_completion_date?: string | null;
					title: string;
					updated_at?: string;
					verification_method?: string | null;
				};
				Update: {
					actual_completion_date?: string | null;
					actual_cost?: number | null;
					approval_date?: string | null;
					approval_required?: boolean | null;
					approved_by?: string | null;
					assigned_to?: string | null;
					capa_number?: string;
					capa_type?: string;
					corrective_action?: string | null;
					cost_estimate?: number | null;
					created_at?: string;
					created_by?: string;
					description?: string | null;
					effectiveness_check?: string | null;
					id?: string;
					immediate_action?: string | null;
					linked_audit_id?: string | null;
					linked_deviation_id?: string | null;
					preventive_action?: string | null;
					priority?: string | null;
					root_cause_analysis?: string | null;
					status?: string;
					target_completion_date?: string | null;
					title?: string;
					updated_at?: string;
					verification_method?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: "capa_records_assigned_to_fkey";
						columns: ["assigned_to"];
						isOneToOne: false;
						referencedRelation: "profiles";
						referencedColumns: ["user_id"];
					},
					{
						foreignKeyName: "capa_records_linked_deviation_id_fkey";
						columns: ["linked_deviation_id"];
						isOneToOne: false;
						referencedRelation: "deviations";
						referencedColumns: ["id"];
					}
				];
			};
			capas: {
				Row: {
					action_type: string | null;
					assignee: string | null;
					completion_date: string | null;
					created_at: string | null;
					created_by: string;
					description: string | null;
					deviation_id: string | null;
					due_date: string | null;
					effectiveness_review: string | null;
					id: string;
					priority: string | null;
					status: string | null;
					title: string;
					updated_at: string | null;
					verification_date: string | null;
				};
				Insert: {
					action_type?: string | null;
					assignee?: string | null;
					completion_date?: string | null;
					created_at?: string | null;
					created_by: string;
					description?: string | null;
					deviation_id?: string | null;
					due_date?: string | null;
					effectiveness_review?: string | null;
					id?: string;
					priority?: string | null;
					status?: string | null;
					title: string;
					updated_at?: string | null;
					verification_date?: string | null;
				};
				Update: {
					action_type?: string | null;
					assignee?: string | null;
					completion_date?: string | null;
					created_at?: string | null;
					created_by?: string;
					description?: string | null;
					deviation_id?: string | null;
					due_date?: string | null;
					effectiveness_review?: string | null;
					id?: string;
					priority?: string | null;
					status?: string | null;
					title?: string;
					updated_at?: string | null;
					verification_date?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: "capas_assignee_fkey";
						columns: ["assignee"];
						isOneToOne: false;
						referencedRelation: "profiles";
						referencedColumns: ["user_id"];
					},
					{
						foreignKeyName: "capas_created_by_fkey";
						columns: ["created_by"];
						isOneToOne: false;
						referencedRelation: "profiles";
						referencedColumns: ["user_id"];
					},
					{
						foreignKeyName: "capas_deviation_id_fkey";
						columns: ["deviation_id"];
						isOneToOne: false;
						referencedRelation: "deviations";
						referencedColumns: ["id"];
					}
				];
			};
			change_requests: {
				Row: {
					approval_workflow: Json | null;
					attachments: string[] | null;
					created_at: string;
					created_by: string;
					date_approved: string | null;
					date_implemented: string | null;
					date_requested: string;
					description: string | null;
					effective_date: string | null;
					id: string;
					impact_assessment: string | null;
					implementation_plan: string | null;
					linked_batch_ids: string[] | null;
					linked_capa_ids: string[] | null;
					linked_deviation_ids: string[] | null;
					linked_equipment_ids: string[] | null;
					linked_sop_ids: string[] | null;
					priority: string;
					request_number: string;
					requester: string;
					risk_level: string;
					status: string;
					title: string;
					updated_at: string;
					verification_method: string | null;
				};
				Insert: {
					approval_workflow?: Json | null;
					attachments?: string[] | null;
					created_at?: string;
					created_by: string;
					date_approved?: string | null;
					date_implemented?: string | null;
					date_requested?: string;
					description?: string | null;
					effective_date?: string | null;
					id?: string;
					impact_assessment?: string | null;
					implementation_plan?: string | null;
					linked_batch_ids?: string[] | null;
					linked_capa_ids?: string[] | null;
					linked_deviation_ids?: string[] | null;
					linked_equipment_ids?: string[] | null;
					linked_sop_ids?: string[] | null;
					priority?: string;
					request_number: string;
					requester: string;
					risk_level?: string;
					status?: string;
					title: string;
					updated_at?: string;
					verification_method?: string | null;
				};
				Update: {
					approval_workflow?: Json | null;
					attachments?: string[] | null;
					created_at?: string;
					created_by?: string;
					date_approved?: string | null;
					date_implemented?: string | null;
					date_requested?: string;
					description?: string | null;
					effective_date?: string | null;
					id?: string;
					impact_assessment?: string | null;
					implementation_plan?: string | null;
					linked_batch_ids?: string[] | null;
					linked_capa_ids?: string[] | null;
					linked_deviation_ids?: string[] | null;
					linked_equipment_ids?: string[] | null;
					linked_sop_ids?: string[] | null;
					priority?: string;
					request_number?: string;
					requester?: string;
					risk_level?: string;
					status?: string;
					title?: string;
					updated_at?: string;
					verification_method?: string | null;
				};
				Relationships: [];
			};
			cities: {
				Row: {
					created_at: string;
					id: number;
					name: string;
					province: string;
				};
				Insert: {
					created_at?: string;
					id?: number;
					name: string;
					province: string;
				};
				Update: {
					created_at?: string;
					id?: number;
					name?: string;
					province?: string;
				};
				Relationships: [];
			};
			cleaning_logs: {
				Row: {
					attachments: string[] | null;
					cleaning_agent: string;
					created_at: string;
					end_time: string | null;
					id: string;
					linked_batch_id: string | null;
					log_id: string;
					notes: string | null;
					operator: string;
					photos: string[] | null;
					qa_verified_at: string | null;
					qa_verified_by: string | null;
					room_equipment: string;
					start_time: string;
					task_id: string;
					updated_at: string;
				};
				Insert: {
					attachments?: string[] | null;
					cleaning_agent: string;
					created_at?: string;
					end_time?: string | null;
					id?: string;
					linked_batch_id?: string | null;
					log_id: string;
					notes?: string | null;
					operator: string;
					photos?: string[] | null;
					qa_verified_at?: string | null;
					qa_verified_by?: string | null;
					room_equipment: string;
					start_time: string;
					task_id: string;
					updated_at?: string;
				};
				Update: {
					attachments?: string[] | null;
					cleaning_agent?: string;
					created_at?: string;
					end_time?: string | null;
					id?: string;
					linked_batch_id?: string | null;
					log_id?: string;
					notes?: string | null;
					operator?: string;
					photos?: string[] | null;
					qa_verified_at?: string | null;
					qa_verified_by?: string | null;
					room_equipment?: string;
					start_time?: string;
					task_id?: string;
					updated_at?: string;
				};
				Relationships: [
					{
						foreignKeyName: "cleaning_logs_task_id_fkey";
						columns: ["task_id"];
						isOneToOne: false;
						referencedRelation: "cleaning_tasks";
						referencedColumns: ["id"];
					}
				];
			};
			cleaning_tasks: {
				Row: {
					assigned_to: string | null;
					cleaning_agent: string;
					created_at: string;
					created_by: string;
					equipment_id: string | null;
					frequency: string;
					id: string;
					last_completed_date: string | null;
					next_due_date: string | null;
					qa_verification_required: boolean;
					room_area: string;
					status: string;
					task: string;
					task_id: string;
					updated_at: string;
				};
				Insert: {
					assigned_to?: string | null;
					cleaning_agent: string;
					created_at?: string;
					created_by: string;
					equipment_id?: string | null;
					frequency: string;
					id?: string;
					last_completed_date?: string | null;
					next_due_date?: string | null;
					qa_verification_required?: boolean;
					room_area: string;
					status?: string;
					task: string;
					task_id: string;
					updated_at?: string;
				};
				Update: {
					assigned_to?: string | null;
					cleaning_agent?: string;
					created_at?: string;
					created_by?: string;
					equipment_id?: string | null;
					frequency?: string;
					id?: string;
					last_completed_date?: string | null;
					next_due_date?: string | null;
					qa_verification_required?: boolean;
					room_area?: string;
					status?: string;
					task?: string;
					task_id?: string;
					updated_at?: string;
				};
				Relationships: [];
			};
			clients: {
				Row: {
					address: string | null;
					client_type: string;
					company: string | null;
					created_at: string;
					created_by: string;
					email: string;
					id: string;
					license_number: string | null;
					name: string;
					notes: string | null;
					phone: string | null;
					status: string;
					updated_at: string;
				};
				Insert: {
					address?: string | null;
					client_type?: string;
					company?: string | null;
					created_at?: string;
					created_by: string;
					email: string;
					id?: string;
					license_number?: string | null;
					name: string;
					notes?: string | null;
					phone?: string | null;
					status?: string;
					updated_at?: string;
				};
				Update: {
					address?: string | null;
					client_type?: string;
					company?: string | null;
					created_at?: string;
					created_by?: string;
					email?: string;
					id?: string;
					license_number?: string | null;
					name?: string;
					notes?: string | null;
					phone?: string | null;
					status?: string;
					updated_at?: string;
				};
				Relationships: [];
			};
			coa_records: {
				Row: {
					batch_id: string;
					cbd_percentage: number | null;
					created_at: string;
					file_url: string | null;
					harvest_date: string | null;
					heavy_metals_result: string | null;
					id: string;
					lab_name: string;
					microbials_result: string | null;
					mold_result: string | null;
					notes: string | null;
					pesticides_result: string | null;
					strain: string;
					terpenes_percentage: number | null;
					test_date: string;
					thc_percentage: number | null;
					updated_at: string;
					uploaded_by: string;
					visibility: string;
				};
				Insert: {
					batch_id: string;
					cbd_percentage?: number | null;
					created_at?: string;
					file_url?: string | null;
					harvest_date?: string | null;
					heavy_metals_result?: string | null;
					id?: string;
					lab_name: string;
					microbials_result?: string | null;
					mold_result?: string | null;
					notes?: string | null;
					pesticides_result?: string | null;
					strain: string;
					terpenes_percentage?: number | null;
					test_date: string;
					thc_percentage?: number | null;
					updated_at?: string;
					uploaded_by: string;
					visibility?: string;
				};
				Update: {
					batch_id?: string;
					cbd_percentage?: number | null;
					created_at?: string;
					file_url?: string | null;
					harvest_date?: string | null;
					heavy_metals_result?: string | null;
					id?: string;
					lab_name?: string;
					microbials_result?: string | null;
					mold_result?: string | null;
					notes?: string | null;
					pesticides_result?: string | null;
					strain?: string;
					terpenes_percentage?: number | null;
					test_date?: string;
					thc_percentage?: number | null;
					updated_at?: string;
					uploaded_by?: string;
					visibility?: string;
				};
				Relationships: [];
			};
			complaints: {
				Row: {
					assigned_to: string | null;
					complaint_number: string;
					complaint_type: string;
					corrective_action: string | null;
					created_at: string;
					created_by: string;
					customer_email: string | null;
					customer_name: string;
					customer_phone: string | null;
					date_received: string;
					date_resolved: string | null;
					description: string;
					id: string;
					investigation_notes: string | null;
					product_batch_id: string | null;
					product_name: string | null;
					root_cause: string | null;
					severity: string;
					status: string;
					updated_at: string;
				};
				Insert: {
					assigned_to?: string | null;
					complaint_number: string;
					complaint_type?: string;
					corrective_action?: string | null;
					created_at?: string;
					created_by: string;
					customer_email?: string | null;
					customer_name: string;
					customer_phone?: string | null;
					date_received?: string;
					date_resolved?: string | null;
					description: string;
					id?: string;
					investigation_notes?: string | null;
					product_batch_id?: string | null;
					product_name?: string | null;
					root_cause?: string | null;
					severity?: string;
					status?: string;
					updated_at?: string;
				};
				Update: {
					assigned_to?: string | null;
					complaint_number?: string;
					complaint_type?: string;
					corrective_action?: string | null;
					created_at?: string;
					created_by?: string;
					customer_email?: string | null;
					customer_name?: string;
					customer_phone?: string | null;
					date_received?: string;
					date_resolved?: string | null;
					description?: string;
					id?: string;
					investigation_notes?: string | null;
					product_batch_id?: string | null;
					product_name?: string | null;
					root_cause?: string | null;
					severity?: string;
					status?: string;
					updated_at?: string;
				};
				Relationships: [];
			};
			compliance_docs: {
				Row: {
					batch_id: string;
					coa_url: string | null;
					created_at: string | null;
					id: string;
					lab_name: string | null;
					product_id: string | null;
					test_date: string | null;
					test_results: Json | null;
					uploaded_by: string | null;
				};
				Insert: {
					batch_id: string;
					coa_url?: string | null;
					created_at?: string | null;
					id?: string;
					lab_name?: string | null;
					product_id?: string | null;
					test_date?: string | null;
					test_results?: Json | null;
					uploaded_by?: string | null;
				};
				Update: {
					batch_id?: string;
					coa_url?: string | null;
					created_at?: string | null;
					id?: string;
					lab_name?: string | null;
					product_id?: string | null;
					test_date?: string | null;
					test_results?: Json | null;
					uploaded_by?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: "compliance_docs_product_id_fkey";
						columns: ["product_id"];
						isOneToOne: false;
						referencedRelation: "products";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "compliance_docs_uploaded_by_fkey";
						columns: ["uploaded_by"];
						isOneToOne: false;
						referencedRelation: "users";
						referencedColumns: ["id"];
					}
				];
			};
			compliance_events: {
				Row: {
					batch_id: string | null;
					created_at: string | null;
					description: string;
					event_category: string;
					event_type: string;
					id: string;
					impact_score: number | null;
					ip_address: unknown | null;
					metadata: Json | null;
					severity: string | null;
					user_agent: string | null;
					user_id: string | null;
				};
				Insert: {
					batch_id?: string | null;
					created_at?: string | null;
					description: string;
					event_category: string;
					event_type: string;
					id?: string;
					impact_score?: number | null;
					ip_address?: unknown | null;
					metadata?: Json | null;
					severity?: string | null;
					user_agent?: string | null;
					user_id?: string | null;
				};
				Update: {
					batch_id?: string | null;
					created_at?: string | null;
					description?: string;
					event_category?: string;
					event_type?: string;
					id?: string;
					impact_score?: number | null;
					ip_address?: unknown | null;
					metadata?: Json | null;
					severity?: string | null;
					user_agent?: string | null;
					user_id?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: "compliance_events_batch_id_fkey";
						columns: ["batch_id"];
						isOneToOne: false;
						referencedRelation: "batches";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "compliance_events_batch_id_fkey";
						columns: ["batch_id"];
						isOneToOne: false;
						referencedRelation: "v_batch_daily_summary";
						referencedColumns: ["batch_id"];
					},
					{
						foreignKeyName: "compliance_events_batch_id_fkey";
						columns: ["batch_id"];
						isOneToOne: false;
						referencedRelation: "v_batch_yield_analysis";
						referencedColumns: ["batch_id"];
					},
					{
						foreignKeyName: "compliance_events_user_id_fkey";
						columns: ["user_id"];
						isOneToOne: false;
						referencedRelation: "profiles";
						referencedColumns: ["user_id"];
					}
				];
			};
			compliance_scores: {
				Row: {
					batch_id: string | null;
					created_at: string | null;
					eu_gmp_score: number | null;
					gacp_score: number | null;
					gmp_score: number | null;
					id: string;
					last_calculated_at: string | null;
					overall_score: number | null;
					updated_at: string | null;
				};
				Insert: {
					batch_id?: string | null;
					created_at?: string | null;
					eu_gmp_score?: number | null;
					gacp_score?: number | null;
					gmp_score?: number | null;
					id?: string;
					last_calculated_at?: string | null;
					overall_score?: number | null;
					updated_at?: string | null;
				};
				Update: {
					batch_id?: string | null;
					created_at?: string | null;
					eu_gmp_score?: number | null;
					gacp_score?: number | null;
					gmp_score?: number | null;
					id?: string;
					last_calculated_at?: string | null;
					overall_score?: number | null;
					updated_at?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: "compliance_scores_batch_id_fkey";
						columns: ["batch_id"];
						isOneToOne: true;
						referencedRelation: "batches";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "compliance_scores_batch_id_fkey";
						columns: ["batch_id"];
						isOneToOne: true;
						referencedRelation: "v_batch_daily_summary";
						referencedColumns: ["batch_id"];
					},
					{
						foreignKeyName: "compliance_scores_batch_id_fkey";
						columns: ["batch_id"];
						isOneToOne: true;
						referencedRelation: "v_batch_yield_analysis";
						referencedColumns: ["batch_id"];
					}
				];
			};
			cycle_stages: {
				Row: {
					created_at: string;
					cycle_id: string;
					expected_duration_days: number | null;
					id: string;
					is_active: boolean;
					stage_id: string;
					stage_order: number;
					updated_at: string;
				};
				Insert: {
					created_at?: string;
					cycle_id: string;
					expected_duration_days?: number | null;
					id?: string;
					is_active?: boolean;
					stage_id: string;
					stage_order?: number;
					updated_at?: string;
				};
				Update: {
					created_at?: string;
					cycle_id?: string;
					expected_duration_days?: number | null;
					id?: string;
					is_active?: boolean;
					stage_id?: string;
					stage_order?: number;
					updated_at?: string;
				};
				Relationships: [];
			};
			cycle_strains: {
				Row: {
					created_at: string;
					growth_cycle_id: string;
					id: string;
					is_primary: boolean;
					strain_id: string;
				};
				Insert: {
					created_at?: string;
					growth_cycle_id: string;
					id?: string;
					is_primary?: boolean;
					strain_id: string;
				};
				Update: {
					created_at?: string;
					growth_cycle_id?: string;
					id?: string;
					is_primary?: boolean;
					strain_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "cycle_strains_growth_cycle_id_fkey";
						columns: ["growth_cycle_id"];
						isOneToOne: false;
						referencedRelation: "growth_cycles";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "cycle_strains_strain_id_fkey";
						columns: ["strain_id"];
						isOneToOne: false;
						referencedRelation: "strains";
						referencedColumns: ["id"];
					}
				];
			};
			daily_logs: {
				Row: {
					actions: string | null;
					actions_taken: string | null;
					activity_types: string[] | null;
					batch_id: string;
					co2_level: number | null;
					created_at: string;
					date: string;
					humidity: number | null;
					id: string;
					issues: string | null;
					issues_raised: string | null;
					logged_by: string;
					notes: string | null;
					observations: string | null;
					ph_level: number | null;
					photos: string[] | null;
					plant_count: number | null;
					plant_variance: number | null;
					plant_variance_percentage: number | null;
					previous_plant_count: number | null;
					stage: Database["public"]["Enums"]["growth_stage"];
					stage_id: string | null;
					temperature: number | null;
					updated_at: string;
				};
				Insert: {
					actions?: string | null;
					actions_taken?: string | null;
					activity_types?: string[] | null;
					batch_id: string;
					co2_level?: number | null;
					created_at?: string;
					date?: string;
					humidity?: number | null;
					id?: string;
					issues?: string | null;
					issues_raised?: string | null;
					logged_by: string;
					notes?: string | null;
					observations?: string | null;
					ph_level?: number | null;
					photos?: string[] | null;
					plant_count?: number | null;
					plant_variance?: number | null;
					plant_variance_percentage?: number | null;
					previous_plant_count?: number | null;
					stage: Database["public"]["Enums"]["growth_stage"];
					stage_id?: string | null;
					temperature?: number | null;
					updated_at?: string;
				};
				Update: {
					actions?: string | null;
					actions_taken?: string | null;
					activity_types?: string[] | null;
					batch_id?: string;
					co2_level?: number | null;
					created_at?: string;
					date?: string;
					humidity?: number | null;
					id?: string;
					issues?: string | null;
					issues_raised?: string | null;
					logged_by?: string;
					notes?: string | null;
					observations?: string | null;
					ph_level?: number | null;
					photos?: string[] | null;
					plant_count?: number | null;
					plant_variance?: number | null;
					plant_variance_percentage?: number | null;
					previous_plant_count?: number | null;
					stage?: Database["public"]["Enums"]["growth_stage"];
					stage_id?: string | null;
					temperature?: number | null;
					updated_at?: string;
				};
				Relationships: [
					{
						foreignKeyName: "daily_logs_batch_id_fkey";
						columns: ["batch_id"];
						isOneToOne: false;
						referencedRelation: "batches";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "daily_logs_batch_id_fkey";
						columns: ["batch_id"];
						isOneToOne: false;
						referencedRelation: "v_batch_daily_summary";
						referencedColumns: ["batch_id"];
					},
					{
						foreignKeyName: "daily_logs_batch_id_fkey";
						columns: ["batch_id"];
						isOneToOne: false;
						referencedRelation: "v_batch_yield_analysis";
						referencedColumns: ["batch_id"];
					},
					{
						foreignKeyName: "daily_logs_logged_by_fkey";
						columns: ["logged_by"];
						isOneToOne: false;
						referencedRelation: "profiles";
						referencedColumns: ["user_id"];
					},
					{
						foreignKeyName: "daily_logs_stage_id_fkey";
						columns: ["stage_id"];
						isOneToOne: false;
						referencedRelation: "stages";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "fk_daily_logs_logged_by_profiles";
						columns: ["logged_by"];
						isOneToOne: false;
						referencedRelation: "profiles";
						referencedColumns: ["user_id"];
					}
				];
			};
			demo_requests: {
				Row: {
					business_name: string | null;
					created_at: string;
					email: string | null;
					id: string;
					location: string | null;
					name: string | null;
					notification_body: string | null;
					notification_sent: boolean | null;
					notification_subject: string | null;
					phone: string | null;
					surname: string | null;
				};
				Insert: {
					business_name?: string | null;
					created_at?: string;
					email?: string | null;
					id?: string;
					location?: string | null;
					name?: string | null;
					notification_body?: string | null;
					notification_sent?: boolean | null;
					notification_subject?: string | null;
					phone?: string | null;
					surname?: string | null;
				};
				Update: {
					business_name?: string | null;
					created_at?: string;
					email?: string | null;
					id?: string;
					location?: string | null;
					name?: string | null;
					notification_body?: string | null;
					notification_sent?: boolean | null;
					notification_subject?: string | null;
					phone?: string | null;
					surname?: string | null;
				};
				Relationships: [];
			};
			deviations: {
				Row: {
					assignee: string | null;
					auto_generated: boolean;
					batch_id: string | null;
					corrective_action: string | null;
					created_at: string | null;
					description: string | null;
					id: string;
					occurred_at: string | null;
					preventive_action: string | null;
					reported_by: string;
					resolved_at: string | null;
					root_cause: string | null;
					severity: string | null;
					stage_id: string | null;
					status: string | null;
					title: string;
					updated_at: string | null;
				};
				Insert: {
					assignee?: string | null;
					auto_generated?: boolean;
					batch_id?: string | null;
					corrective_action?: string | null;
					created_at?: string | null;
					description?: string | null;
					id?: string;
					occurred_at?: string | null;
					preventive_action?: string | null;
					reported_by: string;
					resolved_at?: string | null;
					root_cause?: string | null;
					severity?: string | null;
					stage_id?: string | null;
					status?: string | null;
					title: string;
					updated_at?: string | null;
				};
				Update: {
					assignee?: string | null;
					auto_generated?: boolean;
					batch_id?: string | null;
					corrective_action?: string | null;
					created_at?: string | null;
					description?: string | null;
					id?: string;
					occurred_at?: string | null;
					preventive_action?: string | null;
					reported_by?: string;
					resolved_at?: string | null;
					root_cause?: string | null;
					severity?: string | null;
					stage_id?: string | null;
					status?: string | null;
					title?: string;
					updated_at?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: "deviations_assignee_fkey";
						columns: ["assignee"];
						isOneToOne: false;
						referencedRelation: "profiles";
						referencedColumns: ["user_id"];
					},
					{
						foreignKeyName: "deviations_reported_by_fkey";
						columns: ["reported_by"];
						isOneToOne: false;
						referencedRelation: "profiles";
						referencedColumns: ["user_id"];
					}
				];
			};
			dispatch_items: {
				Row: {
					available_at_selection: number | null;
					created_at: string;
					dispatch_id: string;
					id: string;
					lot_id: string;
					quantity: number;
					unit_of_measure: string;
				};
				Insert: {
					available_at_selection?: number | null;
					created_at?: string;
					dispatch_id: string;
					id?: string;
					lot_id: string;
					quantity: number;
					unit_of_measure: string;
				};
				Update: {
					available_at_selection?: number | null;
					created_at?: string;
					dispatch_id?: string;
					id?: string;
					lot_id?: string;
					quantity?: number;
					unit_of_measure?: string;
				};
				Relationships: [
					{
						foreignKeyName: "dispatch_items_dispatch_id_fkey";
						columns: ["dispatch_id"];
						isOneToOne: false;
						referencedRelation: "dispatches";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "dispatch_items_lot_id_fkey";
						columns: ["lot_id"];
						isOneToOne: false;
						referencedRelation: "inventory_lots";
						referencedColumns: ["id"];
					}
				];
			};
			dispatches: {
				Row: {
					carrier: string | null;
					client_id: string;
					confirmed_at: string | null;
					created_at: string;
					created_by: string;
					delivered_at: string | null;
					dispatch_number: string;
					driver_name: string | null;
					id: string;
					license_plate: string | null;
					notes: string | null;
					origin_facility: string;
					status: string;
					updated_at: string;
					vehicle_info: string | null;
				};
				Insert: {
					carrier?: string | null;
					client_id: string;
					confirmed_at?: string | null;
					created_at?: string;
					created_by: string;
					delivered_at?: string | null;
					dispatch_number: string;
					driver_name?: string | null;
					id?: string;
					license_plate?: string | null;
					notes?: string | null;
					origin_facility: string;
					status?: string;
					updated_at?: string;
					vehicle_info?: string | null;
				};
				Update: {
					carrier?: string | null;
					client_id?: string;
					confirmed_at?: string | null;
					created_at?: string;
					created_by?: string;
					delivered_at?: string | null;
					dispatch_number?: string;
					driver_name?: string | null;
					id?: string;
					license_plate?: string | null;
					notes?: string | null;
					origin_facility?: string;
					status?: string;
					updated_at?: string;
					vehicle_info?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: "dispatches_client_id_fkey";
						columns: ["client_id"];
						isOneToOne: false;
						referencedRelation: "clients";
						referencedColumns: ["id"];
					}
				];
			};
			documents: {
				Row: {
					approved_at: string | null;
					approved_by: string | null;
					category: string;
					content: string | null;
					created_at: string;
					created_by: string;
					document_number: string;
					effective_date: string | null;
					file_url: string | null;
					id: string;
					next_review_date: string | null;
					review_date: string | null;
					status: string;
					title: string;
					updated_at: string;
					version: string;
				};
				Insert: {
					approved_at?: string | null;
					approved_by?: string | null;
					category: string;
					content?: string | null;
					created_at?: string;
					created_by: string;
					document_number: string;
					effective_date?: string | null;
					file_url?: string | null;
					id?: string;
					next_review_date?: string | null;
					review_date?: string | null;
					status?: string;
					title: string;
					updated_at?: string;
					version?: string;
				};
				Update: {
					approved_at?: string | null;
					approved_by?: string | null;
					category?: string;
					content?: string | null;
					created_at?: string;
					created_by?: string;
					document_number?: string;
					effective_date?: string | null;
					file_url?: string | null;
					id?: string;
					next_review_date?: string | null;
					review_date?: string | null;
					status?: string;
					title?: string;
					updated_at?: string;
					version?: string;
				};
				Relationships: [];
			};
			ebr_review_checklist: {
				Row: {
					checklist_item: string;
					comments: string | null;
					created_at: string;
					ebr_id: string;
					evidence_urls: string[] | null;
					id: string;
					is_compliant: boolean | null;
					item_category: string;
					reviewed_at: string | null;
					reviewer_id: string;
					updated_at: string;
				};
				Insert: {
					checklist_item: string;
					comments?: string | null;
					created_at?: string;
					ebr_id: string;
					evidence_urls?: string[] | null;
					id?: string;
					is_compliant?: boolean | null;
					item_category: string;
					reviewed_at?: string | null;
					reviewer_id: string;
					updated_at?: string;
				};
				Update: {
					checklist_item?: string;
					comments?: string | null;
					created_at?: string;
					ebr_id?: string;
					evidence_urls?: string[] | null;
					id?: string;
					is_compliant?: boolean | null;
					item_category?: string;
					reviewed_at?: string | null;
					reviewer_id?: string;
					updated_at?: string;
				};
				Relationships: [
					{
						foreignKeyName: "ebr_review_checklist_ebr_id_fkey";
						columns: ["ebr_id"];
						isOneToOne: false;
						referencedRelation: "qms_ebr";
						referencedColumns: ["id"];
					}
				];
			};
			ebr_signatures: {
				Row: {
					created_at: string;
					ebr_id: string;
					id: string;
					ip_address: unknown | null;
					signature_method: string;
					signature_reason: string | null;
					signature_type: string;
					signed_at: string;
					signer_id: string;
					user_agent: string | null;
				};
				Insert: {
					created_at?: string;
					ebr_id: string;
					id?: string;
					ip_address?: unknown | null;
					signature_method?: string;
					signature_reason?: string | null;
					signature_type: string;
					signed_at?: string;
					signer_id: string;
					user_agent?: string | null;
				};
				Update: {
					created_at?: string;
					ebr_id?: string;
					id?: string;
					ip_address?: unknown | null;
					signature_method?: string;
					signature_reason?: string | null;
					signature_type?: string;
					signed_at?: string;
					signer_id?: string;
					user_agent?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: "ebr_signatures_ebr_id_fkey";
						columns: ["ebr_id"];
						isOneToOne: false;
						referencedRelation: "qms_ebr";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "ebr_signatures_signer_id_fkey";
						columns: ["signer_id"];
						isOneToOne: false;
						referencedRelation: "profiles";
						referencedColumns: ["user_id"];
					},
					{
						foreignKeyName: "fk_ebr_signatures_signer_id";
						columns: ["signer_id"];
						isOneToOne: false;
						referencedRelation: "profiles";
						referencedColumns: ["user_id"];
					}
				];
			};
			environmental_monitoring: {
				Row: {
					batch_id: string | null;
					co2_level: number | null;
					created_at: string | null;
					ec_level: number | null;
					humidity: number | null;
					id: string;
					light_level: number | null;
					linked_deviation_id: string | null;
					notes: string | null;
					ph_level: number | null;
					recorded_at: string | null;
					recorded_by: string;
					room_name: string;
					sensor_id: string | null;
					source: string | null;
					stage_id: string | null;
					status: string | null;
					target_range_max: number | null;
					target_range_min: number | null;
					temperature: number | null;
				};
				Insert: {
					batch_id?: string | null;
					co2_level?: number | null;
					created_at?: string | null;
					ec_level?: number | null;
					humidity?: number | null;
					id?: string;
					light_level?: number | null;
					linked_deviation_id?: string | null;
					notes?: string | null;
					ph_level?: number | null;
					recorded_at?: string | null;
					recorded_by: string;
					room_name: string;
					sensor_id?: string | null;
					source?: string | null;
					stage_id?: string | null;
					status?: string | null;
					target_range_max?: number | null;
					target_range_min?: number | null;
					temperature?: number | null;
				};
				Update: {
					batch_id?: string | null;
					co2_level?: number | null;
					created_at?: string | null;
					ec_level?: number | null;
					humidity?: number | null;
					id?: string;
					light_level?: number | null;
					linked_deviation_id?: string | null;
					notes?: string | null;
					ph_level?: number | null;
					recorded_at?: string | null;
					recorded_by?: string;
					room_name?: string;
					sensor_id?: string | null;
					source?: string | null;
					stage_id?: string | null;
					status?: string | null;
					target_range_max?: number | null;
					target_range_min?: number | null;
					temperature?: number | null;
				};
				Relationships: [
					{
						foreignKeyName: "environmental_monitoring_batch_id_fkey";
						columns: ["batch_id"];
						isOneToOne: false;
						referencedRelation: "batches";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "environmental_monitoring_batch_id_fkey";
						columns: ["batch_id"];
						isOneToOne: false;
						referencedRelation: "v_batch_daily_summary";
						referencedColumns: ["batch_id"];
					},
					{
						foreignKeyName: "environmental_monitoring_batch_id_fkey";
						columns: ["batch_id"];
						isOneToOne: false;
						referencedRelation: "v_batch_yield_analysis";
						referencedColumns: ["batch_id"];
					},
					{
						foreignKeyName: "environmental_monitoring_recorded_by_fkey";
						columns: ["recorded_by"];
						isOneToOne: false;
						referencedRelation: "profiles";
						referencedColumns: ["user_id"];
					}
				];
			};
			environmental_thresholds: {
				Row: {
					created_at: string;
					created_by: string;
					id: string;
					is_critical: boolean;
					max_value: number | null;
					min_value: number | null;
					parameter: string;
					stage_name: string;
					target_value: number | null;
					tolerance_percentage: number | null;
					updated_at: string;
				};
				Insert: {
					created_at?: string;
					created_by: string;
					id?: string;
					is_critical?: boolean;
					max_value?: number | null;
					min_value?: number | null;
					parameter: string;
					stage_name: string;
					target_value?: number | null;
					tolerance_percentage?: number | null;
					updated_at?: string;
				};
				Update: {
					created_at?: string;
					created_by?: string;
					id?: string;
					is_critical?: boolean;
					max_value?: number | null;
					min_value?: number | null;
					parameter?: string;
					stage_name?: string;
					target_value?: number | null;
					tolerance_percentage?: number | null;
					updated_at?: string;
				};
				Relationships: [];
			};
			equipment_calibration: {
				Row: {
					calibration_frequency_days: number;
					calibration_provider: string | null;
					certificate_number: string | null;
					certificate_url: string | null;
					created_at: string;
					created_by: string;
					equipment_id: string;
					equipment_name: string;
					id: string;
					last_calibration_date: string | null;
					location: string | null;
					next_calibration_date: string | null;
					notes: string | null;
					responsible_person: string | null;
					status: string;
					updated_at: string;
				};
				Insert: {
					calibration_frequency_days?: number;
					calibration_provider?: string | null;
					certificate_number?: string | null;
					certificate_url?: string | null;
					created_at?: string;
					created_by: string;
					equipment_id: string;
					equipment_name: string;
					id?: string;
					last_calibration_date?: string | null;
					location?: string | null;
					next_calibration_date?: string | null;
					notes?: string | null;
					responsible_person?: string | null;
					status?: string;
					updated_at?: string;
				};
				Update: {
					calibration_frequency_days?: number;
					calibration_provider?: string | null;
					certificate_number?: string | null;
					certificate_url?: string | null;
					created_at?: string;
					created_by?: string;
					equipment_id?: string;
					equipment_name?: string;
					id?: string;
					last_calibration_date?: string | null;
					location?: string | null;
					next_calibration_date?: string | null;
					notes?: string | null;
					responsible_person?: string | null;
					status?: string;
					updated_at?: string;
				};
				Relationships: [];
			};
			equipment_calibrations: {
				Row: {
					calibrated_by: string;
					calibration_date: string;
					calibration_result: string;
					certificate_number: string | null;
					created_at: string;
					equipment_id: string;
					equipment_name: string;
					id: string;
					linked_batch_ids: string[] | null;
					next_calibration_date: string | null;
					notes: string | null;
					updated_at: string;
				};
				Insert: {
					calibrated_by: string;
					calibration_date: string;
					calibration_result?: string;
					certificate_number?: string | null;
					created_at?: string;
					equipment_id: string;
					equipment_name: string;
					id?: string;
					linked_batch_ids?: string[] | null;
					next_calibration_date?: string | null;
					notes?: string | null;
					updated_at?: string;
				};
				Update: {
					calibrated_by?: string;
					calibration_date?: string;
					calibration_result?: string;
					certificate_number?: string | null;
					created_at?: string;
					equipment_id?: string;
					equipment_name?: string;
					id?: string;
					linked_batch_ids?: string[] | null;
					next_calibration_date?: string | null;
					notes?: string | null;
					updated_at?: string;
				};
				Relationships: [];
			};
			finished_goods_inventory: {
				Row: {
					batch_id: string | null;
					cbd_percentage: number | null;
					coa_id: string | null;
					cost_per_gram: number | null;
					created_at: string;
					created_by: string;
					expiry_date: string | null;
					id: string;
					package_date: string | null;
					price_per_gram: number | null;
					product_name: string;
					production_cost: number | null;
					qa_status: string;
					quantity_available: number;
					quantity_reserved: number;
					quarantine_status: string | null;
					storage_location: string | null;
					strain: string;
					thc_percentage: number | null;
					total_cost: number | null;
					unit_type: string;
					updated_at: string;
				};
				Insert: {
					batch_id?: string | null;
					cbd_percentage?: number | null;
					coa_id?: string | null;
					cost_per_gram?: number | null;
					created_at?: string;
					created_by: string;
					expiry_date?: string | null;
					id?: string;
					package_date?: string | null;
					price_per_gram?: number | null;
					product_name: string;
					production_cost?: number | null;
					qa_status?: string;
					quantity_available?: number;
					quantity_reserved?: number;
					quarantine_status?: string | null;
					storage_location?: string | null;
					strain: string;
					thc_percentage?: number | null;
					total_cost?: number | null;
					unit_type?: string;
					updated_at?: string;
				};
				Update: {
					batch_id?: string | null;
					cbd_percentage?: number | null;
					coa_id?: string | null;
					cost_per_gram?: number | null;
					created_at?: string;
					created_by?: string;
					expiry_date?: string | null;
					id?: string;
					package_date?: string | null;
					price_per_gram?: number | null;
					product_name?: string;
					production_cost?: number | null;
					qa_status?: string;
					quantity_available?: number;
					quantity_reserved?: number;
					quarantine_status?: string | null;
					storage_location?: string | null;
					strain?: string;
					thc_percentage?: number | null;
					total_cost?: number | null;
					unit_type?: string;
					updated_at?: string;
				};
				Relationships: [
					{
						foreignKeyName: "finished_goods_inventory_batch_id_fkey";
						columns: ["batch_id"];
						isOneToOne: false;
						referencedRelation: "batches";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "finished_goods_inventory_batch_id_fkey";
						columns: ["batch_id"];
						isOneToOne: false;
						referencedRelation: "v_batch_daily_summary";
						referencedColumns: ["batch_id"];
					},
					{
						foreignKeyName: "finished_goods_inventory_batch_id_fkey";
						columns: ["batch_id"];
						isOneToOne: false;
						referencedRelation: "v_batch_yield_analysis";
						referencedColumns: ["batch_id"];
					},
					{
						foreignKeyName: "finished_goods_inventory_coa_id_fkey";
						columns: ["coa_id"];
						isOneToOne: false;
						referencedRelation: "coa_records";
						referencedColumns: ["id"];
					}
				];
			};
			goods_received: {
				Row: {
					attachments: string[] | null;
					condition: string;
					created_at: string;
					id: string;
					notes: string | null;
					partial_delivery: boolean;
					po_id: string | null;
					quality_check_required: boolean;
					quality_check_status: string | null;
					quality_checked_at: string | null;
					quality_checked_by: string | null;
					receipt_number: string;
					received_by: string;
					received_date: string;
					supplier_id: string | null;
					total_items: number;
					updated_at: string;
				};
				Insert: {
					attachments?: string[] | null;
					condition?: string;
					created_at?: string;
					id?: string;
					notes?: string | null;
					partial_delivery?: boolean;
					po_id?: string | null;
					quality_check_required?: boolean;
					quality_check_status?: string | null;
					quality_checked_at?: string | null;
					quality_checked_by?: string | null;
					receipt_number: string;
					received_by: string;
					received_date?: string;
					supplier_id?: string | null;
					total_items?: number;
					updated_at?: string;
				};
				Update: {
					attachments?: string[] | null;
					condition?: string;
					created_at?: string;
					id?: string;
					notes?: string | null;
					partial_delivery?: boolean;
					po_id?: string | null;
					quality_check_required?: boolean;
					quality_check_status?: string | null;
					quality_checked_at?: string | null;
					quality_checked_by?: string | null;
					receipt_number?: string;
					received_by?: string;
					received_date?: string;
					supplier_id?: string | null;
					total_items?: number;
					updated_at?: string;
				};
				Relationships: [
					{
						foreignKeyName: "goods_received_po_id_fkey";
						columns: ["po_id"];
						isOneToOne: false;
						referencedRelation: "purchase_orders";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "goods_received_supplier_id_fkey";
						columns: ["supplier_id"];
						isOneToOne: false;
						referencedRelation: "suppliers";
						referencedColumns: ["id"];
					}
				];
			};
			goods_received_items: {
				Row: {
					batch_number: string | null;
					condition: string;
					created_at: string;
					discrepancy_reason: string | null;
					expiry_date: string | null;
					id: string;
					ordered_quantity: number;
					po_item_id: string | null;
					product_name: string;
					receipt_id: string;
					received_quantity: number;
					unit_price: number | null;
				};
				Insert: {
					batch_number?: string | null;
					condition?: string;
					created_at?: string;
					discrepancy_reason?: string | null;
					expiry_date?: string | null;
					id?: string;
					ordered_quantity: number;
					po_item_id?: string | null;
					product_name: string;
					receipt_id: string;
					received_quantity: number;
					unit_price?: number | null;
				};
				Update: {
					batch_number?: string | null;
					condition?: string;
					created_at?: string;
					discrepancy_reason?: string | null;
					expiry_date?: string | null;
					id?: string;
					ordered_quantity?: number;
					po_item_id?: string | null;
					product_name?: string;
					receipt_id?: string;
					received_quantity?: number;
					unit_price?: number | null;
				};
				Relationships: [
					{
						foreignKeyName: "goods_received_items_receipt_id_fkey";
						columns: ["receipt_id"];
						isOneToOne: false;
						referencedRelation: "goods_received";
						referencedColumns: ["id"];
					}
				];
			};
			growth_cycles: {
				Row: {
					created_at: string;
					created_by: string;
					end_date: string | null;
					facility_location: string;
					id: string;
					name: string;
					notes: string | null;
					start_date: string;
					status: Database["public"]["Enums"]["cycle_status"];
					strains: string[];
					updated_at: string;
				};
				Insert: {
					created_at?: string;
					created_by: string;
					end_date?: string | null;
					facility_location: string;
					id?: string;
					name: string;
					notes?: string | null;
					start_date: string;
					status?: Database["public"]["Enums"]["cycle_status"];
					strains: string[];
					updated_at?: string;
				};
				Update: {
					created_at?: string;
					created_by?: string;
					end_date?: string | null;
					facility_location?: string;
					id?: string;
					name?: string;
					notes?: string | null;
					start_date?: string;
					status?: Database["public"]["Enums"]["cycle_status"];
					strains?: string[];
					updated_at?: string;
				};
				Relationships: [
					{
						foreignKeyName: "growth_cycles_created_by_fkey";
						columns: ["created_by"];
						isOneToOne: false;
						referencedRelation: "profiles";
						referencedColumns: ["user_id"];
					}
				];
			};
			hygiene_checks: {
				Row: {
					attachments: string[] | null;
					check_id: string;
					checked_by: string;
					created_at: string;
					date_time: string;
					employee_id: string;
					gloves_worn: boolean;
					hair_beard_cover: boolean;
					hand_wash: boolean;
					id: string;
					jewellery_removed: boolean;
					linked_batch_id: string | null;
					location: string;
					nail_check: boolean;
					notes: string | null;
					status: string;
					uniform_clean: boolean;
					updated_at: string;
				};
				Insert: {
					attachments?: string[] | null;
					check_id: string;
					checked_by: string;
					created_at?: string;
					date_time?: string;
					employee_id: string;
					gloves_worn?: boolean;
					hair_beard_cover?: boolean;
					hand_wash?: boolean;
					id?: string;
					jewellery_removed?: boolean;
					linked_batch_id?: string | null;
					location: string;
					nail_check?: boolean;
					notes?: string | null;
					status?: string;
					uniform_clean?: boolean;
					updated_at?: string;
				};
				Update: {
					attachments?: string[] | null;
					check_id?: string;
					checked_by?: string;
					created_at?: string;
					date_time?: string;
					employee_id?: string;
					gloves_worn?: boolean;
					hair_beard_cover?: boolean;
					hand_wash?: boolean;
					id?: string;
					jewellery_removed?: boolean;
					linked_batch_id?: string | null;
					location?: string;
					nail_check?: boolean;
					notes?: string | null;
					status?: string;
					uniform_clean?: boolean;
					updated_at?: string;
				};
				Relationships: [];
			};
			inventory: {
				Row: {
					batch_number: string | null;
					created_at: string | null;
					expiry_date: string | null;
					id: string;
					location_id: string | null;
					par_level: number | null;
					product_id: string | null;
					qty: number | null;
					updated_at: string | null;
				};
				Insert: {
					batch_number?: string | null;
					created_at?: string | null;
					expiry_date?: string | null;
					id?: string;
					location_id?: string | null;
					par_level?: number | null;
					product_id?: string | null;
					qty?: number | null;
					updated_at?: string | null;
				};
				Update: {
					batch_number?: string | null;
					created_at?: string | null;
					expiry_date?: string | null;
					id?: string;
					location_id?: string | null;
					par_level?: number | null;
					product_id?: string | null;
					qty?: number | null;
					updated_at?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: "inventory_product_id_fkey";
						columns: ["product_id"];
						isOneToOne: false;
						referencedRelation: "products";
						referencedColumns: ["id"];
					}
				];
			};
			inventory_adjustments: {
				Row: {
					batch_number: string | null;
					id: string;
					product_id: string | null;
					qty_change: number;
					reason: string;
					timestamp: string | null;
					user_id: string | null;
				};
				Insert: {
					batch_number?: string | null;
					id?: string;
					product_id?: string | null;
					qty_change: number;
					reason: string;
					timestamp?: string | null;
					user_id?: string | null;
				};
				Update: {
					batch_number?: string | null;
					id?: string;
					product_id?: string | null;
					qty_change?: number;
					reason?: string;
					timestamp?: string | null;
					user_id?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: "inventory_adjustments_product_id_fkey";
						columns: ["product_id"];
						isOneToOne: false;
						referencedRelation: "products";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "inventory_adjustments_user_id_fkey";
						columns: ["user_id"];
						isOneToOne: false;
						referencedRelation: "users";
						referencedColumns: ["id"];
					}
				];
			};
			inventory_lots: {
				Row: {
					batch_id: string | null;
					coa_approved: boolean | null;
					coa_record_id: string | null;
					created_at: string;
					created_by: string;
					expiry_date: string | null;
					facility: string;
					id: string;
					lot_code: string;
					product_name: string;
					product_type: string;
					quantity: number;
					stage: string;
					status: string;
					strain: string;
					unit_of_measure: string;
					updated_at: string;
				};
				Insert: {
					batch_id?: string | null;
					coa_approved?: boolean | null;
					coa_record_id?: string | null;
					created_at?: string;
					created_by: string;
					expiry_date?: string | null;
					facility: string;
					id?: string;
					lot_code: string;
					product_name: string;
					product_type: string;
					quantity?: number;
					stage: string;
					status?: string;
					strain: string;
					unit_of_measure?: string;
					updated_at?: string;
				};
				Update: {
					batch_id?: string | null;
					coa_approved?: boolean | null;
					coa_record_id?: string | null;
					created_at?: string;
					created_by?: string;
					expiry_date?: string | null;
					facility?: string;
					id?: string;
					lot_code?: string;
					product_name?: string;
					product_type?: string;
					quantity?: number;
					stage?: string;
					status?: string;
					strain?: string;
					unit_of_measure?: string;
					updated_at?: string;
				};
				Relationships: [
					{
						foreignKeyName: "inventory_lots_batch_id_fkey";
						columns: ["batch_id"];
						isOneToOne: false;
						referencedRelation: "batches";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "inventory_lots_batch_id_fkey";
						columns: ["batch_id"];
						isOneToOne: false;
						referencedRelation: "v_batch_daily_summary";
						referencedColumns: ["batch_id"];
					},
					{
						foreignKeyName: "inventory_lots_batch_id_fkey";
						columns: ["batch_id"];
						isOneToOne: false;
						referencedRelation: "v_batch_yield_analysis";
						referencedColumns: ["batch_id"];
					},
					{
						foreignKeyName: "inventory_lots_coa_record_id_fkey";
						columns: ["coa_record_id"];
						isOneToOne: false;
						referencedRelation: "coa_records";
						referencedColumns: ["id"];
					}
				];
			};
			lab_tests: {
				Row: {
					batch_id: string | null;
					certificate_url: string | null;
					created_at: string | null;
					id: string;
					lab_name: string;
					notes: string | null;
					pass_fail: string | null;
					requested_by: string;
					results: Json | null;
					sample_id: string;
					status: string | null;
					test_date: string;
					test_type: string;
					updated_at: string | null;
				};
				Insert: {
					batch_id?: string | null;
					certificate_url?: string | null;
					created_at?: string | null;
					id?: string;
					lab_name: string;
					notes?: string | null;
					pass_fail?: string | null;
					requested_by: string;
					results?: Json | null;
					sample_id: string;
					status?: string | null;
					test_date: string;
					test_type: string;
					updated_at?: string | null;
				};
				Update: {
					batch_id?: string | null;
					certificate_url?: string | null;
					created_at?: string | null;
					id?: string;
					lab_name?: string;
					notes?: string | null;
					pass_fail?: string | null;
					requested_by?: string;
					results?: Json | null;
					sample_id?: string;
					status?: string | null;
					test_date?: string;
					test_type?: string;
					updated_at?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: "lab_tests_batch_id_fkey";
						columns: ["batch_id"];
						isOneToOne: false;
						referencedRelation: "batches";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "lab_tests_batch_id_fkey";
						columns: ["batch_id"];
						isOneToOne: false;
						referencedRelation: "v_batch_daily_summary";
						referencedColumns: ["batch_id"];
					},
					{
						foreignKeyName: "lab_tests_batch_id_fkey";
						columns: ["batch_id"];
						isOneToOne: false;
						referencedRelation: "v_batch_yield_analysis";
						referencedColumns: ["batch_id"];
					},
					{
						foreignKeyName: "lab_tests_requested_by_fkey";
						columns: ["requested_by"];
						isOneToOne: false;
						referencedRelation: "profiles";
						referencedColumns: ["user_id"];
					}
				];
			};
			members: {
				Row: {
					created_at: string | null;
					created_by: string | null;
					email: string | null;
					id: string;
					id_number: string;
					membership_end: string | null;
					membership_start: string | null;
					name: string;
					package_id: string | null;
					phone: string | null;
					photo_url: string | null;
					prescription_url: string | null;
					selfie_url: string | null;
					status: Database["public"]["Enums"]["member_status"] | null;
					updated_at: string | null;
				};
				Insert: {
					created_at?: string | null;
					created_by?: string | null;
					email?: string | null;
					id?: string;
					id_number: string;
					membership_end?: string | null;
					membership_start?: string | null;
					name: string;
					package_id?: string | null;
					phone?: string | null;
					photo_url?: string | null;
					prescription_url?: string | null;
					selfie_url?: string | null;
					status?: Database["public"]["Enums"]["member_status"] | null;
					updated_at?: string | null;
				};
				Update: {
					created_at?: string | null;
					created_by?: string | null;
					email?: string | null;
					id?: string;
					id_number?: string;
					membership_end?: string | null;
					membership_start?: string | null;
					name?: string;
					package_id?: string | null;
					phone?: string | null;
					photo_url?: string | null;
					prescription_url?: string | null;
					selfie_url?: string | null;
					status?: Database["public"]["Enums"]["member_status"] | null;
					updated_at?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: "members_created_by_fkey";
						columns: ["created_by"];
						isOneToOne: false;
						referencedRelation: "users";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "members_package_id_fkey";
						columns: ["package_id"];
						isOneToOne: false;
						referencedRelation: "membership_packages";
						referencedColumns: ["id"];
					}
				];
			};
			membership_packages: {
				Row: {
					created_at: string | null;
					created_by_store_id: string | null;
					duration_days: number;
					id: string;
					is_active: boolean | null;
					name: string;
					price: number;
					updated_at: string | null;
				};
				Insert: {
					created_at?: string | null;
					created_by_store_id?: string | null;
					duration_days: number;
					id?: string;
					is_active?: boolean | null;
					name: string;
					price: number;
					updated_at?: string | null;
				};
				Update: {
					created_at?: string | null;
					created_by_store_id?: string | null;
					duration_days?: number;
					id?: string;
					is_active?: boolean | null;
					name?: string;
					price?: number;
					updated_at?: string | null;
				};
				Relationships: [];
			};
			orders: {
				Row: {
					client_id: string;
					created_at: string;
					created_by: string;
					delivery_address: string | null;
					delivery_date: string | null;
					id: string;
					notes: string | null;
					order_date: string;
					order_number: string;
					payment_terms: string | null;
					products: Json;
					quotation_id: string | null;
					status: string;
					subtotal: number;
					tax_amount: number | null;
					total_amount: number;
					updated_at: string;
				};
				Insert: {
					client_id: string;
					created_at?: string;
					created_by: string;
					delivery_address?: string | null;
					delivery_date?: string | null;
					id?: string;
					notes?: string | null;
					order_date?: string;
					order_number: string;
					payment_terms?: string | null;
					products: Json;
					quotation_id?: string | null;
					status?: string;
					subtotal: number;
					tax_amount?: number | null;
					total_amount: number;
					updated_at?: string;
				};
				Update: {
					client_id?: string;
					created_at?: string;
					created_by?: string;
					delivery_address?: string | null;
					delivery_date?: string | null;
					id?: string;
					notes?: string | null;
					order_date?: string;
					order_number?: string;
					payment_terms?: string | null;
					products?: Json;
					quotation_id?: string | null;
					status?: string;
					subtotal?: number;
					tax_amount?: number | null;
					total_amount?: number;
					updated_at?: string;
				};
				Relationships: [
					{
						foreignKeyName: "orders_client_id_fkey";
						columns: ["client_id"];
						isOneToOne: false;
						referencedRelation: "clients";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "orders_quotation_id_fkey";
						columns: ["quotation_id"];
						isOneToOne: false;
						referencedRelation: "quotations";
						referencedColumns: ["id"];
					}
				];
			};
			ppe_inventory: {
				Row: {
					created_at: string;
					created_by: string;
					expiry_date: string | null;
					id: string;
					linked_batch_ids: string[] | null;
					ppe_id: string;
					ppe_type: string;
					quantity_in_stock: number;
					reorder_level: number;
					size: string | null;
					supplier_id: string | null;
					unit_cost: number | null;
					updated_at: string;
				};
				Insert: {
					created_at?: string;
					created_by: string;
					expiry_date?: string | null;
					id?: string;
					linked_batch_ids?: string[] | null;
					ppe_id: string;
					ppe_type: string;
					quantity_in_stock?: number;
					reorder_level?: number;
					size?: string | null;
					supplier_id?: string | null;
					unit_cost?: number | null;
					updated_at?: string;
				};
				Update: {
					created_at?: string;
					created_by?: string;
					expiry_date?: string | null;
					id?: string;
					linked_batch_ids?: string[] | null;
					ppe_id?: string;
					ppe_type?: string;
					quantity_in_stock?: number;
					reorder_level?: number;
					size?: string | null;
					supplier_id?: string | null;
					unit_cost?: number | null;
					updated_at?: string;
				};
				Relationships: [];
			};
			ppe_issuance_logs: {
				Row: {
					created_at: string;
					date_time: string;
					id: string;
					issuance_id: string;
					issued_by: string;
					issued_to: string;
					linked_batch_id: string | null;
					notes: string | null;
					ppe_id: string;
					ppe_type: string;
					quantity_issued: number;
					return_date: string | null;
					return_status: string;
					updated_at: string;
				};
				Insert: {
					created_at?: string;
					date_time?: string;
					id?: string;
					issuance_id: string;
					issued_by: string;
					issued_to: string;
					linked_batch_id?: string | null;
					notes?: string | null;
					ppe_id: string;
					ppe_type: string;
					quantity_issued?: number;
					return_date?: string | null;
					return_status?: string;
					updated_at?: string;
				};
				Update: {
					created_at?: string;
					date_time?: string;
					id?: string;
					issuance_id?: string;
					issued_by?: string;
					issued_to?: string;
					linked_batch_id?: string | null;
					notes?: string | null;
					ppe_id?: string;
					ppe_type?: string;
					quantity_issued?: number;
					return_date?: string | null;
					return_status?: string;
					updated_at?: string;
				};
				Relationships: [
					{
						foreignKeyName: "ppe_issuance_logs_ppe_id_fkey";
						columns: ["ppe_id"];
						isOneToOne: false;
						referencedRelation: "ppe_inventory";
						referencedColumns: ["id"];
					}
				];
			};
			products: {
				Row: {
					batch_id: string | null;
					category: string;
					created_at: string;
					created_by: string;
					current_stock: number;
					id: string;
					location: string | null;
					name: string;
					notes: string | null;
					reorder_level: number;
					sku: string;
					supplier: string | null;
					unit: string;
					updated_at: string;
				};
				Insert: {
					batch_id?: string | null;
					category: string;
					created_at?: string;
					created_by: string;
					current_stock?: number;
					id?: string;
					location?: string | null;
					name: string;
					notes?: string | null;
					reorder_level?: number;
					sku: string;
					supplier?: string | null;
					unit: string;
					updated_at?: string;
				};
				Update: {
					batch_id?: string | null;
					category?: string;
					created_at?: string;
					created_by?: string;
					current_stock?: number;
					id?: string;
					location?: string | null;
					name?: string;
					notes?: string | null;
					reorder_level?: number;
					sku?: string;
					supplier?: string | null;
					unit?: string;
					updated_at?: string;
				};
				Relationships: [];
			};
			profiles: {
				Row: {
					created_at: string;
					email_verified: boolean;
					facility: string | null;
					full_name: string | null;
					id: string;
					invitation_token: string | null;
					role: Database["public"]["Enums"]["app_role"] | null;
					status: string;
					updated_at: string;
					user_id: string;
				};
				Insert: {
					created_at?: string;
					email_verified?: boolean;
					facility?: string | null;
					full_name?: string | null;
					id?: string;
					invitation_token?: string | null;
					role?: Database["public"]["Enums"]["app_role"] | null;
					status?: string;
					updated_at?: string;
					user_id: string;
				};
				Update: {
					created_at?: string;
					email_verified?: boolean;
					facility?: string | null;
					full_name?: string | null;
					id?: string;
					invitation_token?: string | null;
					role?: Database["public"]["Enums"]["app_role"] | null;
					status?: string;
					updated_at?: string;
					user_id?: string;
				};
				Relationships: [];
			};
			promotion_products: {
				Row: {
					created_at: string;
					id: string;
					product_id: string;
					promotion_id: string;
				};
				Insert: {
					created_at?: string;
					id?: string;
					product_id: string;
					promotion_id: string;
				};
				Update: {
					created_at?: string;
					id?: string;
					product_id?: string;
					promotion_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "promotion_products_promotion_id_fkey";
						columns: ["promotion_id"];
						isOneToOne: false;
						referencedRelation: "promotions";
						referencedColumns: ["id"];
					}
				];
			};
			promotions: {
				Row: {
					auto_apply: boolean;
					bundle_price: number | null;
					buy_quantity: number;
					created_at: string;
					created_by: string;
					discount_type: string;
					discount_value: number;
					get_quantity: number;
					id: string;
					limit_per_cart: number | null;
					name: string;
					status: string;
					type: string;
					updated_at: string;
					valid_from: string | null;
					valid_until: string | null;
				};
				Insert: {
					auto_apply?: boolean;
					bundle_price?: number | null;
					buy_quantity?: number;
					created_at?: string;
					created_by: string;
					discount_type?: string;
					discount_value?: number;
					get_quantity?: number;
					id?: string;
					limit_per_cart?: number | null;
					name: string;
					status?: string;
					type?: string;
					updated_at?: string;
					valid_from?: string | null;
					valid_until?: string | null;
				};
				Update: {
					auto_apply?: boolean;
					bundle_price?: number | null;
					buy_quantity?: number;
					created_at?: string;
					created_by?: string;
					discount_type?: string;
					discount_value?: number;
					get_quantity?: number;
					id?: string;
					limit_per_cart?: number | null;
					name?: string;
					status?: string;
					type?: string;
					updated_at?: string;
					valid_from?: string | null;
					valid_until?: string | null;
				};
				Relationships: [];
			};
			purchase_order_items: {
				Row: {
					created_at: string | null;
					id: string;
					po_id: string | null;
					price_per_unit: number;
					product_id: string | null;
					product_name: string | null;
					qty: number;
					received_qty: number | null;
					status: string;
					total_price: number;
				};
				Insert: {
					created_at?: string | null;
					id?: string;
					po_id?: string | null;
					price_per_unit: number;
					product_id?: string | null;
					product_name?: string | null;
					qty: number;
					received_qty?: number | null;
					status?: string;
					total_price: number;
				};
				Update: {
					created_at?: string | null;
					id?: string;
					po_id?: string | null;
					price_per_unit?: number;
					product_id?: string | null;
					product_name?: string | null;
					qty?: number;
					received_qty?: number | null;
					status?: string;
					total_price?: number;
				};
				Relationships: [
					{
						foreignKeyName: "purchase_order_items_po_id_fkey";
						columns: ["po_id"];
						isOneToOne: false;
						referencedRelation: "purchase_orders";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "purchase_order_items_product_id_fkey";
						columns: ["product_id"];
						isOneToOne: false;
						referencedRelation: "products";
						referencedColumns: ["id"];
					}
				];
			};
			purchase_orders: {
				Row: {
					approval_date: string | null;
					approved_by: string | null;
					created_at: string | null;
					created_by: string | null;
					delivery_address: string | null;
					delivery_instructions: string | null;
					expected_delivery_date: string | null;
					fulfilled_at: string | null;
					id: string;
					notes: string | null;
					payment_terms: string | null;
					po_number: string;
					priority: string | null;
					status: Database["public"]["Enums"]["po_status"] | null;
					store_id: string;
					subtotal: number | null;
					supplier_id: string | null;
					total_amount: number | null;
					updated_at: string | null;
					vat_amount: number | null;
					vat_percentage: number | null;
				};
				Insert: {
					approval_date?: string | null;
					approved_by?: string | null;
					created_at?: string | null;
					created_by?: string | null;
					delivery_address?: string | null;
					delivery_instructions?: string | null;
					expected_delivery_date?: string | null;
					fulfilled_at?: string | null;
					id?: string;
					notes?: string | null;
					payment_terms?: string | null;
					po_number: string;
					priority?: string | null;
					status?: Database["public"]["Enums"]["po_status"] | null;
					store_id: string;
					subtotal?: number | null;
					supplier_id?: string | null;
					total_amount?: number | null;
					updated_at?: string | null;
					vat_amount?: number | null;
					vat_percentage?: number | null;
				};
				Update: {
					approval_date?: string | null;
					approved_by?: string | null;
					created_at?: string | null;
					created_by?: string | null;
					delivery_address?: string | null;
					delivery_instructions?: string | null;
					expected_delivery_date?: string | null;
					fulfilled_at?: string | null;
					id?: string;
					notes?: string | null;
					payment_terms?: string | null;
					po_number?: string;
					priority?: string | null;
					status?: Database["public"]["Enums"]["po_status"] | null;
					store_id?: string;
					subtotal?: number | null;
					supplier_id?: string | null;
					total_amount?: number | null;
					updated_at?: string | null;
					vat_amount?: number | null;
					vat_percentage?: number | null;
				};
				Relationships: [
					{
						foreignKeyName: "purchase_orders_created_by_fkey";
						columns: ["created_by"];
						isOneToOne: false;
						referencedRelation: "profiles";
						referencedColumns: ["user_id"];
					},
					{
						foreignKeyName: "purchase_orders_supplier_id_fkey";
						columns: ["supplier_id"];
						isOneToOne: false;
						referencedRelation: "suppliers";
						referencedColumns: ["id"];
					}
				];
			};
			qa_batch_approvals: {
				Row: {
					approved_at: string | null;
					approved_by: string | null;
					attachments: string[] | null;
					batch_id: string;
					coa_id: string | null;
					created_at: string;
					id: string;
					moisture_percentage: number | null;
					notes: string | null;
					packaging_integrity: boolean;
					status: string;
					updated_at: string;
					visual_inspection_pass: boolean;
				};
				Insert: {
					approved_at?: string | null;
					approved_by?: string | null;
					attachments?: string[] | null;
					batch_id: string;
					coa_id?: string | null;
					created_at?: string;
					id?: string;
					moisture_percentage?: number | null;
					notes?: string | null;
					packaging_integrity?: boolean;
					status?: string;
					updated_at?: string;
					visual_inspection_pass?: boolean;
				};
				Update: {
					approved_at?: string | null;
					approved_by?: string | null;
					attachments?: string[] | null;
					batch_id?: string;
					coa_id?: string | null;
					created_at?: string;
					id?: string;
					moisture_percentage?: number | null;
					notes?: string | null;
					packaging_integrity?: boolean;
					status?: string;
					updated_at?: string;
					visual_inspection_pass?: boolean;
				};
				Relationships: [
					{
						foreignKeyName: "fk_qa_batch";
						columns: ["batch_id"];
						isOneToOne: false;
						referencedRelation: "batches";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "fk_qa_batch";
						columns: ["batch_id"];
						isOneToOne: false;
						referencedRelation: "v_batch_daily_summary";
						referencedColumns: ["batch_id"];
					},
					{
						foreignKeyName: "fk_qa_batch";
						columns: ["batch_id"];
						isOneToOne: false;
						referencedRelation: "v_batch_yield_analysis";
						referencedColumns: ["batch_id"];
					},
					{
						foreignKeyName: "fk_qa_coa";
						columns: ["coa_id"];
						isOneToOne: false;
						referencedRelation: "coa_records";
						referencedColumns: ["id"];
					}
				];
			};
			qms_attachments: {
				Row: {
					created_at: string;
					description: string | null;
					file_name: string;
					file_size: number | null;
					file_url: string;
					id: string;
					mime_type: string | null;
					qms_record_id: string;
					uploaded_by: string;
				};
				Insert: {
					created_at?: string;
					description?: string | null;
					file_name: string;
					file_size?: number | null;
					file_url: string;
					id?: string;
					mime_type?: string | null;
					qms_record_id: string;
					uploaded_by: string;
				};
				Update: {
					created_at?: string;
					description?: string | null;
					file_name?: string;
					file_size?: number | null;
					file_url?: string;
					id?: string;
					mime_type?: string | null;
					qms_record_id?: string;
					uploaded_by?: string;
				};
				Relationships: [
					{
						foreignKeyName: "qms_attachments_qms_record_id_fkey";
						columns: ["qms_record_id"];
						isOneToOne: false;
						referencedRelation: "qms_records";
						referencedColumns: ["id"];
					}
				];
			};
			qms_ebr: {
				Row: {
					approved_at: string | null;
					approved_by: string | null;
					batch_id: string;
					batch_name: string;
					completion_date: string | null;
					compliance_score: number | null;
					compliance_status: string;
					created_at: string;
					created_by: string;
					critical_deviations_count: number | null;
					current_stage: string;
					daily_logs_count: number | null;
					ebr_number: string;
					environmental_alerts_count: number | null;
					failed_hygiene_checks_count: number | null;
					final_weight: number | null;
					id: string;
					packaging_complete: boolean | null;
					pass_fail_status: string;
					rejection_reason: string | null;
					requires_reprocessing: boolean | null;
					review_notes: string | null;
					reviewed_at: string | null;
					reviewed_by: string | null;
					stage_reviews_complete: boolean | null;
					start_date: string;
					strain: string;
					total_plant_count: number | null;
					updated_at: string;
					waste_recorded: boolean | null;
				};
				Insert: {
					approved_at?: string | null;
					approved_by?: string | null;
					batch_id: string;
					batch_name: string;
					completion_date?: string | null;
					compliance_score?: number | null;
					compliance_status?: string;
					created_at?: string;
					created_by: string;
					critical_deviations_count?: number | null;
					current_stage: string;
					daily_logs_count?: number | null;
					ebr_number: string;
					environmental_alerts_count?: number | null;
					failed_hygiene_checks_count?: number | null;
					final_weight?: number | null;
					id?: string;
					packaging_complete?: boolean | null;
					pass_fail_status?: string;
					rejection_reason?: string | null;
					requires_reprocessing?: boolean | null;
					review_notes?: string | null;
					reviewed_at?: string | null;
					reviewed_by?: string | null;
					stage_reviews_complete?: boolean | null;
					start_date: string;
					strain: string;
					total_plant_count?: number | null;
					updated_at?: string;
					waste_recorded?: boolean | null;
				};
				Update: {
					approved_at?: string | null;
					approved_by?: string | null;
					batch_id?: string;
					batch_name?: string;
					completion_date?: string | null;
					compliance_score?: number | null;
					compliance_status?: string;
					created_at?: string;
					created_by?: string;
					critical_deviations_count?: number | null;
					current_stage?: string;
					daily_logs_count?: number | null;
					ebr_number?: string;
					environmental_alerts_count?: number | null;
					failed_hygiene_checks_count?: number | null;
					final_weight?: number | null;
					id?: string;
					packaging_complete?: boolean | null;
					pass_fail_status?: string;
					rejection_reason?: string | null;
					requires_reprocessing?: boolean | null;
					review_notes?: string | null;
					reviewed_at?: string | null;
					reviewed_by?: string | null;
					stage_reviews_complete?: boolean | null;
					start_date?: string;
					strain?: string;
					total_plant_count?: number | null;
					updated_at?: string;
					waste_recorded?: boolean | null;
				};
				Relationships: [
					{
						foreignKeyName: "fk_qms_ebr_approved_by";
						columns: ["approved_by"];
						isOneToOne: false;
						referencedRelation: "profiles";
						referencedColumns: ["user_id"];
					},
					{
						foreignKeyName: "fk_qms_ebr_batch_id";
						columns: ["batch_id"];
						isOneToOne: false;
						referencedRelation: "batches";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "fk_qms_ebr_batch_id";
						columns: ["batch_id"];
						isOneToOne: false;
						referencedRelation: "v_batch_daily_summary";
						referencedColumns: ["batch_id"];
					},
					{
						foreignKeyName: "fk_qms_ebr_batch_id";
						columns: ["batch_id"];
						isOneToOne: false;
						referencedRelation: "v_batch_yield_analysis";
						referencedColumns: ["batch_id"];
					},
					{
						foreignKeyName: "fk_qms_ebr_created_by";
						columns: ["created_by"];
						isOneToOne: false;
						referencedRelation: "profiles";
						referencedColumns: ["user_id"];
					}
				];
			};
			qms_records: {
				Row: {
					approved_by: string | null;
					assigned_to: string | null;
					attachments: string[] | null;
					batch_id: string | null;
					completed_date: string | null;
					created_at: string;
					created_by: string;
					cycle_id: string | null;
					data: Json | null;
					description: string | null;
					due_date: string | null;
					id: string;
					parent_record_id: string | null;
					record_type: Database["public"]["Enums"]["qms_record_type"];
					reference_number: string | null;
					reviewed_by: string | null;
					severity: Database["public"]["Enums"]["qms_severity_level"] | null;
					stage_id: string | null;
					status: Database["public"]["Enums"]["qms_record_status"];
					tags: string[] | null;
					title: string;
					updated_at: string;
				};
				Insert: {
					approved_by?: string | null;
					assigned_to?: string | null;
					attachments?: string[] | null;
					batch_id?: string | null;
					completed_date?: string | null;
					created_at?: string;
					created_by: string;
					cycle_id?: string | null;
					data?: Json | null;
					description?: string | null;
					due_date?: string | null;
					id?: string;
					parent_record_id?: string | null;
					record_type: Database["public"]["Enums"]["qms_record_type"];
					reference_number?: string | null;
					reviewed_by?: string | null;
					severity?: Database["public"]["Enums"]["qms_severity_level"] | null;
					stage_id?: string | null;
					status?: Database["public"]["Enums"]["qms_record_status"];
					tags?: string[] | null;
					title: string;
					updated_at?: string;
				};
				Update: {
					approved_by?: string | null;
					assigned_to?: string | null;
					attachments?: string[] | null;
					batch_id?: string | null;
					completed_date?: string | null;
					created_at?: string;
					created_by?: string;
					cycle_id?: string | null;
					data?: Json | null;
					description?: string | null;
					due_date?: string | null;
					id?: string;
					parent_record_id?: string | null;
					record_type?: Database["public"]["Enums"]["qms_record_type"];
					reference_number?: string | null;
					reviewed_by?: string | null;
					severity?: Database["public"]["Enums"]["qms_severity_level"] | null;
					stage_id?: string | null;
					status?: Database["public"]["Enums"]["qms_record_status"];
					tags?: string[] | null;
					title?: string;
					updated_at?: string;
				};
				Relationships: [
					{
						foreignKeyName: "qms_records_batch_id_fkey";
						columns: ["batch_id"];
						isOneToOne: false;
						referencedRelation: "batches";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "qms_records_batch_id_fkey";
						columns: ["batch_id"];
						isOneToOne: false;
						referencedRelation: "v_batch_daily_summary";
						referencedColumns: ["batch_id"];
					},
					{
						foreignKeyName: "qms_records_batch_id_fkey";
						columns: ["batch_id"];
						isOneToOne: false;
						referencedRelation: "v_batch_yield_analysis";
						referencedColumns: ["batch_id"];
					},
					{
						foreignKeyName: "qms_records_cycle_id_fkey";
						columns: ["cycle_id"];
						isOneToOne: false;
						referencedRelation: "growth_cycles";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "qms_records_parent_record_id_fkey";
						columns: ["parent_record_id"];
						isOneToOne: false;
						referencedRelation: "qms_records";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "qms_records_stage_id_fkey";
						columns: ["stage_id"];
						isOneToOne: false;
						referencedRelation: "stages";
						referencedColumns: ["id"];
					}
				];
			};
			qms_schedules: {
				Row: {
					assigned_to: string | null;
					created_at: string;
					created_by: string;
					description: string | null;
					due_date: string | null;
					estimated_duration_hours: number | null;
					frequency: string | null;
					id: string;
					linked_qms_record_id: string | null;
					location: string | null;
					priority: string | null;
					recurring_rule: string | null;
					schedule_type: string;
					start_date: string;
					status: string;
					title: string;
					updated_at: string;
				};
				Insert: {
					assigned_to?: string | null;
					created_at?: string;
					created_by: string;
					description?: string | null;
					due_date?: string | null;
					estimated_duration_hours?: number | null;
					frequency?: string | null;
					id?: string;
					linked_qms_record_id?: string | null;
					location?: string | null;
					priority?: string | null;
					recurring_rule?: string | null;
					schedule_type?: string;
					start_date: string;
					status?: string;
					title: string;
					updated_at?: string;
				};
				Update: {
					assigned_to?: string | null;
					created_at?: string;
					created_by?: string;
					description?: string | null;
					due_date?: string | null;
					estimated_duration_hours?: number | null;
					frequency?: string | null;
					id?: string;
					linked_qms_record_id?: string | null;
					location?: string | null;
					priority?: string | null;
					recurring_rule?: string | null;
					schedule_type?: string;
					start_date?: string;
					status?: string;
					title?: string;
					updated_at?: string;
				};
				Relationships: [
					{
						foreignKeyName: "qms_schedules_assigned_to_fkey";
						columns: ["assigned_to"];
						isOneToOne: false;
						referencedRelation: "profiles";
						referencedColumns: ["user_id"];
					}
				];
			};
			qms_team_assignments: {
				Row: {
					assigned_by: string;
					assigned_date: string;
					created_at: string;
					id: string;
					is_active: boolean;
					permissions: Json | null;
					qms_area: string;
					responsibility_level: string;
					specializations: string[] | null;
					updated_at: string;
					user_id: string;
					workload_capacity: number | null;
				};
				Insert: {
					assigned_by: string;
					assigned_date?: string;
					created_at?: string;
					id?: string;
					is_active?: boolean;
					permissions?: Json | null;
					qms_area: string;
					responsibility_level?: string;
					specializations?: string[] | null;
					updated_at?: string;
					user_id: string;
					workload_capacity?: number | null;
				};
				Update: {
					assigned_by?: string;
					assigned_date?: string;
					created_at?: string;
					id?: string;
					is_active?: boolean;
					permissions?: Json | null;
					qms_area?: string;
					responsibility_level?: string;
					specializations?: string[] | null;
					updated_at?: string;
					user_id?: string;
					workload_capacity?: number | null;
				};
				Relationships: [
					{
						foreignKeyName: "qms_team_assignments_user_id_fkey";
						columns: ["user_id"];
						isOneToOne: false;
						referencedRelation: "profiles";
						referencedColumns: ["user_id"];
					}
				];
			};
			qualification_records: {
				Row: {
					acceptance_criteria: string | null;
					approval_date: string | null;
					approved_by: string | null;
					attachments: string[] | null;
					created_at: string;
					created_by: string;
					equipment_id: string | null;
					facility_area_id: string | null;
					id: string;
					linked_validation_id: string | null;
					next_due_date: string | null;
					performed_by: string | null;
					qualification_id: string;
					qualification_protocol: string | null;
					qualification_type: string;
					results_summary: string | null;
					status: string;
					updated_at: string;
				};
				Insert: {
					acceptance_criteria?: string | null;
					approval_date?: string | null;
					approved_by?: string | null;
					attachments?: string[] | null;
					created_at?: string;
					created_by: string;
					equipment_id?: string | null;
					facility_area_id?: string | null;
					id?: string;
					linked_validation_id?: string | null;
					next_due_date?: string | null;
					performed_by?: string | null;
					qualification_id: string;
					qualification_protocol?: string | null;
					qualification_type: string;
					results_summary?: string | null;
					status?: string;
					updated_at?: string;
				};
				Update: {
					acceptance_criteria?: string | null;
					approval_date?: string | null;
					approved_by?: string | null;
					attachments?: string[] | null;
					created_at?: string;
					created_by?: string;
					equipment_id?: string | null;
					facility_area_id?: string | null;
					id?: string;
					linked_validation_id?: string | null;
					next_due_date?: string | null;
					performed_by?: string | null;
					qualification_id?: string;
					qualification_protocol?: string | null;
					qualification_type?: string;
					results_summary?: string | null;
					status?: string;
					updated_at?: string;
				};
				Relationships: [
					{
						foreignKeyName: "qualification_records_approved_by_fkey";
						columns: ["approved_by"];
						isOneToOne: false;
						referencedRelation: "profiles";
						referencedColumns: ["user_id"];
					},
					{
						foreignKeyName: "qualification_records_created_by_fkey";
						columns: ["created_by"];
						isOneToOne: false;
						referencedRelation: "profiles";
						referencedColumns: ["user_id"];
					},
					{
						foreignKeyName: "qualification_records_linked_validation_id_fkey";
						columns: ["linked_validation_id"];
						isOneToOne: false;
						referencedRelation: "validation_records";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "qualification_records_performed_by_fkey";
						columns: ["performed_by"];
						isOneToOne: false;
						referencedRelation: "profiles";
						referencedColumns: ["user_id"];
					}
				];
			};
			quotations: {
				Row: {
					client_id: string;
					created_at: string;
					created_by: string;
					delivery_date: string | null;
					id: string;
					notes: string | null;
					products: Json;
					quote_number: string;
					status: string;
					subtotal: number;
					tax_amount: number;
					total_amount: number;
					updated_at: string;
					valid_until: string;
				};
				Insert: {
					client_id: string;
					created_at?: string;
					created_by: string;
					delivery_date?: string | null;
					id?: string;
					notes?: string | null;
					products: Json;
					quote_number: string;
					status?: string;
					subtotal: number;
					tax_amount?: number;
					total_amount: number;
					updated_at?: string;
					valid_until: string;
				};
				Update: {
					client_id?: string;
					created_at?: string;
					created_by?: string;
					delivery_date?: string | null;
					id?: string;
					notes?: string | null;
					products?: Json;
					quote_number?: string;
					status?: string;
					subtotal?: number;
					tax_amount?: number;
					total_amount?: number;
					updated_at?: string;
					valid_until?: string;
				};
				Relationships: [
					{
						foreignKeyName: "quotations_client_id_fkey";
						columns: ["client_id"];
						isOneToOne: false;
						referencedRelation: "clients";
						referencedColumns: ["id"];
					}
				];
			};
			recall_records: {
				Row: {
					affected_customers: number | null;
					batch_ids: string[];
					corrective_actions: string | null;
					created_at: string;
					created_by: string;
					date_completed: string | null;
					date_initiated: string;
					description: string;
					id: string;
					initiated_by: string;
					product_names: string[];
					public_notification_required: boolean | null;
					reason: string;
					recall_number: string;
					recall_type: string;
					regulatory_notification_sent: boolean | null;
					root_cause_analysis: string | null;
					severity: string;
					status: string;
					units_recalled: number | null;
					units_recovered: number | null;
					updated_at: string;
				};
				Insert: {
					affected_customers?: number | null;
					batch_ids: string[];
					corrective_actions?: string | null;
					created_at?: string;
					created_by: string;
					date_completed?: string | null;
					date_initiated?: string;
					description: string;
					id?: string;
					initiated_by: string;
					product_names: string[];
					public_notification_required?: boolean | null;
					reason: string;
					recall_number: string;
					recall_type?: string;
					regulatory_notification_sent?: boolean | null;
					root_cause_analysis?: string | null;
					severity?: string;
					status?: string;
					units_recalled?: number | null;
					units_recovered?: number | null;
					updated_at?: string;
				};
				Update: {
					affected_customers?: number | null;
					batch_ids?: string[];
					corrective_actions?: string | null;
					created_at?: string;
					created_by?: string;
					date_completed?: string | null;
					date_initiated?: string;
					description?: string;
					id?: string;
					initiated_by?: string;
					product_names?: string[];
					public_notification_required?: boolean | null;
					reason?: string;
					recall_number?: string;
					recall_type?: string;
					regulatory_notification_sent?: boolean | null;
					root_cause_analysis?: string | null;
					severity?: string;
					status?: string;
					units_recalled?: number | null;
					units_recovered?: number | null;
					updated_at?: string;
				};
				Relationships: [];
			};
			requalification_schedules: {
				Row: {
					auto_generated: boolean;
					created_at: string;
					created_by: string;
					frequency_months: number;
					id: string;
					next_due_date: string;
					qualification_id: string | null;
					reminder_days_before: number;
					schedule_type: string;
					updated_at: string;
					validation_id: string | null;
				};
				Insert: {
					auto_generated?: boolean;
					created_at?: string;
					created_by: string;
					frequency_months?: number;
					id?: string;
					next_due_date: string;
					qualification_id?: string | null;
					reminder_days_before?: number;
					schedule_type: string;
					updated_at?: string;
					validation_id?: string | null;
				};
				Update: {
					auto_generated?: boolean;
					created_at?: string;
					created_by?: string;
					frequency_months?: number;
					id?: string;
					next_due_date?: string;
					qualification_id?: string | null;
					reminder_days_before?: number;
					schedule_type?: string;
					updated_at?: string;
					validation_id?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: "requalification_schedules_created_by_fkey";
						columns: ["created_by"];
						isOneToOne: false;
						referencedRelation: "profiles";
						referencedColumns: ["user_id"];
					},
					{
						foreignKeyName: "requalification_schedules_qualification_id_fkey";
						columns: ["qualification_id"];
						isOneToOne: false;
						referencedRelation: "qualification_records";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "requalification_schedules_validation_id_fkey";
						columns: ["validation_id"];
						isOneToOne: false;
						referencedRelation: "validation_records";
						referencedColumns: ["id"];
					}
				];
			};
			risk_assessments: {
				Row: {
					action_owner: string | null;
					action_taken: string | null;
					created_at: string;
					created_by: string;
					current_controls: string | null;
					detectability: number;
					id: string;
					occurrence: number;
					potential_cause: string | null;
					potential_effect: string | null;
					process_name: string;
					recommended_actions: string | null;
					review_date: string | null;
					risk_description: string;
					risk_level: string | null;
					rpn: number | null;
					severity: number;
					status: string;
					target_date: string | null;
					updated_at: string;
				};
				Insert: {
					action_owner?: string | null;
					action_taken?: string | null;
					created_at?: string;
					created_by: string;
					current_controls?: string | null;
					detectability: number;
					id?: string;
					occurrence: number;
					potential_cause?: string | null;
					potential_effect?: string | null;
					process_name: string;
					recommended_actions?: string | null;
					review_date?: string | null;
					risk_description: string;
					risk_level?: string | null;
					rpn?: number | null;
					severity: number;
					status?: string;
					target_date?: string | null;
					updated_at?: string;
				};
				Update: {
					action_owner?: string | null;
					action_taken?: string | null;
					created_at?: string;
					created_by?: string;
					current_controls?: string | null;
					detectability?: number;
					id?: string;
					occurrence?: number;
					potential_cause?: string | null;
					potential_effect?: string | null;
					process_name?: string;
					recommended_actions?: string | null;
					review_date?: string | null;
					risk_description?: string;
					risk_level?: string | null;
					rpn?: number | null;
					severity?: number;
					status?: string;
					target_date?: string | null;
					updated_at?: string;
				};
				Relationships: [];
			};
			risk_change_request_links: {
				Row: {
					change_request_id: string;
					created_at: string;
					id: string;
					risk_id: string;
				};
				Insert: {
					change_request_id: string;
					created_at?: string;
					id?: string;
					risk_id: string;
				};
				Update: {
					change_request_id?: string;
					created_at?: string;
					id?: string;
					risk_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "risk_change_request_links_change_request_id_fkey";
						columns: ["change_request_id"];
						isOneToOne: false;
						referencedRelation: "change_requests";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "risk_change_request_links_risk_id_fkey";
						columns: ["risk_id"];
						isOneToOne: false;
						referencedRelation: "risk_assessments";
						referencedColumns: ["id"];
					}
				];
			};
			sales: {
				Row: {
					batch_ids: string[] | null;
					created_at: string | null;
					id: string;
					member_id: string;
					payment_method: Database["public"]["Enums"]["payment_method"];
					promotion_discount_total: number | null;
					promotions_applied: Json | null;
					sale_number: string;
					status: Database["public"]["Enums"]["sale_status"] | null;
					store_id: string | null;
					subtotal: number;
					tax_amount: number;
					total_amount: number;
					updated_at: string | null;
					user_id: string;
				};
				Insert: {
					batch_ids?: string[] | null;
					created_at?: string | null;
					id?: string;
					member_id: string;
					payment_method: Database["public"]["Enums"]["payment_method"];
					promotion_discount_total?: number | null;
					promotions_applied?: Json | null;
					sale_number: string;
					status?: Database["public"]["Enums"]["sale_status"] | null;
					store_id?: string | null;
					subtotal: number;
					tax_amount: number;
					total_amount: number;
					updated_at?: string | null;
					user_id: string;
				};
				Update: {
					batch_ids?: string[] | null;
					created_at?: string | null;
					id?: string;
					member_id?: string;
					payment_method?: Database["public"]["Enums"]["payment_method"];
					promotion_discount_total?: number | null;
					promotions_applied?: Json | null;
					sale_number?: string;
					status?: Database["public"]["Enums"]["sale_status"] | null;
					store_id?: string | null;
					subtotal?: number;
					tax_amount?: number;
					total_amount?: number;
					updated_at?: string | null;
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "sales_member_id_fkey";
						columns: ["member_id"];
						isOneToOne: false;
						referencedRelation: "members";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "sales_user_id_fkey";
						columns: ["user_id"];
						isOneToOne: false;
						referencedRelation: "users";
						referencedColumns: ["id"];
					}
				];
			};
			sales_items: {
				Row: {
					created_at: string | null;
					id: string;
					is_promotion_item: boolean | null;
					product_id: string | null;
					promotion_discount: number | null;
					promotion_id: string | null;
					qty: number;
					sale_id: string | null;
					total_price: number;
					unit_price: number;
				};
				Insert: {
					created_at?: string | null;
					id?: string;
					is_promotion_item?: boolean | null;
					product_id?: string | null;
					promotion_discount?: number | null;
					promotion_id?: string | null;
					qty: number;
					sale_id?: string | null;
					total_price: number;
					unit_price: number;
				};
				Update: {
					created_at?: string | null;
					id?: string;
					is_promotion_item?: boolean | null;
					product_id?: string | null;
					promotion_discount?: number | null;
					promotion_id?: string | null;
					qty?: number;
					sale_id?: string | null;
					total_price?: number;
					unit_price?: number;
				};
				Relationships: [
					{
						foreignKeyName: "sales_items_product_id_fkey";
						columns: ["product_id"];
						isOneToOne: false;
						referencedRelation: "products";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "sales_items_promotion_id_fkey";
						columns: ["promotion_id"];
						isOneToOne: false;
						referencedRelation: "promotions";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "sales_items_sale_id_fkey";
						columns: ["sale_id"];
						isOneToOne: false;
						referencedRelation: "sales";
						referencedColumns: ["id"];
					}
				];
			};
			sensors: {
				Row: {
					calibration_frequency_days: number | null;
					created_at: string;
					created_by: string;
					id: string;
					installation_date: string | null;
					last_calibration_date: string | null;
					location: string | null;
					manufacturer: string | null;
					model: string | null;
					next_calibration_date: string | null;
					room_name: string;
					sensor_id: string;
					sensor_type: string;
					status: string;
					updated_at: string;
				};
				Insert: {
					calibration_frequency_days?: number | null;
					created_at?: string;
					created_by: string;
					id?: string;
					installation_date?: string | null;
					last_calibration_date?: string | null;
					location?: string | null;
					manufacturer?: string | null;
					model?: string | null;
					next_calibration_date?: string | null;
					room_name: string;
					sensor_id: string;
					sensor_type: string;
					status?: string;
					updated_at?: string;
				};
				Update: {
					calibration_frequency_days?: number | null;
					created_at?: string;
					created_by?: string;
					id?: string;
					installation_date?: string | null;
					last_calibration_date?: string | null;
					location?: string | null;
					manufacturer?: string | null;
					model?: string | null;
					next_calibration_date?: string | null;
					room_name?: string;
					sensor_id?: string;
					sensor_type?: string;
					status?: string;
					updated_at?: string;
				};
				Relationships: [];
			};
			sessions: {
				Row: {
					created_at: string | null;
					expires_at: string;
					id: string;
					last_active: string | null;
					logged_out_at: string | null;
					session_start: string | null;
					user_id: string | null;
				};
				Insert: {
					created_at?: string | null;
					expires_at: string;
					id?: string;
					last_active?: string | null;
					logged_out_at?: string | null;
					session_start?: string | null;
					user_id?: string | null;
				};
				Update: {
					created_at?: string | null;
					expires_at?: string;
					id?: string;
					last_active?: string | null;
					logged_out_at?: string | null;
					session_start?: string | null;
					user_id?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: "sessions_user_id_fkey";
						columns: ["user_id"];
						isOneToOne: false;
						referencedRelation: "users";
						referencedColumns: ["id"];
					}
				];
			};
			settings: {
				Row: {
					budtender_timeout_minutes: number | null;
					created_at: string | null;
					default_package_id: string | null;
					default_tax_rate: number | null;
					enable_2fa: boolean | null;
					id: string;
					manager_timeout_minutes: number | null;
					updated_at: string | null;
				};
				Insert: {
					budtender_timeout_minutes?: number | null;
					created_at?: string | null;
					default_package_id?: string | null;
					default_tax_rate?: number | null;
					enable_2fa?: boolean | null;
					id?: string;
					manager_timeout_minutes?: number | null;
					updated_at?: string | null;
				};
				Update: {
					budtender_timeout_minutes?: number | null;
					created_at?: string | null;
					default_package_id?: string | null;
					default_tax_rate?: number | null;
					enable_2fa?: boolean | null;
					id?: string;
					manager_timeout_minutes?: number | null;
					updated_at?: string | null;
				};
				Relationships: [];
			};
			sops: {
				Row: {
					approved_at: string | null;
					approved_by: string | null;
					category: string;
					content: string | null;
					created_at: string | null;
					created_by: string;
					description: string | null;
					effective_date: string | null;
					id: string;
					review_date: string | null;
					sop_number: string;
					status: string | null;
					title: string;
					updated_at: string | null;
					version: string | null;
				};
				Insert: {
					approved_at?: string | null;
					approved_by?: string | null;
					category: string;
					content?: string | null;
					created_at?: string | null;
					created_by: string;
					description?: string | null;
					effective_date?: string | null;
					id?: string;
					review_date?: string | null;
					sop_number: string;
					status?: string | null;
					title: string;
					updated_at?: string | null;
					version?: string | null;
				};
				Update: {
					approved_at?: string | null;
					approved_by?: string | null;
					category?: string;
					content?: string | null;
					created_at?: string | null;
					created_by?: string;
					description?: string | null;
					effective_date?: string | null;
					id?: string;
					review_date?: string | null;
					sop_number?: string;
					status?: string | null;
					title?: string;
					updated_at?: string | null;
					version?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: "sops_approved_by_fkey";
						columns: ["approved_by"];
						isOneToOne: false;
						referencedRelation: "profiles";
						referencedColumns: ["user_id"];
					},
					{
						foreignKeyName: "sops_created_by_fkey";
						columns: ["created_by"];
						isOneToOne: false;
						referencedRelation: "profiles";
						referencedColumns: ["user_id"];
					}
				];
			};
			stage_forms: {
				Row: {
					batch_id: string;
					completed_at: string | null;
					completed_by: string | null;
					created_at: string;
					form_data: Json;
					id: string;
					is_draft: boolean;
					stage: Database["public"]["Enums"]["growth_stage"];
					updated_at: string;
				};
				Insert: {
					batch_id: string;
					completed_at?: string | null;
					completed_by?: string | null;
					created_at?: string;
					form_data: Json;
					id?: string;
					is_draft?: boolean;
					stage: Database["public"]["Enums"]["growth_stage"];
					updated_at?: string;
				};
				Update: {
					batch_id?: string;
					completed_at?: string | null;
					completed_by?: string | null;
					created_at?: string;
					form_data?: Json;
					id?: string;
					is_draft?: boolean;
					stage?: Database["public"]["Enums"]["growth_stage"];
					updated_at?: string;
				};
				Relationships: [
					{
						foreignKeyName: "stage_forms_batch_id_fkey";
						columns: ["batch_id"];
						isOneToOne: false;
						referencedRelation: "batches";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "stage_forms_batch_id_fkey";
						columns: ["batch_id"];
						isOneToOne: false;
						referencedRelation: "v_batch_daily_summary";
						referencedColumns: ["batch_id"];
					},
					{
						foreignKeyName: "stage_forms_batch_id_fkey";
						columns: ["batch_id"];
						isOneToOne: false;
						referencedRelation: "v_batch_yield_analysis";
						referencedColumns: ["batch_id"];
					},
					{
						foreignKeyName: "stage_forms_completed_by_fkey";
						columns: ["completed_by"];
						isOneToOne: false;
						referencedRelation: "profiles";
						referencedColumns: ["user_id"];
					}
				];
			};
			stage_management: {
				Row: {
					batch_id: string;
					created_at: string;
					created_by: string;
					cycle_id: string;
					event_type: string;
					form_data: Json;
					id: string;
					initial_plant_count: number | null;
					notes: string | null;
					previous_plant_count: number | null;
					stage_id: string;
					stage_name: string;
					start_date: string | null;
					updated_at: string;
				};
				Insert: {
					batch_id: string;
					created_at?: string;
					created_by: string;
					cycle_id: string;
					event_type?: string;
					form_data?: Json;
					id?: string;
					initial_plant_count?: number | null;
					notes?: string | null;
					previous_plant_count?: number | null;
					stage_id: string;
					stage_name: string;
					start_date?: string | null;
					updated_at?: string;
				};
				Update: {
					batch_id?: string;
					created_at?: string;
					created_by?: string;
					cycle_id?: string;
					event_type?: string;
					form_data?: Json;
					id?: string;
					initial_plant_count?: number | null;
					notes?: string | null;
					previous_plant_count?: number | null;
					stage_id?: string;
					stage_name?: string;
					start_date?: string | null;
					updated_at?: string;
				};
				Relationships: [
					{
						foreignKeyName: "stage_management_batch_id_fkey";
						columns: ["batch_id"];
						isOneToOne: false;
						referencedRelation: "batches";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "stage_management_batch_id_fkey";
						columns: ["batch_id"];
						isOneToOne: false;
						referencedRelation: "v_batch_daily_summary";
						referencedColumns: ["batch_id"];
					},
					{
						foreignKeyName: "stage_management_batch_id_fkey";
						columns: ["batch_id"];
						isOneToOne: false;
						referencedRelation: "v_batch_yield_analysis";
						referencedColumns: ["batch_id"];
					},
					{
						foreignKeyName: "stage_management_stage_id_fkey";
						columns: ["stage_id"];
						isOneToOne: false;
						referencedRelation: "stages";
						referencedColumns: ["id"];
					}
				];
			};
			stages: {
				Row: {
					created_at: string;
					default_duration_days: number | null;
					description: string | null;
					display_name: string;
					id: string;
					is_active: boolean;
					name: string;
					stage_order: number;
					updated_at: string;
				};
				Insert: {
					created_at?: string;
					default_duration_days?: number | null;
					description?: string | null;
					display_name: string;
					id?: string;
					is_active?: boolean;
					name: string;
					stage_order: number;
					updated_at?: string;
				};
				Update: {
					created_at?: string;
					default_duration_days?: number | null;
					description?: string | null;
					display_name?: string;
					id?: string;
					is_active?: boolean;
					name?: string;
					stage_order?: number;
					updated_at?: string;
				};
				Relationships: [];
			};
			stock_levels: {
				Row: {
					available_quantity: number;
					facility: string;
					id: string;
					lot_id: string;
					reserved_quantity: number;
					updated_at: string;
				};
				Insert: {
					available_quantity?: number;
					facility: string;
					id?: string;
					lot_id: string;
					reserved_quantity?: number;
					updated_at?: string;
				};
				Update: {
					available_quantity?: number;
					facility?: string;
					id?: string;
					lot_id?: string;
					reserved_quantity?: number;
					updated_at?: string;
				};
				Relationships: [
					{
						foreignKeyName: "stock_levels_lot_id_fkey";
						columns: ["lot_id"];
						isOneToOne: false;
						referencedRelation: "inventory_lots";
						referencedColumns: ["id"];
					}
				];
			};
			stock_movements: {
				Row: {
					created_at: string;
					from_facility: string | null;
					id: string;
					lot_id: string;
					movement_type: string;
					performed_by: string;
					quantity: number;
					reason: string | null;
					reference_id: string | null;
					reference_type: string | null;
					to_facility: string | null;
					unit_of_measure: string;
				};
				Insert: {
					created_at?: string;
					from_facility?: string | null;
					id?: string;
					lot_id: string;
					movement_type: string;
					performed_by: string;
					quantity: number;
					reason?: string | null;
					reference_id?: string | null;
					reference_type?: string | null;
					to_facility?: string | null;
					unit_of_measure: string;
				};
				Update: {
					created_at?: string;
					from_facility?: string | null;
					id?: string;
					lot_id?: string;
					movement_type?: string;
					performed_by?: string;
					quantity?: number;
					reason?: string | null;
					reference_id?: string | null;
					reference_type?: string | null;
					to_facility?: string | null;
					unit_of_measure?: string;
				};
				Relationships: [
					{
						foreignKeyName: "stock_movements_lot_id_fkey";
						columns: ["lot_id"];
						isOneToOne: false;
						referencedRelation: "inventory_lots";
						referencedColumns: ["id"];
					}
				];
			};
			strains: {
				Row: {
					created_at: string;
					created_by: string;
					description: string | null;
					flowering_time_days: number | null;
					genetics: string | null;
					id: string;
					is_active: boolean;
					name: string;
					updated_at: string;
				};
				Insert: {
					created_at?: string;
					created_by: string;
					description?: string | null;
					flowering_time_days?: number | null;
					genetics?: string | null;
					id?: string;
					is_active?: boolean;
					name: string;
					updated_at?: string;
				};
				Update: {
					created_at?: string;
					created_by?: string;
					description?: string | null;
					flowering_time_days?: number | null;
					genetics?: string | null;
					id?: string;
					is_active?: boolean;
					name?: string;
					updated_at?: string;
				};
				Relationships: [];
			};
			supplier_approvals: {
				Row: {
					approval_date: string | null;
					approval_number: string;
					approval_status: string;
					approved_by: string | null;
					business_justification: string | null;
					conditions: string | null;
					created_at: string;
					id: string;
					linked_audit_ids: string[] | null;
					materials_requested: string[];
					rejection_reason: string | null;
					request_date: string;
					requested_by: string;
					review_date: string | null;
					reviewer: string | null;
					risk_assessment: string | null;
					supplier_id: string;
					updated_at: string;
					valid_until: string | null;
				};
				Insert: {
					approval_date?: string | null;
					approval_number: string;
					approval_status?: string;
					approved_by?: string | null;
					business_justification?: string | null;
					conditions?: string | null;
					created_at?: string;
					id?: string;
					linked_audit_ids?: string[] | null;
					materials_requested: string[];
					rejection_reason?: string | null;
					request_date?: string;
					requested_by: string;
					review_date?: string | null;
					reviewer?: string | null;
					risk_assessment?: string | null;
					supplier_id: string;
					updated_at?: string;
					valid_until?: string | null;
				};
				Update: {
					approval_date?: string | null;
					approval_number?: string;
					approval_status?: string;
					approved_by?: string | null;
					business_justification?: string | null;
					conditions?: string | null;
					created_at?: string;
					id?: string;
					linked_audit_ids?: string[] | null;
					materials_requested?: string[];
					rejection_reason?: string | null;
					request_date?: string;
					requested_by?: string;
					review_date?: string | null;
					reviewer?: string | null;
					risk_assessment?: string | null;
					supplier_id?: string;
					updated_at?: string;
					valid_until?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: "supplier_approvals_supplier_id_fkey";
						columns: ["supplier_id"];
						isOneToOne: false;
						referencedRelation: "suppliers";
						referencedColumns: ["id"];
					}
				];
			};
			supplier_audits: {
				Row: {
					audit_date: string;
					audit_number: string;
					audit_type: string;
					auditor: string;
					certificate_expiry: string | null;
					certificate_issued: boolean | null;
					created_at: string;
					created_by: string;
					critical_findings: number | null;
					findings_count: number | null;
					id: string;
					next_audit_date: string | null;
					notes: string | null;
					report_url: string | null;
					score: number | null;
					status: string;
					supplier_id: string;
					updated_at: string;
				};
				Insert: {
					audit_date: string;
					audit_number: string;
					audit_type?: string;
					auditor: string;
					certificate_expiry?: string | null;
					certificate_issued?: boolean | null;
					created_at?: string;
					created_by: string;
					critical_findings?: number | null;
					findings_count?: number | null;
					id?: string;
					next_audit_date?: string | null;
					notes?: string | null;
					report_url?: string | null;
					score?: number | null;
					status?: string;
					supplier_id: string;
					updated_at?: string;
				};
				Update: {
					audit_date?: string;
					audit_number?: string;
					audit_type?: string;
					auditor?: string;
					certificate_expiry?: string | null;
					certificate_issued?: boolean | null;
					created_at?: string;
					created_by?: string;
					critical_findings?: number | null;
					findings_count?: number | null;
					id?: string;
					next_audit_date?: string | null;
					notes?: string | null;
					report_url?: string | null;
					score?: number | null;
					status?: string;
					supplier_id?: string;
					updated_at?: string;
				};
				Relationships: [
					{
						foreignKeyName: "supplier_audits_supplier_id_fkey";
						columns: ["supplier_id"];
						isOneToOne: false;
						referencedRelation: "suppliers";
						referencedColumns: ["id"];
					}
				];
			};
			suppliers: {
				Row: {
					address: string | null;
					approval_date: string | null;
					approval_status: string | null;
					approved_by: string | null;
					certification_expiry: string | null;
					compliance_rating: number | null;
					contact_person: string | null;
					created_at: string;
					created_by: string;
					delivery_rating: number | null;
					email: string;
					id: string;
					last_audit_date: string | null;
					license_number: string | null;
					materials_supplied: string[] | null;
					name: string;
					next_audit_date: string | null;
					notes: string | null;
					payment_terms: string | null;
					performance_score: number | null;
					phone: string | null;
					quality_rating: number | null;
					status: string;
					supplier_type: string;
					updated_at: string;
				};
				Insert: {
					address?: string | null;
					approval_date?: string | null;
					approval_status?: string | null;
					approved_by?: string | null;
					certification_expiry?: string | null;
					compliance_rating?: number | null;
					contact_person?: string | null;
					created_at?: string;
					created_by: string;
					delivery_rating?: number | null;
					email: string;
					id?: string;
					last_audit_date?: string | null;
					license_number?: string | null;
					materials_supplied?: string[] | null;
					name: string;
					next_audit_date?: string | null;
					notes?: string | null;
					payment_terms?: string | null;
					performance_score?: number | null;
					phone?: string | null;
					quality_rating?: number | null;
					status?: string;
					supplier_type?: string;
					updated_at?: string;
				};
				Update: {
					address?: string | null;
					approval_date?: string | null;
					approval_status?: string | null;
					approved_by?: string | null;
					certification_expiry?: string | null;
					compliance_rating?: number | null;
					contact_person?: string | null;
					created_at?: string;
					created_by?: string;
					delivery_rating?: number | null;
					email?: string;
					id?: string;
					last_audit_date?: string | null;
					license_number?: string | null;
					materials_supplied?: string[] | null;
					name?: string;
					next_audit_date?: string | null;
					notes?: string | null;
					payment_terms?: string | null;
					performance_score?: number | null;
					phone?: string | null;
					quality_rating?: number | null;
					status?: string;
					supplier_type?: string;
					updated_at?: string;
				};
				Relationships: [];
			};
			training_assignments: {
				Row: {
					assigned_by: string;
					assigned_date: string | null;
					assigned_to: string;
					completion_date: string | null;
					completion_notes: string | null;
					created_at: string | null;
					due_date: string | null;
					id: string;
					status: string | null;
					training_program_id: string | null;
					updated_at: string | null;
				};
				Insert: {
					assigned_by: string;
					assigned_date?: string | null;
					assigned_to: string;
					completion_date?: string | null;
					completion_notes?: string | null;
					created_at?: string | null;
					due_date?: string | null;
					id?: string;
					status?: string | null;
					training_program_id?: string | null;
					updated_at?: string | null;
				};
				Update: {
					assigned_by?: string;
					assigned_date?: string | null;
					assigned_to?: string;
					completion_date?: string | null;
					completion_notes?: string | null;
					created_at?: string | null;
					due_date?: string | null;
					id?: string;
					status?: string | null;
					training_program_id?: string | null;
					updated_at?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: "training_assignments_training_program_id_fkey";
						columns: ["training_program_id"];
						isOneToOne: false;
						referencedRelation: "training_programs";
						referencedColumns: ["id"];
					}
				];
			};
			training_programs: {
				Row: {
					category: string;
					created_at: string;
					created_by: string;
					description: string | null;
					document_id: string | null;
					duration_hours: number | null;
					id: string;
					is_mandatory: boolean;
					requires_certification: boolean;
					title: string;
					updated_at: string;
					validity_period_days: number | null;
				};
				Insert: {
					category?: string;
					created_at?: string;
					created_by: string;
					description?: string | null;
					document_id?: string | null;
					duration_hours?: number | null;
					id?: string;
					is_mandatory?: boolean;
					requires_certification?: boolean;
					title: string;
					updated_at?: string;
					validity_period_days?: number | null;
				};
				Update: {
					category?: string;
					created_at?: string;
					created_by?: string;
					description?: string | null;
					document_id?: string | null;
					duration_hours?: number | null;
					id?: string;
					is_mandatory?: boolean;
					requires_certification?: boolean;
					title?: string;
					updated_at?: string;
					validity_period_days?: number | null;
				};
				Relationships: [];
			};
			training_records: {
				Row: {
					certificate_url: string | null;
					completion_date: string | null;
					created_at: string | null;
					expiry_date: string | null;
					id: string;
					notes: string | null;
					program_id: string | null;
					score: number | null;
					sop_id: string | null;
					status: string | null;
					title: string;
					trainer_id: string | null;
					training_type: string;
					updated_at: string | null;
					user_id: string;
				};
				Insert: {
					certificate_url?: string | null;
					completion_date?: string | null;
					created_at?: string | null;
					expiry_date?: string | null;
					id?: string;
					notes?: string | null;
					program_id?: string | null;
					score?: number | null;
					sop_id?: string | null;
					status?: string | null;
					title: string;
					trainer_id?: string | null;
					training_type: string;
					updated_at?: string | null;
					user_id: string;
				};
				Update: {
					certificate_url?: string | null;
					completion_date?: string | null;
					created_at?: string | null;
					expiry_date?: string | null;
					id?: string;
					notes?: string | null;
					program_id?: string | null;
					score?: number | null;
					sop_id?: string | null;
					status?: string | null;
					title?: string;
					trainer_id?: string | null;
					training_type?: string;
					updated_at?: string | null;
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "training_records_sop_id_fkey";
						columns: ["sop_id"];
						isOneToOne: false;
						referencedRelation: "sops";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "training_records_trainer_id_fkey";
						columns: ["trainer_id"];
						isOneToOne: false;
						referencedRelation: "profiles";
						referencedColumns: ["user_id"];
					},
					{
						foreignKeyName: "training_records_user_id_fkey";
						columns: ["user_id"];
						isOneToOne: false;
						referencedRelation: "profiles";
						referencedColumns: ["user_id"];
					}
				];
			};
			user_batch_assignments: {
				Row: {
					assigned_at: string;
					assigned_by: string;
					batch_id: string;
					created_at: string;
					id: string;
					is_active: boolean;
					updated_at: string;
					user_id: string;
				};
				Insert: {
					assigned_at?: string;
					assigned_by: string;
					batch_id: string;
					created_at?: string;
					id?: string;
					is_active?: boolean;
					updated_at?: string;
					user_id: string;
				};
				Update: {
					assigned_at?: string;
					assigned_by?: string;
					batch_id?: string;
					created_at?: string;
					id?: string;
					is_active?: boolean;
					updated_at?: string;
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "user_batch_assignments_batch_id_fkey";
						columns: ["batch_id"];
						isOneToOne: false;
						referencedRelation: "batches";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "user_batch_assignments_batch_id_fkey";
						columns: ["batch_id"];
						isOneToOne: false;
						referencedRelation: "v_batch_daily_summary";
						referencedColumns: ["batch_id"];
					},
					{
						foreignKeyName: "user_batch_assignments_batch_id_fkey";
						columns: ["batch_id"];
						isOneToOne: false;
						referencedRelation: "v_batch_yield_analysis";
						referencedColumns: ["batch_id"];
					}
				];
			};
			user_invitations: {
				Row: {
					created_at: string;
					email: string;
					expires_at: string;
					id: string;
					invited_by: string;
					status: string;
					token: string;
					updated_at: string;
				};
				Insert: {
					created_at?: string;
					email: string;
					expires_at?: string;
					id?: string;
					invited_by: string;
					status?: string;
					token: string;
					updated_at?: string;
				};
				Update: {
					created_at?: string;
					email?: string;
					expires_at?: string;
					id?: string;
					invited_by?: string;
					status?: string;
					token?: string;
					updated_at?: string;
				};
				Relationships: [];
			};
			user_room_assignments: {
				Row: {
					assigned_at: string;
					assigned_by: string;
					created_at: string;
					id: string;
					is_active: boolean;
					room_name: string;
					updated_at: string;
					user_id: string;
				};
				Insert: {
					assigned_at?: string;
					assigned_by: string;
					created_at?: string;
					id?: string;
					is_active?: boolean;
					room_name: string;
					updated_at?: string;
					user_id: string;
				};
				Update: {
					assigned_at?: string;
					assigned_by?: string;
					created_at?: string;
					id?: string;
					is_active?: boolean;
					room_name?: string;
					updated_at?: string;
					user_id?: string;
				};
				Relationships: [];
			};
			users: {
				Row: {
					created_at: string | null;
					email: string | null;
					id: string;
					last_login: string | null;
					name: string;
					pin_hash: string | null;
					role: Database["public"]["Enums"]["user_role"];
					status: string | null;
					store_id: string | null;
					updated_at: string | null;
				};
				Insert: {
					created_at?: string | null;
					email?: string | null;
					id?: string;
					last_login?: string | null;
					name: string;
					pin_hash?: string | null;
					role: Database["public"]["Enums"]["user_role"];
					status?: string | null;
					store_id?: string | null;
					updated_at?: string | null;
				};
				Update: {
					created_at?: string | null;
					email?: string | null;
					id?: string;
					last_login?: string | null;
					name?: string;
					pin_hash?: string | null;
					role?: Database["public"]["Enums"]["user_role"];
					status?: string | null;
					store_id?: string | null;
					updated_at?: string | null;
				};
				Relationships: [];
			};
			validation_attachments: {
				Row: {
					attachment_type: string;
					created_at: string;
					description: string | null;
					file_name: string;
					file_size: number | null;
					file_url: string;
					id: string;
					mime_type: string | null;
					qualification_id: string | null;
					uploaded_by: string;
					validation_id: string | null;
				};
				Insert: {
					attachment_type: string;
					created_at?: string;
					description?: string | null;
					file_name: string;
					file_size?: number | null;
					file_url: string;
					id?: string;
					mime_type?: string | null;
					qualification_id?: string | null;
					uploaded_by: string;
					validation_id?: string | null;
				};
				Update: {
					attachment_type?: string;
					created_at?: string;
					description?: string | null;
					file_name?: string;
					file_size?: number | null;
					file_url?: string;
					id?: string;
					mime_type?: string | null;
					qualification_id?: string | null;
					uploaded_by?: string;
					validation_id?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: "validation_attachments_qualification_id_fkey";
						columns: ["qualification_id"];
						isOneToOne: false;
						referencedRelation: "qualification_records";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "validation_attachments_uploaded_by_fkey";
						columns: ["uploaded_by"];
						isOneToOne: false;
						referencedRelation: "profiles";
						referencedColumns: ["user_id"];
					},
					{
						foreignKeyName: "validation_attachments_validation_id_fkey";
						columns: ["validation_id"];
						isOneToOne: false;
						referencedRelation: "validation_records";
						referencedColumns: ["id"];
					}
				];
			};
			validation_records: {
				Row: {
					acceptance_criteria: string | null;
					approval_date: string | null;
					approved_by: string | null;
					attachments: string[] | null;
					created_at: string;
					created_by: string;
					id: string;
					linked_batch_ids: string[] | null;
					linked_equipment_ids: string[] | null;
					linked_process_stage_ids: string[] | null;
					linked_sop_id: string | null;
					linked_supplier_ids: string[] | null;
					next_due_date: string | null;
					performed_by: string | null;
					results_summary: string | null;
					scope: string | null;
					status: string;
					title: string;
					updated_at: string;
					validation_id: string;
					validation_protocol: string | null;
					validation_type: string;
				};
				Insert: {
					acceptance_criteria?: string | null;
					approval_date?: string | null;
					approved_by?: string | null;
					attachments?: string[] | null;
					created_at?: string;
					created_by: string;
					id?: string;
					linked_batch_ids?: string[] | null;
					linked_equipment_ids?: string[] | null;
					linked_process_stage_ids?: string[] | null;
					linked_sop_id?: string | null;
					linked_supplier_ids?: string[] | null;
					next_due_date?: string | null;
					performed_by?: string | null;
					results_summary?: string | null;
					scope?: string | null;
					status?: string;
					title: string;
					updated_at?: string;
					validation_id: string;
					validation_protocol?: string | null;
					validation_type: string;
				};
				Update: {
					acceptance_criteria?: string | null;
					approval_date?: string | null;
					approved_by?: string | null;
					attachments?: string[] | null;
					created_at?: string;
					created_by?: string;
					id?: string;
					linked_batch_ids?: string[] | null;
					linked_equipment_ids?: string[] | null;
					linked_process_stage_ids?: string[] | null;
					linked_sop_id?: string | null;
					linked_supplier_ids?: string[] | null;
					next_due_date?: string | null;
					performed_by?: string | null;
					results_summary?: string | null;
					scope?: string | null;
					status?: string;
					title?: string;
					updated_at?: string;
					validation_id?: string;
					validation_protocol?: string | null;
					validation_type?: string;
				};
				Relationships: [
					{
						foreignKeyName: "validation_records_approved_by_fkey";
						columns: ["approved_by"];
						isOneToOne: false;
						referencedRelation: "profiles";
						referencedColumns: ["user_id"];
					},
					{
						foreignKeyName: "validation_records_created_by_fkey";
						columns: ["created_by"];
						isOneToOne: false;
						referencedRelation: "profiles";
						referencedColumns: ["user_id"];
					},
					{
						foreignKeyName: "validation_records_linked_sop_id_fkey";
						columns: ["linked_sop_id"];
						isOneToOne: false;
						referencedRelation: "documents";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "validation_records_performed_by_fkey";
						columns: ["performed_by"];
						isOneToOne: false;
						referencedRelation: "profiles";
						referencedColumns: ["user_id"];
					}
				];
			};
		};
		Views: {
			v_batch_daily_summary: {
				Row: {
					batch_id: string | null;
					batch_name: string | null;
					current_plant_count: number | null;
					days_since_last_log: number | null;
					initial_plant_count: number | null;
					last_humidity: number | null;
					last_log_date: string | null;
					last_temperature: number | null;
					missing_days_count: number | null;
					strain: string | null;
					survival_rate_percent: number | null;
					total_log_count: number | null;
				};
				Relationships: [];
			};
			v_batch_yield_analysis: {
				Row: {
					avg_co2: number | null;
					avg_humidity: number | null;
					avg_temperature: number | null;
					batch_id: string | null;
					batch_name: string | null;
					current_plant_count: number | null;
					grams_per_plant: number | null;
					harvest_weight_grams: number | null;
					initial_plant_count: number | null;
					missing_days_count: number | null;
					strain: string | null;
					survival_rate_percent: number | null;
					total_log_count: number | null;
				};
				Relationships: [];
			};
			v_stage_environmental_stats: {
				Row: {
					avg_co2: number | null;
					avg_humidity: number | null;
					avg_ph: number | null;
					avg_temperature: number | null;
					batch_id: string | null;
					first_log_date: string | null;
					last_log_date: string | null;
					log_count: number | null;
					logs_last_7_days: number | null;
					max_humidity: number | null;
					max_temperature: number | null;
					min_humidity: number | null;
					min_temperature: number | null;
					stage_id: string | null;
					stage_name: string | null;
				};
				Relationships: [
					{
						foreignKeyName: "daily_logs_batch_id_fkey";
						columns: ["batch_id"];
						isOneToOne: false;
						referencedRelation: "batches";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "daily_logs_batch_id_fkey";
						columns: ["batch_id"];
						isOneToOne: false;
						referencedRelation: "v_batch_daily_summary";
						referencedColumns: ["batch_id"];
					},
					{
						foreignKeyName: "daily_logs_batch_id_fkey";
						columns: ["batch_id"];
						isOneToOne: false;
						referencedRelation: "v_batch_yield_analysis";
						referencedColumns: ["batch_id"];
					},
					{
						foreignKeyName: "daily_logs_stage_id_fkey";
						columns: ["stage_id"];
						isOneToOne: false;
						referencedRelation: "stages";
						referencedColumns: ["id"];
					}
				];
			};
		};
		Functions: {
			approve_ebr_with_signature: {
				Args: {
					p_ebr_id: string;
					p_signature_method?: string;
					p_signature_reason?: string;
					p_signer_id: string;
				};
				Returns: Json;
			};
			calculate_batch_compliance: {
				Args: { batch_record_id: string };
				Returns: Json;
			};
			calculate_cleaning_task_status: {
				Args: { due_date: string };
				Returns: string;
			};
			calculate_compliance_score: {
				Args: { p_batch_id: string };
				Returns: Json;
			};
			calculate_environmental_status: {
				Args: { current_value: number; parameter_name: string; room?: string };
				Returns: string;
			};
			check_missing_daily_logs: {
				Args: Record<PropertyKey, never>;
				Returns: undefined;
			};
			check_overdue_cleaning_tasks: {
				Args: Record<PropertyKey, never>;
				Returns: undefined;
			};
			check_overdue_validations: {
				Args: Record<PropertyKey, never>;
				Returns: undefined;
			};
			compile_batch_compliance_data: {
				Args: { p_batch_id: string };
				Returns: Json;
			};
			create_user_with_role: {
				Args: {
					user_email: string;
					user_name: string;
					user_password: string;
					user_role?: string;
				};
				Returns: Json;
			};
			generate_approval_number: {
				Args: Record<PropertyKey, never>;
				Returns: string;
			};
			generate_audit_number: {
				Args: Record<PropertyKey, never>;
				Returns: string;
			};
			generate_capa_number: {
				Args: Record<PropertyKey, never>;
				Returns: string;
			};
			generate_change_request_number: {
				Args: Record<PropertyKey, never>;
				Returns: string;
			};
			generate_cleaning_log_id: {
				Args: Record<PropertyKey, never>;
				Returns: string;
			};
			generate_cleaning_task_id: {
				Args: Record<PropertyKey, never>;
				Returns: string;
			};
			generate_complaint_number: {
				Args: Record<PropertyKey, never>;
				Returns: string;
			};
			generate_dispatch_number: {
				Args: Record<PropertyKey, never>;
				Returns: string;
			};
			generate_ebr_number: {
				Args: Record<PropertyKey, never>;
				Returns: string;
			};
			generate_ebr_record: {
				Args: { p_batch_id: string };
				Returns: string;
			};
			generate_hygiene_check_id: {
				Args: Record<PropertyKey, never>;
				Returns: string;
			};
			generate_order_number: {
				Args: Record<PropertyKey, never>;
				Returns: string;
			};
			generate_po_number: {
				Args: Record<PropertyKey, never>;
				Returns: string;
			};
			generate_ppe_id: {
				Args: Record<PropertyKey, never>;
				Returns: string;
			};
			generate_ppe_issuance_id: {
				Args: Record<PropertyKey, never>;
				Returns: string;
			};
			generate_qms_reference_number: {
				Args: {
					record_type_param: Database["public"]["Enums"]["qms_record_type"];
				};
				Returns: string;
			};
			generate_qualification_id: {
				Args: Record<PropertyKey, never>;
				Returns: string;
			};
			generate_recall_number: {
				Args: Record<PropertyKey, never>;
				Returns: string;
			};
			generate_receipt_number: {
				Args: Record<PropertyKey, never>;
				Returns: string;
			};
			generate_supplier_audit_number: {
				Args: Record<PropertyKey, never>;
				Returns: string;
			};
			generate_validation_id: {
				Args: Record<PropertyKey, never>;
				Returns: string;
			};
			get_session_variable: {
				Args: { setting_name: string };
				Returns: string;
			};
			get_user_role: {
				Args: { user_id?: string };
				Returns: string;
			};
			insert_audit_log_safe: {
				Args: {
					p_action: string;
					p_new_values?: Json;
					p_old_values?: Json;
					p_reason?: string;
					p_resource_id: string;
					p_resource_type: string;
					p_user_id: string;
				};
				Returns: undefined;
			};
			is_admin: {
				Args: { user_id?: string };
				Returns: boolean;
			};
			is_current_user_admin: {
				Args: Record<PropertyKey, never>;
				Returns: boolean;
			};
			log_compliance_event: {
				Args: {
					p_batch_id: string;
					p_description: string;
					p_event_category: string;
					p_event_type: string;
					p_impact_score?: number;
					p_metadata?: Json;
					p_severity?: string;
					p_user_id: string;
				};
				Returns: string;
			};
			populate_cycle_stages_for_existing_cycles: {
				Args: Record<PropertyKey, never>;
				Returns: undefined;
			};
			recalculate_all_compliance_scores: {
				Args: Record<PropertyKey, never>;
				Returns: number;
			};
			reject_ebr_with_signature: {
				Args: {
					p_ebr_id: string;
					p_rejection_reason?: string;
					p_requires_reprocessing?: boolean;
					p_signer_id: string;
				};
				Returns: Json;
			};
			set_session_variable: {
				Args: { new_value: string; setting_name: string };
				Returns: undefined;
			};
			user_can_access_batch: {
				Args: { batch_id: string; user_id?: string };
				Returns: boolean;
			};
			user_can_advance_stage: {
				Args: { user_id?: string };
				Returns: boolean;
			};
			user_can_approve_qa: {
				Args: { user_id?: string };
				Returns: boolean;
			};
		};
		Enums: {
			app_role:
				| "admin"
				| "grower"
				| "cultivation_lead"
				| "qa_manager"
				| "packaging_dispatch"
				| "environmental_tech";
			batch_status: "active" | "completed" | "archived";
			cycle_status: "planning" | "active" | "completed" | "archived";
			growth_stage:
				| "cloning"
				| "vegetative"
				| "flowering"
				| "harvest"
				| "drying"
				| "packaging";
			member_status: "active" | "expired" | "suspended" | "pending";
			payment_method: "cash" | "card" | "debit" | "store_credit";
			po_status: "pending" | "processing" | "fulfilled" | "cancelled";
			qms_record_status:
				| "open"
				| "in_progress"
				| "pending_review"
				| "approved"
				| "rejected"
				| "completed"
				| "closed";
			qms_record_type:
				| "checklist"
				| "inspection"
				| "deviation"
				| "corrective_action"
				| "preventive_action"
				| "audit_finding";
			qms_severity_level: "low" | "medium" | "high" | "critical";
			sale_status: "completed" | "void" | "refunded";
			user_role:
				| "budtender"
				| "store_manager"
				| "warehouse_manager"
				| "chain_manager"
				| "admin";
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
	keyof Database,
	"public"
>];

export type Tables<
	DefaultSchemaTableNameOrOptions extends
		| keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
		| { schema: keyof DatabaseWithoutInternals },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals;
	}
		? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
				DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
		: never = never
> = DefaultSchemaTableNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals;
}
	? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
			DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
			Row: infer R;
	  }
		? R
		: never
	: DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
			DefaultSchema["Views"])
	? (DefaultSchema["Tables"] &
			DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
			Row: infer R;
	  }
		? R
		: never
	: never;

export type TablesInsert<
	DefaultSchemaTableNameOrOptions extends
		| keyof DefaultSchema["Tables"]
		| { schema: keyof DatabaseWithoutInternals },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals;
	}
		? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
		: never = never
> = DefaultSchemaTableNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals;
}
	? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
			Insert: infer I;
	  }
		? I
		: never
	: DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
	? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
			Insert: infer I;
	  }
		? I
		: never
	: never;

export type TablesUpdate<
	DefaultSchemaTableNameOrOptions extends
		| keyof DefaultSchema["Tables"]
		| { schema: keyof DatabaseWithoutInternals },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals;
	}
		? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
		: never = never
> = DefaultSchemaTableNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals;
}
	? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
			Update: infer U;
	  }
		? U
		: never
	: DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
	? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
			Update: infer U;
	  }
		? U
		: never
	: never;

export type Enums<
	DefaultSchemaEnumNameOrOptions extends
		| keyof DefaultSchema["Enums"]
		| { schema: keyof DatabaseWithoutInternals },
	EnumName extends DefaultSchemaEnumNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals;
	}
		? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
		: never = never
> = DefaultSchemaEnumNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals;
}
	? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
	: DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
	? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
	: never;

export type CompositeTypes<
	PublicCompositeTypeNameOrOptions extends
		| keyof DefaultSchema["CompositeTypes"]
		| { schema: keyof DatabaseWithoutInternals },
	CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals;
	}
		? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
		: never = never
> = PublicCompositeTypeNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals;
}
	? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
	: PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
	? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
	: never;

export const Constants = {
	public: {
		Enums: {
			app_role: [
				"admin",
				"grower",
				"cultivation_lead",
				"qa_manager",
				"packaging_dispatch",
				"environmental_tech",
			],
			batch_status: ["active", "completed", "archived"],
			cycle_status: ["planning", "active", "completed", "archived"],
			growth_stage: [
				"cloning",
				"vegetative",
				"flowering",
				"harvest",
				"drying",
				"packaging",
			],
			member_status: ["active", "expired", "suspended", "pending"],
			payment_method: ["cash", "card", "debit", "store_credit"],
			po_status: ["pending", "processing", "fulfilled", "cancelled"],
			qms_record_status: [
				"open",
				"in_progress",
				"pending_review",
				"approved",
				"rejected",
				"completed",
				"closed",
			],
			qms_record_type: [
				"checklist",
				"inspection",
				"deviation",
				"corrective_action",
				"preventive_action",
				"audit_finding",
			],
			qms_severity_level: ["low", "medium", "high", "critical"],
			sale_status: ["completed", "void", "refunded"],
			user_role: [
				"budtender",
				"store_manager",
				"warehouse_manager",
				"chain_manager",
				"admin",
			],
		},
	},
} as const;
