export const InfoCenteredText = ({ text, className = "" }: { text: string, className?: string }) => {
    return (
        <div className={`w-full py-6 flex items-center justify-center ${className}`}>
            <p className="text-gray-400 text-xs">{text}</p>
        </div>
    );
};