import moment from "moment";

export default function handleFormatPostTime(time: number) {
    const postTime = moment(time);
    return postTime.format("DD/MM/YYYY at HH:mm");
}
