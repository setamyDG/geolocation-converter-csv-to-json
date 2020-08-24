import React, { useState, useEffect }  from 'react';
import styled from 'styled-components';
import Layout from './components/layout';
import SEO from './components/seo';
import Papa from 'papaparse';
import { OpenStreetMapProvider } from 'leaflet-geosearch';
import PrivateMarker from './assets/private-marker.svg';

const Wrapper = styled.div`
  display: flex;
  height: 60vh;
  width: 100%;
  justify-content: center;
  align-items: center;
  text-align: center;
  flex-flow: column;
  text-transform: uppercase;
`;

const StyledForm = styled.div`
  display: flex;
  flex-flow: column;
`;

const Label = styled.label`
  margin-bottom: 50px;
  font-weight: bold;
`;

const StyledInput = styled.input`
`;

const Title = styled.h1`
  margin-top: 50px;
  margin-bottom: 30px;
`;

const DownloadButton = styled.input`
  width: 250px;
  height: 100px;
  background: transparent;
  border: 1px solid white;
  color: black;
  text-transform: uppercase;
  box-shadow: 0px 10px 10px 0px rgba(0,0,0,0.1);
  :hover {
    cursor: pointer;
    box-shadow: 0px 15px 10px 0px rgba(0,0,0,0.15);
    transition: 0.5s all ease-in-out;
  }
`;

const ProgressBarStatus = styled.div`
  margin-top: 50px;
  width: 50%;
  background: #ddd;
`;

const ProgressBar = styled.div`
  width: ${({ width }) => width}%;
  height: 35px;
  background: #4caf50;
  text-align: center;
  line-height: 32px;
  color: black;
`;

const App = () => {
  const [selectedFile, setSelectedFile] = useState();
  const [convertedFile, setConvertedFile] = useState();
  const [progressBarWidth, setProgresBarWidth] = useState(0);
  const [isFileSelected, setIsFileSelected] = useState(false);
  const [itemsProgress, setItemsProgress] = useState({ overall: 0, processed: 0});


  const onChangeInput = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setIsFileSelected(true);
  };

  useEffect(()=> {
    if (selectedFile !== undefined) {
      const fileReader = new FileReader();
      fileReader.onloadend = async () => {
        const parsedFile = await Papa.parse(fileReader.result, {
          header: true,
        });

        // let newArr = Array.from(new Set(parsedFile.data.map(JSON.stringify))).map(JSON.parse);

        const convertedMarkers = [];
        let counter = 1;

        for (let index = 0; index < parsedFile.data.length; index ++){
          if(index > 15){
            return;
          }
          const provider = new OpenStreetMapProvider();
          const element = parsedFile.data[index];
          const country = element.country;
          const zipCode = element['ZIP-Code'].trim();
          const link = element.Link;
          const comment = element.Comment;
          const category = element.Category;

          const newCountry = country.substring(country.lastIndexOf('[') + 1, country.lastIndexOf(']'));
          element.country = newCountry;

          const searchFor = zipCode ? `${zipCode} ${newCountry}` : newCountry;
          const geoResults = await provider.search({query: searchFor});
          if (geoResults && geoResults[0]) {
            const lat = geoResults[0].y;
            const lng = geoResults[0].x;
            element.lat = lat;
            element.lng = lng;
            let iconType = '';
            delete element['ZIP-Code'];
            delete element.Source;

            if(category === 'Private') iconType = 
            `<svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="18" cy="18" r="17.5" fill="#7CD5FB" stroke="white"/>
            <path d="M20.6999 13.4017V15.6623M12.0656 21.6269C11.9355 22.9578 10.7914 23.9981 9.39854 23.9981C8.00572 23.9981 6.86161 22.9578 6.73151 21.6269C5.30617 21.6269 4.41843 21.6269 4.38208 21.6269C3.52496 21.2782 4.1525 17.2837 5.83804 16.4533C7.52359 15.6229 9.11156 15.6192 10.2404 15.1581C11.5165 14.3239 13.8774 12.6931 16.6611 12.2189C19.4448 11.7446 28.7622 12.1045 29.958 12.6931C31.1537 13.2817 31.6244 14.6501 32.1505 15.9378C32.6766 17.2256 32.9962 18.2135 33 20.0186C33.0038 21.7 32.4222 21.5088 30.1435 21.6025C30.0268 22.9465 28.877 24 27.4746 24C26.0818 24 24.9377 22.9597 24.8076 21.6288C21.2146 21.6269 16.2172 21.6269 12.0656 21.6269ZM9.40045 23.9981C7.92153 23.9981 6.72195 22.8228 6.72195 21.3738C6.72195 19.9249 7.92153 18.7496 9.40045 18.7496C10.8794 18.7496 12.079 19.9249 12.079 21.3738C12.079 22.8228 10.8794 23.9981 9.40045 23.9981ZM27.4803 23.9981C26.0014 23.9981 24.8018 22.8228 24.8018 21.3738C24.8018 19.9249 26.0014 18.7496 27.4803 18.7496C28.9593 18.7496 30.1589 19.9249 30.1589 21.3738C30.1589 22.8228 28.9593 23.9981 27.4803 23.9981ZM11.7059 15.7729C13.2211 13.8965 15.7504 12.9593 19.2918 12.9593C24.6029 12.9593 27.0747 12.9593 28.942 13.3342C29.4376 13.8272 29.7762 14.6388 29.9618 15.7729H11.7059ZM26.7265 13.4017L27.1455 15.6623L26.7265 13.4017Z" stroke="white" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            `
            if(category === 'Commercial') iconType = 
            `<svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="18" cy="18" r="17.5" fill="#56A2F8" stroke="white"/>
            <path d="M23.0516 10.1117V11.9041M10.5205 26.1192C10.4149 27.1739 9.49131 27.9982 8.36417 27.9982C7.23703 27.9982 6.31342 27.1739 6.20781 26.1192C5.05571 26.1192 4.33756 26.1192 4.30876 26.1192C3.61558 25.8426 4.12442 22.6765 5.48583 22.0182C6.84915 21.3599 8.13183 21.3562 9.04583 20.9911C10.077 20.331 11.9875 19.0365 14.238 18.6622C16.4884 18.2879 24.0232 18.57 24.991 19.0365C25.9587 19.503 26.3389 20.5873 26.7633 21.607C27.1876 22.6267 27.4469 23.4104 27.4507 24.8413C27.4526 26.1745 26.9841 26.0233 25.1407 26.097C25.0466 27.161 24.1154 27.9982 22.9824 27.9982C21.8572 27.9982 20.9317 27.1739 20.8261 26.1192C17.917 26.1192 13.877 26.1192 10.5205 26.1192ZM8.36417 28C7.1679 28 6.19821 27.0688 6.19821 25.92C6.19821 24.7712 7.1679 23.84 8.36417 23.84C9.56044 23.84 10.5301 24.7712 10.5301 25.92C10.5301 27.0688 9.56044 28 8.36417 28ZM22.9844 28C21.7881 28 20.8184 27.0688 20.8184 25.92C20.8184 24.7712 21.7881 23.84 22.9844 23.84C24.1806 23.84 25.1503 24.7712 25.1503 25.92C25.1503 27.0688 24.1806 28 22.9844 28ZM10.2287 21.4798C11.4537 19.9935 13.4987 19.2486 16.3617 19.2486C20.6571 19.2486 22.6541 19.2486 24.1653 19.5473C24.5647 19.9382 24.8412 20.5817 24.991 21.4798H10.2287V21.4798ZM22.3757 19.6008L22.7136 21.3931L22.3757 19.6008ZM17.5023 19.6008V21.3931V19.6008ZM7.28695 21.3101C6.59377 21.0335 7.10261 17.8674 8.46402 17.2091C9.82734 16.5509 11.11 16.5472 12.024 16.1821C13.0552 15.5219 14.9657 14.2275 17.2162 13.8531C19.4666 13.4788 27.0014 13.7609 27.9691 14.2275C28.9369 14.694 29.3171 15.7782 29.7415 16.7979C30.1658 17.8177 30.425 18.6013 30.4289 20.0322C30.4308 21.3654 29.9623 21.2142 28.1189 21.288C28.0632 21.9094 27.7234 22.4515 27.226 22.7963L7.28695 21.3101ZM9.18792 20.9008C9.29737 19.8497 10.221 19.031 11.3424 19.031C11.6649 19.031 11.9703 19.0992 12.2468 19.2209L9.18792 20.9008ZM25.2444 19.1471C25.4691 19.0715 25.711 19.031 25.9626 19.031C27.1588 19.031 28.1285 19.9622 28.1285 21.111C28.1285 21.8246 27.7541 22.4534 27.1838 22.8295L25.2444 19.1471ZM13.2068 16.6707C14.4319 15.1845 16.4769 14.4395 19.3399 14.4395C23.6353 14.4395 25.6323 14.4395 27.1435 14.7382C27.5429 15.1292 27.8194 15.7727 27.9691 16.6707H13.2068V16.6707ZM25.3539 14.7917L25.6918 16.584L25.3539 14.7917ZM20.4805 14.7917V16.584V14.7917ZM9.85806 16.6301C9.16488 16.3535 9.67373 13.1875 11.0351 12.5292C12.3985 11.8709 13.6811 11.8672 14.5951 11.5021C15.6263 10.842 17.5368 9.54749 19.7873 9.17317C22.0377 8.79884 29.5725 9.08097 30.5403 9.54749C31.508 10.014 31.8882 11.0983 32.3126 12.118C32.7369 13.1377 32.9962 13.9214 33 15.3523C33.0019 16.6855 32.5334 16.5343 30.69 16.608C30.6497 17.0672 30.4538 17.4839 30.1524 17.8084L9.85806 16.6301ZM11.7552 16.265C11.8435 15.1937 12.7767 14.351 13.9135 14.351C14.2591 14.351 14.5855 14.4285 14.8755 14.5667L11.7552 16.265ZM28.3225 14.3602C28.3916 14.3529 28.4626 14.351 28.5337 14.351C29.7299 14.351 30.6996 15.2822 30.6996 16.431C30.6996 16.9786 30.4788 17.4784 30.1178 17.849L28.3225 14.3602ZM15.778 11.9907C17.003 10.5045 19.048 9.75955 21.911 9.75955C26.2064 9.75955 28.2034 9.75955 29.7146 10.0583C30.114 10.4492 30.3905 11.0927 30.5403 11.9907H15.778ZM27.925 10.1117L28.2629 11.9041L27.925 10.1117Z" stroke="white" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>`
            if(category === 'ESS project') iconType =
            `<svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="18" cy="18" r="17.5" fill="#F5BE41" stroke="white"/>
            <path d="M21.9221 10.8307V9H26.5377V10.8307M25.9237 16.627H21.3082H25.9237ZM12.3841 18.9153V14.3387V18.9153ZM14.6918 16.627H10.0763H14.6918ZM7.15457 11.1351H28.8454C28.9313 11.1351 29 11.2032 29 11.2883V26.8467C29 26.9319 28.9313 27 28.8454 27H7.15457C7.0687 27 7 26.9319 7 26.8467V11.2883C7 11.2032 7.0687 11.1351 7.15457 11.1351ZM9.76932 10.8307V9H14.3849V10.8307H9.76932Z" stroke="white" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>`
            if(category === 'V2G project') iconType =
            `<svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="18" cy="18" r="17.5" fill="#5FCF81" stroke="white"/>
            <path d="M15.9118 26.4918C15.9118 26.5043 15.9118 26.5168 15.9118 26.5292C15.9118 27.612 15.0339 28.4899 13.9511 28.4899C12.8684 28.4899 11.9905 27.612 11.9905 26.5292C11.9905 26.5168 11.9905 26.5043 11.9905 26.4918C10.9523 26.4918 10.3058 26.4918 10.2791 26.4918C9.65227 26.2301 10.1117 23.249 11.344 22.6275C12.5763 22.0078 13.7392 22.0042 14.5655 21.6605C15.4986 21.039 17.2278 19.8192 19.265 19.4666C21.3023 19.1122 28.1192 19.3811 28.9953 19.8209C29.8715 20.2608 30.2152 21.283 30.5998 22.2446C30.9845 23.2063 31.2196 23.9453 31.2213 25.2916C31.2231 26.5453 30.8011 26.4046 29.1378 26.474C29.1129 27.5354 28.2456 28.3866 27.1789 28.3866C26.1193 28.3866 25.2557 27.5443 25.22 26.4936C22.5934 26.4918 18.9445 26.4918 15.9118 26.4918ZM13.9529 28.4899C12.8702 28.4899 11.9922 27.612 11.9922 26.5292C11.9922 25.4465 12.8702 24.5686 13.9529 24.5686C15.0356 24.5686 15.9136 25.4465 15.9136 26.5292C15.9136 27.612 15.0338 28.4899 13.9529 28.4899ZM27.1825 28.3848C26.0998 28.3848 25.2218 27.5069 25.2218 26.4242C25.2218 25.3414 26.0998 24.4635 27.1825 24.4635C28.2652 24.4635 29.1431 25.3414 29.1431 26.4242C29.1431 27.5087 28.2652 28.3848 27.1825 28.3848ZM15.6393 22.12C16.7488 20.7185 18.599 20.0186 21.1901 20.0186C25.0776 20.0186 26.8851 20.0186 28.2527 20.3C28.6142 20.6668 28.8636 21.2741 28.9989 22.1217H15.6393V22.12ZM26.6304 20.3481L26.9367 22.0363L26.6304 20.3481ZM22.2212 20.3481V22.0363V20.3481ZM4.95273 14.7688H5.98738C6.51271 14.7688 6.9401 15.1944 6.9401 15.7215V20.649C6.9401 20.7167 6.8849 20.7719 6.81723 20.7719H4.12288C4.0552 20.7719 4 20.7167 4 20.649V15.7215C4 15.1962 4.42561 14.7688 4.95273 14.7688Z" stroke="white" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M5.46916 19.9136C5.80752 19.9136 6.08176 19.6393 6.08176 19.301C6.08176 18.9626 5.80752 18.6884 5.46916 18.6884C5.13081 18.6884 4.85657 18.9626 4.85657 19.301C4.85657 19.6393 5.13081 19.9136 5.46916 19.9136Z" fill="white"/>
            <path d="M5.49053 19.7355C5.65971 22.1467 6.11915 23.5998 6.87243 24.0967C7.89283 24.7698 8.31666 24.1412 9.24446 23.8224C9.74309 23.6515 10.2132 23.8224 10.3112 23.8224" stroke="white" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M6.55545 13.3566C9.29789 9.92504 15.2849 7.78273 21.272 9.38011" stroke="white" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="8 8"/>
            <path d="M14.5815 8L16.2786 8.76753L15.041 10.1566" stroke="white" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M9.30501 9.7256L8.58735 11.4423L10.4394 11.615" stroke="white" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M27.8716 13.7217L23.5372 17.465L24.6733 13.5792L25.1595 11.9142H27.5511L28.0301 13.5792L29.1752 17.465L24.8407 13.7217M25.2343 8.03204H27.601L30.0923 9.13436H22.7429L25.2343 8.03204ZM25.1114 8.27601V11.9516V8.27601ZM22.7429 9.13436V9.86983V9.13436ZM30.0923 9.13436V9.86983V9.13436ZM22.7429 11.9516V12.6871V11.9516ZM30.0923 11.9516V12.6871V11.9516ZM27.5618 8.27601V11.9516V8.27601ZM25.1933 10.8493H27.6437L30.0941 11.9516H22.7447L25.1933 10.8493Z" stroke="white" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            `
            if(category === 'References') iconType =
            `<svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="18" cy="18" r="17.5" fill="#ED6C62" stroke="white"/>
            <path d="M17.885 10C12.4252 10 8 13.5697 8 17.9723C8 20.0988 9.03457 22.0306 10.7177 23.4599C10.5473 24.018 9.71444 25.4786 8.46425 26.1585C7.11844 26.8888 12.7295 27.6208 15.0108 25.6003C15.9201 25.8229 16.8834 25.9429 17.8832 25.9429C19.1943 25.9429 20.4479 25.736 21.592 25.3621C25.2139 24.1797 27.7664 21.316 27.7664 17.9706C27.7699 13.568 23.3447 10 17.885 10Z" stroke="white" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M17.1425 21.2899C17.1425 21.189 17.1616 21.0934 17.1981 21.0013C17.2347 20.9091 17.2868 20.8326 17.3546 20.7665C17.4207 20.7004 17.5007 20.65 17.5911 20.61C17.6815 20.5718 17.7806 20.5527 17.885 20.5527C17.9858 20.5527 18.0814 20.5718 18.1736 20.61C18.2657 20.65 18.344 20.7022 18.4101 20.7665C18.4761 20.8326 18.53 20.9091 18.57 21.0013C18.6083 21.0934 18.6292 21.189 18.6292 21.2899C18.6292 21.3942 18.61 21.4916 18.57 21.5803C18.53 21.6707 18.4779 21.7472 18.4101 21.8133C18.344 21.8793 18.264 21.9298 18.1736 21.9663C18.0832 22.0045 17.9858 22.0219 17.885 22.0219C17.7806 22.0219 17.6833 22.0028 17.5911 21.9663C17.5007 21.928 17.4207 21.8776 17.3546 21.8133C17.2886 21.7472 17.2364 21.6707 17.1981 21.5803C17.1599 21.4899 17.1425 21.3942 17.1425 21.2899ZM18.4674 14.8877V17.6837C18.4674 17.981 18.4535 18.2714 18.424 18.5565C18.3944 18.8417 18.3579 19.1442 18.311 19.4642H17.4903C17.445 19.1442 17.4068 18.8417 17.3772 18.5565C17.3477 18.2714 17.3338 17.981 17.3338 17.6837V14.8877H18.4674Z" fill="white"/>
            </svg>`
            
            console.log(category);
            
            const location = {counter: counter, lat: element.lat, lng: element.lng, link: link, category: category, comment: comment, iconType: iconType};

            const countryIndex = convertedMarkers.findIndex(item => item.country === newCountry);

            if (countryIndex < 0) {
              convertedMarkers.push({country: newCountry, locations: [location]});
            } 
            else {
              const locationIndex = convertedMarkers[countryIndex].locations.findIndex(item => item.lat === location.lat && item.lng === location.lng && item.category === location.category);

              if (locationIndex < 0) {
                convertedMarkers[countryIndex].locations.push(location);
              } else {
                convertedMarkers[countryIndex].locations[locationIndex].counter++;
              }
            }
            console.log(convertedMarkers)

          } else {
            console.warn('Cannot find for: ', element);
            console.warn('GeoResult: ', geoResults);
          }

            const fillBar = (index / parsedFile.data.length) * 100;
            setItemsProgress({ overall: parsedFile.data.length, processed: index});
            setProgresBarWidth(fillBar);
          //})
        }

        

        const finalResult = Array.from(new Set(convertedMarkers.map(JSON.stringify))).map(JSON.parse);

        setConvertedFile(finalResult);
      }
      fileReader.readAsText(selectedFile);
    }
  }, [selectedFile])
  
  const downloadFile = () => {
    if(!window.File || !window.FileReader || !window.FileList || !window.Blob){
      alert('The File api are not fully supported for this browser');
      return;
    }
    const input = document.getElementById('input');
    if(!input){
      alert("there is no file input element")
    }
    else if (!input.files){
      alert("This browser doesn't seem to support the `files` property of file inputs.");
      }
    else if (!selectedFile) {
      alert("Please select a file before clicking 'Load'");
    }
    else {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(convertedFile));
      const link = document.createElement('a');
      link.setAttribute("href", dataStr);
      link.setAttribute("download", input.files[0].name + ".json");
      link.click();
    }
  }

  return (
   <Layout>
     <SEO />
     <Wrapper>
      <StyledForm enctype="multipart/form-data">
      <Label for="file">please select a file</Label>
      <StyledInput type="file" id="input" name="file" accept=".csv" onChange={onChangeInput}/>
      {isFileSelected ? <p>file : {selectedFile.name}</p>: null}
      </StyledForm>
      <ProgressBarStatus>
        <ProgressBar width={progressBarWidth}></ProgressBar>
        {`${itemsProgress.processed} / ${itemsProgress.overall}`}
      </ProgressBarStatus>
      <div>
      <Title>download json file</Title>
      <DownloadButton type='button' id='btnLoad' value='download' onClick={downloadFile} />
      </div>
     </Wrapper>
   </Layout>
  );
}

export default App;
