import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import type { Project, ProjectType } from "@/services/projects/types";

interface ProjectsState {
  projects: Project[];
  featuredCount: number;
  nonFeaturedTotal: number;
  selectedType: ProjectType | undefined;
  scrollPosition: number;
}

interface ProjectsActions {
  setProjects: (projects: Project[]) => void;
  addProjects: (projects: Project[]) => void;
  setFeaturedCount: (count: number) => void;
  setNonFeaturedTotal: (total: number) => void;
  setSelectedType: (type: ProjectType | undefined) => void;
  setScrollPosition: (position: number) => void;
  reset: () => void;
}

type ProjectsStore = ProjectsState & ProjectsActions;

const initialState: ProjectsState = {
  projects: [],
  featuredCount: 0,
  nonFeaturedTotal: 0,
  selectedType: undefined,
  scrollPosition: 0,
};

/**
 * Projects store with session persistence.
 * Caches loaded projects to avoid re-fetching when navigating back.
 */
export const useProjectsStore = create<ProjectsStore>()(
  persist(
    (set) => ({
      ...initialState,

      setProjects: (projects) => set({ projects }),

      addProjects: (newProjects) =>
        set((state) => {
          const existingIds = new Set(state.projects.map((p) => p.id));
          const uniqueProjects = newProjects.filter(
            (p) => !existingIds.has(p.id),
          );
          return { projects: [...state.projects, ...uniqueProjects] };
        }),

      setFeaturedCount: (featuredCount) => set({ featuredCount }),

      setNonFeaturedTotal: (nonFeaturedTotal) => set({ nonFeaturedTotal }),

      setSelectedType: (selectedType) => set({ selectedType }),

      setScrollPosition: (scrollPosition) => set({ scrollPosition }),

      reset: () => set(initialState),
    }),
    {
      name: "projects-cache",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
