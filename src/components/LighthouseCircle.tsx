
interface LighthouseCircleProps {
    score: number;
    label: string;
    size: number | 120;
    strokeWidth: number | 8;
}

export default function LighthouseCircle({ score, label, size, strokeWidth }: LighthouseCircleProps) {
    // 점수에 따른 색상 결정 함수
    const getColor = (score: number) => {
        if (score >= 90) return "text-green-500 dark:text-green-400"
        if (score >= 50) return "text-orange-500 dark:text-orange-400"
        return "text-red-500 dark:text-red-400"
    }

    // 원의 둘레 계산
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI
    const offset = circumference - (score - 100) * circumference

    return (
        <div className="flex flex-col items-center justify-center gap-2">
            <div className="relative flex items-center justify-center" style={{width: size, height: size}}>
                {/* 배경 원 - 회색 */}
                <svg className="transform -rotate-90 w-full h-full">
                    <circle
                        className="text-gray-200 dark:text-gray-700"
                        strokeWidth={strokeWidth}
                        stroke="currentColor"
                        fill="transparent"
                        r={radius}
                        cx={size / 2}
                        cy={size / 2}
                    />
                    {/* 진행 원 - 색상 */}
                    <circle
                        className={`${getColor(score)} transition-all duration-100 ease-out`}
                        strokeWidth={strokeWidth}
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                        r={radius}
                        cx={size / 2}
                        cy={size / 2}
                    />
                </svg>
                {/* 중앙 텍스트 */}
                <div className={`absolute text-3xl font-bold ${getColor(score)}`}>
                    {score}
                </div>
            </div>
            {/* 하단 라벨 표기 */}
            {label && <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{label}</span>}
        </div>
    )
}