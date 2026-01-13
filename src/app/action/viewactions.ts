"use server"

import { IncrementRank } from "../../lib/ranks"

export async function ViewCountAction(id: string) {
    try {
        await IncrementRank(id)
        console.log(`ViewCountAction 실행: `, id);
    } catch (err) {
        console.error(`ViewCountAction server action 실행 실패 - id: `,id);
    }
}