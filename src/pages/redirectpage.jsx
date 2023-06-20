import "../app/globals.css";
import "../app/gov.scss";

const redirectpage = () =>{
    let jobWindow;
    if (typeof window !== "undefined") {
        jobWindow = window.open("about:blank", "_blank")
        const indexOfH = window.location.search.indexOf("h")
        const searchQuery = window.location.search.substring(indexOfH, window.location.search.length)
        jobWindow.location.href = `${searchQuery}`
    }

    return null
}

export default redirectpage