import { useState, useEffect, useRef } from "react";

const useHover = (): [React.MutableRefObject<any>, boolean] => {
    const [isHovered, setIsHovered] = useState(false);
    const hoverRef = useRef<any>(null); // Explicitly define the type as any

    const handleMouseOver = () => setIsHovered(true);
    const handleMouseOut = () => setIsHovered(false);

    useEffect(() => {
        const node = hoverRef.current;
        if (node) {
            node.addEventListener("mouseover", handleMouseOver);
            node.addEventListener("mouseout", handleMouseOut);

            return () => {
                node.removeEventListener("mouseover", handleMouseOver);
                node.removeEventListener("mouseout", handleMouseOut);
            };
        }
    }, []);

    return [hoverRef, isHovered];
};

export default useHover;
