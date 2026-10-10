export type Task = {
  id: number
  title: string
  completed: boolean
}

const API_URL = 'http://localhost:5053/api/tasks'

export async function getTasks(): Promise<Task[]> {
  const response = await fetch(API_URL)

  if (!response.ok) {
    throw new Error(
      `Failed to load tasks: ${response.status}`
    )
  }

  return response.json()
}

export async function createTask(
  title: string
): Promise<Task> {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title }),
  })

  if (!response.ok) {
    throw new Error(
      `Failed to create task: ${response.status}`
    )
  }

  return response.json()
}

export async function updateTask(
  id: number,
  completed: boolean
): Promise<Task> {
  const response = await fetch(
    `${API_URL}/${id}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ completed }),
    }
  )

  if (!response.ok) {
    throw new Error(
      `Failed to update task: ${response.status}`
    )
  }

  return response.json()
}

export async function deleteTask(
  id: number
): Promise<void> {
  const response = await fetch(
    `${API_URL}/${id}`,
    {
      method: 'DELETE',
    }
  )

  if (!response.ok) {
    throw new Error(
      `Failed to delete task: ${response.status}`
    )
  }
}