import { useState, useEffect } from "react"

export function useFetch(url, autoload = false) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [data, setData] = useState([])

  const loadData = async (options = {}) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(url, {
        headers: { "Content-Type": "application/json" },
        ...options,
      })
      if (!res.ok) throw new Error("Failed to fetch data")
      const json = await res.json()
      setData(json)
      return json
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const createData = async (newItem) => {
    const created = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newItem),
    }).then((r) => {
      if (!r.ok) throw new Error("Create failed")
      return r.json()
    })
    setData((prev) => [...prev, created])
    return created
  }

  const updateData = async (id, updatedItem) => {
    const updated = await fetch(`${url}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedItem),
    }).then((r) => {
      if (!r.ok) throw new Error("Update failed")
      return r.json()
    })
    setData((prev) =>
      prev.map((item) => (item.id === id ? updated : item))
    )
    return updated
  }

  const deleteData = async (id) => {
    await fetch(`${url}/${id}`, { method: "DELETE" }).then((r) => {
      if (!r.ok) throw new Error("Delete failed")
    })
    setData((prev) => prev.filter((item) => item.id !== id))
  }

  useEffect(() => {
    if (autoload) loadData()
  }, [autoload])

  return {
    loading,
    error,
    data,
    loadData,
    createData,
    updateData,
    deleteData,
  }
}