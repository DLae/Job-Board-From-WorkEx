import "../app/globals.css";
import "../app/gov.scss";

const redirectpage = () => {
    if (typeof window !== "undefined") {




        const indexOfH = window.location.search.indexOf("h")
        const searchQuery = window.location.search.substring(indexOfH, window.location.search.length)
        window.location.replace(searchQuery)
    }

    return null
}

export default redirectpage