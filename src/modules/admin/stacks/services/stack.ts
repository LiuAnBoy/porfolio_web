import http from "@/services/client";
import type { StackData, StackPayload } from "@/types";

/**
 * Fetch all stacks.
 *
 * @returns Promise resolving to an array of StackData
 */
export async function getStackList(): Promise<StackData[]> {
  return http.get<StackData[]>("/v1/admin/stacks");
}

/**
 * Create a new stack.
 *
 * @param payload - Stack creation payload
 * @returns Promise resolving to void
 */
export async function createStack(payload: StackPayload): Promise<void> {
  return http.post<void>("/v1/admin/stacks", payload);
}

/**
 * Update an existing stack.
 *
 * @param id - Stack ID
 * @param payload - Stack update payload
 * @returns Promise resolving to void
 */
export async function updateStack(
  id: string,
  payload: StackPayload,
): Promise<void> {
  return http.patch<void>(`/v1/admin/stacks/${id}`, payload);
}

/**
 * Delete a stack by ID.
 *
 * @param id - Stack ID
 * @returns Promise resolving to void
 */
export async function deleteStack(id: string): Promise<void> {
  return http.del<void>(`/v1/admin/stacks/${id}`);
}
