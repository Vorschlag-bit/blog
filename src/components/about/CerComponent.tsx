const pixelShadow = "shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]";

interface StudyData {
  duration: string;
  title: string;
  details: string[];
}

const studies: StudyData[] = [
  {
    duration: "2017.02 - 2024.08",
    title: "한국외국어대학교",
    details: [
      "생명공학과(전공) / 독일어통번역학과(이중전공) 졸업"
    ],
  },
  {
    duration: "2024.06 - 2024.12",
    title: "한화시스템 Beyond SW캠프 9기",
    details: [
      "DB 기초 설계 및 최적화 학습",
      "Java/Spring Boot 기반 서버 프로그래밍 및 배포 파이프라인 구축",
      "HTML, CSS, JS 기초 및 Vue를 활용한 웹 클라이언트 구현"
    ],
  },
  {
    duration: "2025.07 - 2025.08",
    title: "네이버 부스트 캠프 안드로이드 10기 챌린지",
    details: [
      "CS 기초(네트워크, OS, Git 등)를 코드로 직접 구현하며 원리 학습",
      "동료 학습을 통한 기술 공유 및 협업 경험"
    ],
  },
];

const certificates: StudyData[] = [
  {
    duration: "2024.09.20",
    title: "SQLD",
    details: ["한국데이터산업진흥원 발급"],
  },
  {
    duration: "2024.09.10",
    title: "정보처리기사",
    details: ["한국산업인력공단 발급"],
  },
  {
    duration: "2025.03.12",
    title: "OPIc",
    details: ["Intermediate HIGH (영어)"],
  },
];

export default function CerComponent() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
      
      {/* 1. 교육 및 이력 */}
      <div className={`col-span-1 w-full border-2 border-black dark:border-gray-500 bg-white dark:bg-gray-800 p-6 ${pixelShadow}`}>
        <div className="flex items-center gap-2 mb-6 border-b-2 border-dashed border-gray-300 dark:border-gray-600 pb-2">
            <svg className="w-6 h-6 text-blue-600" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"> <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z" fill="currentColor"/> </svg>
            <h3 className="text-xl font-bold">Education & History</h3>
        </div>
        
        <ul className="space-y-8">
          {studies.map((study, index) => (
            <li key={index} className="group">
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-6">
                {/* [Left] Duration */}
                <div className="min-w-[8rem] shrink-0 pt-1">
                  <span className="text-sm font-mono text-gray-500 dark:text-gray-400 group-hover:text-blue-500 transition-colors">
                    * {study.duration}
                  </span>
                </div>

                {/* [Right] Title & Details */}
                <div className="flex flex-col flex-1">
                  <h4 className="text-lg font-bold mb-2 text-gray-900 dark:text-gray-100">
                    {study.title}
                  </h4>
                  <ul className="list-disc list-outside ml-4 space-y-1">
                    {study.details.map((detail, idx) => (
                      <li key={idx} className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* 2. 어학 및 자격증 */}
      <div className={`col-span-1 w-full border-2 border-black dark:border-gray-500 bg-white dark:bg-gray-800 p-6 ${pixelShadow}`}>
        <div className="flex items-center gap-2 mb-6 border-b-2 border-dashed border-gray-300 dark:border-gray-600 pb-2">
            <svg className="w-6 h-6 text-green-600" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"> <path d="M2 4h20v2H2V4zm2 4h16v2H4V8zm2 4h12v2H6v-2zm2 4h8v2H8v-2z" fill="currentColor"/> </svg>
            <h3 className="text-xl font-bold">Certificate & Language</h3>
        </div>

        <ul className="space-y-8">
          {certificates.map((cer, index) => (
            <li key={index} className="group">
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-6">
                {/* [Left] Duration (Date) */}
                <div className="min-w-[8rem] shrink-0 pt-1">
                  <span className="text-sm font-mono text-gray-500 dark:text-gray-400 group-hover:text-green-500 transition-colors">
                    * {cer.duration}
                  </span>
                </div>

                {/* [Right] Title & Details */}
                <div className="flex flex-col flex-1">
                  <h4 className="text-lg font-bold mb-2 text-gray-900 dark:text-gray-100">
                    {cer.title}
                  </h4>
                  <ul className="list-disc list-outside ml-4 space-y-1">
                    {cer.details.map((detail, idx) => (
                      <li key={idx} className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}