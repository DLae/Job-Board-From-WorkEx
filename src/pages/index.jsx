import "../app/globals.css"
import React, {useEffect, useState} from "react"
import axios from "axios";

const MainPage = () => {
    const [jobs, setJobs] = useState(null)

    useEffect(() => {
            const fetchData = async () => {
                try {
                    const response = await axios.get('https://api.lmiforall.org.uk/api/v1/vacancies/search?limit=6&radius=5&location=Leeds&keywords=%25*');
                    setJobs(response.data);
                } catch (error) {
                    console.error(error.message)
                }
            }
            fetchData();
        }

    , []);
   return (tableCreate2(jobs))
}

function getDataFromAPI() {



}


function tableCreate2(responseData){

    console.log(responseData)
    var jobs = []
    if (responseData === null){
        return "";
    }
    for (let i = 0; i < 6; i++){

        let jobItem = responseData[i];


        var dataRow = <tr>
            <td>{jobItem.title}</td>
            <td>{jobItem.summary.substring(0,900) + "... Please scan the QR Code for more information"}</td>
            <td>{jobItem.company}</td>
            <td>{jobItem.location.location}</td>
            <td>{jobItem.link}</td>
        </tr>;
        jobs.push(dataRow)
        console.log(dataRow)
    }



    return (
        <table className={"jobCardTable"}>
            <tbody>
            <tr>
                <th>Job Title</th>
                <th>Job Description</th>
                <th>Company</th>
                <th>Job Location</th>
                <th>QR Code</th>
            </tr>
            {jobs}
            </tbody>
        </table>
    )
}

function show_image(src, width, height, alt) {
    if (typeof window !== "undefined") {
        var img = document.createElement("img");
        img.src = src;
        img.width = width;
        img.height = height;
        img.alt = alt;

        // This next line will just add it to the <body> tag
        document.body.appendChild(img);
    }
}

export default MainPage
