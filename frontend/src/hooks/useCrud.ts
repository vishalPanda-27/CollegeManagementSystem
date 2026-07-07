import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface CrudApi<T> {
  list: () => Promise<T[]>;
  create: (data: Partial<T>) => Promise<T>;
  update: (id: string | number, data: Partial<T>) => Promise<T>;
  remove: (id: string | number) => Promise<unknown>;
}

export function useCrud<T>(key: string, api: CrudApi<T>) {
  const qc = useQueryClient();

  const listQuery = useQuery({ queryKey: [key], queryFn: api.list });

  const createMutation = useMutation({
    mutationFn: (data: Partial<T>) => api.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: [key] }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string | number; data: Partial<T> }) =>
      api.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: [key] }),
  });

  const removeMutation = useMutation({
    mutationFn: (id: string | number) => api.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: [key] }),
  });

  return { listQuery, createMutation, updateMutation, removeMutation };
}
