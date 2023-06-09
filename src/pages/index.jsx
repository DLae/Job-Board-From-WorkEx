import "../app/globals.css"
import Table from '@govuk-react/table';
import React, {useEffect, useState} from "react"
import axios from "axios";
import QRCode from "qrcode"
import {GridCol, GridRow} from "govuk-react";

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


function getWindowSize(){
    if (typeof window !== "undefined"){
        const windowWidth = window.innerWidth
        const windowHeight = window.innerHeight
        console.log(windowWidth)
        console.log(windowHeight)
        // 1633 x 910 comfortably fits 4 jobs no problem
        switch (windowWidth){
            case 2560 : return 5;   // 2560 x ~~~~
            case 1920 : return 3;   // 1920 x ~~~~
            case 1440 : return 9;  // 1440 x ~~~~
            case 1080 : return 5;   // 1080 x ~~~~
            default: return 3;
        }
    }
}

// Height(normal/fullscreen), Width
// 1304/1329, 2560 ----- 969, 1920   landscape
// 2449, 1440 ----- 1809, 1080  portrait
//console.log(window.innerHeight, window.innerWidth)

// anything above 2000px wide comfortably fits 6 jobs (needs 1300px min height)
function tableCreate2(responseData){

    let size = getWindowSize()

    const jobs = [];
    if (responseData === null){
        return "";
    }

    for (let i = 0; i < size; i++){

        let jobItem = responseData[i];

        // const dataRow = <tr>
        //     <td>{jobItem.title}</td>
        //     <td>{jobItem.summary.substring(0,300) + "... Please scan the QR Code for more information"}</td>
        //     <td>{jobItem.company}</td>
        //     <td>{jobItem.location.location}</td>
        //     <td><img src = {jobItem.qrCode}/></td>
        // </tr>;
        // jobs.push(dataRow)

        // const dataRow = <GridRow>
        //     <GridCol setWidth={"10%"}>{jobItem.title}</GridCol>
        //     <GridCol setWidth={"50%"}>{jobItem.summary.substring(0,300) + "... Please scan the QR Code for more information"}</GridCol>
        //     <GridCol setWidth={"10%"}>{jobItem.company}</GridCol>
        //     <GridCol setWidth={"10%"}>{jobItem.location.location}</GridCol>
        //     <GridCol><img src = {jobItem.qrCode}/></GridCol>
        // </GridRow>;
        // jobs.push(dataRow)

        const dataRow = <Table>

            <Table.Row>
                <Table.Cell>
                    {jobItem.title}
                </Table.Cell>
                <Table.Cell>
                    {jobItem.summary.substring(0,300) + "Please scan the QR Codes for more information"}
                </Table.Cell>
                <Table.Cell>
                    {jobItem.company}
                </Table.Cell>
                <Table.Cell>
                    {jobItem.location.location}
                </Table.Cell>
                <Table.Cell>
                    <img src = {jobItem.qrCode}/>
                </Table.Cell>
            </Table.Row>
        </Table>
        jobs.push(dataRow)


    }




    return (
        // <table className={"jobCardTable"}>
        //     <caption>This is all a first design of a digital Job Board - Made by Josh Bhogal (I'm a T-level student, Feedback is appreciated)</caption>
        //     <tbody>
        //     <tr>
        //         <th>Job Title</th>
        //         <th>Job Description</th>
        //         <th>Company</th>
        //         <th>Job Location</th>
        //         <th>QR Code</th>
        //     </tr>
        //     {jobs}
        //     </tbody>
        // </table>

        <Table className={"jobCardTable"} caption={"This is a test for a digital Job Board made by Josh Bhogal (I'm a T-Level student, Feedback is appreciated)"}
               // head={<Table.Row><Table.CellHeader>Job Title</Table.CellHeader>
               //     <Table.CellHeader>Job Description</Table.CellHeader>
               //     <Table.CellHeader>Company</Table.CellHeader>
               //     <Table.CellHeader>Location</Table.CellHeader>
               //     <Table.CellHeader>QR Code</Table.CellHeader>
               // </Table.Row>}
        >
            {jobs}
        </Table>

    )
}

export default MainPage
