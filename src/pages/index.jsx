import "../app/globals.css"
import "../app/gov.scss"
import Table from '@govuk-react/table';
import Button from '@govuk-react/button';
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
                    <p className="govuk-body">{jobItem.title}</p>
                </Table.Cell>
                <Table.Cell>
                    <p className="govuk-body">{jobItem.summary.substring(0,300) + "... Scan the QR Code for more information"}</p>
                </Table.Cell>
                <Table.Cell>
                    <p className="govuk-body">{jobItem.company}</p>
                </Table.Cell>
                <Table.Cell>
                    <p className="govuk-body">{jobItem.location.location}</p>
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

        <body className="govuk-template__body ">
            <script>
                document.body.className = ((document.body.className) ? document.body.className + ' js-enabled' :
                'js-enabled');
            </script>
            <a href="#main-content" className="govuk-skip-link" data-module="govuk-skip-link">Skip to main content</a>
            <header className="govuk-header " role="banner" data-module="govuk-header">
                <div className="govuk-header__container govuk-width-container">
                    <div className="govuk-header__logo">
                        <a href="/" className="govuk-header__link govuk-header__link--homepage">
              <span className="govuk-header__logotype">
                  <svg
                      aria-hidden="true"
                      focusable="false"
                      className="govuk-header__logotype-crown"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 132 97"
                      height="30"
                      width="36">
                  <path
                      fill="currentColor" fill-rule="evenodd"
                      d="M25 30.2c3.5 1.5 7.7-.2 9.1-3.7 1.5-3.6-.2-7.8-3.9-9.2-3.6-1.4-7.6.3-9.1 3.9-1.4 3.5.3 7.5 3.9 9zM9 39.5c3.6 1.5 7.8-.2 9.2-3.7 1.5-3.6-.2-7.8-3.9-9.1-3.6-1.5-7.6.2-9.1 3.8-1.4 3.5.3 7.5 3.8 9zM4.4 57.2c3.5 1.5 7.7-.2 9.1-3.8 1.5-3.6-.2-7.7-3.9-9.1-3.5-1.5-7.6.3-9.1 3.8-1.4 3.5.3 7.6 3.9 9.1zm38.3-21.4c3.5 1.5 7.7-.2 9.1-3.8 1.5-3.6-.2-7.7-3.9-9.1-3.6-1.5-7.6.3-9.1 3.8-1.3 3.6.4 7.7 3.9 9.1zm64.4-5.6c-3.6 1.5-7.8-.2-9.1-3.7-1.5-3.6.2-7.8 3.8-9.2 3.6-1.4 7.7.3 9.2 3.9 1.3 3.5-.4 7.5-3.9 9zm15.9 9.3c-3.6 1.5-7.7-.2-9.1-3.7-1.5-3.6.2-7.8 3.7-9.1 3.6-1.5 7.7.2 9.2 3.8 1.5 3.5-.3 7.5-3.8 9zm4.7 17.7c-3.6 1.5-7.8-.2-9.2-3.8-1.5-3.6.2-7.7 3.9-9.1 3.6-1.5 7.7.3 9.2 3.8 1.3 3.5-.4 7.6-3.9 9.1zM89.3 35.8c-3.6 1.5-7.8-.2-9.2-3.8-1.4-3.6.2-7.7 3.9-9.1 3.6-1.5 7.7.3 9.2 3.8 1.4 3.6-.3 7.7-3.9 9.1zM69.7 17.7l8.9 4.7V9.3l-8.9 2.8c-.2-.3-.5-.6-.9-.9L72.4 0H59.6l3.5 11.2c-.3.3-.6.5-.9.9l-8.8-2.8v13.1l8.8-4.7c.3.3.6.7.9.9l-5 15.4v.1c-.2.8-.4 1.6-.4 2.4 0 4.1 3.1 7.5 7 8.1h.2c.3 0 .7.1 1 .1.4 0 .7 0 1-.1h.2c4-.6 7.1-4.1 7.1-8.1 0-.8-.1-1.7-.4-2.4V34l-5.1-15.4c.4-.2.7-.6 1-.9zM66 92.8c16.9 0 32.8 1.1 47.1 3.2 4-16.9 8.9-26.7 14-33.5l-9.6-3.4c1 4.9 1.1 7.2 0 10.2-1.5-1.4-3-4.3-4.2-8.7L108.6 76c2.8-2 5-3.2 7.5-3.3-4.4 9.4-10 11.9-13.6 11.2-4.3-.8-6.3-4.6-5.6-7.9 1-4.7 5.7-5.9 8-.5 4.3-8.7-3-11.4-7.6-8.8 7.1-7.2 7.9-13.5 2.1-21.1-8 6.1-8.1 12.3-4.5 20.8-4.7-5.4-12.1-2.5-9.5 6.2 3.4-5.2 7.9-2 7.2 3.1-.6 4.3-6.4 7.8-13.5 7.2-10.3-.9-10.9-8-11.2-13.8 2.5-.5 7.1 1.8 11 7.3L80.2 60c-4.1 4.4-8 5.3-12.3 5.4 1.4-4.4 8-11.6 8-11.6H55.5s6.4 7.2 7.9 11.6c-4.2-.1-8-1-12.3-5.4l1.4 16.4c3.9-5.5 8.5-7.7 10.9-7.3-.3 5.8-.9 12.8-11.1 13.8-7.2.6-12.9-2.9-13.5-7.2-.7-5 3.8-8.3 7.1-3.1 2.7-8.7-4.6-11.6-9.4-6.2 3.7-8.5 3.6-14.7-4.6-20.8-5.8 7.6-5 13.9 2.2 21.1-4.7-2.6-11.9.1-7.7 8.8 2.3-5.5 7.1-4.2 8.1.5.7 3.3-1.3 7.1-5.7 7.9-3.5.7-9-1.8-13.5-11.2 2.5.1 4.7 1.3 7.5 3.3l-4.7-15.4c-1.2 4.4-2.7 7.2-4.3 8.7-1.1-3-.9-5.3 0-10.2l-9.5 3.4c5 6.9 9.9 16.7 14 33.5 14.8-2.1 30.8-3.2 47.7-3.2z"></path>
                </svg>
                  <span className="govuk-header__logotype-text">
                  Job Board
                </span>
              </span>
                        </a>
                    </div>
                </div>
            </header>
            <div className="govuk-width-container ">
                <main className="govuk-main-wrapper " id="main-content" role="main">
                    <Table className={"jobCardTable"} caption={"This is a test for a digital Job Board made by Josh Bhogal (I'm a T-Level student, Feedback is appreciated)"}>
                        {jobs}
                    </Table>
                </main>
            </div>
        </body>


        // <button className="govuk-button" data-module="govuk-button">
        //     Save and continue
        // </button>

    )
}

export default MainPage
