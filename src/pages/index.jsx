import "../app/globals.css"
import "../app/gov.scss"
import Table from '@govuk-react/table';
import React, {useEffect, useState} from "react"
import axios from "axios";
import QRCode from "qrcode"
import dotenv from 'dotenv'

const MainPage = (props) => {
    const [jobs, setJobs] = useState(null)
    const [shortendUrl, setShortenedUrl] = useState(null)


    useEffect(() => {
        dotenv.config();

            const fetchData = async (centreLocation, actualResponse) => {
                try {

                    //const response = await axios.get("https://findajob.dwp.gov.uk/api/search?api_id="+ props.fajID + "&api_key="+ props.fajKey +"&w="+centreLocation);
                    //const response = await axios.get('https://api.lmiforall.org.uk/api/v1/vacancies/search?limit=6&radius=5&location='+centreLocation+'&keywords=%25*');
                    const response = await actualResponse;
                    console.log(response)
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

            const fetchLocationData = () => {
                try {
                    const newAPIResponse = props.jobData.jobs
                    navigator.geolocation.getCurrentPosition(async function (location) {
                        const locationInfo = await axios.get("https://api.geoapify.com/v1/geocode/reverse?lat=" + location.coords.latitude + "&lon=" + location.coords.longitude + "&apiKey="+ props.userLoc);
                        let jobCentreLocation = locationInfo.data.features[0].properties.postcode;
                        await fetchData(jobCentreLocation, newAPIResponse);

                    }, async function (){
                        const locationInfoDefault = await axios.get("https://api.geoapify.com/v1/geocode/reverse?lat=53.800571&lon=-1.545053&apiKey="+ props.defaultLoc);
                        let defaultPostcode = locationInfoDefault.data.features[0].properties.postcode;
                        await fetchData(defaultPostcode, newAPIResponse)
                    })
                }
                catch (error){
                    console.error(error.message)
                }
            }

            fetchLocationData();

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
            case 1080 : return 5;   // 1080 x ~~~~
            default: return 3;
        }
    }
}

function tableCreate2(responseData){

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

        const dataRow = <Table className={"govuk-table"} >

            <Table.Row>
                <Table.CellHeader className={"govuk-!-text-align-centre"}>
                    {jobItem.title}
                </Table.CellHeader>

                <Table.Cell className={"govuk-!-text-align-centre"}>
                    <p className="govuk-body">{jobItem.description.substring(0,350) + "... Scan the QR Code for more information"}</p>
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
        </Table>
        jobs.push(dataRow)


    }




    return (

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
    )
}


export const getServerSideProps= async () => {

    const findAJobID = process.env.API_ID;
    const findAJobKey = process.env.FIND_A_JOB_KEY;
    const userLocation = process.env.USERLOCATIONKEY;
    const defaultLocation = process.env.DEFAULTLOCATIONKEY;

    const response = await axios.get("https://findajob.dwp.gov.uk/api/search?api_id="+ findAJobID +"&api_key="+ findAJobKey +"&w=Leeds");
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
