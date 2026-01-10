
interface LighthouseCircleProps {
    score: number;
    label: string;
    size: number | 120;
    strokeWidth: number | 8;
}

export default function LighthouseCircle({ score, label, size, strokeWidth }: LighthouseCircleProps) {
    const getColor = (score: number) => {
        if (score >= 90) return "text-green-500 dark:text-green-400"
        if (score >= 50) return "text-orange-500 dark:text-orange-400"
        return "text-red-500 dark:text-red-400"
    }
}