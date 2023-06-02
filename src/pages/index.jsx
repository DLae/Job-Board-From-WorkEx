import "../app/globals.css"
import React, {useEffect, useState} from "react"
import axios from "axios";
import QRCode from "qrcode"
import {error} from "next/dist/build/output/log";

const MainPage = () => {
    const [jobs, setJobs] = useState(null)

    const [qrcode, setQrcode] = useState(null)

    useEffect(() => {
            const fetchData = async () => {
                try {
                    // const response = await axios.get('https://api.lmiforall.org.uk/api/v1/vacancies/search?limit=6&radius=5&location=Leeds&keywords=%25*');
                    // setJobs(response.data.map( job =>
                    // {QRCode.toDataURL("google.com").then(qrPng => {
                    //     return({
                    //         ...job,
                    //         qrCode: "qrPng"})
                    // })
                    //     }))

                    const response = await axios.get('https://api.lmiforall.org.uk/api/v1/vacancies/search?limit=6&radius=5&location=Leeds&keywords=%25*');

                    const jobsWithQrCodes = await Promise.all(response.data.map(async (job) => {
                        const qrPng = await QRCode.toDataURL(job.link);
                        return {
                            ...job,
                            qrCode: qrPng
                        };
                    }));

                    // const updatedJobs = jobs.map(job => {
                    //     return{
                    //         ...job,
                    //         qrCode: qrcode
                    //     }
                    // })
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
        return ("hello world")
    }, 600000)
   return (tableCreate2(jobs))
}






function tableCreate2(responseData){
    let err;
    console.log(responseData)
    const jobs = [];
    if (responseData === null){
        return "";
    }
    for (let i = 0; i < 6; i++){

        let jobItem = responseData[i];


        const dataRow = <tr>
            <td>{jobItem.title}</td>
            <td>{jobItem.summary.substring(0, 900) + "... Please scan the QR Code for more information"}</td>
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

// function show_image(src, width, height, alt) {
//     if (typeof window !== "undefined") {
//         const img = document.createElement("img");
//         img.src = src;
//         img.width = width;
//         img.height = height;
//         img.alt = alt;
//
//         // This next line will just add it to the <body> tag
//         document.body.appendChild(img);
//     }
// }

export default MainPage
