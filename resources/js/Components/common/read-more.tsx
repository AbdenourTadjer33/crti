import { cn } from "@/Utils/utils";
import React from "react";

interface ReadMoreProps {
    charLimit?: number;
    readMoreText?: string;
    readLessText?: string;
    text: string;
    classNames?: {
        readLess?: string;
        readMore?: string;
        content?: string;
    };
}

const ReadMore: React.FC<ReadMoreProps> = ({
    charLimit = 150,
    readMoreText = "Read more",
    readLessText = "Read less",
    text,
    classNames,
}) => {
    const [currentCharLimit, setCurrentCharLimit] = React.useState(charLimit);

    const isTextLong = text.length > currentCharLimit;

    const getTruncatedText = (text: string, limit: number) => {
        if (text.length <= limit) return text;

        // Find the last space character before the limit
        const truncated = text.substr(0, limit);
        const lastSpaceIndex = truncated.lastIndexOf(" ");

        // If there's no space or it's too close to the start, cut directly at the limit
        return lastSpaceIndex > 0
            ? truncated.substr(0, lastSpaceIndex)
            : truncated;
    };

    const handleReadMore = () => setCurrentCharLimit(text.length);
    const handleReadLess = () => setCurrentCharLimit(charLimit);

    return (
        <div>
            <span
                className="prose prose-slate prose-sm sm:prose-base dark:prose-invert prose-a:text-blue-600 first:*:mt-0"
                dangerouslySetInnerHTML={{
                    __html: getTruncatedText(text, currentCharLimit),
                }}
            />
            {isTextLong ? (
                <span
                    className={cn(
                        "cursor-pointer text-blue-600 dark:text-blue-500 hover:underline",
                        classNames?.readMore
                    )}
                    role="presentation"
                    onClick={handleReadMore}
                >
                    {readMoreText}
                </span>
            ) : currentCharLimit > charLimit ? (
                <span
                    className={cn(
                        "cursor-pointer text-blue-600 dark:text-blue-500 hover:underline",
                        classNames?.readLess
                    )}
                    role="presentation"
                    onClick={handleReadLess}
                >
                    {readLessText}
                </span>
            ) : null}
        </div>
    );
};

export type { ReadMoreProps };
export default ReadMore;
