import {
  useCallback,
  useEffect,
  useState,
} from 'react'

import { useTaskCategoriesApi } from './useTaskCategoriesApi'

import type {
  CreateTaskCategoryInput,
  TaskCategory,
  UpdateTaskCategoryInput,
} from './taskCategoryTypes'

export function useTaskCategories() {
  const {
    getCategories,
    createCategory:
      createCategoryRequest,
    updateCategory:
      updateCategoryRequest,
    deleteCategory:
      deleteCategoryRequest,
  } = useTaskCategoriesApi()

  const [
    categories,
    setCategories,
  ] = useState<TaskCategory[]>([])

  const [
    isLoadingCategories,
    setIsLoadingCategories,
  ] = useState(true)

  const [
    categoryError,
    setCategoryError,
  ] = useState<string | null>(null)

  const loadCategories =
    useCallback(
      async () => {
        try {
          setIsLoadingCategories(
            true,
          )

          setCategoryError(null)

          const data =
            await getCategories()

          setCategories(data)
        } catch (error) {
          console.error(error)

          setCategoryError(
            'Unable to load categories.',
          )
        } finally {
          setIsLoadingCategories(
            false,
          )
        }
      },
      [getCategories],
    )

  useEffect(() => {
    void loadCategories()
  }, [loadCategories])

  const addCategory =
    useCallback(
      async (
        input:
          CreateTaskCategoryInput,
      ) => {
        const category =
          await createCategoryRequest(
            input,
          )

        setCategories(
          (current) => [
            ...current,
            category,
          ],
        )

        return category
      },
      [createCategoryRequest],
    )

  const saveCategory =
    useCallback(
      async (
        id: number,
        input:
          UpdateTaskCategoryInput,
      ) => {
        const updated =
          await updateCategoryRequest(
            id,
            input,
          )

        setCategories(
          (current) =>
            current.map(
              (category) =>
                category.id === id
                  ? updated
                  : category,
            ),
        )

        return updated
      },
      [updateCategoryRequest],
    )

  const removeCategory =
    useCallback(
      async (
        id: number,
      ) => {
        await deleteCategoryRequest(
          id,
        )

        setCategories(
          (current) =>
            current.filter(
              (category) =>
                category.id !== id,
            ),
        )
      },
      [deleteCategoryRequest],
    )

  return {
    categories,
    isLoadingCategories,
    categoryError,

    loadCategories,
    addCategory,
    saveCategory,
    removeCategory,
  }
}