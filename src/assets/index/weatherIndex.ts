// 날씨 Icon 미리 import
import ClearDay from '@/assets/icons/clear-day.svg'
import ClearNight from '@/assets/icons/clear-night.svg'
import Drizzle from '@/assets/icons/drizzle.svg'
import OvercastDay from '@/assets/icons/overcast-day.svg'
import OvercastNight from '@/assets/icons/overcast-night.svg'
import Overcast from '@/assets/icons/overcast.svg'
import PartlyCloudyDay from '@/assets/icons/partly-cloudy-day.svg'
import PartlyCloudyNight from '@/assets/icons/partly-cloudy-night.svg'
import Rain from '@/assets/icons/rain.svg'
import Sleet from '@/assets/icons/sleet.svg'
import SmokeParticles from '@/assets/icons/smoke-particles.svg'
import Smoke from '@/assets/icons/smoke.svg'
import Snow from '@/assets/icons/snow.svg'
import ThunderDay from '@/assets/icons/thunderstorms-day.svg'
import ThunderNight from '@/assets/icons/thunderstorms-night.svg'
import ThunderRain from '@/assets/icons/thunderstorms-rain.svg'
import ThunderSnow from '@/assets/icons/thunderstorms-snow.svg'
import WindSock from '@/assets/icons/windsock.svg'
import { StaticImageData } from "next/image";

export const weatherIconMap: Record<string,StaticImageData> = {
    'clear-day': ClearDay,
    'clear-night': ClearNight,
    'drizzle': Drizzle,
    'overcast-day': OvercastDay,
    'overcast-night': OvercastNight,
    'overcast': Overcast,
    'partly-cloudy-day': PartlyCloudyDay,
    'partly-cloudy-night': PartlyCloudyNight,
    'rain': Rain,
    'sleet': Sleet,
    'smoke-particles': SmokeParticles,
    'smoke': Smoke,
    'snow': Snow,
    'thunderstorms-day': ThunderDay,
    'thunderstorms-night': ThunderNight,
    'thunderstorms-rain': ThunderRain,
    'thunderstorms-snow': ThunderSnow,
    'windsock': WindSock,
}