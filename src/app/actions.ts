// src/app/actions.ts
'use server'

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"

// --- DELETE ACTION ---
export async function deleteGoal(formData: FormData) {
  // Captured directly as a string to match the CUID in your schema
  const id = formData.get('id') as string;

  if (!id) return; // Basic safety check

  await db.goal.delete({
    where: { id },
  })

  // Refreshes the dashboard to reflect the deleted item instantly
  revalidatePath('/')
}

// --- EDIT ACTION ---
export async function updateGoal(formData: FormData) {
  const id = formData.get('id') as string;
  const title = formData.get('title') as string;

  if (!id || !title) return; // Basic safety check

  await db.goal.update({
    where: { id },
    data: { title },
  })

  revalidatePath('/')
}
