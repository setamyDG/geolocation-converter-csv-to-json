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
          const country = element.Country;
          const city = element.City;
          const zipCode = element['ZIP-code'];
          const link = element.Link;
          const category = element.Type;
          zipCode.trim();

          const searchFor = zipCode ? `${country} ${city} ${zipCode}` : country && city;
          const geoResults = await provider.search({query: searchFor});
          if (geoResults && geoResults[0]) {
            const lat = geoResults[0].y;
            const lng = geoResults[0].x;
            element.lat = lat;
            element.lng = lng;
            delete element['ZIP-code'];
            delete element.Source;
            delete element.City;
            
            const location = {counter: counter, lat: element.lat, lng: element.lng, link: link, category: category};

            const countryIndex = convertedMarkers.findIndex(item => item.country === country);

            if (countryIndex < 0) {
              convertedMarkers.push({country: country, locations: [location]});
            } 
            else {
              const locationIndex = convertedMarkers[countryIndex].locations.findIndex(item => item.lat === location.lat && item.lng === location.lng && item.category === location.category);

              if (locationIndex < 0) {
                convertedMarkers[countryIndex].locations.push(location);
              } else {
                convertedMarkers[countryIndex].locations[locationIndex].counter++;
              }
            }

            console.log(convertedMarkers);

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
