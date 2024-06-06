import { useEffect, useRef, useState } from "react";

const useClickOutSide = (dom: string = "button") => {
    const [show, setShow] = useState<boolean>(false);
    const nodeRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        function handleClickOutSide(e: MouseEvent) {
            if ((e.target as Element).closest(".search-input")) {
                return;
            }
            if (
                nodeRef.current &&
                !nodeRef.current.contains(e.target as Node) &&
                !(e.target as Element).matches(dom)
            ) {
                setShow(false);
            }
        }

        document.addEventListener("click", handleClickOutSide);
        return () => {
            document.removeEventListener("click", handleClickOutSide);
        };
    }, [dom]);

    return {
        show,
        setShow,
        nodeRef,
    };
};

export default useClickOutSide;
