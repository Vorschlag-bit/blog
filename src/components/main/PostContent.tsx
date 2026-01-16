import parse, { Element } from "html-react-parser";
import Image from "next/image";

export default function PostContent({ htmlContent }: { htmlContent: string}) {
    let imgIdx = 0
    // 순수 문자열을 JSX 태그로 변환
    const content = parse(htmlContent, {
        replace: (domNode) => {
            // img 태그가 있는지 확인
            if (domNode instanceof Element && domNode.tagName === 'img') {
                const { src,alt,width,height,class: classNameFromMarkdown } = domNode.attribs

                // 크기가 있는지, 외부 이미지가 아닌지 확인
                if (src.startsWith('/') && width && height) {
                    return (
                        <span className="relative w-full">
                            <Image 
                                src={src}
                                alt={alt}
                                width={parseInt(width,10)}
                                height={parseInt(height,10)}
                                sizes="(max-width: 768px) 100vw, 700px"
                                priority={imgIdx === 0 ? true : false}
                                quality={65}
                                decoding={imgIdx === 0 ? "sync" : "async"}
                                fetchPriority={imgIdx === 0 ? "high" : "low"}
                                className={`
                                    retro-img h-auto
                                    ${classNameFromMarkdown ? classNameFromMarkdown : 'w-[70%]'}
                                    `} 

                            />
                        </span>
                    )
                }
                imgIdx ++
            }
        }
    })
    return (
        <div className="markdown-body">{content}</div>
    )
}