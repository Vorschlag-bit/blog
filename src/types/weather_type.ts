// 기상성 API 응답 객체
export interface WeatherData {
    temperature: string,
    tmx: string,
    tmn: string,
    humidity: number,
    wind: number,
    location: string,
    iconName: string
}