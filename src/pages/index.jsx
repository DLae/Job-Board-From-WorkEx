import "../app/globals.css"
import "../app/gov.scss"
import Table from '@govuk-react/table';
import React, {useEffect, useState} from "react"
import axios from "axios";
import QRCode from "qrcode"
import dotenv from 'dotenv'
import async from "async";
import {log} from "qrcode/lib/core/galois-field";
import {Input} from "govuk-react";

const MainPage = (props) => {

    const [jobs, setJobs] = useState(null)
    const [shortendUrl, setShortenedUrl] = useState(null)

    useEffect(() => {
        dotenv.config();

            const fetchData = async () => {
                try {
                    const response = await props.jobData.jobs;
                    const qrCodeSize = 180;

                    const jobsWithQrCodes = await Promise.all(response.map(async (job) => {

                        const newJobLink = "https://uc-job-screen-prototype.herokuapp.com/redirectpage?redirecturl=" + job.url
                        const qrPng = await QRCode.toDataURL(newJobLink, {width:qrCodeSize});
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
            fetchData()
        }

    , []);
    setTimeout(function (){
        location.reload()
        return (tableCreate2(jobs))
    }, 600000)
   return (tableCreate2(jobs))
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
            case 1080 : return 6;   // 1080 x ~~~~
            default: return 3;
        }
    }
}


function tableCreate2(responseData){

    const [postcode, setPostcode] = useState(null)

    const getInputPostcode = (e) => {
        if (typeof window !== "undefined") {
            if (postcode !== null) {
                //const urlWithPostcode = "http://localhost:3001/?postcode="
                const urlWithPostcode = "https://uc-job-screen-prototype.herokuapp.com/?postcode="
                window.location.replace(urlWithPostcode + postcode.replace(/ /g, ''))
                getServerSideProps(postcode).then(r => tableCreate2())
            }
            else{
                //const urlWithNoPostcode = "http://localhost:3001/?postcode="
                const urlWithNoPostcode = "https://uc-job-screen-prototype.herokuapp.com/?postcode="
                window.location.replace(urlWithNoPostcode)
            }
        }

    }

    const handleChange = (event) => {
        setPostcode(event.target.value);
    }

    let size = getWindowSize()

    const jobs = [];
    if (responseData === null){
        return "";
    }

    for (let i = 0; i < size; i++){

        let jobItem = responseData[i];

        let jobSalary = jobItem.salary;
        if (jobSalary === ""){
            jobSalary = "Unable To Retrieve Salary"
        }

        const dataRow =
            <Table.Row key={i}>
                <Table.CellHeader className={"govuk-!-text-align-centre"}>
                    {jobItem.title}
                </Table.CellHeader>

                <Table.Cell className={"govuk-!-text-align-centre"}>
                    <p className="govuk-body">{jobItem.description.substring(0,175) + "... Scan the QR Code for more information"}</p>
                </Table.Cell>

                <Table.Cell className={"govuk-!-text-align-centre"}>
                    <p className="govuk-body">{jobSalary}</p>
                </Table.Cell>

                <Table.Cell className={"govuk-!-text-align-centre"}>
                    <strong><u>{jobItem.company}</u></strong>
                    <p className="govuk-body">{jobItem.contract_type}</p>
                    <p className={"govuk-body"}>{jobItem.contract_time}</p>
                </Table.Cell>

                <Table.Cell className={"govuk-!-text-align-centre"}>
                    <p className="govuk-body">{jobItem.location}</p>
                </Table.Cell>

                <Table.Cell className={"govuk-!-text-align-centre"}>
                    <img src = {jobItem.qrCode}/>
                </Table.Cell>

            </Table.Row>

        jobs.push(dataRow)

    }




    return (

        <div className="govuk-template__body ">
            <script>
                document.body.className = ((document.body.className) ? document.body.className + ' js-enabled' :
                'js-enabled');
            </script>
            <a href="#main-content" className="govuk-skip-link" data-module="govuk-skip-link">Skip to main content</a>
            <header className="govuk-header " role="banner" data-module="govuk-header">
                <div className="govuk-header__container govuk-width-container">
                    <div className="govuk-header__logo">
                      <span className="govuk-header__logotype">
                          <span className="govuk-header__logotype-text">
                          Job Board
                        </span>
                      </span>
                    </div>
                    <div>
                        <span className={"govuk-header__content"}>
                            <input className={"govuk-input govuk-input--width-5"} id={"postcodeInput"} onChange={handleChange}></input>
                            <button className="govuk-button" data-module="govuk-button" id={"confirmPostcodeButton"} type={"button"} onClick={(e) => getInputPostcode(e)}>
                             Confirm Postcode
                            </button>
                        </span>
                    </div>
                </div>
            </header>

            <div className="govuk-width-container" className={"govuk-!-padding-left-9"} >
                <main className="govuk-main-wrapper " id="main-content" role="main">
                    <Table className={"govuk-table"} >

                        {jobs}
                    </Table>
                </main>
            </div>
        </div>
    )
}


export const getServerSideProps= async (context) => {

    const findAJobID = process.env.API_ID;
    const findAJobKey = process.env.FIND_A_JOB_KEY;
    const userLocation = process.env.USERLOCATIONKEY;
    const defaultLocation = process.env.DEFAULTLOCATIONKEY;

    let response;

    switch (context.query.postcode){
        case undefined: response = await axios.get("https://findajob.dwp.gov.uk/api/search?api_id="+ findAJobID +"&api_key="+ findAJobKey +"&w=Leeds");
            break;
        case "": response = await axios.get("https://findajob.dwp.gov.uk/api/search?api_id="+ findAJobID +"&api_key="+ findAJobKey +"&w=Leeds");
            break;
        default: response = await axios.get("https://findajob.dwp.gov.uk/api/search?api_id="+ findAJobID +"&api_key="+ findAJobKey +"&w="+ context.query.postcode);
            break;
    }

    const responseJobData = response.data;

    return {
        props: {
            userLoc: userLocation,
            defaultLoc: defaultLocation,
            jobData:responseJobData
        }
    }
}

export default MainPage
