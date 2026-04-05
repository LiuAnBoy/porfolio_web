import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  createStack,
  deleteStack,
  getStackList,
  updateStack,
} from '../services/stack';

/** Query key for the stack list */
const STACK_QUERY_KEY = ['stacks'] as const;

/**
 * React Query hook to fetch the stack list.
 *
 * @returns Query result containing StackData[]
 */
export function useStackList() {
  return useQuery({ queryKey: STACK_QUERY_KEY, queryFn: getStackList });
}

/**
 * Mutation hook to create a new stack.
 * Invalidates the stack list on success.
 *
 * @returns Mutation result for createStack
 */
export function useCreateStack() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createStack,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: STACK_QUERY_KEY });
    },
  });
}

/**
 * Mutation hook to update an existing stack.
 * Invalidates the stack list on success.
 *
 * @returns Mutation result for updateStack
 */
export function useUpdateStack() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: { label: string } }) =>
      updateStack(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: STACK_QUERY_KEY });
    },
  });
}

/**
 * Mutation hook to delete a stack.
 * Invalidates the stack list on success.
 *
 * @returns Mutation result for deleteStack
 */
export function useDeleteStack() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteStack(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: STACK_QUERY_KEY });
    },
  });
}
