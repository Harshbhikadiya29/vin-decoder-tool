const axios = require('axios');
require("dotenv").config();

/*
{
  "totalCountFormatted": "string",
  "totalCount": 0,
  "salesHistory": {
    "vin": "string",
    "salesCycles": [
      {
        "startDate": "string",
        "endDate": "string"
      }
    ],
    "daysOnSite": 0,
    "cycles": [
      [
        "string"
      ]
    ]
  },
  "records": [
    {
      "year": 0,
      "vin": "string",
      "vdpUrl": "string",
      "updatedAt": "string",
      "trim": "string",
      "trackingParams": {
        "rooftopUuid": null,
        "rooftopUniqueName": null,
        "remoteSku": "string",
        "remoteDealerId": "string",
        "idFromProvider": "string",
        "experience": "string",
        "dealerUuid": "string",
        "dealerUniqueName": "string",
        "dealerName": "string",
        "dealerGroupUuid": "string",
        "dealerGroupUniqueName": "string"
      },
      "thumbnailUrlLarge": "string",
      "thumbnailUrl": "string",
      "target": null,
      "state": "string",
      "showThankyouPage": true,
      "showRsrp": true,
      "showNewMileage": true,
      "requiresAddressWithLead": true,
      "requireEmailOptIn": true,
      "regional": true,
      "regionName": "string",
      "recentPriceDrop": true,
      "quickPicksEligible": true,
      "providerName": "string",
      "providerId": 0,
      "providerGroupId": 0,
      "primaryPhotoUrl": "string",
      "priceUnformatted": 0,
      "priceMobile": "string",
      "price": "string",
      "preCheckThankyouMobile": true,
      "preCheckThankyou": true,
      "photoUrls": [
        "string"
      ],
      "partnerType": "string",
      "paidAllowOneClickSubmit": true,
      "openInNewWindow": true,
      "noPriceText": null,
      "newPriceAsMsrp": true,
      "monthlyPayment": 0,
      "modelId": 0,
      "model": "string",
      "mileageUnformatted": 0,
      "mileageHumanized": "string",
      "mileage": "string",
      "make": "string",
      "lon": 0,
      "lat": 0,
      "isHot": true,
      "id": 0,
      "humanizedSearchLocation": null,
      "hrefTarget": "string",
      "hideDistance": null,
      "financingExperience": "string",
      "experience": "string",
      "emailOptDefault": true,
      "eligibleForFinancing": true,
      "distanceFromOrigin": 0,
      "displayColor": "string",
      "dealerName": "string",
      "dealerGroupUuid": "string",
      "createdAt": "string",
      "cplValue": 0,
      "condition": "string",
      "clickoffUrl": "string",
      "clickOff": true,
      "city": "string",
      "bodyType": "string",
      "bodyStyle": "string",
      "availableNationwide": true,
      "alwaysAskForZip": true,
      "allowOneClickSubmit": true,
      "active": true,
      "acceptsLeads": true
    }
  ],
  "promotedAggregations": [
    null
  ],
  "priceHistory": {
    "vin": "string",
    "recentPriceDrop": true,
    "priceChanges": [
      {
        "price": 0,
        "delta": 0,
        "date": "string"
      }
    ],
    "history": [
      [
        0
      ]
    ],
    "currentCycleDelta": 0,
    "currentCycleChanges": [
      {
        "price": 0,
        "delta": 0,
        "date": "string"
      }
    ]
  },
  "listimate": {
    "year": 0,
    "vehicleCount": 0,
    "trim": "string",
    "targetPrice": 0,
    "priceLimitLow": 0,
    "priceLimitHigh": 0,
    "model": "string",
    "mileage": 0,
    "make": "string",
    "fairPriceLow": 0,
    "fairPriceHigh": 0
  },
  "hitsCount": 0
}
*/

/**
 * Fetch vehicle listings from auto.dev based on make and model.
  * @param {Object} req - The request object containing the make and model.
  * @param {Object} res - The response object to send the results.
 * @return {Promise<Object>} - The vehicle listings data.
 * @throws {Error} - If the API request fails or if the response is invalid.
 * @throws {Error} - If the API token is missing.
 * @throws {Error} - If the API response is not successful.
 */
const getVehicleListingsAutoDev = async (req, res) => {
  const { make, model } = req.body;
  if (!make || !model) {
    return res.status(400).json({ error: 'Make and model are required' });
  }
  const url = `https://www.auto.dev/api/listings/${make.toLowerCase()}/${model.toLowerCase()}`;
  const token = process.env.AUTO_DEV_API_KEY;
  if (!token) {
    throw new Error('API token is missing');
  }

  console.log('Fetching vehicle listings from:', url);

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    const data = response.data;
    if (!data || !data.records || data.records.length === 0) {
      return res.status(404).json({ error: 'No listings found' });
    }
    const listings = data.records.map((listing) => ({
      year: listing.year,
      make: listing.make,
      model: listing.model,
      price: listing.price,
      mileage: listing.mileage,
      thumbnailUrl: listing.thumbnailUrl,
      vdpUrl: listing.vdpUrl,
    }));
    return res.status(200).json({ success: true, data: listings });
  } catch (error) {
    console.error('Error fetching vehicle listings:', error.message);
    return res.status(500).json({ error: 'Failed to fetch vehicle listings. Please try again later.' });
  }
}

const searchVehiclesGoogle = async (req, res) => {
  const { make, model, year } = req.body;

  if (!make || !model || !year) {
    return res.status(400).json({ error: 'Missing year, make, or model' });
  }

  const query = `${year} ${make} ${model} for sale`;
  const cx = process.env.GOOGLE_SEARCH_ENGINE_ID;
  const apiKey = process.env.GOOGLE_API_KEY;

  try {
    const response = await axios.get('https://www.googleapis.com/customsearch/v1', {
      params: {
        key: apiKey,
        cx: cx,
        q: query,
        num: 10,
      },
    });

    if (!response.data.items || response.data.items.length === 0) {
      return res.status(404).json({ error: 'No results found' });
    }
    if (response.data.error) {
      return res.status(500).json({ error: response.data.error.message });
    }

    const results = response.data.items.map((item) => ({
      title: item.title,
      link: item.link,
      snippet: item.snippet,
      displayLink: item.displayLink,
      image: item.pagemap?.cse_image?.[0]?.src || null,
    }));

    return res.status(200).json({ success: true, data: results });
  } catch (error) {
    console.error('Google Search API error:', error.message);
    res.status(500).json({ error: 'Failed to fetch search results' });
  }
};

module.exports = { getVehicleListingsAutoDev, searchVehiclesGoogle };