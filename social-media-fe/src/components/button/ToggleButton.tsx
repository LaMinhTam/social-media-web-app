const ToggleButton = ({
    checked,
    text,
    onChange = () => {},
}: {
    checked: boolean;
    text: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
    return (
        <label className="flex items-center justify-center cursor-pointer">
            <span className="mr-auto text-sm font-medium text-gray-900 dark:text-gray-300 max-w-[250px]">
                {text}
            </span>
            <input
                type="checkbox"
                value=""
                className="sr-only peer"
                checked={checked}
                onChange={onChange}
            />
            <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
        </label>
    );
};

export default ToggleButton;
