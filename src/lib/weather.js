"use server"

import { dfs_xy_conv } from "@/app/utils/positionConverter"

/**
 * 좌표(x,y)를 기반으로 기상청 API를 호출하고 return 받은 걸 그대로 return 하는 함수입니다.
 * type이 'xy'인 경우에는 그대로 사용하고, 위/경도일 경우에는 입력받은 x가 
 * @param { number } x,
 * @param { number } y,
 * @param { string } type,
 */
export default function getWeather({ x, y, type="xy" }) {

}