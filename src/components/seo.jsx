import React from 'react';
import Helmet from 'react-helmet';

const SEO = () => {
  return (
    <Helmet>
      <title>
        TMH Map Converter
      </title>
      <meta
        name="description"
        content="Map shows TMH products"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Lato&display=swap"
        rel="stylesheet"
      />
    </Helmet>
  );
};

export default SEO;
