import "../app/globals.css"
import "../app/gov.scss"
import Table from '@govuk-react/table';
import React, {useEffect, useState} from "react"
import axios from "axios";
import QRCode from "qrcode"
import dotenv from 'dotenv'
import GovUkInitialiser from './govuk-initialiser';

const MainPage = (props) => {
    const [jobs, setJobs] = useState(null)
    const [shortenedUrl, setShortenedUrl] = useState(null)
    const [error, setError] = useState(props.error || null)

    useEffect(() => {
        // Handle case where we have an error from the server-side
        if (props.error) {
            console.error("Server-side error:", props.error);
            return;
        }

        const fetchData = async () => {
            try {
                if (!props.jobData || !props.jobData.jobs) {
                    throw new Error("No job data available");
                }
                
                const response = props.jobData.jobs;
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
                console.error("Error processing job data:", error.message);
                setError(error.message);
            }
        }
        
        fetchData();
    }, [props.jobData, props.error]);

    // Rest of your component...

    // Add error display
    if (error) {
        return (
            <div className="govuk-template__body">
                <div className="govuk-width-container">
                    <main className="govuk-main-wrapper" id="main-content" role="main">
                        <h1 className="govuk-heading-xl">Error</h1>
                        <p className="govuk-body">There was a problem loading job data: {error}</p>
                        {props.errorStatus && (
                            <p className="govuk-body">Status code: {props.errorStatus}</p>
                        )}
                    </main>
                </div>
            </div>
        );
    }

    // Continue with your existing render logic...
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

    return (
        <>
            {tableCreate2(jobs)}
            <GovUkInitialiser />
        </>
    );
}

export default MainPage;

function getWindowSize(){

    if (typeof window !== "undefined"){
        const windowWidth = window.innerWidth

        switch (windowWidth){
            case 2560 : return 5;   // 2560 x ~~~~
            case 1920 : return 3;   // 1920 x ~~~~
            case 1440 : return 11;  // 1440 x ~~~~
            case 1080 : return 6;   // 1080 x ~~~~
            default: return 5;
        }
    }
}

const capitaliseFirst = str => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};

function tableCreate2(responseData){

    // const [postcode, setPostcode] = useState(null)
    //
    // const getInputPostcode = () => {
    //     if (typeof window !== "undefined") {
    //         if (postcode !== null) {
    //             const urlWithPostcode = "http://localhost:3001/?postcode="
    //             //const urlWithPostcode = "https://uc-job-screen-prototype.herokuapp.com/?postcode="
    //             window.location.replace(urlWithPostcode + postcode.replace(/ /g, ''))
    //             getServerSideProps(postcode).then(tableCreate2())
    //         }
    //         else{
    //             const urlWithNoPostcode = "http://localhost:3001/"
    //             //const urlWithNoPostcode = "https://uc-job-screen-prototype.herokuapp.com/"
    //             window.location.replace(urlWithNoPostcode)
    //         }
    //     }
    // }
    //
    // const handleChange = (event) => {
    //     setPostcode(event.target.value);
    // }

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
            console.log(jobItem);

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
                        <p className="govuk-body" id={"jobSalaries"}>{jobSalary}</p>
                    </Table.Cell>

                    <Table.Cell className={"govuk-!-text-align-centre"}>
                        <p className="govuk-body">{jobItem.description.substring(0, 175) + "... Scan the QR Code for more information"}</p>
                    </Table.Cell>

                    <Table.Cell className={"govuk-!-text-align-centre"}>
                        <strong><u>{jobItem.company}</u></strong>
                        <p className="govuk-body">{capitaliseFirst(jobItem.contract_type)}</p>
                        <p className={"govuk-body"}>{capitaliseFirst((jobItem.contract_time).replace("_", " "))}</p>
                    </Table.Cell>

                    <Table.Cell className={"govuk-!-text-align-centre"}>
                        <p className="govuk-body">{jobItem.location}</p>
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
            <a href="#main-content" className="govuk-skip-link" data-module="govuk-skip-link">Skip to main content</a>
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


export const getServerSideProps = async (context) => {
  try {
    // Load environment variables
    require('dotenv').config();
    
    const findAJobID = process.env.API_ID;
    const findAJobKey = process.env.FIND_A_JOB_KEY;
    
    if (!findAJobID || !findAJobKey) {
      console.error('Missing API credentials');
      throw new Error('API credentials not configured');
    }
    
    // Build the API URL
    let responseLink;
    switch (context.query.postcode) {
      case undefined:
      case "":
        responseLink = `https://findajob.dwp.gov.uk/api/search?api_id=${findAJobID}&api_key=${findAJobKey}&w=Leeds&d=5`;
        break;
      default:
        responseLink = `https://findajob.dwp.gov.uk/api/search?api_id=${findAJobID}&api_key=${findAJobKey}&w=${context.query.postcode}&d=5`;
        break;
    }
    
    if (context.query.sector && context.query.sector !== "") {
      responseLink += `&q=${context.query.sector}`;
    }

    let response;
    
    // Different approaches for development vs production environments
    if (process.env.NODE_ENV === 'development') {
      // In development: Disable certificate validation, but with warning
      console.warn('⚠️ SSL certificate validation is disabled in development mode');
      response = await axios.get(responseLink, {
        httpsAgent: new (require('https').Agent)({
          rejectUnauthorized: false
        })
      });
    } else {
      // In production: Use standard secure request
      response = await axios.get(responseLink);
    }

    return {
      props: {
        jobData: response.data
      }
    };
  } catch (error) {
    console.error('Error in getServerSideProps:', error.message);
    
    // More detailed error for certificate issues
    if (error.message.includes('certificate')) {
      console.error('SSL Certificate Error: This might be due to the API using an invalid or self-signed certificate.');
    }
    
    return {
      props: {
        error: error.message,
        errorStatus: error.response?.status || 'No status',
        jobData: { jobs: [] }
      }
    };
  }
};