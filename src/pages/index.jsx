import "../app/globals.css"
import "../app/gov.scss"
import Table from '@govuk-react/table';
import Button from '@govuk-react/button';
import React, {useEffect, useState} from "react"
import axios from "axios";
import QRCode from "qrcode"
import {GridCol, GridRow} from "govuk-react";
import {addImplicitTags} from "next/dist/server/lib/patch-fetch";

const MainPage = () => {
    const [jobs, setJobs] = useState(null)
    let jobCentreLocation;
    useEffect(() => {

            const fetchLocationData = async () => {
                try {
                    navigator.geolocation.getCurrentPosition(async function (location) {
                        const locationInfo = await axios.get("https://api.geoapify.com/v1/geocode/reverse?lat=" + location.coords.latitude + "&lon=" + location.coords.longitude + "&type=city&apiKey=3200759bbd644f979309769b8cd6cc8e");
                        console.log(locationInfo);
                        const cityLocation = locationInfo.data.features[0].properties.city;
                        console.log(cityLocation)
                        return cityLocation;
                    })
                }
                catch (error){
                    console.error(error.message)
                }
            }


            const fetchData = async () => {
                try {
                    const response = await axios.get('https://api.lmiforall.org.uk/api/v1/vacancies/search?limit=6&radius=5&location='+jobCentreLocation+'&keywords=%25*');
                    const qrCodeSize = 180;
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
            jobCentreLocation = fetchLocationData();
            jobCentreLocation = "Leeds"
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
        // 1633 x 910 comfortably fits 4 jobs no problem
        switch (windowWidth){
            case 2560 : return 5;   // 2560 x ~~~~
            case 1920 : return 3;   // 1920 x ~~~~
            case 1440 : return 9;  // 1440 x ~~~~
            case 1080 : return 5;   // 1080 x ~~~~
            default: return 4;
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

        const dataRow = <Table className={"govuk-table"} >

            <Table.Row>
                <Table.CellHeader className={"govuk-!-text-align-centre"}>
                    {jobItem.title}
                </Table.CellHeader>
                <Table.Cell className={"govuk-!-text-align-centre"}>
                    <p className="govuk-body">{jobItem.summary.substring(0,350) + "... Scan the QR Code for more information"}</p>
                </Table.Cell>
                <Table.Cell className={"govuk-!-text-align-centre"}>
                    <p className="govuk-body">{jobItem.company}</p>
                </Table.Cell>
                <Table.Cell className={"govuk-!-text-align-centre"}>
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

                  <span className="govuk-header__logotype-text">
                  Job Board
                </span>
              </span>
                        </a>
                    </div>
                </div>
            </header>



            <div className="govuk-width-container" className={"govuk-!-padding-left-9"} >
                <main className="govuk-main-wrapper " id="main-content" role="main">
                    <table className={"govuk-table"}>
                        <caption>This is a test for a digital Job Board made by Josh Bhogal (I'm a T-Level student, Feedback is appreciated)</caption>
                        {jobs}
                    </table>
                </main>
            </div>
        </body>


        // <button className="govuk-button" data-module="govuk-button">
        //     Save and continue
        // </button>

    )
}

export default MainPage
