import "../app/globals.css";
import "../app/gov.scss";

const redirectpage = () =>{
    let newPageOpen;
    if (typeof window !== "undefined") {

        const indexOfEquals = window.location.search.indexOf("=")
        const searchQuery = window.location.search.substring(indexOfEquals + 1, window.location.search.length)

        newPageOpen = window.open(searchQuery)
    }

    return(newPageOpen)
}



export default redirectpage