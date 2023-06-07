import "../app/globals.css"
import React, {useEffect, useState} from "react"
import axios from "axios";
import QRCode from "qrcode"

const MainPage = () => {
    const [jobs, setJobs] = useState(null)

    useEffect(() => {
            const fetchData = async () => {
                try {
                    const response = await axios.get('https://api.lmiforall.org.uk/api/v1/vacancies/search?limit=6&radius=5&location=Leeds&keywords=%25*');
                    const qrCodeSize = 190;
                    const jobsWithQrCodes = await Promise.all(response.data.map(async (job) => {
                        const qrPng = await QRCode.toDataURL(job.link, {width:qrCodeSize});
                        return {
                            ...job,
                            qrCode: qrPng
                        };
                    }));
                    setJobs(jobsWithQrCodes)

                } catch (error) {
                    console.error(error.message)
                }
            }
            fetchData();

        }

    , []);
    setTimeout(function (){
        location.reload()
        return (tableCreate2(jobs))
    }, 600000)
   return (tableCreate2(jobs))
}

function pageScrollDown() {
    if (typeof window !== "undefined") {
        window.scrollBy(0, 1);
        setTimeout(pageScrollDown, 10);
    }
}
function pageScrollUp() {
    if (typeof window !== "undefined") {
        window.scrollBy(0, -1);
        setTimeout(pageScrollUp, 10);
    }
}


function tableCreate2(responseData){
    console.log(responseData)
    const jobs = [];
    if (responseData === null){
        return "";
    }
    for (let i = 0; i < 6; i++){

        let jobItem = responseData[i];


        const dataRow = <tr>
            <td>{jobItem.title}</td>
            <td>{jobItem.summary.substring(0,300) + "... Please scan the QR Code for more information"}</td>
            <td>{jobItem.company}</td>
            <td>{jobItem.location.location}</td>
            <td className={"qrcode"}><img src = {jobItem.qrCode}/></td>
        </tr>;
        jobs.push(dataRow)
    }

    return (
        <table className={"jobCardTable"}>
            <caption>This is all a first design of a digital Job Board - Made by Josh Bhogal (I'm a T-level student, Feedback is appreciated)</caption>
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

export default MainPage
