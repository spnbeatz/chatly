export const InfoCenteredText = ({ text }: { text: string }) => {
    return (
        <div className="w-full py-6 flex items-center justify-center">
            <p className="text-gray-400 text-xs">{text}</p>
        </div>
    );
};