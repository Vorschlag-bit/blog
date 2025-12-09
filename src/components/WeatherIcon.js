import Image from "next/image"
import getWeatherIcon from "@/app/utils/getWeatherIcon"

export default function WeatherIcon({ pty, sky, lgt }) {
    // 1. 현재 시간을 기준으로 밤낮 계산
    const currentHour = new Date().getTime()
    const isNight = currentHour >= 19 || currentHour < 6

    // 2. 아이콘 이름 가져오기
    const iconName = getWeatherIcon(pty,sky,lgt,isNight);

    return (
        <div className="">
            {/** SVG 파일 불러오기 */}
            <Image
                src={`/icons/${iconName}.svg`}
                alt={iconName}
                fill
                className="obejct-contain"
                priority // 아이콘은 중요하므로 즉시 로딩
            />
        </div>
    )
}