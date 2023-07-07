import "../app/globals.css"
import "../app/gov.scss"
import Table from '@govuk-react/table';
import React, {useEffect, useState} from "react"
import axios from "axios";
import QRCode from "qrcode"
import dotenv from 'dotenv'

const MainPage = (props) => {

    const [jobs, setJobs] = useState(null)
    const [shortenedUrl, setShortenedUrl] = useState(null)

    useEffect(() => {
            dotenv.config();

            const fetchData = async () => {
                try {
                    const response = await props.jobData;
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

        switch (windowWidth){
            case 2560 : return 5;   // 2560 x ~~~~
            case 1920 : return 3;   // 1920 x ~~~~
            case 1440 : return 11;  // 1440 x ~~~~
            case 1080 : return 6;   // 1080 x ~~~~
            default: return 7;
        }
    }
}

const capitaliseFirst = str => {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function tableCreate2(responseData){

    let size = getWindowSize()

    const jobs = [];
    if (responseData === null){
        return "";
    }

    if (typeof window !== "undefined") {
        console.log(window.visualViewport.width < window.innerWidth)
        console.log(document.body.clientHeight > window.innerHeight)

        for (let i = 0; i < size; i++) {

            let jobItem = responseData[i];

            let jobSalary = jobItem.salary;
            if (jobSalary === "") {
                jobSalary = "Unable To Retrieve Salary"
            }

            const dataRow =
                <Table.Row key={i}>
                    <Table.CellHeader className={"govuk-!-text-align-centre"} id={"jobTitles"}>
                        {jobItem.title}
                    </Table.CellHeader>

                    <Table.Cell className={"govuk-!-text-align-centre"}>
                        <p className="govuk-body">{jobItem.summary.substring(0, 175) + "... Scan the QR Code for more information"}</p>
                    </Table.Cell>

                    <Table.Cell className={"govuk-!-text-align-centre"}>
                        <strong><u>{jobItem.company}</u></strong>
                    </Table.Cell>

                    <Table.Cell className={"govuk-!-text-align-centre"}>
                        <p className="govuk-body">{jobItem.location.location}</p>
                    </Table.Cell>

                    <Table.Cell className={"govuk-!-text-align-centre"}>
                        <img src={jobItem.qrCode} alt={""}/>
                    </Table.Cell>

                </Table.Row>

            if (!(window.visualViewport.height < window.innerHeight)) {
                jobs.push(dataRow)
            }
            else if(document.body.clientHeight > window.innerHeight){
                jobs.push(dataRow)
            }
            else{
                break;
            }
        }
    }




    return (

        <div className="govuk-template__body ">
            <script>
                document.body.className = ((document.body.className) ? document.body.className + ' js-enabled' :
                'js-enabled');
            </script>
            <header className="govuk-header " role="banner" data-module="govuk-header">
                <div className="govuk-header__container govuk-width-container">
                    <div className="govuk-header__logo">
                      <span className="govuk-header__logotype">
                          <span className="govuk-header__logotype-text" id={"fajTitle"}>
                          Find a job
                        </span>
                      </span>
                    </div>
                    <div>
                        <header id={"explanationText"}>To scan a QR code, first try your phone camera<br></br>If your camera doesn't work, search for QR reader in your app store</header>
                    </div>
                </div>
            </header>

            <div className="govuk-width-container" className={"govuk-!-padding-left-9"} id={"mainTable"}>
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

    let response;
    let responseLink;

    switch (context.query.postcode){
        case undefined: responseLink = "https://api.lmiforall.org.uk/api/v1/vacancies/search?limit=6&radius=5&location=Leeds&keywords=*%25";
            break;
        case "": responseLink = "https://api.lmiforall.org.uk/api/v1/vacancies/search?limit=6&radius=5&location=Leeds&keywords=*%25"
            break;
        default: responseLink = "http://api.lmiforall.org.uk/api/v1/vacancies/search?limit=6&radius=5&location="+ context.query.postcode +"&keywords=*%25"
            break;
    }

    switch (context.query.sector){
        case undefined: responseLink;
            break;
        case "": responseLink;
            break;
        default: responseLink = responseLink.replace("*%25", context.query.sector+"25");
            break
    }

    response = await axios.get(responseLink)
    const responseJobData = response.data;

    return {
        props: {
            jobData:responseJobData
        }
    }
}

export default MainPage
