import { getSeoulWeather } from "@/app/action/weather";
import WeatherWidget from "./WeatherWidget";
/**
 * 서버 컴포넌트의 기능만을 수행하는 보이진 않는 컴포넌트입니다.
 * 자식으로 클라이언트 컴포넌트인 <WeahterWidget>에게 'data'를 props로 제공합니다.
 * 클라이언트 컴포넌트인 <WeahterWidget>에게 서버 컴포넌트인 <WeatherIcon>을
 * `children` props로 제공합니다.
 * 
 * @returns 
 */


export default async function WeatherContainer() {
    // 기본값으로 종로구 송월동에 위치한 '서울 기상 관측소' 날씨 제공
    const data = await getSeoulWeather()
    // console.log('WeatherContainer에서 받은 데이터: ', data);
    
    return (
        <div className="w-full">
            <WeatherWidget initialData={data} />
        </div>
    )
}